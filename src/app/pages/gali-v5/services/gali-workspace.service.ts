import { Injectable, NgZone, inject, signal, computed, OnDestroy } from '@angular/core';

export type WorkspaceMode = 'operar' | 'lanzar' | 'medir' | 'construir' | 'comunidad';

export interface ModeConfig {
  id: WorkspaceMode;
  label: string;
  icon: string;
  description: string;
  layout: 'three-col' | 'two-col' | 'full';
}

export const WORKSPACE_MODES: ModeConfig[] = [
  { id: 'operar',    label: 'Operar',    icon: '⚡', description: 'Gestión diaria — señales, proyectos, agentes', layout: 'three-col' },
  { id: 'lanzar',    label: 'Lanzar',    icon: '🚀', description: 'Nuevo producto o campaña — flujo misión con Gali', layout: 'two-col' },
  { id: 'medir',     label: 'Medir',     icon: '📊', description: 'P&L real por proyecto — atribución y rentabilidad', layout: 'two-col' },
  { id: 'construir', label: 'Construir', icon: '🔧', description: 'Editor de automatizaciones — mis skills y recetas', layout: 'two-col' },
  { id: 'comunidad', label: 'Comunidad', icon: '🌐', description: 'Marketplace de skills de otros dropshippers', layout: 'full' },
];

export interface LiveEvent {
  id: string;
  agente: string;
  agente_id: string;
  mensaje: string;
  timestamp: string;
  tipo: 'ok' | 'warn' | 'action';
}

export interface GaliToast {
  message: string;
  agente: string;
  tipo: 'ok' | 'warn' | 'action';
  id: string;
}

/** Banner contextual en Gali Hub cuando el usuario viene de otro flujo */
export interface HubEntryContext {
  source: 'ada-spy' | 'caza' | 'proyecto' | 'campana';
  productName?: string;
  productId?: string;
  message: string;
  ctaLabel: string;
  ctaRoute: string;
}

@Injectable({ providedIn: 'root' })
export class GaliWorkspaceService implements OnDestroy {
  readonly activeMode = signal<WorkspaceMode>('operar');
  readonly galiPaused = signal(false);
  readonly autopilot = signal(false);
  readonly liveEventsVisible = signal(true);
  readonly toast = signal<GaliToast | null>(null);
  readonly hubEntryContext = signal<HubEntryContext | null>(null);

  /** Live feed — last N agent events */
  readonly liveEvents = signal<LiveEvent[]>([
    { id: 'e1', agente: 'Roax', agente_id: 'roax', mensaje: 'ROAS 2.9x estable · Video B ganando', timestamp: 'ahora', tipo: 'ok' },
    { id: 'e2', agente: 'Vigilante', agente_id: 'vigilante', mensaje: 'Detectó novedad 15% Coordinadora Bogotá', timestamp: 'hace 18 min', tipo: 'warn' },
    { id: 'e3', agente: 'Chatea Pro', agente_id: 'chatea', mensaje: 'Resolvió 8 novedades automáticamente', timestamp: 'hace 1h', tipo: 'action' },
  ]);

  readonly activeModeConfig = computed(() =>
    WORKSPACE_MODES.find(m => m.id === this.activeMode()) ?? WORKSPACE_MODES[0],
  );

  get galiStatusLabel(): string {
    if (this.galiPaused()) return 'Gali Pausada';
    if (this.autopilot()) return 'Autopilot';
    return 'Gali Activo';
  }

  get galiStatusClass(): string {
    if (this.galiPaused()) return 'mode-bar__gali-status--paused';
    if (this.autopilot()) return 'mode-bar__gali-status--autopilot';
    return 'mode-bar__gali-status--active';
  }

  private liveTimer: ReturnType<typeof setInterval> | null = null;

