import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../gali-descubrimiento/models/gali.models';

@Component({
  selector: 'product-mini-rail',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="pmr" *ngIf="product" [title]="product.name">
      <div class="pmr__image">
        <img [src]="product.image" [alt]="product.name" />
      </div>
      <div class="pmr__label">
        <span class="pmr__label-letter">P</span>
        <span class="pmr__label-letter">R</span>
        <span class="pmr__label-letter">O</span>
        <span class="pmr__label-letter">D</span>
      </div>
      <div class="pmr__name">{{ product.name }}</div>
      <div class="pmr__lock">🔒</div>
    </aside>
  `,
  styleUrl: './product-mini-rail.component.scss',
})
export class ProductMiniRailComponent {
  @Input() product: Product | null = null;
}
