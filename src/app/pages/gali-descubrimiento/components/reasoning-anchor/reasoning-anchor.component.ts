import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reasoning-anchor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ra" *ngIf="text" role="status" aria-live="polite">
      <span class="ra__icon">💡</span>
      <p class="ra__text">{{ text }}</p>
      <button class="ra__cta" type="button">Cambiar criterio ↗</button>
    </div>
  `,
  styleUrl: './reasoning-anchor.component.scss',
})
export class ReasoningAnchorComponent {
  @Input() text = '';
}
