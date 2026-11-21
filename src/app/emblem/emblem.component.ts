import { Component } from '@angular/core';

@Component({
  selector: 'app-emblem',
  template: `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="17" r="8" />
      <path d="M26 27h12l3 12c1 4 3 6 6 8H17c3-2 5-4 6-8z" />
      <rect x="14" y="47" width="36" height="6" rx="2" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: var(--emblem-size, 32px);
      height: var(--emblem-size, 32px);
      filter: drop-shadow(
        0 0 var(--emblem-glow, 8px) color-mix(in srgb, var(--accent) 55%, transparent)
      );
    }

    svg {
      width: 100%;
      height: 100%;
      fill: color-mix(in srgb, var(--accent) 20%, transparent);
      stroke: var(--accent);
      stroke-width: 2.5;
      stroke-linejoin: round;
    }
  `,
})
export class EmblemComponent {}
