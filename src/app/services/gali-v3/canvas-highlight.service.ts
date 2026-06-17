import { Injectable, signal } from '@angular/core';
import { BlockId } from './block-registry';

export type HighlightState = 'active' | 'done' | null;

@Injectable({ providedIn: 'root' })
export class CanvasHighlightService {
  readonly blockId = signal<BlockId | string | null>(null);
  readonly state = signal<HighlightState>(null);
  readonly deltaLabel = signal<string | null>(null);

  highlight(blockId: BlockId | string, state: HighlightState = 'active', delta?: string) {
    this.blockId.set(blockId);
    this.state.set(state);
    this.deltaLabel.set(delta ?? null);
  }

  clear() {
    this.blockId.set(null);
    this.state.set(null);
    this.deltaLabel.set(null);
  }

  isHighlighted(id: BlockId | string): HighlightState {
    if (this.blockId() !== id) return null;
    return this.state();
  }
}
