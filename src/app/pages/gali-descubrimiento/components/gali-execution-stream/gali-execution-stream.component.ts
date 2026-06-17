import { ChangeDetectionStrategy, Component, Input, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutionStep } from '../../models/gali.models';

@Component({
  selector: 'gali-execution-stream',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="exec" role="status" aria-live="polite">
      <div class="exec__header">
        <span class="exec__label">EXEC</span>
        <span class="exec__time" *ngIf="elapsedDisplay()">{{ elapsedDisplay() }}</span>
      </div>
      <ul class="exec__list">
        <li
          *ngFor="let step of steps; let i = index"
          class="exec__step"
          [attr.data-status]="step.status"
          [style.animation-delay.ms]="i * 120"
        >
          <span class="exec__step-icon" [attr.data-status]="step.status">
            <ng-container [ngSwitch]="step.status">
              <span *ngSwitchCase="'done'">✓</span>
              <span *ngSwitchCase="'running'" class="exec__spinner"></span>
              <span *ngSwitchDefault>○</span>
            </ng-container>
          </span>
          <span class="exec__step-label">{{ step.label }}</span>
          <span class="exec__step-time" *ngIf="step.status === 'done'">
            {{ (step.elapsedMs ?? step.duration) / 1000 | number: '1.1-1' }}s
          </span>
        </li>
      </ul>
    </div>
  `,
  styleUrl: './gali-execution-stream.component.scss',
})
export class GaliExecutionStreamComponent implements OnDestroy {
  private _steps: ExecutionStep[] = [];

  @Input() set steps(v: ExecutionStep[]) {
    this._steps = v;
    if (v.some(s => s.status === 'running')) {
      this.startTimer();
    } else if (v.every(s => s.status === 'done')) {
      this.stopTimer();
    }
  }
  get steps(): ExecutionStep[] {
    return this._steps;
  }

  private startTime = 0;
  private timerId: any;
  private elapsedMutable = signal('');
  elapsedDisplay = this.elapsedMutable.asReadonly();

  private startTimer(): void {
    if (this.timerId) return;
    this.startTime = Date.now();
    this.timerId = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000;
      this.elapsedMutable.set(elapsed.toFixed(1) + 's');
    }, 100);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
