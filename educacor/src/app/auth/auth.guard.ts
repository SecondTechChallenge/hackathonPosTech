import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verifica se está rodando no navegador
  if (typeof window !== 'undefined') {
    const professor = localStorage.getItem('professorLogado');
    if (professor) return true;
  }

  return router.createUrlTree(['/login']);
};
