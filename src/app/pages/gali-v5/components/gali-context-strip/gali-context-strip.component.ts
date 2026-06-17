import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliStateService } from '../../services/gali-state.service';

export type ContextKey = 'pedidos' | 'marketing' | 'productos' | 'financiero' | 'proyectos' | 'logistica' | 'reportes' | 'conexiones' | 'home' | null;

interface CrossImpact {
  section: string;
  icon: string;
  route: string;
  text: string;
}

interface ContextConfig {
  agentId: string;
  agentLabel: string;
  color: string;
  summary: string;
  agencyLevel: string;
  recentActions: string[];
  crossImpacts: CrossImpact[];
  activeSkill?: string;
  skillRoute?: string;
  ctaPrimary?: string;
}

const CONTEXT_MAP: Record<string, ContextConfig> = {
  pedidos: {
    agentId: 'vigilante',
    agentLabel: 'Vigilante',
    color: '#fbbf24',
    summary: '47 órdenes · 3 requieren tu decisión',
    agencyLevel: 'Autónomo con reporte',
    recentActions: [
      '✓ Confirmó 43 pedidos automáticamente (huella verde)',
      '⚡ Cambió 12 pedidos → Servientrega (Coordinadora 15% Bogotá)',
      '⚠ 3 casos requieren tu decisión',
    ],
    crossImpacts: [
      { section: 'Reportes', icon: '📊', route: '/gali-v5/reportes/dashboard', text: 'Roax recibió 43 conversiones → ROAS actualizado a 2.9x' },
      { section: 'Finanzas', icon: '💰', route: '/gali-v5/financiero/historial-de-cartera', text: '28 entregas → pendientes de facturar en Siigo' },
      { section: 'Marketing', icon: '📣', route: '/gali-v5/marketing/roax-informes', text: 'CPA actualizado $21.4k por conversión' },
    ],
    activeSkill: 'Smart routing novedad',
    skillRoute: '/gali-v5/skills',
    ctaPrimary: 'Ver 3 casos pendientes',
  },
  marketing: {
    agentId: 'roax',
    agentLabel: 'Roax',
    color: '#f97316',
    summary: 'ROAS 2.9x · escalando presupuesto',
    agencyLevel: 'Media buyer autónomo con límites',
    recentActions: [
      '⚡ Video B CTR 1.8% (+50%) — Roax escaló presupuesto +15%',
      '✓ Presupuesto $57.5k → $66k/día (ROAS ≥ 2.8x por 52h)',
      '⚠ Video A pausado por CTR 0.7% (48h bajo umbral)',
    ],
    crossImpacts: [
      { section: 'Pedidos', icon: '🛒', route: '/gali-v5/mis-pedidos/mis-pedidos', text: '47 pedidos esta semana generados por campañas activas' },
      { section: 'Finanzas', icon: '💰', route: '/gali-v5/financiero/historial-de-cartera', text: 'Gasto pauta $280k/sem · margen neto 34% del proyecto' },
      { section: 'Reportes', icon: '📊', route: '/gali-v5/reportes/productos-vendidos', text: 'ROAS real Gali: 2.9x vs ROAS Meta declarado: 3.1x' },
    ],
    activeSkill: 'Escalado ROAS automático',
    skillRoute: '/gali-v5/skills',
    ctaPrimary: 'Aprobar escala de presupuesto',
  },
  productos: {
    agentId: 'ada',
    agentLabel: 'ADA Spy',
    color: '#818cf8',
    summary: 'Stock 847u · 3 oportunidades detectadas',
    agencyLevel: 'Proactivo (alerta y propone)',
    recentActions: [
      '📦 Collar GPS: 847u · a ritmo actual de 47/sem → ~18 días de stock',
      '🔍 Difusor aromaterapia: score 87/100, margen 68%, ventana 10–14 días',
      '↗ 2 productos más en análisis con ventana activa',
    ],
    crossImpacts: [
      { section: 'Proyectos', icon: '⚡', route: '/gali-v5/proyectos', text: '¿Agregar Difusor aromaterapia como nuevo proyecto?' },
      { section: 'Marketing', icon: '📣', route: '/gali-v5/marketing/roax-lanzador', text: 'Preparar landing y campaña para el producto seleccionado' },
    ],
    activeSkill: 'Alerta stock crítico',
    skillRoute: '/gali-v5/skills',
    ctaPrimary: 'Ver 3 oportunidades',
  },
  financiero: {
    agentId: 'gali',
    agentLabel: 'Gali',
    color: '#ff6102',
    summary: 'P&L real · Siigo pendiente de conectar',
    agencyLevel: 'Analítico + alertante',
    recentActions: [
      '💰 Ganancia neta sem 22: $411k (↓4pts vs sem 21)',
      '⚠ Causa: novedades Cali subieron de 4% a 12%',
      '📊 ROAS Meta 3.1x vs ROAS Gali real 2.9x (discrepancia -0.2x)',
    ],
    crossImpacts: [
      { section: 'Conexiones', icon: '🔗', route: '/gali-v5/conexiones', text: '28 entregas sin facturar — Siigo no conectado' },
      { section: 'Marketing', icon: '📣', route: '/gali-v5/marketing/roax-informes', text: 'Discrepancia ROAS absorbida por novedades Cali (40%)' },
      { section: 'Logística', icon: '🚚', route: '/gali-v5/logistica/transportadoras', text: 'Reducir novedad Cali → mejora directa del margen' },
    ],
    ctaPrimary: 'Ver P&L detallado',
  },
  logistica: {
    agentId: 'vigilante',
    agentLabel: 'Vigilante',
    color: '#fbbf24',
    summary: 'Smart routing activo · novedad 15% Bogotá',
    agencyLevel: 'Autónomo con reporte',
    recentActions: [
      '🚛 Cambió 12 pedidos de Coordinadora → Servientrega (novedad 3 días seguidos)',
      '✓ Tasa de entrega Servientrega esta semana: 96.2%',
      '⚠ Coordinadora Bogotá: 15% novedad (umbral: 5%)',
    ],
    crossImpacts: [
      { section: 'Pedidos', icon: '🛒', route: '/gali-v5/mis-pedidos/novedades', text: '8 novedades resueltas automáticamente · $480k en pérdidas evitadas' },
      { section: 'Finanzas', icon: '💰', route: '/gali-v5/financiero/historial-de-cartera', text: 'Novedades Cali reducidas → margen estimado +3pts' },
    ],
    activeSkill: 'Smart routing novedad',
    skillRoute: '/gali-v5/skills',
    ctaPrimary: 'Ver configuración de transportadoras',
  },
  reportes: {
    agentId: 'gali',
    agentLabel: 'Gali',
    color: '#ff6102',
    summary: 'Dashboard actualizado · sem 22',
    agencyLevel: 'Analítico + alertante',
    recentActions: [
      '📊 ROAS promedio semana: 2.9x (vs objetivo 2.5x ✓)',
      '✓ 47 unidades vendidas Collar GPS — líder de la semana',
      '⚠ Skincare K-Beauty: ROAS 2.1x, cercano al umbral de corte 1.8x',
    ],
    crossImpacts: [
      { section: 'Marketing', icon: '📣', route: '/gali-v5/marketing/roax-informes', text: 'Datos ROAS por campaña disponibles en Roax Informes' },
      { section: 'Finanzas', icon: '💰', route: '/gali-v5/financiero/historial-de-cartera', text: 'P&L real disponible al cruzar con datos de wallet' },
    ],
    ctaPrimary: 'Ver dashboard completo',
  },
  proyectos: {
    agentId: 'gali',
    agentLabel: 'Gali',
    color: '#ff6102',
    summary: '2 proyectos activos · 1 pausado',
    agencyLevel: 'Orquestador total',
    recentActions: [
      '⚡ Collar GPS: ROAS 3.2x sobre meta 3.0x — Roax sugiere +30%',
      '⚠ Skincare K-Beauty: tendencia negativa, CTR bajó a 1.1%',
      '💡 Bandas de Fitness: CTR recuperado → ¿Reanudamos?',
    ],
    crossImpacts: [
      { section: 'Skills', icon: '🔧', route: '/gali-v5/skills', text: '4 skills activas gobernando los proyectos en curso' },
      { section: 'Conexiones', icon: '🔗', route: '/gali-v5/conexiones', text: 'Meta Ads + WhatsApp conectados · Siigo pendiente' },
    ],
    ctaPrimary: 'Ver todos los proyectos',
  },
  conexiones: {
    agentId: 'gali',
    agentLabel: 'Gali',
    color: '#ff6102',
    summary: '2/6 MCPs conectados · Siigo pendiente',
    agencyLevel: 'Coordinador de ecosistema',
    recentActions: [
      '⬤ Meta Ads conectado — Roax opera en tiempo real',
      '⬤ WhatsApp Business conectado — Chatea Pro activo',
      '○ Siigo sin conectar — 28 pedidos sin facturar esta semana',
    ],
    crossImpacts: [
      { section: 'Finanzas', icon: '💰', route: '/gali-v5/financiero/historial-de-cartera', text: 'Conectar Siigo sincroniza facturas automáticamente' },
      { section: 'Marketing', icon: '📣', route: '/gali-v5/marketing/roax-informes', text: 'Meta Ads activo → ROAS real visible en Roax Informes' },
    ],
    ctaPrimary: 'Conectar Siigo',
  },
};

