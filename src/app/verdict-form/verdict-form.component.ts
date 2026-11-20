import { Component, computed, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Answer } from '../models/answer.model';
import { Verdict } from '../models/verdict.model';

@Component({
  selector: 'app-verdict-form',
  imports: [ReactiveFormsModule],
  templateUrl: './verdict-form.component.html',
  styleUrl: './verdict-form.component.css',
})
export class VerdictFormComponent {
  readonly positionId = input.required<number>();
  readonly answered = output<Answer>();

  protected readonly verdictOptions: { value: Verdict; label: string }[] = [
    { value: 'WHITE_BETTER', label: 'White is better' },
    { value: 'EQUAL', label: 'Equal' },
    { value: 'BLACK_BETTER', label: 'Black is better' },
  ];

  protected readonly form = new FormGroup({
    verdict: new FormControl<Verdict | null>(null, Validators.required),
    confidence: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(50),
      Validators.max(100),
    ]),
  });

  protected readonly confidence = toSignal(this.form.controls.confidence.valueChanges, {
    initialValue: this.form.controls.confidence.value,
  });

  /** Native range inputs rest at the midpoint of 50–100 until the user moves them. */
  private readonly restingConfidence = 75;

  protected readonly sliderPercent = computed(
    () => ((this.confidence() ?? this.restingConfidence) - 50) * 2,
  );

  protected commitConfidence(event: Event): void {
    const control = this.form.controls.confidence;
    if (control.value === null) {
      control.setValue(Number((event.target as HTMLInputElement).value));
    }
    control.markAsTouched();
  }

  protected submit(): void {
    const { verdict, confidence } = this.form.getRawValue();
    if (this.form.invalid || verdict === null || confidence === null) {
      this.form.markAllAsTouched();
      return;
    }
    this.answered.emit({ positionId: this.positionId(), verdict, confidence });
  }
}