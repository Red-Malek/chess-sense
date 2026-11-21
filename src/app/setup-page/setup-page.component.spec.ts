import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SetupPageComponent } from './setup-page.component';

describe('SetupPageComponent', () => {
  let fixture: ComponentFixture<SetupPageComponent>;
  let http: HttpTestingController;
  let navigate: ReturnType<typeof vi.fn>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';
  const inputs = (name: string) =>
    Array.from(el().querySelectorAll<HTMLInputElement>(`input[name="${name}"]`));

  async function setup(positionCount: number) {
    navigate = vi.fn().mockResolvedValue(true);
    await TestBed.configureTestingModule({
      imports: [SetupPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SetupPageComponent);
    http = TestBed.inject(HttpTestingController);
    http
      .expectOne('data/positions.json')
      .flush(Array.from({ length: positionCount }, (_, i) => ({ id: i + 1, fen: 'x' })));
    await fixture.whenStable();
  }

  it('starts with all categories, All filters and 10 positions', async () => {
    await setup(30);
    const boxes = el().querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(Array.from(boxes).every((b) => b.checked)).toBe(true);
    expect(inputs('difficulty').find((r) => r.checked)?.value).toBe('ALL');
    expect(inputs('phase').find((r) => r.checked)?.value).toBe('ALL');
    expect(inputs('length').find((r) => r.checked)?.value).toBe('10');
  });

  it('keeps at least one category selected', async () => {
    await setup(30);
    const boxes = Array.from(el().querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    for (const box of boxes) {
      box.click();
      fixture.detectChanges();
    }
    expect(boxes.filter((b) => b.checked).length).toBe(1);
  });

  it('disables lengths larger than the pool and falls back to the largest available', async () => {
    await setup(12);
    expect(inputs('length').map((r) => r.disabled)).toEqual([false, false, true, true]);
    inputs('length')[1].click();
    fixture.detectChanges();
    expect(text()).toContain('10 positions');
  });

  it('uses the whole pool when it is smaller than every preset', async () => {
    await setup(3);
    expect(inputs('length').every((r) => r.disabled)).toBe(true);
    expect(text()).toContain('3 positions');
    expect(el().querySelector<HTMLButtonElement>('.start')?.disabled).toBe(false);
  });

  it('blocks Start when nothing matches', async () => {
    await setup(0);
    expect(el().querySelector<HTMLButtonElement>('.start')?.disabled).toBe(true);
    expect(text()).toContain('No positions match these filters.');
  });

  it('navigates to the session with the chosen config', async () => {
    await setup(30);
    inputs('difficulty')[2].click();
    inputs('length')[0].click();
    fixture.detectChanges();
    el().querySelector<HTMLButtonElement>('.start')?.click();
    expect(navigate).toHaveBeenCalledWith(['/session'], {
      queryParams: {
        categories: 'TACTICAL,POSITIONAL,DEFENSIVE,TECHNICAL',
        difficulty: 'INTERMEDIATE',
        phase: 'ALL',
        length: 5,
      },
    });
  });
});
