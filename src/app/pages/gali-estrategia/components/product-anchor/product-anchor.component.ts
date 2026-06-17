import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../gali-descubrimiento/models/gali.models';

@Component({
  selector: 'product-anchor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="pa" *ngIf="product">
      <div class="pa__label">PRODUCTO ANCLADO</div>
      <div class="pa__image">
        <img [src]="product.image" [alt]="product.name" />
        <div class="pa__lock">🔒</div>
      </div>
      <h2 class="pa__title">{{ product.name }}</h2>
      <div class="pa__supplier" *ngIf="product.supplier?.verified">
        <span>✓</span> {{ product.supplier.name }}
      </div>

      <div class="pa__metrics">
        <div class="pa__metric">
          <span class="pa__metric-label">Costo</span>
          <span class="pa__metric-value">\${{ formatCop(product.cost) }}</span>
        </div>
        <div class="pa__metric">
          <span class="pa__metric-label">Sugerido</span>
          <span class="pa__metric-value">\${{ formatCop(product.suggestedPrice) }}</span>
        </div>
        <div class="pa__metric pa__metric--accent">
          <span class="pa__metric-label">Margen</span>
          <span class="pa__metric-value pa__metric-value--strong">{{ product.margin }}%</span>
        </div>
      </div>

      <div class="pa__sales">
        <div class="pa__sales-num">{{ product.salesWeek }}</div>
        <div class="pa__sales-text">ventas/semana en Colombia</div>
        <div class="pa__trend" [attr.data-direction]="trendDirection">
          {{ trendArrow }} {{ product.trendPct > 0 ? '+' : '' }}{{ product.trendPct }}%
        </div>
      </div>

      <div class="pa__reasoning" *ngIf="product.reasoning">
        <div class="pa__reasoning-label">¿POR QUÉ ESTE?</div>
        <ul>
          <li>{{ product.reasoning.salesPercentile }}</li>
          <li>{{ product.reasoning.marginRationale }}</li>
          <li>{{ product.reasoning.trendNote }}</li>
        </ul>
      </div>

      <div class="pa__hint">
        <span class="pa__hint-icon">🔒</span>
        Producto fijo durante esta fase
      </div>
    </aside>
  `,
  styleUrl: './product-anchor.component.scss',
})
export class ProductAnchorComponent {
  @Input() product: Product | null = null;

  formatCop(n: number): string {
    return new Intl.NumberFormat('es-CO').format(n);
  }

  get trendDirection(): 'up' | 'flat' | 'down' {
    if (!this.product) return 'flat';
    if (this.product.trendPct > 5) return 'up';
    if (this.product.trendPct < -5) return 'down';
    return 'flat';
  }

  get trendArrow(): string {
    return this.trendDirection === 'up' ? '↗' : this.trendDirection === 'down' ? '↘' : '→';
  }
}
