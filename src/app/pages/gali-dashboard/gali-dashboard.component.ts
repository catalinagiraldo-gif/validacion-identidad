import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import {
  DashboardAlert,
  DashboardMission,
  DashboardQuickAction,
  DashboardSnapshot,
  GaliDashboardData,
} from '../gali-descubrimiento/models/gali.models';
import { DemoNavComponent } from '../gali-descubrimiento/components/demo-nav/demo-nav.component';
import { GaliAvatarComponent } from '../gali-descubrimiento/components/gali-avatar/gali-avatar.component';
import { NotificationsDrawerComponent } from '../gali-descubrimiento/components/notifications-drawer/notifications-drawer.component';
import { TopbarGaliComponent } from '../gali-descubrimiento/components/topbar-gali/topbar-gali.component';

@Component({
  selector: 'app-gali-dashboard',
  standalone: true,
  imports: [CommonModule, DemoNavComponent, GaliAvatarComponent, NotificationsDrawerComponent, TopbarGaliComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gd">
      <topbar-gali [mission]="null" (toggleSidebar)="toggleRail()"></topbar-gali>

      <div class="gd__body" *ngIf="snapshot">
        <main class="gd__main">
          <header class="gd__greeting">
            <gali-avatar size="sidebar" state="idle"></gali-avatar>
            <div class="gd__greeting-text">
              <h1 class="gd__title">{{ snapshot.greeting }}</h1>
              <p class="gd__subtitle">{{ snapshot.subtitle }}</p>
            </div>
          </header>

          <div class="gd__grid">
            <!-- COL 1: ACTIVE MISSION + AVAILABLE -->
            <section class="gd__col">
              <h2 class="gd__section-title">
                <span>🎯</span> Tu misión activa
              </h2>

              <article class="gd__active">
                <div class="gd__active-meta">
                  <span class="gd__active-step">
                    PASO {{ snapshot.activeMission.currentStep }}/{{ snapshot.activeMission.totalSteps }}
                  </span>
                  <span class="gd__active-step-name">{{ snapshot.activeMission.currentStepName }}</span>
                </div>
                <h3 class="gd__active-title">{{ snapshot.activeMission.title }}</h3>
                <div class="gd__progress-wrap">
                  <div class="gd__progress-bar">
                    <div
                      class="gd__progress-fill"
                      [style.width.%]="snapshot.activeMission.progressPct"
                    ></div>
                  </div>
                  <span class="gd__progress-pct">{{ snapshot.activeMission.progressPct }}%</span>
                </div>
                <div class="gd__active-stats">
                  <span>📊 {{ snapshot.activeMission.completedBy }} la completaron esta semana</span>
                  <span>·</span>
                  <span>⏱ promedio {{ snapshot.activeMission.avgDays }}d</span>
                </div>
                <button class="gd__btn gd__btn--primary" (click)="continueMission()">
                  {{ snapshot.activeMission.nextActionLabel }} →
                </button>
              </article>

              <h2 class="gd__section-title">
                <span>📦</span> Otras misiones disponibles
              </h2>

              <div class="gd__missions">
                <article
                  *ngFor="let m of snapshot.availableMissions; let i = index"
                  class="gd__mission"
                  [attr.data-status]="m.status"
                  [style.animation-delay.ms]="i * 80"
                  (click)="onMissionClick(m)"
                >
                  <div class="gd__mission-icon">{{ m.icon }}</div>
                  <div class="gd__mission-body">
                    <div class="gd__mission-header">
                      <h4 class="gd__mission-title">{{ m.title }}</h4>
                      <span class="gd__mission-badge" *ngIf="m.status === 'locked-plus'">
                        🔒 Plus
                      </span>
                      <span class="gd__mission-badge gd__mission-badge--done" *ngIf="m.status === 'completed'">
                        ✓ Completada
                      </span>
                      <span class="gd__mission-badge gd__mission-badge--priority" *ngIf="m.priority === 'alta'">
                        Alta prioridad
                      </span>
                    </div>
                    <p class="gd__mission-subtitle">{{ m.subtitle }}</p>
                    <div class="gd__mission-stats">
                      <span>📊 {{ m.completedBy }} usuarios</span>
                      <span>·</span>
                      <span>⏱ {{ m.avgDays }}d promedio</span>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <!-- COL 2: GALI SUMMARY + ALERTS + QUICK ACTIONS -->
            <section class="gd__col gd__col--side">
              <h2 class="gd__section-title">
                <span>💬</span> Gali — resumen del día
              </h2>

              <div class="gd__alerts">
                <article
                  *ngFor="let a of snapshot.alerts; let i = index"
                  class="gd__alert"
                  [attr.data-type]="a.type"
                  [style.animation-delay.ms]="i * 100"
                >
                  <div class="gd__alert-icon">{{ a.icon }}</div>
                  <div class="gd__alert-body">
                    <h4 class="gd__alert-title">{{ a.title }}</h4>
                    <p class="gd__alert-text">{{ a.body }}</p>
                    <div class="gd__alert-ctas" *ngIf="a.ctas?.length">
                      <button
                        *ngFor="let cta of a.ctas"
                        class="gd__btn"
                        [class.gd__btn--primary]="cta.primary"
                        [class.gd__btn--small]="true"
                        (click)="onAlertCta(cta)"
                      >
                        {{ cta.label }}
                      </button>
                    </div>
                  </div>
                </article>
              </div>

              <h2 class="gd__section-title">
                <span>⚡</span> ¿Qué quieres hacer hoy?
              </h2>

              <div class="gd__quick-actions">
                <button
                  *ngFor="let a of snapshot.quickActions"
                  class="gd__quick"
                  (click)="onQuickAction(a)"
                >
                  <span class="gd__quick-icon">{{ a.icon }}</span>
                  <span class="gd__quick-label">{{ a.label }}</span>
                  <span class="gd__quick-arrow" *ngIf="a.route">→</span>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      <div class="gd__toast" *ngIf="toast()">{{ toast() }}</div>

      <notifications-drawer></notifications-drawer>
      <demo-nav></demo-nav>
    </div>
  `,
  styleUrl: './gali-dashboard.component.scss',
})
export class GaliDashboardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Fallback inline para que el render no quede vacío si la HTTP falla
  snapshot: DashboardSnapshot | null = {
    greeting: 'Buenos días, Sebas',
    subtitle: 'Esto es lo que necesitas atender hoy',
    activeMission: {
      id: 'm-001',
      title: 'Lanza tu primer producto ganador',
      progressPct: 0,
      currentStep: 1,
      currentStepName: 'Buscar producto',
      totalSteps: 4,
      completedBy: 247,
      avgDays: 2.4,
      status: 'active',
      icon: '🎯',
      nextActionLabel: 'Continuar misión',
      nextActionRoute: '/gali/descubrimiento',
    },
    alerts: [
      {
        id: 'a-001',
        type: 'warning',
        icon: '⚠️',
        title: 'Aún no has lanzado tu primer producto',
        body: 'Llevas 14 días en Dropi. 247 dropshippers con tu perfil ya lanzaron — promedio 2.4 días.',
        ctas: [{ label: 'Empezar ahora', primary: true, route: '/gali/descubrimiento' }],
      },
      {
        id: 'a-002',
        type: 'info',
        icon: '💡',
        title: 'Nuevo en tendencia esta semana',
        body: 'Skincare está creciendo +41% en Colombia. ¿Quieres explorar la categoría?',
        ctas: [{ label: 'Ver productos skincare', route: '/gali/descubrimiento' }],
      },
    ],
    availableMissions: [
      {
        id: 'm-002',
        title: 'Renueva tus creatives',
        subtitle: 'Si llevas >15 días con la misma pieza, baja la conversión',
        priority: 'alta',
        completedBy: 134,
        avgDays: 1.2,
        status: 'available',
        icon: '🎨',
      },
      {
        id: 'm-003',
        title: 'Lleva tu producto a 50 ventas/semana',
        subtitle: 'Escala lo que ya está funcionando',
        completedBy: 89,
        avgDays: 14,
        status: 'locked-plus',
        icon: '📈',
      },
      {
        id: 'm-004',
        title: 'Configura tu primera campaña <$200k',
        subtitle: 'Para presupuestos pequeños y conservadores',
        completedBy: 312,
        avgDays: 3.1,
        status: 'completed',
        icon: '✓',
      },
    ],
    quickActions: [
      { label: 'Buscar un nuevo producto', icon: '🔍', route: '/gali/descubrimiento' },
      { label: 'Revisar rendimiento', icon: '📊', route: null },
      { label: 'Generar creatives nuevos', icon: '✨', route: null },
      { label: 'Escribir a Gali libre', icon: '💬', route: null },
    ],
  };
  toast = signal('');

  private sub?: Subscription;
  private toastTimer: any;

  ngOnInit(): void {
    // Si no completó onboarding, redirigir
    if (!sessionStorage.getItem('gali-onboarding-done')) {
      this.router.navigate(['/gali/onboarding']);
      return;
    }

    this.sub = this.http.get<GaliDashboardData>('/api/gali-dashboard').subscribe({
      next: data => {
        if (data?.dashboard) this.snapshot = data.dashboard;
      },
      error: err => console.warn('Dashboard HTTP fallback to embedded data:', err),
    });
  }

  continueMission(): void {
    if (this.snapshot?.activeMission.nextActionRoute) {
      this.router.navigate([this.snapshot.activeMission.nextActionRoute]);
    }
  }

  onMissionClick(m: DashboardMission): void {
    if (m.status === 'locked-plus') {
      this.showToast('🔒 Esta misión requiere Dropi AI Plus');
    } else if (m.status === 'completed') {
      this.showToast(`✓ ${m.title} — ya completada`);
    } else {
      this.showToast(`Próximamente: misión "${m.title}"`);
    }
  }

  onAlertCta(cta: { route?: string | null; label: string }): void {
    if (cta.route) {
      this.router.navigate([cta.route]);
    } else {
      this.showToast(`Próximamente: ${cta.label}`);
    }
  }

  onQuickAction(a: DashboardQuickAction): void {
    if (a.route) {
      this.router.navigate([a.route]);
    } else {
      this.showToast(`Próximamente: ${a.label}`);
    }
  }

  toggleRail(): void {
    window.dispatchEvent(new CustomEvent('gali:toggle-rail'));
  }

  private showToast(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(''), 3000);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearTimeout(this.toastTimer);
  }
}
