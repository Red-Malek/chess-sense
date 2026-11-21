import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-placeholder-page',
  template: `
    <main class="page">
      <h1>{{ title }}</h1>
      <p>This page isn't built yet.</p>
      <a routerLink="/">Back to home</a>
    </main>
  `,
  styles: `
    .page {
      display: grid;
      justify-items: center;
      gap: 0.75rem;
      max-width: 640px;
      margin: 0 auto;
      padding: 5rem 1rem;
      text-align: center;
    }

    p {
      color: var(--muted);
    }

    a {
      color: var(--accent-strong);
      font-weight: 600;
    }
  `,
})
export class PlaceholderPageComponent {
  protected readonly title: string = inject(ActivatedRoute).snapshot.data['title'] ?? 'Coming soon';
}
