import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  imports: [RouterLink],
  selector: 'app-progress-preview',
  templateUrl: './progress-preview.component.html',
  styleUrl: './progress-preview.component.css',
})
export class ProgressPreviewComponent {
  private readonly session = inject(SessionService);

  readonly loggedIn = input(false);

  protected readonly answered = this.session.answerCount;

  protected readonly averageConfidence = computed(() => {
    const answers = this.session.answers();
    if (!answers.length) return null;
    return Math.round(answers.reduce((sum, a) => sum + a.confidence, 0) / answers.length);
  });

  protected readonly hasData = computed(() => this.loggedIn() && this.answered() > 0);
}
