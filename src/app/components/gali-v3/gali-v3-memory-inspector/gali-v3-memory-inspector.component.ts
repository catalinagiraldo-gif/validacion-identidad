import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Recuerdo {
  id: string;
  categoria: 'perfil' | 'ritmo' | 'preferencia' | 'decision';
  texto: string;
  fuente: string;
  fecha: string;
}

const SEED: Recuerdo[] = [
  { id: 'r1', categoria: 'perfil',      texto: 'Nicho: mascotas y hogar. Evita moda/belleza.',                fuente: 'onboarding', fecha: '2026-04-12' },
  { id: 'r2', categoria: 'ritmo',       texto: 'Opera campañas en la tarde; revisa pedidos en la mañana.',     fuente: 'comportamiento', fecha: '2026-04-29' },
  { id: 'r3', categoria: 'preferencia', texto: 'Tono directo y cálido, sin tecnicismos.',                       fuente: 'feedback', fecha: '2026-05-02' },
  { id: 'r4', categoria: 'decision',    texto: 'No escalar campañas más de 30% diario.',                        fuente: 'decisión explícita', fecha: '2026-05-15' },
  { id: 'r5', categoria: 'decision',    texto: 'Priorizar productos con margen > 50%.',                         fuente: 'decisión explícita', fecha: '2026-05-18' },
  { id: 'r6', categoria: 'preferencia', texto: 'No le gusta el copy con emojis en exceso.',                     fuente: 'edición de landing', fecha: '2026-05-20' },
];

@Component({
  selector: 'gali-v3-memory-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mi" role="dialog" aria-modal="true" aria-labelledby="mi-titulo">
      <button class="mi__backdrop" aria-label="cerrar" (click)="onCerrar()"></button>
      <div class="mi__panel">
        <header class="mi__head">
          <div>
            <span class="mi__crumb">memoria</span>
            <h2 class="mi__titulo" id="mi-titulo">Lo que Gali sabe de ti.</h2>
          </div>
          <button class="mi__close" (click)="onCerrar()" aria-label="cerrar">✕</button>
        </header>

        <div class="mi__filtros">
          <button *ngFor="let c of categorias"
                  class="mi__chip"
                  [class.mi__chip--on]="filtro() === c"
                  (click)="filtro.set(c)">{{ c }}</button>
        </div>

        <ul class="mi__list">
          <li *ngFor="let r of visibles()" class="mi__item">
            <span class="mi__item-tag" [attr.data-cat]="r.categoria">{{ r.categoria }}</span>
            <p *ngIf="editId() !== r.id" class="mi__item-texto">{{ r.texto }}</p>
            <textarea
              *ngIf="editId() === r.id"
              class="mi__item-edit"
              [value]="borrador()"
              (input)="borrador.set($any($event.target).value)"
              rows="2"></textarea>
            <span class="mi__item-meta">de {{ r.fuente }} · {{ r.fecha }}</span>
            <div class="mi__item-actions">
              <ng-container *ngIf="editId() === r.id; else acciones">
                <button class="mi__btn mi__btn--primary" (click)="confirmar(r)">guardar</button>
                <button class="mi__btn mi__btn--ghost" (click)="cancelar()">cancelar</button>
              </ng-container>
              <ng-template #acciones>
                <button class="mi__btn mi__btn--ghost" (click)="editar(r)">editar</button>
                <button class="mi__btn mi__btn--ghost" (click)="olvidar(r)">olvidar</button>
              </ng-template>
            </div>
          </li>
        </ul>

        <footer class="mi__foot">
          <span>Tu memoria es tuya. Olvidar es un derecho, no un bug.</span>
        </footer>
      </div>
    </div>
  `,
  styleUrls: ['./gali-v3-memory-inspector.component.scss'],
})
export class GaliV3MemoryInspectorComponent {
  @Output() cerrar = new EventEmitter<void>();

  readonly categorias = ['todas', 'perfil', 'ritmo', 'preferencia', 'decision'] as const;

  recuerdos = signal<Recuerdo[]>(SEED);
  filtro = signal<(typeof this.categorias)[number]>('todas');
  editId = signal<string | null>(null);
  borrador = signal<string>('');

  visibles = () => {
    const f = this.filtro();
    return f === 'todas' ? this.recuerdos() : this.recuerdos().filter(r => r.categoria === f);
  };

  editar(r: Recuerdo) {
    this.editId.set(r.id);
    this.borrador.set(r.texto);
  }
  cancelar() { this.editId.set(null); }
  confirmar(r: Recuerdo) {
    const next = this.borrador().trim();
    if (next) this.recuerdos.update(list => list.map(x => x.id === r.id ? { ...x, texto: next } : x));
    this.editId.set(null);
  }
  olvidar(r: Recuerdo) {
    this.recuerdos.update(list => list.filter(x => x.id !== r.id));
  }

  onCerrar() { this.cerrar.emit(); }
}
