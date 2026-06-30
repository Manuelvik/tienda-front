import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  const token = authService.obtenerToken();
  const rol = authService.obtenerRol();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (rol !== 'ADMIN') {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
