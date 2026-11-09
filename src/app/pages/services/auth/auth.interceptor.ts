import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ToastService } from '../toast/toast.service';
import { environment } from '../../../../environments/environment';

/** Rotas públicas de autenticação: não levam token. (/auth/me precisa do token!) */
const PUBLIC_AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/esqueci-senha', '/auth/redefinir-senha'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // O token só vai para a API da CacTech — nunca para serviços externos (ex.: ViaCEP)
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  if (PUBLIC_AUTH_ENDPOINTS.some((path) => req.url.includes(path))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const userService = inject(UserService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token expirado ou inválido: encerra a sessão local e pede novo login
      if (err.status === 401 && authService.getToken() === token) {
        authService.clearToken();
        userService.clearCurrentUser();
        toastService.show('Sua sessão expirou. Entre novamente para continuar.', 'info');
        router.navigate(['/login'], { queryParams: { voltar: router.url } });
      }
      return throwError(() => err);
    })
  );
};
