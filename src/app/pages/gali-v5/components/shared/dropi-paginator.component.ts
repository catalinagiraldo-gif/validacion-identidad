import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dropi-paginator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="dropi-paginator" aria-label="Paginación">
      <button type="button" class="dropi-paginator__btn" aria-label="Primera página">
        <i class="pi pi-angle-double-left"></i>
      </button>
      <button type="button" class="dropi-paginator__btn" aria-label="Página anterior">
        <i class="pi pi-angle-left"></i>
      </button>
      <button type="button" class="dropi-paginator__btn dropi-paginator__btn--active">{{ page }}</button>
      <button type="button" class="dropi-paginator__btn" aria-label="Página siguiente">
        <i class="pi pi-angle-right"></i>
      </button>
      <button type="button" class="dropi-paginator__btn" aria-label="Última página">
        <i class="pi pi-angle-double-right"></i>
      </button>
    </nav>
  `,
  styles: [`
    @import 'styles/gali-v5-tokens';

    .dropi-paginator {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      padding-top: $size-3;

      &__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid $gray-200;
        border-radius: $radius-full;
        background: $white;
        color: $gray-600;
        cursor: pointer;
        font-family: $font-primary;
        font-size: $font-sm;

        &--active {
          background: $primary-500;
          border-color: $primary-500;
          color: $white;
        }

        &:hover:not(&--active) {
          border-color: $primary-500;
          color: $primary-600;
        }
      }
    }
  `],
})
export class DropiPaginatorComponent {
  @Input() page = 1;
}
