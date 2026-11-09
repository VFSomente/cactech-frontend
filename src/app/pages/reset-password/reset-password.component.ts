import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  token = '';
  password = '';
  confirmation = '';
  showPassword = false;
  loading = false;
  done = false;
  invalidLink = false;
  errorMessage = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.invalidLink = !this.token;
  }

  submit(): void {
    this.errorMessage = '';
    if (this.password.length < 6) {
      this.errorMessage = 'A nova senha deve ter pelo menos 6 caracteres.';
      return;
    }
    if (this.password !== this.confirmation) {
      this.errorMessage = 'As senhas não conferem.';
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.done = true;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 400 && /link/i.test(err.error?.message ?? '')) {
          this.invalidLink = true;
          return;
        }
        this.errorMessage =
          err.status === 0
            ? 'Não foi possível conectar ao servidor. Tente novamente em instantes.'
            : 'Não foi possível redefinir a senha. Tente novamente.';
      }
    });
  }
}
