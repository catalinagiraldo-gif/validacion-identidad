import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropiPaginatorComponent } from './dropi-paginator.component';

export interface DropiTableColumnDef {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
}

@Component({
  selector: 'dropi-table-shell',
  standalone: true,
  imports: [CommonModule, DropiPaginatorComponent],
  template: `
    <div class="dropi-table-shell" [class.dropi-table-shell--sticky-actions]="stickyActionsWidth">
      <div class="dropi-table-shell__scroll" [style.min-width.px]="minWidth">
        <table class="dropi-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th
                  class="dropi-table__th"
                  [style.width]="col.width"
                  [style.text-align]="col.align ?? 'left'"
                >{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody>
            <ng-content select="[tableBody]"></ng-content>
          </tbody>
        </table>
      </div>
      @if (stickyActionsWidth) {
        <div class="dropi-table-shell__sticky" [style.width.px]="stickyActionsWidth">
          <div class="dropi-table-shell__sticky-head">{{ actionsLabel }}</div>
          <ng-content select="[actionsCol]"></ng-content>
        </div>
      }
      @if (showPaginator) {
        <dropi-paginator class="dropi-table-shell__paginator" />
      }
    </div>
  `,
  styles: [`
    @import 'styles/gali-v5-tokens';

    .dropi-table-shell {
      position: relative;
      background: $white;
      border: 1px solid $gray-100;
      border-radius: $radius-md;
      overflow: hidden;

      &--sticky-actions {
        display: flex;
        align-items: stretch;
      }

      &__scroll {
        flex: 1;
        overflow-x: auto;
        overflow-y: hidden;
      }

      &__sticky {
        flex-shrink: 0;
        border-left: 1px solid $gray-100;
        background: $white;
      }

      &__sticky-head {
        height: 55px;
        display: flex;
        align-items: center;
        padding: 0 $size-3;
        font-family: $font-primary;
        font-size: $font-sm;
        font-weight: $font-semibold;
        color: $gray-600;
        background: $gray-50;
        border-bottom: 1px solid $gray-100;
      }

      &__paginator {
        padding: $size-3 $size-4;
        border-top: 1px solid $gray-100;
      }
    }

    .dropi-table {
      width: 100%;
      border-collapse: collapse;
      font-family: $font-primary;

      &__th {
        height: 55px;
        padding: 0 $size-3;
        font-size: $font-sm;
        font-weight: $font-semibold;
        color: $gray-600;
        background: $gray-50;
        border-bottom: 1px solid $gray-100;
        white-space: nowrap;
        text-align: left;
      }
    }
  `],
})
export class DropiTableShellComponent {
  @Input() columns: DropiTableColumnDef[] = [];
  @Input() minWidth?: number;
  @Input() stickyActionsWidth?: number;
  @Input() actionsLabel = 'Acciones';
  @Input() showPaginator = true;
}
