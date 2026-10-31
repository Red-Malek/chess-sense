declare module 'cm-chessboard' {
  export const FEN: { readonly start: string; readonly empty: string };
  export const COLOR: { readonly white: string; readonly black: string };

  export interface ChessboardProps {
    position?: string;
    orientation?: string;
    responsive?: boolean;
    assetsUrl?: string;
    style?: {
      showCoordinates?: boolean;
      borderType?: string;
      pieces?: { file?: string };
    };
  }

  export class Chessboard {
    constructor(context: HTMLElement, props?: ChessboardProps);
    setPosition(fen: string, animated?: boolean): Promise<void>;
    setOrientation(color: string, animated?: boolean): Promise<void>;
    getPosition(): string;
    destroy(): void;
  }
}