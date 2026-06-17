import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DropiTagVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'carrier';

@Component({
  selector: 'dropi-tag',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="dropi-tag dropi-tag--{{ variant }}">{{ label }}</span>`,
  styles: [`
    @import 'styles/gali-v5-tokens';

    .dropi-tag {
      display: inline-flex;
      align-items: center;
      height: 24px;
      padding: 0 $size-2;
      border-radius: $radius-sm;
      font-family: $font-primary;
      font-size: 11px;
      font-weight: $font-semibold;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      white-space: nowrap;

      &--success {
        background: rgba($success, 0.12);
        color: darken($success, 8%);
      }

      &--warning {
        background: rgba($warning, 0.12);
        color: darken($warning, 10%);
      }

      &--error {
        background: rgba($error, 0.12);
        color: $error;
      }

      &--info {
        background: rgba($info, 0.12);
        color: $secondary-600;
      }

      &--neutral {
        background: $gray-100;
        color: $gray-600;
      }

      &--carrier {
        background: rgba($secondary-500, 0.12);
        color: $secondary-600;
      }
    }
  `],
})
export class DropiTagComponent {
  @Input({ required: true }) label!: string;
  @Input() variant: DropiTagVariant = 'neutral';
}
