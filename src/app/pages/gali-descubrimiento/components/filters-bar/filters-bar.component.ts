import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'filters-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fb">
      <div class="fb__filters">
        <span class="fb__label">Filtros</span>
        <button
          *ngFor="let c of categories"
          type="button"
          class="fb__chip"
          [class.fb__chip--active]="activeCategory === c.value"
          (click)="onCategory(c.value)"
        >
          <span *ngIf="c.icon" class="fb__chip-icon">{{ c.icon }}</span>
          {{ c.label }}
        </button>
      </div>

      <div class="fb__sort">
        <span class="fb__sort-label">Ordenar</span>
        <div class="fb__select-wrap">
          <button
            type="button"
            class="fb__select-trigger"
            (click)="toggleSort()"
            [class.fb__select-trigger--open]="sortOpen()"
          >
            <span class="fb__select-icon">{{ sortIcon }}</span>
            {{ sortLabel }}
            <span class="fb__chevron">▾</span>
          </button>
          <ul class="fb__select-menu" *ngIf="sortOpen()">
            <li
              *ngFor="let opt of sortOptions"
              class="fb__select-opt"
              [class.fb__select-opt--active]="activeSort === opt.value"
              (click)="onSort(opt.value)"
            >
              <span class="fb__chip-icon">{{ opt.icon }}</span>
              {{ opt.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  @Input() activeCategory = 'todos';
  @Input() activeSort: 'sales' | 'trend' | 'margin' = 'sales';
  @Output() categoryChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<'sales' | 'trend' | 'margin'>();

  sortOpen = signal(false);

  categories = [
    { label: 'Todos', value: 'todos', icon: '' },
    { label: 'Tendencia', value: 'tendencia', icon: '🔥' },
    { label: 'Mascotas', value: 'mascotas', icon: '' },
    { label: 'Skincare', value: 'skincare', icon: '' },
    { label: 'Hogar', value: 'hogar', icon: '' },
    { label: 'Fitness', value: 'fitness', icon: '' },
    { label: 'Tech', value: 'tech', icon: '' },
  ];

  sortOptions: { label: string; value: 'sales' | 'trend' | 'margin'; icon: string }[] = [
    { label: 'Más vendidos', value: 'sales', icon: '🔥' },
    { label: 'Tendencia', value: 'trend', icon: '📈' },
    { label: 'Mayor margen', value: 'margin', icon: '💰' },
  ];

  get sortLabel(): string {
    return this.sortOptions.find(o => o.value === this.activeSort)?.label ?? 'Ordenar';
  }

  get sortIcon(): string {
    return this.sortOptions.find(o => o.value === this.activeSort)?.icon ?? '';
  }

  private categoryDebounce: any;

  onCategory(value: string): void {
    clearTimeout(this.categoryDebounce);
    this.categoryDebounce = setTimeout(() => {
      this.categoryChanged.emit(value);
    }, 300);
  }

  toggleSort(): void {
    this.sortOpen.set(!this.sortOpen());
  }

  onSort(v: 'sales' | 'trend' | 'margin'): void {
    this.sortOpen.set(false);
    this.sortChanged.emit(v);
  }
}
