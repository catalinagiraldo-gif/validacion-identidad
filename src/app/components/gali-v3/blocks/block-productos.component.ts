import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Producto {
  nombre: string;
  categoria: string;
  margen: number;
  curva: 'entrada' | 'estable' | 'saturando';
}

const ITEMS: Producto[] = [
  { nombre: 'Collar GPS para mascota', categoria: 'Mascotas',  margen: 58, curva: 'entrada' },
  { nombre: 'Lámpara solar plegable',  categoria: 'Hogar',     margen: 62, curva: 'entrada' },
  { nombre: 'Silla ergonómica',         categoria: 'Oficina',   margen: 41, curva: 'estable' },
  { nombre: 'Aire frío portátil',       categoria: 'Hogar',     margen: 38, curva: 'saturando' },
];

@Component({
  selector: 'block-productos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bpr">
      <div class="bpr__filter">
        <span class="bpr__filter-mono">para tu perfil</span>
        <span class="bpr__filter-chip">curva entrada</span>
      </div>
      <ul class="bpr__list">
        <li *ngFor="let p of items" class="bpr__row" [attr.data-curva]="p.curva">
          <div class="bpr__thumb" aria-hidden="true">✦</div>
          <div class="bpr__main">
            <strong>{{ p.nombre }}</strong>
            <span>{{ p.categoria }} · margen {{ p.margen }}%</span>
          </div>
          <span class="bpr__badge">{{ labelCurva(p.curva) }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bpr { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .bpr__filter {
      display: flex; gap: $gv3-space-2; align-items: center;
    }
    .bpr__filter-mono {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.12em;
      text-transform: uppercase; color: $gv3-text-tertiary;
    }
    .bpr__filter-chip {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.08em;
      padding: 3px 10px; border-radius: $gv3-radius-pill;
      background: $gv3-sage-tint; color: $gv3-sage;
    }
    .bpr__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; overflow-y: auto; }
    .bpr__row {
      display: grid; grid-template-columns: 40px 1fr auto;
      gap: $gv3-space-3; align-items: center;
      padding: 8px; border-radius: $gv3-radius-md;
      &:hover { background: $gv3-bg-cream; }
    }
    .bpr__thumb {
      width: 40px; height: 40px;
      display: grid; place-items: center;
      border-radius: $gv3-radius-md;
      background: $gv3-orange-soft; color: $gv3-orange-hover;
      font-size: 18px;
    }
    .bpr__main strong {
      display: block; font-size: $gv3-text-sm; font-weight: 500; color: $gv3-text-primary;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .bpr__main span {
      font-family: $gv3-font-mono; font-size: 10px; color: $gv3-text-tertiary;
    }
    .bpr__badge {
      font-family: $gv3-font-mono; font-size: 9px; letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 4px 8px; border-radius: $gv3-radius-pill;
    }
    .bpr__row[data-curva="entrada"]   .bpr__badge { background: $gv3-sage-tint;  color: $gv3-sage; }
    .bpr__row[data-curva="estable"]   .bpr__badge { background: $gv3-orange-tint;color: $gv3-orange-hover; }
    .bpr__row[data-curva="saturando"] .bpr__badge { background: $gv3-rust-tint;  color: $gv3-rust; }
  `],
})
export class BlockProductosComponent {
  items = ITEMS;
  labelCurva(c: Producto['curva']) {
    return c === 'entrada' ? 'entrada' : c === 'estable' ? 'estable' : 'saturando';
  }
}
