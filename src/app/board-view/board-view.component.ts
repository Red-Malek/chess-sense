import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { COLOR, Chessboard } from 'cm-chessboard';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.css',
})
export class BoardViewComponent {
  readonly fen = input.required<string>();
  readonly orientation = input<'white' | 'black'>('white');

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private board?: Chessboard;

  constructor() {
    afterNextRender(() => {
      this.board = new Chessboard(this.host().nativeElement, {
        position: this.fen(),
        orientation: this.colorOf(this.orientation()),
        assetsUrl: '/assets/cm-chessboard/',
        style: { showCoordinates: true, pieces: { file: 'pieces/standard.svg' } },
      });
    });

    effect(() => {
      const fen = this.fen();
      void this.board?.setPosition(fen);
    });

    effect(() => {
      const orientation = this.orientation();
      void this.board?.setOrientation(this.colorOf(orientation));
    });

    inject(DestroyRef).onDestroy(() => this.board?.destroy());
  }

  private colorOf(orientation: 'white' | 'black'): string {
    return orientation === 'white' ? COLOR.white : COLOR.black;
  }
}
