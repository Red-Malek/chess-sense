import { NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthStateService } from '../auth/auth-state.service';
import { EmblemComponent } from '../emblem/emblem.component';

type NavIcon = 'train' | 'progress' | 'guide';

interface NavItem {
  path: string;
  label: string;
  icon: NavIcon;
  /** URL prefixes that should highlight this item. */
  matches: string[];
}

@Component({
  imports: [RouterLink, NgTemplateOutlet, EmblemComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeAll()',
  },
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly auth = inject(AuthStateService);

  protected readonly loggedIn = this.auth.loggedIn;
  protected readonly menuOpen = signal(false);
  protected readonly userMenuOpen = signal(false);

  protected readonly items: readonly NavItem[] = [
    { path: '/setup', label: 'Train', icon: 'train', matches: ['/setup', '/session'] },
    { path: '/progress', label: 'Progress', icon: 'progress', matches: ['/progress'] },
    { path: '/guide', label: 'Guide', icon: 'guide', matches: ['/guide'] },
  ];

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activePath = computed(
    () => this.items.find((item) => item.matches.some((m) => this.url().startsWith(m)))?.path,
  );

  protected toggleMenu(): void {
    this.userMenuOpen.set(false);
    this.menuOpen.update((open) => !open);
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
  }

  protected closeAll(): void {
    this.menuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  protected logout(): void {
    this.auth.signOut();
    this.closeAll();
    void this.router.navigateByUrl('/');
  }

  protected onDocumentClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.closeAll();
  }
}
