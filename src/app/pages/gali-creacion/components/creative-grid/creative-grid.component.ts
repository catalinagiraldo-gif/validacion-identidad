import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Creative } from '../../../gali-descubrimiento/models/gali.models';

@Component({
  selector: 'creative-grid',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cg">
      <div class="cg__header">
        <span class="cg__counter">
          <strong>{{ selected.length }}</strong> de {{ creatives.length }} seleccionados
        </span>
        <span class="cg__hint">Selecciona al menos 1 para continuar</span>
      </div>

      <div class="cg__grid">
        <article
          *ngFor="let c of creatives; let i = index; trackBy: trackById"
          class="cg__item"
          [class.cg__item--selected]="selected.includes(c.id)"
          [class.cg__item--recommended]="c.recommended"
          [style.animation-delay.ms]="i * 100"
          (click)="toggleSelected.emit(c.id)"
          [attr.aria-pressed]="selected.includes(c.id)"
        >
          <div class="cg__chip cg__chip--reco" *ngIf="c.recommended">★ Recomendado</div>
          <div class="cg__check" *ngIf="selected.includes(c.id)">✓</div>

          <div
            class="cg__thumb"
            [attr.data-ratio]="c.ratio"
            [style.background]="'linear-gradient(135deg, ' + c.gradient[0] + ' 0%, ' + c.gradient[1] + ' 100%)'"
          >
            <span class="cg__thumb-emoji">{{ c.thumbnailEmoji }}</span>
            <span class="cg__thumb-play" *ngIf="c.type === 'video'">▶</span>
            <span class="cg__thumb-duration" *ngIf="c.duration">{{ c.duration }}</span>
          </div>

          <div class="cg__meta">
            <div class="cg__label">{{ c.label }}</div>
            <div class="cg__platform">
              <span class="cg__platform-tag">{{ c.platform }}</span>
              <span class="cg__ratio">{{ c.ratio }}</span>
            </div>
          </div>
        </article>

        <article class="cg__plus" (click)="plusClicked.emit()">
          <div class="cg__plus-lock">🔒</div>
          <div class="cg__plus-title">Genera más variaciones</div>
          <div class="cg__plus-body">
            Con Dropi AI Plus: hasta 20 variaciones, A/B automático y videos con avatar.
          </div>
          <button type="button" class="cg__plus-cta">Ver planes →</button>
        </article>
      </div>
    </div>
  `,
  styleUrl: './creative-grid.component.scss',
})
export class CreativeGridComponent {
  @Input() creatives: Creative[] = [];
  @Input() selected: string[] = [];
  @Output() toggleSelected = new EventEmitter<string>();
  @Output() plusClicked = new EventEmitter<void>();

  trackById(_: number, c: Creative): string {
    return c.id;
  }
}
