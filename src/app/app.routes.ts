import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'session' },
  {
    path: 'session',
    loadComponent: () =>
      import('./session-page/session-page.component').then((m) => m.SessionPageComponent),
  },
];