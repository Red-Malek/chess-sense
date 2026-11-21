import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  const el = () => fixture.nativeElement as HTMLElement;

  async function create(loggedIn: boolean) {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStateService, useValue: { loggedIn: () => loggedIn, signOut: vi.fn() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(NavbarComponent);
    await fixture.whenStable();
  }

  it('links Train, Progress and Guide', async () => {
    await create(false);
    const labels = Array.from(el().querySelectorAll('.links .link')).map((a) =>
      a.textContent?.trim(),
    );
    expect(labels).toEqual(['Train', 'Progress', 'Guide']);
  });

  it('shows Sign In and Sign Up when logged out', async () => {
    await create(false);
    const text = el().querySelector('.actions')?.textContent ?? '';
    expect(text).toContain('Sign In');
    expect(text).toContain('Sign Up');
    expect(el().querySelector('[aria-label="Account menu"]')).toBeNull();
  });

  it('shows Start Training and a user menu when logged in', async () => {
    await create(true);
    expect(el().querySelector('.actions')?.textContent).toContain('Start Training');
    el().querySelector<HTMLButtonElement>('[aria-label="Account menu"]')?.click();
    await fixture.whenStable();
    const items = Array.from(el().querySelectorAll('[role="menuitem"]')).map((i) =>
      i.textContent?.trim(),
    );
    expect(items).toEqual(['Profile', 'Log out']);
  });

  it('opens and closes the mobile drawer', async () => {
    await create(false);
    const burger = el().querySelector<HTMLButtonElement>('.burger')!;
    expect(el().querySelector('#mobile-drawer')).toBeNull();
    burger.click();
    await fixture.whenStable();
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(el().querySelector('#mobile-drawer')).not.toBeNull();
    burger.click();
    await fixture.whenStable();
    expect(el().querySelector('#mobile-drawer')).toBeNull();
  });
});
