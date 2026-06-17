import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DropiPrototypeFeedbackService } from '../services/dropi-prototype-feedback.service';
import { GaliStateService } from '../services/gali-state.service';
import { GALI_V5_DROPI_LOGO } from '../gali-v5.constants';

interface SectionAgent { name: string; color: string; status: string; }

const SECTION_AGENTS: Array<{ patterns: string[]; agent: SectionAgent }> = [
  {
    patterns: ['productos', 'catalogo', 'proveedores', 'negociaciones', 'caza-productos'],
    agent: { name: 'ADA Spy', color: '#818cf8', status: 'analizando catálogo' },
  },
  {
    patterns: ['pedidos', 'novedades', 'garantias', 'logistica', 'transportadoras', 'torre-logistica', 'etiquetas', 'ordenes-de-despacho', 'validador'],
    agent: { name: 'Vigilante', color: '#fbbf24', status: 'monitoreando pedidos' },
  },
  {
    patterns: ['marketing', 'campanas', 'automatizacion', 'roax', 'creador-de-paginas'],
    agent: { name: 'Roax', color: '#f97316', status: '3 campañas activas' },
  },
  {
    patterns: ['cas', 'chatea-pro'],
    agent: { name: 'Chatea Pro', color: '#34d399', status: 'respondiendo clientes' },
  },
];

function resolveAgentForUrl(url: string): SectionAgent {
  const path = url.toLowerCase();
  for (const entry of SECTION_AGENTS) {
    if (entry.patterns.some(p => path.includes(p))) {
      return entry.agent;
    }
  }
  return { name: 'Gali', color: '#ff6102', status: 'orquestando tu negocio' };
}

@Component({
  selector: 'dropi-header-ia2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header-ia2">
      <!-- Brand -->
      <div class="header-ia2__brand">
        <a
          routerLink="/new/prototipos"
          [queryParams]="{ folder: 'gali' }"
          class="header-ia2__back"
          title="Volver a versiones de Gali">
          <i class="pi pi-arrow-left" aria-hidden="true"></i>
          <span>Volver</span>
        </a>
        <a routerLink="/gali-v5" class="header-ia2__logo-link" title="Inicio Gali V5">
          <img [src]="logoSrc" alt="dropi" class="header-ia2__logo" />
        </a>
      </div>

      <!-- ── ZONA CONTEXTUAL TRANSVERSAL ──────────────────────────── -->
      <div class="header-ia2__context">

        <!-- Business Health Score — glanceable business summary -->
        <button
          type="button"
          class="header-ia2__health"
          [style.--health-color]="healthColor"
          (click)="showHealthBreakdown.set(!showHealthBreakdown())"
          data-proto-skip
          [title]="healthLabel">
          <span class="header-ia2__health-num" [style.color]="healthColor">{{ healthScore }}</span>
          <div class="header-ia2__health-bar">
            <div class="header-ia2__health-fill" [style.width.%]="healthScore" [style.background]="healthColor"></div>
          </div>
          <span class="header-ia2__health-label">salud</span>
        </button>

        @if (showHealthBreakdown()) {
          <div class="header-ia2__health-breakdown" (click)="showHealthBreakdown.set(false)">
            <strong>Salud del negocio · {{ healthScore }}/100</strong>
            <div class="hb-row"><span>ROAS promedio 7d</span><span style="color:#22c55e">2.9x ✓ 87%</span></div>
            <div class="hb-row"><span>Tasa de novedades</span><span style="color:#f59e0b">14% ⚠ 70%</span></div>
            <div class="hb-row"><span>Conversión</span><span style="color:#22c55e">3.2% ✓ 80%</span></div>
            <div class="hb-row"><span>P&L vs objetivo</span><span style="color:#22c55e">+12% ✓ 75%</span></div>
            <span class="hb-footer">Actualizado hace 15min · Gali</span>
          </div>
        }

        <!-- Agente activo en la sección actual — claro y accionable -->
        <button
          type="button"
          class="header-ia2__agent-ctx"
          data-proto-skip
          [title]="'Abrir panel de ' + sectionAgent().name"
          (click)="openAgentPanel()">
          <span class="header-ia2__ctx-dot" [style.background]="sectionAgent().color"></span>
          <span class="header-ia2__ctx-name">{{ sectionAgent().name }}</span>
          <span class="header-ia2__ctx-sep">·</span>
          <span class="header-ia2__ctx-status">{{ sectionAgent().status }}</span>
        </button>

        <!-- Señales pendientes — claro, no críptico -->
        <a routerLink="/gali-v5" class="header-ia2__signals-pill" title="Ver señales pendientes en Gali Hub">
          <span class="header-ia2__signals-num">{{ signalCount }}</span>
          <span class="header-ia2__signals-label">señales</span>
        </a>

        <!-- Autopilot badge -->
        @if (autopilotOn) {
          <span class="header-ia2__auto-badge">● AUTO</span>
        }
      </div>
      <!-- ─────────────────────────────────────────────────────────── -->

      <div class="header-ia2__actions">
        <div class="header-ia2__wallet">
          <i class="pi pi-wallet header-ia2__wallet-icon"></i>
          @if (walletVisible()) {
            <span class="header-ia2__wallet-amount">{{ formattedBalance }}</span>
          } @else {
            <span class="header-ia2__wallet-mask">••••••••</span>
          }
          <button
            type="button"
            class="header-ia2__eye"
            data-proto-skip
            (click)="toggleWallet()"
            [attr.aria-label]="walletVisible() ? 'Ocultar saldo' : 'Mostrar saldo'">
            <i [class]="walletVisible() ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>

        <button type="button" class="header-ia2__avatar" aria-label="Perfil" (click)="onProfile()">
          <img [src]="avatarUrl" [alt]="userName" />
        </button>
      </div>
    </header>
  `,
  styleUrl: './dropi-header-ia2.component.scss',
})
export class DropiHeaderIa2Component implements OnInit {
  private feedback = inject(DropiPrototypeFeedbackService);
  private router = inject(Router);
  readonly galiState = inject(GaliStateService);

  readonly logoSrc = GALI_V5_DROPI_LOGO;

  @Input() userName = 'Alejandra';
  @Input() walletBalance = 2717360700;
  @Input() avatarUrl = 'assets/images/dropi-baseline/avatar-user.png';
  @Input() galiMode: 0 | 1 | 2 = 0;
  @Input() autopilotOn = false;

  readonly signalCount = 3;

  // Business Health Score — mock calculation from key business metrics
  readonly healthScore = 78; // 0–100: ROAS(30%) + novedad rate(25%) + conversión(20%) + P&L vs goal(25%)
  get healthColor(): string {
    if (this.healthScore >= 70) return '#22c55e';
    if (this.healthScore >= 40) return '#f59e0b';
    return '#ef4444';
  }
  get healthLabel(): string {
    if (this.healthScore >= 70) return 'Negocio saludable';
    if (this.healthScore >= 40) return 'Requiere atención';
    return 'Atención urgente';
  }
  readonly showHealthBreakdown = signal(false);

  sectionAgent = signal<SectionAgent>(resolveAgentForUrl(window.location.pathname));
  walletVisible = signal(true);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.sectionAgent.set(resolveAgentForUrl(e.urlAfterRedirects)));
  }

  get formattedBalance(): string {
    return `$ ${this.walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }

  openAgentPanel(): void {
    this.galiState.togglePanel();
  }

  toggleWallet(): void {
    this.walletVisible.update(v => !v);
  }

  onProfile(): void {
    this.feedback.action('Perfil de usuario');
  }
}
