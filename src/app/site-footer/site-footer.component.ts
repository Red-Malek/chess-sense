import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-site-footer',
  template: `
    <footer class="footer">
      <p class="brand">Chess<span>Sense</span></p>
      <nav aria-label="Footer">
        <a routerLink="/guide">Guide</a>
        <a routerLink="/progress">Progress</a>
      </nav>
      <p class="copy">© {{ year }} ChessSense</p>
    </footer>
  `,
  styles: `
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem 1rem 2rem;
      border-top: 1px solid color-mix(in srgb, var(--text) 9%, transparent);
      color: var(--muted);
      font-size: 0.85rem;
    }

    .brand {
      color: var(--text);
      font-weight: 800;
    }

    .brand span {
      color: var(--accent);
    }

    nav {
      display: flex;
      gap: 1.25rem;
    }

    a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      color: var(--text);
    }
  `,
})
export class SiteFooterComponent {
  protected readonly year = new Date().getFullYear();
}
