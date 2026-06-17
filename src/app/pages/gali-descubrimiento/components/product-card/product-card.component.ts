import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/gali.models';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="pc"
      [class.pc--selected]="selected"
      [class.pc--dimmed]="dimmed"
      [style.animation-delay.ms]="animDelay"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
      [attr.aria-labelledby]="'pc-title-' + product.id"
    >
      <div class="pc__media">
        <img
          [src]="product.image"
          [alt]="product.name"
          class="pc__img"
          loading="lazy"
          (error)="onImgError($event)"
        />
        <div class="pc__badge" *ngIf="product.badge">
          <span class="pc__badge-icon">{{ product.badge.icon }}</span>
          <span class="pc__badge-label">{{ product.badge.label }}</span>
        </div>
        <div class="pc__check" *ngIf="selected" aria-label="Seleccionado">✓</div>
      </div>

      <div class="pc__body">
        <h3 class="pc__title" [id]="'pc-title-' + product.id">{{ product.name }}</h3>
        <div class="pc__supplier" *ngIf="product.supplier?.verified">
          <span class="pc__verified">✓</span> Proveedor verificado
        </div>

        <div class="pc__row">
          <span class="pc__metric pc__price">
            <span class="pc__metric-label">Sugerido</span>
            <span class="pc__metric-value">\${{ formatCurrency(product.suggestedPrice) }}</span>
          </span>
          <span class="pc__metric pc__margin" [attr.data-tier]="marginTier">
            <span class="pc__metric-label">Margen</span>
            <span class="pc__metric-value">{{ product.margin }}%</span>
          </span>
        </div>

        <div class="pc__sales">
          <span class="pc__sales-num">{{ product.salesWeek }}</span>
          <span class="pc__sales-text">ventas/sem en Colombia</span>
          <span class="pc__trend" [attr.data-direction]="trendDirection">
            {{ trendArrow }} {{ product.trendPct > 0 ? '+' : '' }}{{ product.trendPct }}%
          </span>
        </div>

        <div class="pc__actions">
          <button type="button" class="pc__btn pc__btn--ghost" (click)="details.emit(product)">
            Ver detalles
          </button>
          <button
            type="button"
            class="pc__btn pc__btn--primary"
            (click)="choose.emit(product)"
            [disabled]="selected"
          >
            {{ selected ? '✓ Seleccionado' : 'Elegir este' }}
          </button>
        </div>

        <div class="pc__confidence" [attr.data-tier]="confidenceTier">
          <span class="pc__conf-segments">
            <span
              *ngFor="let _ of confidenceSegments; let i = index"
              class="pc__conf-seg"
              [class.pc__conf-seg--filled]="i < confidenceFilled"
            ></span>
          </span>
          <span class="pc__conf-pct">{{ product.confidence }}%</span>
        </div>
      </div>

      <div class="pc__why" *ngIf="whyVisible() && product.reasoning && !selected">
        <header class="pc__why-header">¿POR QUÉ ESTE?</header>
        <ul class="pc__why-list">
          <li>{{ product.reasoning.salesPercentile }}</li>
          <li>{{ product.reasoning.marginRationale }}</li>
          <li>{{ product.reasoning.trendNote }}</li>
        </ul>
        <div class="pc__why-footer">
          Coincidencia con tu intención:
          <strong>{{ product.confidence }}%</strong>
        </div>
      </div>
    </article>
  `,
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() selected = false;
  @Input() dimmed = false;
  @Input() animDelay = 0;
  @Output() choose = new EventEmitter<Product>();
  @Output() details = new EventEmitter<Product>();
  @Output() hovered = new EventEmitter<Product>();

  whyVisible = signal(false);
  confidenceSegments = Array.from({ length: 4 });
  private hoverTimer: any;
  private learningTimer: any;

  onEnter(): void {
    this.hoverTimer = setTimeout(() => this.whyVisible.set(true), 800);
    this.learningTimer = setTimeout(() => this.hovered.emit(this.product), 2000);
  }

  onLeave(): void {
    clearTimeout(this.hoverTimer);
    clearTimeout(this.learningTimer);
    setTimeout(() => this.whyVisible.set(false), 200);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/products/smartwatch.jpg';
  }

  formatCurrency(n: number): string {
    return new Intl.NumberFormat('es-CO').format(n);
  }

  get marginTier(): 'strong' | 'medium' | 'weak' {
    if (this.product.margin >= 50) return 'strong';
    if (this.product.margin >= 30) return 'medium';
    return 'weak';
  }

  get trendDirection(): 'up' | 'flat' | 'down' {
    if (this.product.trendPct > 5) return 'up';
    if (this.product.trendPct < -5) return 'down';
    return 'flat';
  }

  get trendArrow(): string {
    return this.trendDirection === 'up' ? '↗' : this.trendDirection === 'down' ? '↘' : '→';
  }

  get confidenceFilled(): number {
    return Math.round((this.product.confidence / 100) * 4);
  }

  get confidenceTier(): 'high' | 'mid' | 'low' {
    if (this.product.confidence >= 80) return 'high';
    if (this.product.confidence >= 60) return 'mid';
    return 'low';
  }
}
