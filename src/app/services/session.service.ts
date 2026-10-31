import { Injectable, computed, signal } from '@angular/core';
import { Answer } from '../models/answer.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly _answers = signal<Answer[]>([]);

  readonly answers = this._answers.asReadonly();
  readonly answerCount = computed(() => this._answers().length);

  submitAnswer(answer: Answer): void {
    this._answers.update((answers) => [...answers, answer]);
  }
}