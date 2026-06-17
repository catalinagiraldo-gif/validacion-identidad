import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaliLearningService } from '../../../../services/gali-learning.service';
import { GaliService } from '../../../../services/gali.service';
import { Learning } from '../../models/gali.models';

@Component({
  selector: 'gali-learning-ribbon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ribbon" *ngIf="(learning.learnings$ | async) as items">
      <header class="ribbon__header">
        <span class="ribbon__title">LO QUE ESTOY APRENDIENDO</span>
        <button
          class="ribbon__forget-all"
          (click)="learning.forgetAll()"
          [disabled]="items.length === 0"
          [attr.aria-label]="'Olvidar todo'"
        >
          🗑 Olvidar todo
        </button>
      </header>

      <div class="ribbon__empty" *ngIf="items.length === 0">
        <p>Empezaré a aprender de ti en cuanto explores algo. 👀</p>
      </div>

      <ul class="ribbon__list" *ngIf="items.length > 0">
        <li
          *ngFor="let item of items; trackBy: trackByKey"
          class="ribbon__item"
          [class.ribbon__item--stale]="isStale(item)"
          [title]="item.detectedBy"
        >
          <span class="ribbon__icon">{{ item.icon }}</span>
          <span class="ribbon__label">
            {{ item.label }}
            <span class="ribbon__counter" *ngIf="item.counter && item.counter > 1">
              ({{ item.counter }}×)
            </span>
          </span>
          <button
            class="ribbon__forget"
            (click)="learning.forget(item.key)"
            [attr.aria-label]="'Olvidar: ' + item.label"
          >
            ×
          </button>
        </li>
      </ul>

      <!-- Trust Stage Toggle (Fase T1) -->
      <div class="ribbon__trust" *ngIf="(galiSvc.trustStage$ | async) as stage">
        <button
          class="ribbon__trust-toggle"
          (click)="galiSvc.toggleTrustStage()"
          [attr.data-stage]="stage"
          [title]="stage === 1
            ? 'Stage 1: Gali muestra todo su razonamiento (transparency)'
            : 'Stage 2: Gali se calla cuando confía (selective disclosure)'"
        >
          <span class="ribbon__trust-icon">{{ stage === 1 ? '👤' : '🤝' }}</span>
          <span class="ribbon__trust-label">
            Modo demo: <strong>{{ stage === 1 ? 'usuario nuevo' : 'usuario con experiencia' }}</strong>
          </span>
          <span class="ribbon__trust-arrow">⇄</span>
        </button>
      </div>
    </section>
  `,
  styleUrl: './gali-learning-ribbon.component.scss',
})
export class GaliLearningRibbonComponent {
  learning = inject(GaliLearningService);
  galiSvc = inject(GaliService);

  trackByKey(_: number, item: Learning): string {
    return item.key;
  }

  isStale(item: Learning): boolean {
    return Date.now() - item.timestamp > 120000;
  }
}