  private readonly eventPool: Omit<LiveEvent, 'id' | 'timestamp'>[] = [
    { agente: 'Roax', agente_id: 'roax', mensaje: 'Evaluando CTR de Video B vs Video C', tipo: 'ok' },
    { agente: 'Vigilante', agente_id: 'vigilante', mensaje: 'Verificando novedades en Medellín', tipo: 'ok' },
    { agente: 'Chatea Pro', agente_id: 'chatea', mensaje: 'Confirmó pedido P-8845 con cliente', tipo: 'action' },
    { agente: 'ADA Spy', agente_id: 'ada', mensaje: 'Escaneando tendencias en nicho de mascotas', tipo: 'ok' },
    { agente: 'Roax', agente_id: 'roax', mensaje: 'Skill "Auto-pausa CTR" verificó umbral — OK', tipo: 'ok' },
    { agente: 'Vigilante', agente_id: 'vigilante', mensaje: 'Smart routing: 3 pedidos reasignados a Servientrega', tipo: 'action' },
    { agente: 'Chatea Pro', agente_id: 'chatea', mensaje: 'Patrón PQR detectado — Collar GPS novedad Cali', tipo: 'warn' },
    { agente: 'ADA Spy', agente_id: 'ada', mensaje: 'Score Difusor aromaterapia actualizado: 87/100', tipo: 'ok' },
    { agente: 'Roax', agente_id: 'roax', mensaje: 'ROAS 2.9x — presupuesto $66k/día estable', tipo: 'ok' },
    { agente: 'Vigilante', agente_id: 'vigilante', mensaje: 'Coordinadora Bogotá: novedad bajó a 12%', tipo: 'warn' },
    { agente: 'Chatea Pro', agente_id: 'chatea', mensaje: '2 tickets PQR cerrados automáticamente', tipo: 'action' },
    { agente: 'ADA Spy', agente_id: 'ada', mensaje: 'Nuevo nicho detectado: accesorios gaming 94/100', tipo: 'ok' },
    { agente: 'Roax', agente_id: 'roax', mensaje: 'Video C CTR 0.7% — por debajo del umbral. Evaluando pausa.', tipo: 'warn' },
  ];

  private ngZone = inject(NgZone);

  constructor() {
    // Simulate live events outside Angular zone to avoid continuous change detection
    this.startLiveSimulation();
  }

  startLiveSimulation(): void {
    this.ngZone.runOutsideAngular(() => {
      this.liveTimer = setInterval(() => {
        if (!this.autopilot() || this.galiPaused()) return;
        const pool = this.eventPool;
        const raw = pool[Math.floor(Math.random() * pool.length)];
        this.ngZone.run(() => this.addLiveEvent(raw));
      }, 4000);
    });
  }

  ngOnDestroy(): void {
    if (this.liveTimer) clearInterval(this.liveTimer);
  }

  setMode(mode: WorkspaceMode): void {
    this.activeMode.set(mode);
  }

  enableAutopilot(): void {
    this.autopilot.set(true);
    this.galiPaused.set(false);
  }

  disableAutopilot(): void {
    this.autopilot.set(false);
  }

  pauseGali(): void {
    this.galiPaused.set(true);
    this.autopilot.set(false);
  }

  resumeGali(): void {
    this.galiPaused.set(false);
  }

  toggleAutopilot(): void {
    if (this.galiPaused()) {
      this.resumeGali();
    } else {
      this.autopilot.update(v => !v);
    }
  }

  addLiveEvent(event: Omit<LiveEvent, 'id' | 'timestamp'>): void {
    const full = { ...event, id: `e-${Date.now()}`, timestamp: 'ahora mismo' };
    this.liveEvents.update(events => [full, ...events].slice(0, 8));
    // Show toast for action-type events
    if (event.tipo === 'action' || event.tipo === 'warn') {
      this.showToast({ message: event.mensaje, agente: event.agente, tipo: event.tipo, id: full.id });
    }
  }

  showToast(toast: GaliToast): void {
    this.toast.set(toast);
    setTimeout(() => this.toast.set(null), 4000);
  }

  setHubEntryContext(ctx: HubEntryContext | null): void {
    this.hubEntryContext.set(ctx);
  }

  clearHubEntryContext(): void {
    this.hubEntryContext.set(null);
  }
}
