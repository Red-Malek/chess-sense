import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { SessionService } from '../services/session.service';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  async function create(loggedIn: boolean) {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStateService, useValue: { loggedIn: () => loggedIn } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomePageComponent);
    await fixture.whenStable();
  }

  it('offers a free session and Sign Up when logged out', async () => {
    await create(false);
    expect(text()).toContain('Try a free session');
    expect(text()).toContain('Sign Up');
    expect(text()).toContain('Solve positions to see your stats');
  });

  it('offers Start Training and View Progress when logged in', async () => {
    await create(true);
    expect(text()).toContain('View Progress');
    expect(text()).not.toContain('Try a free session');
  });

  it('shows real session stats only when logged in with answers', async () => {
    await create(true);
    TestBed.inject(SessionService).submitAnswer({
      positionId: 1,
      verdict: 'EQUAL',
      confidence: 70,
    });
    TestBed.inject(SessionService).submitAnswer({
      positionId: 2,
      verdict: 'EQUAL',
      confidence: 80,
    });
    await fixture.whenStable();
    expect(text()).toContain('75%');
    expect(text()).not.toContain('Solve positions to see your stats');
  });

  it('lists the three how-it-works steps and three features', async () => {
    await create(false);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.how-step').length).toBe(3);
    expect(el.querySelectorAll('.feature').length).toBe(3);
  });
});
