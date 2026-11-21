import { Routes } from '@angular/router';

const placeholder = (title: string) => ({
  loadComponent: () =>
    import('./placeholder-page/placeholder-page.component').then((m) => m.PlaceholderPageComponent),
  data: { title },
});

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home-page/home-page.component').then((m) => m.HomePageComponent),
  },
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
  { path: 'progress', ...placeholder('Progress') },
  { path: 'guide', ...placeholder('Guide') },
  { path: 'sign-in', ...placeholder('Sign In') },
  { path: 'sign-up', ...placeholder('Sign Up') },
  { path: 'profile', ...placeholder('Profile') },
  { path: '**', redirectTo: '' },
];
