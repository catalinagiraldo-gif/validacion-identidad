import { Injectable, signal } from '@angular/core';

export type TourPlacement = 'center' | 'bottom' | 'right' | 'left' | 'top';

export interface TourStep {
  id: string;
  title: string;
  body: string;
  /** CSS selector for the spotlight target; omit for a centered modal step */
  target?: string;
  placement?: TourPlacement;
  /** Run before showing this step (e.g. navigate the prototype to a state) */
  onEnter?: () => void;
}

/**
 * Generic, prototype-agnostic guided-tour engine.
 * Steps are supplied by the host (with `onEnter` hooks that drive the
 * prototype) via `setSteps()`, keeping navigation logic reusable.
 */
@Injectable({ providedIn: 'root' })
export class IdentidadTourService {
  readonly active = signal(false);
  readonly stepIndex = signal(0);

  private readonly _steps = signal<TourStep[]>([]);
  readonly steps = this._steps.asReadonly();

  setSteps(steps: TourStep[]): void {
    this._steps.set(steps);
  }

  currentStep(): TourStep | null {
    return this._steps()[this.stepIndex()] ?? null;
  }

  start(): void {
    if (this._steps().length === 0) return;
    this.stepIndex.set(0);
    this.active.set(true);
    this.runHook(0);
  }

  next(): void {
    const i = this.stepIndex();
    if (i < this._steps().length - 1) {
      const n = i + 1;
      this.stepIndex.set(n);
      this.runHook(n);
    } else {
      this.finish();
    }
  }

  prev(): void {
    const i = this.stepIndex();
    if (i > 0) {
      const p = i - 1;
      this.stepIndex.set(p);
      this.runHook(p);
    }
  }

  skip(): void {
    this.finish();
  }

  finish(): void {
    this.active.set(false);
  }

  isLast(): boolean {
    return this.stepIndex() === this._steps().length - 1;
  }

  private runHook(index: number): void {
    this._steps()[index]?.onEnter?.();
  }
}
