import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'setup' },
  {
    path: 'setup',
    loadComponent: () =>
      import('./setup-page/setup-page.component').then((m) => m.SetupPageComponent),
  },
  {
    path: 'session',
    loadComponent: () =>
      import('./session-page/session-page.component').then((m) => m.SessionPageComponent),
  },
];
