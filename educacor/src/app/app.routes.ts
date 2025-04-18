import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './auth/auth.guard'; // ⬅️ import do guard

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'trabalhos',
        loadComponent: () =>
          import('./pages/trabalhos/trabalhos.component').then((m) => m.TrabalhosComponent),
      },
      {
        path: 'provas',
        loadComponent: () =>
          import('./pages/provas/provas.component').then((m) => m.ProvasComponent),
      },
      {
        path: 'plagio',
        loadComponent: () =>
          import('./pages/plagio/plagio.component').then((m) => m.PlagioComponent),
      },
      {
        path: 'config',
        loadComponent: () =>
          import('./pages/configuracoes/configuracoes.component').then((m) => m.ConfiguracoesComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ]
  },

  // ROTAS PÚBLICAS
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cadastrar',
    loadComponent: () =>
      import('./pages/cadastrar/cadastrar.component').then(m => m.CadastrarComponent),
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
