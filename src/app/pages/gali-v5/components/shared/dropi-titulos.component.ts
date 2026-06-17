import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dropi-titulos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="dropi-titulos">
      <nav class="dropi-titulos__breadcrumbs" aria-label="Breadcrumb">
        <a routerLink="/gali-v5" class="dropi-titulos__crumb dropi-titulos__crumb--home" aria-label="Inicio">
          <i class="pi pi-home"></i>
        </a>
        @for (crumb of breadcrumbs; track $index; let last = $last) {
          <i class="pi pi-chevron-right dropi-titulos__sep"></i>
          <span class="dropi-titulos__crumb" [class.dropi-titulos__crumb--active]="last">{{ crumb }}</span>
        }
      </nav>
      <div class="dropi-titulos__row">
        <h1 class="dropi-titulos__title">{{ title }}</h1>
        <div class="dropi-titulos__actions">
          <ng-content select="[titulosActions]"></ng-content>
        </div>
      </div>
    </header>
  `,
  styles: [`
    @import 'styles/gali-v5-tokens';

    .dropi-titulos {
      display: flex;
      flex-direction: column;
      gap: $size-1;
    }

    .dropi-titulos__breadcrumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
    }

    .dropi-titulos__crumb {
      font-family: $font-primary;
      font-size: $font-xs;
      line-height: 1.5;
      color: $gray-500;
      text-decoration: none;

      &--home {
        display: inline-flex;
        align-items: center;
      }

      &--active {
        color: $gray-700;
      }
    }

    .dropi-titulos__sep {
      font-size: 10px;
      color: $gray-400;
    }

    .dropi-titulos__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $size-4;
      flex-wrap: wrap;
    }

    .dropi-titulos__title {
      margin: 0;
      font-family: $font-primary;
      font-size: $font-2xl;
      font-weight: $font-bold;
      color: $gray-700;
      line-height: 1.1;
    }

    .dropi-titulos__actions {
      display: flex;
      align-items: center;
      gap: $size-3;
      flex-wrap: wrap;
    }
  `],
})
export class DropiTitulosComponent {
  @Input({ required: true }) title!: string;
  @Input() breadcrumbs: string[] = [];
}
