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
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GaliService } from '../../services/gali.service';
import {
  AvatarState,
  CampaignNotification,
  Creative,
  ExecutionStep,
  GaliMessage,
  LandingTemplate,
  LaunchResult,
  Mission,
  Platform,
  Product,
  RoasEstimate,
} from '../gali-descubrimiento/models/gali.models';
import { ConfidenceMeterComponent } from '../gali-descubrimiento/components/confidence-meter/confidence-meter.component';
import { GaliAvatarComponent } from '../gali-descubrimiento/components/gali-avatar/gali-avatar.component';
import { GaliExecutionStreamComponent } from '../gali-descubrimiento/components/gali-execution-stream/gali-execution-stream.component';
import { GaliMessageComponent } from '../gali-descubrimiento/components/gali-message/gali-message.component';
import { DemoNavComponent } from '../gali-descubrimiento/components/demo-nav/demo-nav.component';
import { NotificationsDrawerComponent } from '../gali-descubrimiento/components/notifications-drawer/notifications-drawer.component';
import { TopbarGaliComponent } from '../gali-descubrimiento/components/topbar-gali/topbar-gali.component';

@Component({
  selector: 'app-gali-lanzamiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfidenceMeterComponent,
    DemoNavComponent,
    GaliAvatarComponent,
    GaliExecutionStreamComponent,
    GaliMessageComponent,
    NotificationsDrawerComponent,
    TopbarGaliComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gw" [class.gw--published]="!!launchResult">
      <topbar-gali [mission]="mission" (toggleSidebar)="toggleRail()"></topbar-gali>

      <div class="gw__body">
        <main class="gw__main">
          <div class="gw__crumbs">
            <span class="gw__crumb gw__crumb--done">✓ Producto</span>
            <span class="gw__sep">→</span>
            <span class="gw__crumb gw__crumb--done">✓ Estrategia</span>
            <span class="gw__sep">→</span>
            <span class="gw__crumb gw__crumb--done">✓ Creación</span>
            <span class="gw__sep">→</span>
            <span class="gw__crumb gw__crumb--active">Lanzamiento</span>
          </div>

          <header class="gw__hero">
            <div class="gw__hero-avatar">
              <gali-avatar size="sidebar" [state]="avatarState"></gali-avatar>
            </div>
            <div class="gw__hero-bubble" *ngIf="messages.length > 0">
              <gali-message [message]="messages[0]"></gali-message>
            </div>
          </header>

          <div class="gw__columns">
            <!-- COLUMN 1: FORM -->
            <section class="gw__col gw__form">
              <h2 class="gw__col-title">CONFIGURACIÓN</h2>

              <div class="gw__field">
                <label class="gw__label">Plataforma</label>
                <div class="gw__platforms">
                  <button
                    *ngFor="let p of platforms"
                    type="button"
                    class="gw__platform"
                    [class.gw__platform--active]="selectedPlatform === p.id"
                    (click)="onPlatform(p.id)"
                  >
                    <span class="gw__platform-icon">{{ p.icon }}</span>
                    {{ p.label }}
                  </button>
                </div>
              </div>

              <div class="gw__locked">
                <div class="gw__locked-row">
                  <span class="gw__locked-label">Producto</span>
                  <span class="gw__locked-value">✓ {{ product?.name }}</span>
                </div>
                <div class="gw__locked-row" *ngIf="landingTemplate">
                  <span class="gw__locked-label">Landing</span>
                  <span class="gw__locked-value">✓ landing-{{ slug }}.dropi.co</span>
                </div>
                <div class="gw__locked-row" *ngIf="selectedCreativesCount > 0">
                  <span class="gw__locked-label">Creative</span>
                  <span class="gw__locked-value">✓ {{ selectedCreativesCount }} pieza{{ selectedCreativesCount > 1 ? 's' : '' }}</span>
                </div>
                <div class="gw__locked-row">
                  <span class="gw__locked-label">Audiencia</span>
                  <span class="gw__locked-value">✓ Colombia · 25-45 · mascotas</span>
                </div>
              </div>

              <div class="gw__field">
                <label class="gw__label">
                  Presupuesto diario
                  <span class="gw__budget-value">\${{ formatCop(budget) }} COP</span>
                </label>
                <input
                  type="range"
                  class="gw__slider"
                  [min]="budgetMin"
                  [max]="budgetMax"
                  [step]="budgetStep"
                  [ngModel]="budget"
                  (ngModelChange)="onBudget($event)"
                  [attr.aria-label]="'Presupuesto diario'"
                />
                <div class="gw__slider-track">
                  <span>\${{ formatCop(budgetMin) }}</span>
                  <span>\${{ formatCop(budgetMax) }}</span>
                </div>
              </div>

              <div class="gw__field">
                <label class="gw__label">Duración</label>
                <div class="gw__duration">
                  <button
                    *ngFor="let d of durationOptions"
                    type="button"
                    class="gw__duration-pill"
                    [class.gw__duration-pill--active]="duration === d"
                    (click)="onDuration(d)"
                  >
                    {{ d }}d
                  </button>
                </div>
              </div>
            </section>

            <!-- COLUMN 2: ROAS ESTIMATOR + NOTIFICATIONS -->
            <section class="gw__col gw__estimator">
              <h2 class="gw__col-title">📊 ESTIMACIÓN DE GALI</h2>

              <div class="gw__total">
                <span class="gw__total-label">Inversión total ({{ duration }} días)</span>
                <span class="gw__total-value">\${{ formatCop(totalSpend) }}</span>
              </div>

              <div class="gw__metrics" *ngIf="roas">
                <div class="gw__metric">
                  <span class="gw__metric-label">Alcance</span>
                  <span class="gw__metric-value">
                    {{ formatNumK(roas.reach.min) }}–{{ formatNumK(roas.reach.max) }}
                  </span>
                  <span class="gw__metric-note">personas</span>
                </div>
                <div class="gw__metric">
                  <span class="gw__metric-label">Ventas est.</span>
                  <span class="gw__metric-value gw__metric-value--accent">
                    {{ roas.sales.min }}–{{ roas.sales.max }}
                  </span>
                  <span class="gw__metric-note">en {{ duration }} días</span>
                </div>
                <div class="gw__metric">
                  <span class="gw__metric-label">ROAS est.</span>
                  <span class="gw__metric-value gw__metric-value--strong">
                    {{ roas.roas.min }}x–{{ roas.roas.max }}x
                  </span>
                  <span class="gw__metric-note">retorno</span>
                </div>
              </div>

              <confidence-meter
                [value]="82"
                [details]="[
                  'Basado en 34 campañas similares en Colombia últimos 90 días',
                  'Tono ' + (tone ?? 'Emocional') + ' + producto ' + (product?.category ?? 'mascotas'),
                  'Predicción robusta ±15%'
                ]"
                [caveat]="duration > 14 ? 'Predicciones >14d tienen mayor varianza' : ''"
              ></confidence-meter>

              <div class="gw__notif">
                <h3 class="gw__notif-title">🔔 NOTIFICACIONES PROGRAMADAS</h3>
                <div *ngFor="let n of notifications" class="gw__notif-item">
                  <button
                    type="button"
                    class="gw__notif-toggle"
                    [class.gw__notif-toggle--on]="n.enabled"
                    (click)="onToggleNotif(n.id)"
                    [attr.aria-pressed]="n.enabled"
                  >
                    <span class="gw__notif-check" *ngIf="n.enabled">✓</span>
                  </button>
                  <span class="gw__notif-time">{{ n.time }}</span>
                  <span class="gw__notif-label">{{ n.label }}</span>
                </div>
              </div>
            </section>
          </div>

          <div class="gw__footer">
            <button class="gw__btn gw__btn--ghost" (click)="goBack()">← Volver</button>
            <button
              class="gw__btn gw__btn--primary"
              (click)="onPublishClick()"
              [disabled]="processing"
            >
              🚀 Publicar campaña
            </button>
          </div>
        </main>
      </div>

      <!-- CONFIRMATION MODAL -->
      <div class="gw__modal-backdrop" *ngIf="confirmModal()" (click)="confirmModal.set(false)">
        <div class="gw__modal gw__modal--confirm" (click)="$event.stopPropagation()">
          <div class="gw__modal-icon">⚡</div>
          <h3>¿Estás listo para publicar?</h3>
          <p class="gw__modal-intro">
            Gali se conecta con Meta Ads y crea tu campaña con esta configuración:
          </p>
          <ul class="gw__modal-list">
            <li>✓ Presupuesto total: <strong>\${{ formatCop(totalSpend) }}</strong> ({{ duration }} días × \${{ formatCop(budget) }})</li>
            <li>✓ Audiencia: Colombia · 25-45 · mascotas</li>
            <li>✓ Creatives: {{ selectedCreativesCount }} pieza{{ selectedCreativesCount > 1 ? 's' : '' }}</li>
            <li>✓ Notificaciones: {{ enabledNotifsCount }}/3 activas</li>
          </ul>
          <p class="gw__modal-meta">
            Una vez publicada, recibirás notificaciones en las próximas 24h, 72h y 7 días.
          </p>
          <div class="gw__modal-actions">
            <button class="gw__btn gw__btn--ghost" (click)="confirmModal.set(false)">Cancelar</button>
            <button class="gw__btn gw__btn--primary" (click)="onConfirmPublish()">
              ✅ Sí, publicar ahora
            </button>
          </div>
        </div>
      </div>

      <!-- PUBLISHING OVERLAY -->
      <div class="gw__publishing" *ngIf="processing && !launchResult">
        <div class="gw__publishing-content">
          <gali-avatar size="hero" [state]="avatarState"></gali-avatar>
          <h2>Publicando tu campaña...</h2>
          <gali-execution-stream
            *ngIf="executionStream"
            [steps]="executionStream"
          ></gali-execution-stream>
        </div>
      </div>

      <!-- SUCCESS OVERLAY WITH CONFETTI -->
      <div class="gw__success" *ngIf="launchResult">
        <div class="gw__confetti">
          <span *ngFor="let i of confettiArr; let idx = index" class="gw__confetti-piece" [style.--i]="idx"></span>
        </div>

        <div class="gw__success-content">
          <gali-avatar size="hero" state="success"></gali-avatar>
          <div class="gw__success-celebration">🎉</div>
          <h1 class="gw__success-title">¡Tu campaña está en el aire!</h1>
          <p class="gw__success-body">
            Meta está procesando tu anuncio. Estará activo en aproximadamente 30 minutos.
          </p>

          <div class="gw__success-card">
            <div class="gw__success-row">
              <span>📊 Estimación</span>
              <strong>{{ launchResult.estimate.sales.min }}–{{ launchResult.estimate.sales.max }} ventas en {{ duration }} días</strong>
            </div>
            <div class="gw__success-row">
              <span>🎯 ROAS</span>
              <strong>{{ launchResult.estimate.roas.min }}x–{{ launchResult.estimate.roas.max }}x</strong>
            </div>
            <div class="gw__success-row">
              <span>🔔 Próxima notificación</span>
              <strong>Mañana 9 AM con métricas iniciales</strong>
            </div>
          </div>

          <div class="gw__success-mission">
            <div class="gw__success-mission-icon">✓</div>
            <div class="gw__success-mission-body">
              <span class="gw__success-mission-label">MISIÓN COMPLETADA</span>
              <h3>Lanza tu primer producto ganador</h3>
              <div class="gw__success-mission-bar">
                <div class="gw__success-mission-fill"></div>
              </div>
            </div>
          </div>

          <div class="gw__success-actions">
            <button class="gw__btn gw__btn--ghost" (click)="goHome()">Ir al inicio</button>
            <button class="gw__btn gw__btn--primary" (click)="onNextMission()">
              Ver siguiente misión →
            </button>
          </div>
        </div>
      </div>

      <div class="gw__toast" *ngIf="toast()">{{ toast() }}</div>

      <notifications-drawer></notifications-drawer>
      <demo-nav></demo-nav>
    </div>
  `,
  styleUrl: './gali-lanzamiento.component.scss',
})
export class GaliLanzamientoComponent implements OnInit, OnDestroy {
  private galiSvc = inject(GaliService);
  private router = inject(Router);

  toast = signal('');
  confirmModal = signal(false);

  product: Product | null = null;
  mission: Mission | null = null;
  landingTemplate: LandingTemplate | null = null;
  creatives: Creative[] = [];
  selectedCreatives: string[] = [];

  selectedPlatform = 'meta';
  budget = 50000;
  duration = 7;
  notifications: CampaignNotification[] = [];
  platforms: Platform[] = [];

  budgetMin = 20000;
  budgetMax = 500000;
  budgetStep = 5000;
  durationOptions: number[] = [3, 5, 7, 14, 21, 30];

  roas: RoasEstimate | null = null;
  messages: GaliMessage[] = [];
  executionStream: ExecutionStep[] | null = null;
  launchResult: LaunchResult | null = null;
  avatarState: AvatarState = 'idle';
  processing = false;
  tone: string | null = null;

  confettiArr = Array.from({ length: 60 });

  private subs: Subscription[] = [];
  private toastTimer: any;

  ngOnInit(): void {
    // Seed context si el usuario llega directo
    this.galiSvc.ensureSelectedProduct();
    this.galiSvc.ensureSelectedPersona();
    this.galiSvc.ensureMission();

    this.subs.push(
      this.galiSvc.selectedProduct$.subscribe(p => (this.product = p)),
      this.galiSvc.mission$.subscribe(m => (this.mission = m)),
      this.galiSvc.landingTemplate$.subscribe(t => (this.landingTemplate = t)),
      this.galiSvc.creatives$.subscribe(c => (this.creatives = c)),
      this.galiSvc.selectedCreatives$.subscribe(s => (this.selectedCreatives = s)),
      this.galiSvc.selectedPersona$.subscribe(p => (this.tone = p?.tone ?? null)),
      this.galiSvc.campaignPlatform$.subscribe(p => (this.selectedPlatform = p)),
      this.galiSvc.campaignBudget$.subscribe(b => (this.budget = b)),
      this.galiSvc.campaignDuration$.subscribe(d => (this.duration = d)),
      this.galiSvc.roasEstimate$.subscribe(r => (this.roas = r)),
      this.galiSvc.notifications$.subscribe(n => (this.notifications = n)),
      this.galiSvc.launchMessages$.subscribe(m => (this.messages = m)),
      this.galiSvc.executionStream$.subscribe(es => (this.executionStream = es)),
      this.galiSvc.launchResult$.subscribe(r => (this.launchResult = r)),
      this.galiSvc.avatarState$.subscribe(s => (this.avatarState = s)),
    );

    this.galiSvc.loadLaunchData().subscribe({
      next: data => {
        this.platforms = data.campaign.platforms;
        this.budgetMin = data.campaign.budgetRange.min;
        this.budgetMax = data.campaign.budgetRange.max;
        this.budgetStep = data.campaign.budgetRange.step;
        this.durationOptions = data.campaign.durationOptions;
        this.galiSvc.enterLaunchMode();
      },
      error: err => {
        console.warn('Launch HTTP failed, using inline fallback:', err);
        // Seed mínimo para que el slider funcione
        this.platforms = [
          { id: 'meta', label: 'Meta Ads', icon: '📘', isDefault: true },
          { id: 'tiktok', label: 'TikTok Ads', icon: '🎵', isDefault: false },
        ];
        this.galiSvc.enterLaunchMode();
      },
    });
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    if (this.confirmModal()) this.confirmModal.set(false);
  }

  get totalSpend(): number {
    return this.budget * this.duration;
  }

  get slug(): string {
    return this.product?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) ?? 'producto';
  }

  get selectedCreativesCount(): number {
    return this.selectedCreatives.length || 1;
  }

  get enabledNotifsCount(): number {
    return this.notifications.filter(n => n.enabled).length;
  }

  formatCop(n: number): string {
    return new Intl.NumberFormat('es-CO').format(n);
  }

  formatNumK(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return String(n);
  }

  onPlatform(id: string): void {
    this.galiSvc.setCampaignPlatform(id);
  }

  onBudget(value: number): void {
    this.galiSvc.setCampaignBudget(value);
  }

  onDuration(value: number): void {
    this.galiSvc.setCampaignDuration(value);
  }

  onToggleNotif(id: string): void {
    this.galiSvc.toggleNotification(id);
  }

  onPublishClick(): void {
    this.confirmModal.set(true);
  }

  onConfirmPublish(): void {
    this.confirmModal.set(false);
    this.processing = true;
    this.galiSvc.publishCampaign().subscribe(() => {
      this.processing = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/gali/creacion']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  onNextMission(): void {
    this.showToast('Próximamente: Dashboard de Misiones (Fase 4)');
    setTimeout(() => this.router.navigate(['/gali/descubrimiento']), 1500);
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
    this.subs.forEach(s => s.unsubscribe());
    clearTimeout(this.toastTimer);
  }
}
