import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Landing {
  nombre: string;
  visitas: number;
  conversion: number;
  estado: 'live' | 'borrador';
}

const ITEMS: Landing[] = [
  { nombre: 'Collar GPS — Bogotá', visitas: 2840, conversion: 3.2, estado: 'live' },
  { nombre: 'Silla ergonómica',    visitas: 1120, conversion: 1.4, estado: 'live' },
  { nombre: 'Lámpara solar',       visitas:    0, conversion: 0,   estado: 'borrador' },
];

@Component({
  selector: 'block-landings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bl">
      <ul class="bl__list">
        <li *ngFor="let l of items" class="bl__row" [attr.data-estado]="l.estado">
          <span class="bl__pill">{{ l.estado === 'live' ? 'LIVE' : 'DRAFT' }}</span>
          <div class="bl__main">
            <strong>{{ l.nombre }}</strong>
            <span *ngIf="l.estado === 'live'">{{ l.visitas | number }} visitas · {{ l.conversion }}% conv.</span>
            <span *ngIf="l.estado === 'borrador'">sin publicar</span>
          </div>
        </li>
      </ul>
      <button type="button" class="bl__cta">✦ crear con Gali</button>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bl { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .bl__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; overflow-y: auto; }
    .bl__row {
      display: grid; grid-template-columns: auto 1fr;
      gap: $gv3-space-3; align-items: center;
      padding: 10px; border-radius: $gv3-radius-md;
      background: $gv3-bg-cream;
    }
    .bl__pill {
      font-family: $gv3-font-mono;
      font-size: 9px; letter-spacing: 0.16em; font-weight: 700;
      padding: 3px 8px; border-radius: $gv3-radius-pill;
      background: $gv3-text-muted; color: $gv3-text-onAccent;
    }
    .bl__row[data-estado="live"] .bl__pill { background: $gv3-sage; }
    .bl__row[data-estado="borrador"] .bl__pill { background: $gv3-amber; }
    .bl__main strong {
      display: block; font-size: $gv3-text-sm; font-weight: 500; color: $gv3-text-primary;
    }
    .bl__main span {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.06em;
      color: $gv3-text-tertiary;
    }
    .bl__cta {
      appearance: none; cursor: pointer;
      background: $gv3-terracota; color: $gv3-text-onAccent;
      border: 0;
      border-radius: $gv3-radius-md;
      padding: 10px;
      font-family: $gv3-font-mono; font-size: $gv3-text-xs;
      letter-spacing: 0.12em; text-transform: uppercase;
      transition: all $gv3-dur-fast $gv3-ease-out;
      &:hover { background: darken(#B8593A, 6%); transform: translateY(-1px); box-shadow: $gv3-shadow-md; }
    }
  `],
})
export class BlockLandingsComponent {
  items = ITEMS;
}
