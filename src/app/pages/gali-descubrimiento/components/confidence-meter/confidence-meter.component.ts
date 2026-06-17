import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'confidence-meter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="meter" [class.meter--expanded]="expanded()">
      <button
        class="meter__bar"
        (click)="toggle()"
        [attr.aria-label]="'Confianza ' + value + ' por ciento. Click para ver detalles.'"
      >
        <span class="meter__segments">
          <span
            *ngFor="let i of segments; let idx = index"
            class="meter__seg"
            [class.meter__seg--filled]="idx < filled"
            [attr.data-color]="colorClass"
          ></span>
        </span>
        <span class="meter__pct" [attr.data-color]="colorClass">{{ value }}%</span>
        <span class="meter__info">ⓘ</span>
      </button>

      <div class="meter__panel" *ngIf="expanded()">
        <div class="meter__panel-header">CONFIANZA: {{ value }}%</div>
        <div class="meter__panel-divider"></div>
        <div class="meter__panel-label">Basado en:</div>
        <ul class="meter__panel-list">
          <li *ngFor="let d of details">{{ d }}</li>
        </ul>
        <div class="meter__panel-caveat" *ngIf="caveat">
          Caveat: {{ caveat }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './confidence-meter.component.scss',
})
export class ConfidenceMeterComponent {
  @Input() value = 0;
  @Input() details: string[] = [];
  @Input() caveat = '';

  expanded = signal(false);
  segments = Array.from({ length: 10 });

  get filled(): number {
    return Math.round(this.value / 10);
  }

  get colorClass(): string {
    if (this.value >= 80) return 'high';
    if (this.value >= 60) return 'mid';
    return 'low';
  }

  toggle(): void {
    this.expanded.set(!this.expanded());
  }
}
