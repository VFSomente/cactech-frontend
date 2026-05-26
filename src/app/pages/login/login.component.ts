import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLogin = true;
  loading = false;
  errorMessage = '';

  loginUsername = '';
  loginPassword = '';
  registerName = '';
  registerUsername = '';
  registerEmail = '';
  registerPhone = '';
  registerPassword = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  toggleForm(login: boolean) {
    this.isLogin = login;
    this.errorMessage = '';
  }

  login() {
    if (!this.loginUsername || !this.loginPassword) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.loginUsername, senha: this.loginPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.userService.refreshMeIfToken(this.authService.getToken());
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Falha no login. Verifique usuário e senha.';
      }
    });
  }

  register() {
    if (!this.registerName || !this.registerUsername || !this.registerEmail || !this.registerPassword) return;
    this.loading = true;
    this.errorMessage = '';

    const payload: RegisterRequest = {
      nomeCompleto: this.registerName,
      username: this.registerUsername,
      senha: this.registerPassword,
      email: this.registerEmail,
      telefone: this.registerPhone || '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.isLogin = true;
        alert('Cadastro realizado com sucesso. Faça login.');
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Falha no cadastro.';
      }
    });
  }
}
