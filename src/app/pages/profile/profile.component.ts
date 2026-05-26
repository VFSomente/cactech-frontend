import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile, UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
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

  constructor(private userService: UserService, private router: Router) {}

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
        this.avatarPreview = user.avatarUrl || '';
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
        this.errorMessage = 'Falha ao enviar avatar.';
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
        this.avatarPreview = user.avatarUrl || this.avatarPreview;
        this.message = 'Perfil atualizado com sucesso.';
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Erro ao salvar perfil.';
      }
    });
  }

  backHome(): void {
    this.router.navigate(['/']);
  }
}