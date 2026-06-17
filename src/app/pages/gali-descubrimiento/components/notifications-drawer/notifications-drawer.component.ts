import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GaliService } from '../../../../services/gali.service';
import { CampaignNotificationEvent } from '../../models/gali.models';
import { GaliAvatarComponent } from '../gali-avatar/gali-avatar.component';

@Component({
  selector: 'notifications-drawer',
  standalone: true,
  imports: [CommonModule, GaliAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open()" class="nd" role="dialog" aria-modal="false" aria-labelledby="nd-title">
      <div class="nd__backdrop" (click)="close()"></div>

      <aside class="nd__panel">
        <header class="nd__header">
          <h2 class="nd__title" id="nd-title">
            <span>🔔</span> Notificaciones
            <span class="nd__count" *ngIf="events.length > 0">{{ events.length }}</span>
          </h2>
          <button class="nd__close" (click)="close()" aria-label="Cerrar">✕</button>
        </header>

        <div class="nd__body" *ngIf="events.length > 0; else empty">
          <article
            *ngFor="let e of events; let i = index"
            class="nd__event"
            [class.nd__event--unread]="!e.read"
            [style.animation-delay.ms]="i * 80"
          >
            <header class="nd__event-header">
              <div class="nd__event-avatar">
                <gali-avatar size="inline" state="alert"></gali-avatar>
              </div>
              <div class="nd__event-meta">
                <span class="nd__event-time">{{ e.time }}</span>
                <span class="nd__event-dot" *ngIf="!e.read"></span>
              </div>
            </header>

            <h3 class="nd__event-title">{{ e.title }}</h3>
            <p class="nd__event-subtitle">{{ e.subtitle }}</p>

            <div class="nd__metrics" *ngIf="e.metrics.reach > 0">
              <div class="nd__metric">
                <span class="nd__metric-label">Alcance</span>
                <span class="nd__metric-value">{{ formatNum(e.metrics.reach) }}</span>
              </div>
              <div class="nd__metric">
                <span class="nd__metric-label">Clics</span>
                <span class="nd__metric-value">
                  {{ e.metrics.clicks }}
                  <span class="nd__metric-sub">{{ e.metrics.ctr }}%</span>
                </span>
              </div>
              <div class="nd__metric">
                <span class="nd__metric-label">Ventas</span>
                <span class="nd__metric-value nd__metric-value--accent">{{ e.metrics.sales }}</span>
              </div>
              <div class="nd__metric">
                <span class="nd__metric-label">ROAS</span>
                <span class="nd__metric-value nd__metric-value--strong">{{ e.metrics.roas }}x</span>
              </div>
            </div>

            <div class="nd__gali-msg">
              <p>{{ e.galiMessage }}</p>
            </div>

            <div class="nd__actions">
              <button
                *ngFor="let r of e.recommendations"
                class="nd__btn"
                [class.nd__btn--primary]="r.primary"
                (click)="onRecommendation(r.label)"
              >
                {{ r.label }}
              </button>
            </div>
          </article>
        </div>

        <ng-template #empty>
          <div class="nd__empty">
            <span class="nd__empty-icon">📭</span>
            <p>Aún no tienes notificaciones.</p>
            <p class="nd__empty-sub">
              Cuando lances una campaña, Gali te avisará al cumplirse 24h, 72h y 7d.
            </p>
          </div>
        </ng-template>
      </aside>
    </div>
  `,
  styleUrl: './notifications-drawer.component.scss',
})
export class NotificationsDrawerComponent implements OnInit, OnDestroy {
  private galiSvc = inject(GaliService);

  open = signal(false);
  events: CampaignNotificationEvent[] = [];

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.galiSvc.notifDrawerOpen$.subscribe(o => this.open.set(o)),
      this.galiSvc.notifEvents$.subscribe(e => (this.events = e)),
    );
  }

  formatNum(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return String(n);
  }

  onRecommendation(label: string): void {
    // Placeholder action
    console.log('Recommendation:', label);
    this.close();
  }

  close(): void {
    this.galiSvc.closeNotifDrawer();
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    if (this.open()) this.close();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
