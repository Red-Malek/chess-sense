import { Component, computed, inject, signal } from '@angular/core';
import { BoardViewComponent } from '../board-view/board-view.component';
import { Answer } from '../models/answer.model';
import { ChessPosition } from '../models/chess-position.model';
import { PositionService } from '../services/position.service';
import { VerdictFormComponent } from '../verdict-form/verdict-form.component';

@Component({
  imports: [BoardViewComponent, VerdictFormComponent],
  selector: 'app-session-page',
  styleUrl: './session-page.component.css',
  templateUrl: './session-page.component.html',
})
export class SessionPageComponent {
  protected readonly positionService = inject(PositionService);
  protected readonly currentIndex = signal(0);
  protected readonly currentPosition = computed<ChessPosition | undefined>(
    () => this.positionService.positions()[this.currentIndex()],
  );

  protected onAnswered(answer: Answer): void {
    console.log('TEMP answer received', answer);
  }

  constructor() {
    this.positionService.load();
  }
}
