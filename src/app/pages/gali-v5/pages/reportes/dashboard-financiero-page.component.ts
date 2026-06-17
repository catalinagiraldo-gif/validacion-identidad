import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliInsightDirective } from '../../directives/gali-insight.directive';

interface WaterfallBar {
  label: string;
  value: number;
  type: 'revenue' | 'cost' | 'subtotal' | 'net';
  tooltip: string;
}

interface WeekRow {
  week: string;
  ventas: number;
  pauta: number;
  flete: number;
  novedad: number;
  cogs: number;
  utilidad: number;
  roas: number;
}

interface GaliProjection {
  scenario: 'conservador' | 'base' | 'optimista';
  label: string;
  semanas: number;
  utilidadProyectada: number;
  roasProyectado: number;
  acciones: string[];
}

@Component({
  selector: 'app-dashboard-financiero-page',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliInsightDirective],
  templateUrl: './dashboard-financiero-page.component.html',
  styleUrl: './dashboard-financiero-page.component.scss',
})
export class DashboardFinancieroPageComponent {
  readonly Math = Math;
  readonly activeWeekFilter = signal<'4s' | '8s' | '12s'>('4s');
  readonly activeProjection = signal<'conservador' | 'base' | 'optimista'>('base');

  // ── P&L Waterfall data ───────────────────────────────────────
  readonly waterfallBars: WaterfallBar[] = [
    { label: 'Ingresos brutos', value: 14_820_000, type: 'revenue', tooltip: '2.470 pedidos × $6.000 precio promedio' },
    { label: 'Costo del producto (COGS)', value: -4_446_000, type: 'cost', tooltip: '30% de los ingresos brutos' },
    { label: 'Flete pagado', value: -1_482_000, type: 'cost', tooltip: '$600/pedido promedio Servientrega + Coordinadora' },
    { label: 'Subtotal post-flete/COGS', value: 8_892_000, type: 'subtotal', tooltip: 'Margen bruto después de producto y flete' },
    { label: 'Pauta Meta (Roax)', value: -3_100_000, type: 'cost', tooltip: '21% de los ingresos · ROAS 4.78x en ventas directas' },
    { label: 'Novedades / devoluciones', value: -740_000, type: 'cost', tooltip: '14% tasa novedad · $300 pérdida promedio por novedad' },
    { label: 'Comisión Dropi', value: -594_000, type: 'cost', tooltip: '4% de ingresos brutos' },
    { label: 'Subtotal post-marketing', value: 4_458_000, type: 'subtotal', tooltip: 'Margen después de todos los costos variables' },
    { label: 'Gastos fijos operativos', value: -650_000, type: 'cost', tooltip: 'Herramientas, plataformas, suscripciones' },
    { label: 'Utilidad neta del mes', value: 3_808_000, type: 'net', tooltip: 'P&L real de Mayo 2026 — Gali calculado' },
  ];

  get maxAbsValue(): number {
    return Math.max(...this.waterfallBars.map(b => Math.abs(b.value)));
  }

  barWidth(value: number): number {
    return (Math.abs(value) / this.maxAbsValue) * 100;
  }

