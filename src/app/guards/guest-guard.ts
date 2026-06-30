import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  const token = authService.obtenerToken();
  const rol = authService.obtenerRol();

  if (token) {
    if (rol === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/dashboard']);
    }

    return false;
  }

  return true;
};