@Component({
  selector: 'gali-context-strip',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (config()) {
      <div
        class="ctx-strip"
        [class.ctx-strip--expanded]="expanded()"
        [style.--agent-color]="config()!.color">
        <button class="ctx-strip__bar" (click)="toggle()" type="button" [attr.aria-expanded]="expanded()">
          <span class="ctx-strip__dot" [style.background]="config()!.color" aria-hidden="true"></span>
          <span class="ctx-strip__agent">{{ config()!.agentLabel }}</span>
          <span class="ctx-strip__summary">{{ config()!.summary }}</span>
          <span class="ctx-strip__mode">{{ config()!.agencyLevel }}</span>
          <span class="ctx-strip__chevron" aria-hidden="true">{{ expanded() ? '▴' : '▾' }}</span>
        </button>

        <!-- Wrapper animado via CSS grid-template-rows: no DOM removal = animación de entrada Y salida -->
        <div class="ctx-strip__detail-wrapper">
          <div class="ctx-strip__detail-inner">
            <div class="ctx-strip__detail">

              @if (config()!.recentActions.length) {
                <div class="ctx-strip__section">
                  <span class="ctx-strip__section-label">GALI ACTUÓ</span>
                  <ul class="ctx-strip__actions-list">
                    @for (action of config()!.recentActions; track $index) {
                      <li class="ctx-strip__action-item">{{ action }}</li>
                    }
                  </ul>
                </div>
              }

              @if (config()!.crossImpacts.length) {
                <div class="ctx-strip__section">
                  <span class="ctx-strip__section-label">IMPACTO EN OTRAS SECCIONES</span>
                  <ul class="ctx-strip__impact-list">
                    @for (impact of config()!.crossImpacts; track $index) {
                      <li class="ctx-strip__impact-item">
                        <div class="ctx-strip__impact-header">
                          <span class="ctx-strip__impact-section">{{ impact.section }}</span>
                          <a [routerLink]="impact.route" class="ctx-strip__impact-link">Ver →</a>
                        </div>
                        <span class="ctx-strip__impact-text">{{ impact.text }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

              <div class="ctx-strip__footer">
                @if (config()!.activeSkill) {
                  <div class="ctx-strip__skill-row">
                    <span class="ctx-strip__skill-label">Skill activa:</span>
                    <span class="ctx-strip__skill-name">{{ config()!.activeSkill }}</span>
                    @if (config()!.skillRoute) {
                      <a [routerLink]="config()!.skillRoute" class="ctx-strip__skill-link">Editar →</a>
                    }
                  </div>
                }
                @if (config()!.ctaPrimary) {
                  <button type="button" class="ctx-strip__cta ctx-strip__cta--primary">
                    {{ config()!.ctaPrimary }}
                  </button>
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './gali-context-strip.component.scss',
})
export class GaliContextStripComponent {
  contextKey = input<ContextKey>(null);
  private galiState = inject(GaliStateService);

  expanded = signal(false);

  config = computed<ContextConfig | null>(() => {
    const key = this.contextKey();
    if (!key || key === 'home') return null;
    return CONTEXT_MAP[key] ?? null;
  });

  toggle(): void {
    this.expanded.update(v => !v);
  }
}
