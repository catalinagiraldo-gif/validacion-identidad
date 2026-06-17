import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gali-suggestion-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="chip"
      [class.chip--accent]="accent"
      [style.animation-delay.ms]="delay"
      (click)="clicked.emit(label)"
      [attr.aria-label]="'Sugerencia: ' + label"
    >
      <span class="chip__arrow" *ngIf="!accent">▸</span>
      <span class="chip__label">{{ label }}</span>
    </button>
  `,
  styleUrl: './gali-suggestion-chip.component.scss',
})
export class GaliSuggestionChipComponent {
  @Input({ required: true }) label = '';
  @Input() accent = false;
  @Input() delay = 0;
  @Output() clicked = new EventEmitter<string>();
}
