import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dropi-button-new',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="dropi-btn"
      [class.dropi-btn--primary]="hierarchy === 'primary'"
      [class.dropi-btn--secondary]="hierarchy === 'secondary'"
      [class.dropi-btn--outline]="hierarchy === 'outline'"
      [class.dropi-btn--icon]="iconOnly"
      [style.width.px]="width"
      [disabled]="disabled"
    >
      @if (icon && !iconOnly) {
        <i class="pi" [ngClass]="icon"></i>
      }
      @if (iconOnly && icon) {
        <i class="pi" [ngClass]="icon"></i>
      }
      @if (!iconOnly) {
        <span>{{ label }}</span>
      }
    </button>
  `,
  styles: [`
    @import 'styles/gali-v5-tokens';

    .dropi-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: $size-2;
      height: 40px;
      padding: 0 $size-4;
      border-radius: $radius-lg;
      font-family: $font-primary;
      font-size: $font-sm;
      font-weight: $font-bold;
      cursor: pointer;
      border: 1px solid transparent;
      white-space: nowrap;
      transition: background 0.15s ease, border-color 0.15s ease;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &--primary {
        background: $primary-500;
        color: $white;
        border-color: $primary-500;

        &:hover:not(:disabled) {
          background: $primary-600;
        }
      }

      &--secondary,
      &--outline {
        background: $white;
        color: $gray-700;
        border-color: $gray-200;

        &:hover:not(:disabled) {
          border-color: $primary-500;
          color: $primary-600;
        }
      }

      &--icon {
        width: 42px;
        padding: 0;
      }
    }
  `],
})
export class DropiButtonNewComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() iconOnly = false;
  @Input() hierarchy: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() width?: number;
  @Input() disabled = false;
}
