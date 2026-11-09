import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLogin = true;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

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

  toggleForm(login: boolean): void {
    this.isLogin = login;
    this.errorMessage = '';
    this.successMessage = '';
  }

  login(): void {
    if (!this.loginUsername || !this.loginPassword) {
      this.errorMessage = 'Informe seu usuário e sua senha.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login({ username: this.loginUsername, senha: this.loginPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.userService.refreshMeIfToken(this.authService.getToken());
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          err.status === 0
            ? 'Não foi possível conectar ao servidor. Tente novamente em instantes.'
            : 'Usuário ou senha incorretos.';
      }
    });
  }

  register(): void {
    if (!this.registerName || !this.registerUsername || !this.registerEmail || !this.registerPassword) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }
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
        this.loginUsername = this.registerUsername;
        this.loginPassword = '';
        this.successMessage = 'Conta criada com sucesso. Entre com sua senha para continuar.';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = this.registerErrorMessage(err);
      }
    });
  }

  /** Traduz a resposta da API em uma mensagem clara para o usuário. */
  private registerErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
    }
    const apiMessage: string = err.error?.message ?? '';
    if (err.status === 409) {
      if (/email/i.test(apiMessage)) {
        return 'Este e-mail já está cadastrado. Entre com sua conta ou use outro e-mail.';
      }
      if (/username/i.test(apiMessage)) {
        return 'Este nome de usuário já está em uso. Escolha outro.';
      }
    }
    if (err.status === 400 && /email/i.test(apiMessage)) {
      return 'Informe um e-mail válido.';
    }
    return 'Não foi possível criar a conta. Verifique os dados e tente novamente.';
  }
}
