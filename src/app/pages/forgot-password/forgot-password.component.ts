import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  email = '';
  loading = false;
  sent = false;
  errorMessage = '';

  submit(): void {
    const email = this.email.trim();
    if (!email) {
      this.errorMessage = 'Informe o e-mail da sua conta.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        this.sent = true;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          err.status === 0
            ? 'Não foi possível conectar ao servidor. Tente novamente em instantes.'
            : err.status === 400
              ? 'Informe um e-mail válido.'
              : 'Não foi possível enviar o link agora. Tente novamente.';
      }
    });
  }
}
