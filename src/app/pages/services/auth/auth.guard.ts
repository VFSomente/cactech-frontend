import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  // Depois do login, o usuário volta para a página que tentou abrir
  return router.createUrlTree(['/login'], { queryParams: { voltar: state.url } });
};
