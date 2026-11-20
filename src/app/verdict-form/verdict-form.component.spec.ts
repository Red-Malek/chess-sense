import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Answer } from '../models/answer.model';
import { VerdictFormComponent } from './verdict-form.component';

describe('VerdictFormComponent', () => {
  let fixture: ComponentFixture<VerdictFormComponent>;
  let el: HTMLElement;
  let emitted: Answer[];

  const button = () => el.querySelector('button') as HTMLButtonElement;
  // Radios appear in the order: White better, Equal, Black better.
  const radio = (index: number) =>
    el.querySelectorAll<HTMLInputElement>('input[type="radio"]')[index];
  const confidence = () => el.querySelector('input[type="range"]') as HTMLInputElement;

  async function setConfidence(value: string) {
    confidence().value = value;
    confidence().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VerdictFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(VerdictFormComponent);
    fixture.componentRef.setInput('positionId', 7);
    emitted = [];
    fixture.componentInstance.answered.subscribe((a) => emitted.push(a));
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  it('disables submit when the form is empty', () => {
    expect(button().disabled).toBe(true);
  });

  it('disables submit when only a verdict is chosen', async () => {
    radio(1).click();
    await fixture.whenStable();
    expect(button().disabled).toBe(true);
  });

  it('limits the confidence slider to 50–100', () => {
    expect(confidence().min).toBe('50');
    expect(confidence().max).toBe('100');
  });

  it('disables submit when only a confidence is chosen', async () => {
    await setConfidence('80');
    expect(button().disabled).toBe(true);
  });

  it('emits a typed answer with the position id when valid', async () => {
    radio(2).click();
    await setConfidence('80');
    expect(button().disabled).toBe(false);

    button().click();
    expect(emitted).toEqual([{ positionId: 7, verdict: 'BLACK_BETTER', confidence: 80 }]);
  });
});