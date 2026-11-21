import { Injectable, signal } from '@angular/core';

const DEV_FLAG = 'chesssense.devLoggedIn';

/**
 * Stub: ChessSense has no authentication yet. This only answers "is someone logged in?" so the
 * navbar and home page can render both states. Until a real auth flow exists, set
 * `localStorage['chesssense.devLoggedIn'] = '1'` and reload to preview the logged-in UI.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _loggedIn = signal(AuthStateService.readFlag());
  readonly loggedIn = this._loggedIn.asReadonly();

  signOut(): void {
    try {
      localStorage.removeItem(DEV_FLAG);
    } catch {
      // storage unavailable; the in-memory state below is enough
    }
    this._loggedIn.set(false);
  }

  private static readFlag(): boolean {
    try {
      return localStorage.getItem(DEV_FLAG) === '1';
    } catch {
      return false;
    }
  }
}