  formatCOP(val: number): string {
    const abs = Math.abs(val);
    if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}k`;
    return `$${abs}`;
  }

  formatCOPFull(val: number): string {
    return `$${Math.abs(val).toLocaleString('es-CO')}`;
  }

  // ── Weekly breakdown ─────────────────────────────────────────
  readonly weeks4: WeekRow[] = [
    { week: 'Sem 1 Mayo', ventas: 3_820_000, pauta: 780_000, flete: 382_000, novedad: 190_000, cogs: 1_146_000, utilidad: 1_124_000, roas: 4.9 },
    { week: 'Sem 2 Mayo', ventas: 3_650_000, pauta: 810_000, flete: 365_000, novedad: 210_000, cogs: 1_095_000, utilidad: 970_000, roas: 4.5 },
    { week: 'Sem 3 Mayo', ventas: 3_920_000, pauta: 750_000, flete: 392_000, novedad: 165_000, cogs: 1_176_000, utilidad: 1_237_000, roas: 5.2 },
    { week: 'Sem 4 Mayo', ventas: 3_430_000, pauta: 760_000, flete: 343_000, novedad: 175_000, cogs: 1_029_000, utilidad: 923_000, roas: 4.5 },
  ];

  readonly weeks8: WeekRow[] = [
    ...this.weeks4.map(w => ({ ...w, week: w.week.replace('Mayo', 'Abr') })),
    ...this.weeks4,
  ];

  get activeWeeks(): WeekRow[] {
    if (this.activeWeekFilter() === '4s') return this.weeks4;
    if (this.activeWeekFilter() === '8s') return this.weeks8;
    return this.weeks8;
  }

  totalRow = computed(() => {
    const rows = this.activeWeeks;
    return {
      ventas: rows.reduce((s, r) => s + r.ventas, 0),
      pauta: rows.reduce((s, r) => s + r.pauta, 0),
      flete: rows.reduce((s, r) => s + r.flete, 0),
      novedad: rows.reduce((s, r) => s + r.novedad, 0),
      cogs: rows.reduce((s, r) => s + r.cogs, 0),
      utilidad: rows.reduce((s, r) => s + r.utilidad, 0),
      roas: rows.length ? rows.reduce((s, r) => s + r.roas, 0) / rows.length : 0,
    };
  });

  // ── Gali projections ─────────────────────────────────────────
  readonly projections: GaliProjection[] = [
    {
      scenario: 'conservador',
      label: 'Conservador',
      semanas: 4,
      utilidadProyectada: 3_400_000,
      roasProyectado: 4.2,
      acciones: [
        'Mantener presupuesto actual $66k/día',
        'No escalar campañas nuevas',
        'Optimizar solo novedades (meta: 12%)',
      ],
    },
    {
      scenario: 'base',
      label: 'Base (recomendado)',
      semanas: 4,
      utilidadProyectada: 4_600_000,
      roasProyectado: 4.8,
      acciones: [
        'Escalar Video B a $85k/día (+20%)',
        'Lanzar Difusor Aromaterapia con skill Roax',
        'Chatea Pro: recuperar 15% carritos',
        'Meta tasa novedad: 11%',
      ],
    },
    {
      scenario: 'optimista',
      label: 'Optimista',
      semanas: 4,
      utilidadProyectada: 6_200_000,
      roasProyectado: 5.5,
      acciones: [
        'Nuevo nicho: Accesorios Gaming (ADA Score 94)',
        'Escalar 3 productos simultáneamente',
        'Bundle Skincare Pack lanzado en semana 2',
        'Reducir novedad a 10% con smart routing',
      ],
    },
  ];

  get activeProjectionData(): GaliProjection {
    return this.projections.find(p => p.scenario === this.activeProjection())!;
  }

  // ── KPI summary ─────────────────────────────────────────────
  readonly kpis = [
    { label: 'Ingresos brutos', value: '$14.8M', delta: '+12%', tone: 'ok',
      insight: 'Crecimiento sostenido 3 meses seguidos. Proyección Gali: $16.5M próximo mes si escalas Difusor.' },
    { label: 'Utilidad neta', value: '$3.8M', delta: '+8%', tone: 'ok',
      insight: 'Por encima del promedio histórico tuyo ($3.1M). El 60% viene del proyecto Skincare Pack.' },
    { label: 'Margen real', value: '25.7%', delta: '+1.4pp', tone: 'ok',
      insight: 'Margen saludable para dropshipping. La reducción de novedad de 16% a 14% aportó 0.9pp.' },
    { label: 'ROAS efectivo', value: '4.78×', delta: '-0.2×', tone: 'warn',
      insight: 'Pequeña caída vs semana anterior por Video C (CTR bajo). Roax está evaluando pausa automática.' },
    { label: 'Tasa novedad', value: '14%', delta: '-2pp', tone: 'warn',
      insight: 'Bajó de 16% → 14% pero sigue sobre el umbral ideal (10%). Coordinadora Bogotá es el foco.' },
    { label: 'Costo adquisición', value: '$1.255', delta: '-$120', tone: 'ok',
      insight: 'Mejora real. El escalado de Video B mejoró la eficiencia. Objetivo Gali: <$1.100 en 2 semanas.' },
  ];

  // ── Economía unitaria por producto ──────────────────────────
  readonly unitEconomics = [
    {
      product: 'Collar GPS Mascotas',
      precio: 189_000, cogs: 65_000, flete: 12_000, pauta: 42_000, novedad: 8_000, comision: 7_560,
      margenUnit: 54_440, roasBreakeven: 1.52, roasReal: 4.5,
      ltv: 310_000, cac: 42_000, ltvCacRatio: 7.4,
      semanaBreakeven: 3, status: 'escala',
    },
    {
      product: 'Skincare K-Beauty Pack',
      precio: 125_000, cogs: 38_000, flete: 11_500, pauta: 38_000, novedad: 6_500, comision: 5_000,
      margenUnit: 26_000, roasBreakeven: 1.97, roasReal: 1.8,
      ltv: 240_000, cac: 38_000, ltvCacRatio: 6.3,
      semanaBreakeven: 6, status: 'riesgo',
    },
    {
      product: 'Bandas de Fitness',
      precio: 89_000, cogs: 28_000, flete: 10_000, pauta: 35_000, novedad: 9_000, comision: 3_560,
      margenUnit: 3_440, roasBreakeven: 2.14, roasReal: 1.1,
      ltv: 160_000, cac: 35_000, ltvCacRatio: 4.6,
      semanaBreakeven: 14, status: 'pausado',
    },
  ];

  unitStatusLabel(s: string): string {
    return { escala: '↑ escalando', riesgo: '⚠ en riesgo', pausado: '⏸ pausado' }[s] ?? s;
  }

  unitStatusClass(s: string): string {
    return `eco-status--${s}`;
  }

  formatCOPShort(v: number): string {
    if (v >= 1_000_000) return `$${(v/1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v/1_000).toFixed(0)}k`;
    return `$${v}`;
  }
}
