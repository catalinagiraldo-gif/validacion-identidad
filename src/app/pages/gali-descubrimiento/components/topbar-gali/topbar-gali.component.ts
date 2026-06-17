import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { GaliService } from '../../../../services/gali.service';
import { Mission } from '../../models/gali.models';
import { MissionRibbonComponent } from '../mission-ribbon/mission-ribbon.component';

@Component({
  selector: 'topbar-gali',
  standalone: true,
  imports: [CommonModule, RouterLink, MissionRibbonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="topbar">
      <a routerLink="/home" class="topbar__logo" aria-label="Ir a home">
        <span class="topbar__logo-mark">D</span>
        <span class="topbar__logo-text">dropi</span>
        <span class="topbar__logo-divider">/</span>
        <span class="topbar__logo-ai">ai-first</span>
      </a>

      <mission-ribbon [mission]="mission" *ngIf="mission"></mission-ribbon>
      <span *ngIf="!mission" class="topbar__placeholder"></span>

      <div class="topbar__actions">
        <button
          class="topbar__btn"
          (click)="toggleSidebar.emit()"
          aria-label="Toggle sidebar Dropi"
          title="Expandir/colapsar sidebar Dropi"
        >
          ⇆
        </button>
        <button
          class="topbar__btn topbar__btn--notif"
          (click)="onNotifClick()"
          [attr.aria-label]="'Notificaciones (' + (notifCount$ | async) + ')'"
          [class.topbar__btn--has-notif]="((notifCount$ | async) ?? 0) > 0"
        >
          🔔
          <span class="topbar__badge" *ngIf="((notifCount$ | async) ?? 0) > 0">
            {{ notifCount$ | async }}
          </span>
        </button>
        <button class="topbar__avatar" aria-label="Perfil">
          <span class="topbar__avatar-initial">S</span>
        </button>
      </div>
    </header>
  `,
  styleUrl: './topbar-gali.component.scss',
})
export class TopbarGaliComponent {
  private galiSvc = inject(GaliService);

  @Input() mission: Mission | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();

  notifCount$ = this.galiSvc.notifEvents$.pipe(
    map(events => events.filter(e => !e.read).length),
  );

  private hasNotifs = false;

  constructor() {
    this.galiSvc.notifEvents$.subscribe(events => {
      this.hasNotifs = events.length > 0;
    });
  }

  onNotifClick(): void {
    if (!this.hasNotifs) return;
    this.galiSvc.toggleNotifDrawer();
  }
}
