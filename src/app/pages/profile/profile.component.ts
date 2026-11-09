import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UpdateProfileRequest, UserProfile, UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toast/toast.service';

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private http = inject(HttpClient);

  readonly ufs = UFS;

  loading = false;
  saving = false;
  uploadingAvatar = false;
  searchingCep = false;
  cepMessage = '';
  errorMessage = '';
  avatarPreview = '';

  user: UserProfile = { username: '', email: '' };
  form: UpdateProfileRequest = emptyForm();

  get displayName(): string {
    return this.form.nomeCompleto || this.user.username;
  }

  get initials(): string {
    const parts = this.displayName.trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: (user) => {
        this.loading = false;
        this.applyUser(user);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar seu perfil.';
      }
    });
  }

  /** Formata o CEP enquanto digita e busca o endereço ao completar 8 dígitos. */
  onCepInput(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    this.form.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    this.cepMessage = '';
    if (digits.length === 8) {
      this.lookupCep(digits);
    }
  }

  onPhoneInput(value: string): void {
    const d = value.replace(/\D/g, '').slice(0, 11);
    let formatted = d;
    if (d.length > 2) formatted = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) formatted = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(d.length - 4)}`;
    this.form.telefone = formatted;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingAvatar = true;
    this.errorMessage = '';
    this.userService.uploadAvatar(file).subscribe({
      next: (res) => {
        this.uploadingAvatar = false;
        this.avatarPreview = this.userService.resolveAvatarUrl(res.avatarUrl);
        this.toastService.show('Foto atualizada.');
      },
      error: () => {
        this.uploadingAvatar = false;
        this.errorMessage = 'Não foi possível enviar a foto. Use JPG, PNG, GIF ou WEBP de até 2 MB.';
      }
    });
    input.value = '';
  }

  saveProfile(): void {
    this.errorMessage = '';
    if (!this.form.nomeCompleto.trim()) {
      this.errorMessage = 'Informe seu nome completo.';
      return;
    }

    this.saving = true;
    const payload: UpdateProfileRequest = {
      ...this.form,
      nomeCompleto: this.form.nomeCompleto.trim(),
      cep: this.form.cep.replace(/\D/g, '')
    };

    this.userService.updateProfile(payload).subscribe({
      next: (user) => {
        this.saving = false;
        this.applyUser(user);
        this.toastService.show('Alterações salvas.');
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.errorMessage =
          err.status === 400 && err.error?.message
            ? 'Verifique os dados: ' + err.error.message
            : 'Não foi possível salvar as alterações. Tente novamente.';
      }
    });
  }

  logout(): void {
    this.authService.clearToken();
    this.userService.clearCurrentUser();
    this.router.navigate(['/']);
  }

  private applyUser(user: UserProfile): void {
    this.user = user;
    const cep = (user.cep ?? '').replace(/\D/g, '');
    this.form = {
      nomeCompleto: user.nomeCompleto || user.nome || '',
      telefone: user.telefone ?? '',
      cep: cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep,
      rua: user.rua ?? '',
      numero: user.numero ?? '',
      complemento: user.complemento ?? '',
      bairro: user.bairro ?? '',
      cidade: user.cidade ?? '',
      estado: user.estado ?? ''
    };
    this.avatarPreview = this.userService.resolveAvatarUrl(user.avatarUrl);
  }

  private lookupCep(cep: string): void {
    this.searchingCep = true;
    this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (res) => {
        this.searchingCep = false;
        if (res.erro) {
          this.cepMessage = 'CEP não encontrado. Preencha o endereço manualmente.';
          return;
        }
        this.form.rua = res.logradouro || this.form.rua;
        this.form.bairro = res.bairro || this.form.bairro;
        this.form.cidade = res.localidade || this.form.cidade;
        this.form.estado = res.uf || this.form.estado;
      },
      error: () => {
        this.searchingCep = false;
        this.cepMessage = 'Não foi possível buscar o CEP agora. Preencha o endereço manualmente.';
      }
    });
  }
}

function emptyForm(): UpdateProfileRequest {
  return { nomeCompleto: '', telefone: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' };
}
