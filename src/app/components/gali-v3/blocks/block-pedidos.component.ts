import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';

interface PedidoRow {
  id: string;
  cliente: string;
  ciudad: string;
  estado: 'entregado' | 'en_transito' | 'novedad' | 'pendiente';
  fecha: string;
  monto: number;
}

const ROWS: PedidoRow[] = [
  { id: 'DRP-48232', cliente: 'Andrea Mosquera',    ciudad: 'Cali',         estado: 'novedad',      fecha: '2026-05-26', monto: 89_000 },
  { id: 'DRP-48230', cliente: 'Carlos Rincón',       ciudad: 'Bogotá',       estado: 'en_transito',  fecha: '2026-05-26', monto: 142_000 },
  { id: 'DRP-48229', cliente: 'María Paula Suárez',  ciudad: 'Medellín',     estado: 'en_transito',  fecha: '2026-05-26', monto: 165_000 },
  { id: 'DRP-48225', cliente: 'Juan David López',    ciudad: 'Barranquilla', estado: 'entregado',    fecha: '2026-05-25', monto: 92_000 },
  { id: 'DRP-48222', cliente: 'Lucía Hernández',     ciudad: 'Pereira',      estado: 'pendiente',    fecha: '2026-05-25', monto: 78_000 },
];

@Component({
  selector: 'block-pedidos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bp">
      <div class="bp__summary">
        <div class="bp__stat" data-tone="warn">
          <span class="bp__stat-num">{{ count('novedad') }}</span>
          <span class="bp__stat-label">Novedades</span>
        </div>
        <div class="bp__stat">
          <span class="bp__stat-num">{{ count('en_transito') }}</span>
          <span class="bp__stat-label">En tránsito</span>
        </div>
        <div class="bp__stat">
          <span class="bp__stat-num">{{ count('pendiente') }}</span>
          <span class="bp__stat-label">Pendientes</span>
        </div>
        <div class="bp__stat" data-tone="ok">
          <span class="bp__stat-num">{{ count('entregado') }}</span>
          <span class="bp__stat-label">Entregados</span>
        </div>
      </div>

      <ul class="bp__list">
        <li *ngFor="let r of rows" class="bp__row" [attr.data-estado]="r.estado">
          <span class="bp__row-dot" aria-hidden="true"></span>
          <div class="bp__row-main">
            <strong>{{ r.cliente }}</strong>
            <span>{{ r.ciudad }} · {{ r.id }}</span>
          </div>
          <span class="bp__row-monto">{{ formatCOP(r.monto) }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bp { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; min-height: 0; }
    .bp__summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $gv3-space-2;
    }
    .bp__stat {
      padding: $gv3-space-3;
      background: $gv3-bg-cream;
      border-radius: $gv3-radius-md;
      display: flex;
      flex-direction: column;
      gap: 2px;
      border-left: 3px solid $gv3-border-default;
      &[data-tone="warn"] { border-left-color: $gv3-rust; background: $gv3-rust-tint; }
      &[data-tone="ok"] { border-left-color: $gv3-sage; background: $gv3-sage-tint; }
    }
    .bp__stat-num {
      font-family: $gv3-font-display;
      font-variation-settings: 'opsz' 36, 'SOFT' 40;
      font-size: clamp(20px, 2.2vw, 26px);
      font-weight: 600;
      color: $gv3-text-primary;
      line-height: 1;
    }
    .bp__stat-label {
      font-family: $gv3-font-mono;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: $gv3-text-tertiary;
    }
    .bp__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
    }
    .bp__row {
      display: grid;
      grid-template-columns: 8px 1fr auto;
      gap: $gv3-space-3;
      align-items: center;
      padding: 8px 10px;
      border-radius: $gv3-radius-sm;
      &:hover { background: $gv3-bg-cream; }
    }
    .bp__row-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $gv3-text-muted;
    }
    .bp__row[data-estado="novedad"] .bp__row-dot { background: $gv3-rust; box-shadow: 0 0 0 3px $gv3-rust-tint; }
    .bp__row[data-estado="en_transito"] .bp__row-dot { background: $gv3-orange; box-shadow: 0 0 0 3px $gv3-orange-tint; }
    .bp__row[data-estado="pendiente"] .bp__row-dot { background: $gv3-amber; }
    .bp__row[data-estado="entregado"] .bp__row-dot { background: $gv3-sage; }
    .bp__row-main { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .bp__row-main strong {
      font-size: $gv3-text-sm;
      font-weight: 500;
      color: $gv3-text-primary;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .bp__row-main span {
      font-family: $gv3-font-mono;
      font-size: 10px;
      color: $gv3-text-tertiary;
    }
    .bp__row-monto {
      font-family: $gv3-font-mono;
      font-size: $gv3-text-xs;
      color: $gv3-text-secondary;
    }
  `],
})
export class BlockPedidosComponent {
  rows = ROWS;
  count(estado: PedidoRow['estado']): number {
    return this.rows.filter(r => r.estado === estado).length;
  }
  formatCOP(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  }
}
