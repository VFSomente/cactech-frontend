import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile, UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  loading = false;
  saving = false;
  uploadingAvatar = false;
  message = '';
  errorMessage = '';
  avatarPreview = '';

  profile: UserProfile = {
    nome: '',
    nomeCompleto: '',
    username: '',
    email: '',
    telefone: '',
    endereco: '',
    avatarUrl: ''
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  get initials(): string {
    const name = (this.profile.nome || this.profile.username || '').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: (user) => {
        this.loading = false;
        this.profile = {
          ...user,
          nome: user.nome || user.nomeCompleto || '',
          nomeCompleto: user.nomeCompleto || user.nome || ''
        };
        this.avatarPreview = this.userService.resolveAvatarUrl(user.avatarUrl);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar seu perfil.';
      }
    });
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
        this.profile.avatarUrl = this.avatarPreview;
      },
      error: () => {
        this.uploadingAvatar = false;
        this.errorMessage = 'Não foi possível enviar a foto.';
      }
    });
  }

  saveProfile(): void {
    this.saving = true;
    this.message = '';
    this.errorMessage = '';

    const payload: Partial<UserProfile> = {
      nome: this.profile.nome || this.profile.nomeCompleto || '',
      telefone: this.profile.telefone || '',
      endereco: this.profile.endereco || '',
      avatarUrl: this.profile.avatarUrl || ''
    };

    this.userService.updateProfile(payload).subscribe({
      next: (user) => {
        this.saving = false;
        this.profile = {
          ...this.profile,
          ...user,
          nome: user.nome || user.nomeCompleto || this.profile.nome || '',
          nomeCompleto: user.nomeCompleto || user.nome || this.profile.nomeCompleto || ''
        };
        this.avatarPreview = this.userService.resolveAvatarUrl(user.avatarUrl) || this.avatarPreview;
        this.message = 'Alterações salvas.';
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Não foi possível salvar as alterações.';
      }
    });
  }

  logout(): void {
    this.authService.clearToken();
    this.userService.clearCurrentUser();
    this.router.navigate(['/']);
  }
}
