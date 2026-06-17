import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'dropi-search-oficial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropiSearchOficialComponent),
    multi: true,
  }],
  template: `
    <div class="dropi-search" [style.max-width.px]="width">
      <i class="pi pi-search"></i>
      @if (guiaLabel) {
        <span class="dropi-search__guia">{{ guiaLabel }}</span>
      }
      <input
        type="search"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
      />
    </div>
  `,
  styles: [`
    @import 'styles/gali-v5-tokens';

    .dropi-search {
      flex: 1;
      min-width: 200px;
      display: flex;
      align-items: center;
      gap: $size-2;
      height: 40px;
      padding: 0 $size-3;
      border: 1px solid $gray-200;
      border-radius: $radius-lg;
      background: $white;

      .pi-search {
        color: $gray-400;
        font-size: $font-sm;
      }

      &__guia {
        font-family: $font-primary;
        font-size: $font-sm;
        color: $gray-500;
        white-space: nowrap;
        padding-right: $size-2;
        border-right: 1px solid $gray-200;
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        font-family: $font-primary;
        font-size: $font-sm;
        background: transparent;
        color: $gray-700;

        &::placeholder {
          color: $gray-400;
        }
      }
    }
  `],
})
export class DropiSearchOficialComponent implements ControlValueAccessor {
  @Input() placeholder = 'Buscar…';
  @Input() guiaLabel?: string;
  @Input() width = 385;

  value = '';
  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string): void {
    this.value = v ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
