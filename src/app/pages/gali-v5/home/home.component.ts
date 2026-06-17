import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { GaliWorkspaceService } from '../services/gali-workspace.service';
import { GaliStateService } from '../services/gali-state.service';
import {
  GaliSignalCardV2Component,
  GaliSignalData,
} from '../components/gali-signal-card-v2/gali-signal-card-v2.component';
import {
  GaliProjectPanelComponent,
  ProjectPanelData,
} from '../components/gali-project-panel/gali-project-panel.component';
import {
  GaliGoalOnboardingComponent,
  shouldShowOnboarding,
} from '../components/gali-goal-onboarding/gali-goal-onboarding.component';

type AgentStatus = 'activo' | 'esperando' | 'pausa';

interface AgentLive {
  id: string;
  nombre: string;
  icono: string;
  estado: AgentStatus;
  descripcion: string;
  ultimaAccion: string;
  color: string;
}

interface ProyectoPL {
  id: string;
  nombre: string;
  estado: 'escala' | 'activo' | 'pausado';
  pedidos_sem: number;
  revenue: string;
  cogs: string;
  cogs_pct: number;
  flete: string;
  flete_pct: number;
  pauta: string;
  pauta_pct: number;
  novedades: string;
  novedades_pct: number;
  garantias: string;
  garantias_pct: number;
  ganancia_neta: string;
  margen: number;
  roas_meta: string;
  roas_dropi: string;
  semana_delta: string;
  semana_delta_ok: boolean;
  gali_nota: string;
  trend: 'up' | 'down' | 'stable';
}

interface CampanaMedir {
  id: string;
  nombre: string;
  proyecto: string;
  estado: 'activa' | 'escalando' | 'pausada';
  ctr: string;
  ctr_trend: 'up' | 'down' | 'stable';
  roas: string;
  spend_dia: string;
  conversiones: number;
  skill: string;
  gali_accion?: string;
}

interface LanzarMsg { from: 'gali' | 'user'; text: string; time: string; }

const LANZAR_RESPONSES: Record<string, string> = {
  'producto': '¡Perfecto! Dame el nombre del producto y en segundos te digo: margen estimado, nivel de competencia y si hay ventana de oportunidad esta semana.',
  'sugerencias': 'A la derecha tienes las 4 mejores oportunidades de ADA Spy. El Difusor de aromaterapia lidera con score 87/100 y margen del 68% — ventana de 10–14 días. ¿Lo lanzamos?',
  'objetivo': 'Cuéntame tu objetivo en pedidos por semana. Con ese número configuro automáticamente el presupuesto inicial de Roax y los umbrales de las skills de escalado.',
  'difusor': 'Difusor de aromaterapia: precio mercado $180k–$220k, COGS estimado ~$65k (Alibaba), margen bruto ~65%. Roax necesita ~$25k/día de pauta para 15 pedidos/sem. ROAS objetivo: 2.5x. ¿Arrancamos?',
  'default': 'Entendido. Para lanzar este producto necesito: 1) Precio de venta, 2) Costo del producto, 3) Objetivo de pedidos/sem. Puedo estimarlo yo si me das el nombre del producto.',
};

function matchLanzar(text: string): string {
  const l = text.toLowerCase();
  if (l.includes('difusor') || l.includes('aromaterapia')) return LANZAR_RESPONSES['difusor'];
  if (l.includes('sugerencia') || l.includes('ada') || l.includes('muéstrame')) return LANZAR_RESPONSES['sugerencias'];
  if (l.includes('objetivo') || l.includes('pedidos') || l.includes('venta')) return LANZAR_RESPONSES['objetivo'];
  if (l.includes('producto') || l.includes('tengo') || l.includes('mente')) return LANZAR_RESPONSES['producto'];
  return LANZAR_RESPONSES['default'];
}

@Component({
  selector: 'app-dropi-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GaliSignalCardV2Component,
    GaliProjectPanelComponent,
    GaliGoalOnboardingComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class DropiHomeComponent implements AfterViewChecked {
  readonly ws = inject(GaliWorkspaceService);
  readonly router = inject(Router);
  readonly gali = inject(GaliStateService);

  readonly showOnboarding = signal(true);
  private auth = inject(AuthService);

  @ViewChild('lanzarScroll') lanzarScrollEl?: ElementRef<HTMLElement>;
  private shouldScrollLanzar = false;

  userName = signal('Alejandra');

  // Dashboard customizer — signal lives in service so chat can open it
  readonly showCustomizer = this.gali.showCustomizer;
  readonly customizerSaved = signal(false);
  readonly dashboardSections = signal({
    insight: true,
    anatomy: true,
    signals: true,
    chat: true,
    akademy: true,
  });

  toggleSection(key: string): void {
    this.dashboardSections.update(s => ({ ...s, [key]: !s[key as keyof typeof s] }));
  }

  saveAndCloseCustomizer(): void {
    this.gali.showCustomizer.set(false);
    this.customizerSaved.set(true);
    setTimeout(() => this.customizerSaved.set(false), 5000);
  }

  // Lanzar mode chat
  readonly lanzarMessages = signal<LanzarMsg[]>([
    { from: 'gali', text: '¿Qué quieres lanzar? Puedo ayudarte a elegir un producto, definir el objetivo o empezar desde una oportunidad que detecté.', time: 'ahora' },
  ]);
  readonly lanzarInput = signal('');
  readonly lanzarTyping = signal(false);

  sendLanzar(text?: string): void {
    const msg = (text ?? this.lanzarInput()).trim();
    if (!msg) return;
    this.lanzarMessages.update(m => [...m, { from: 'user', text: msg, time: 'ahora' }]);
    this.lanzarInput.set('');
    this.lanzarTyping.set(true);
    this.shouldScrollLanzar = true;
    setTimeout(() => {
      this.lanzarTyping.set(false);
      this.lanzarMessages.update(m => [...m, { from: 'gali', text: matchLanzar(msg), time: 'ahora' }]);
      this.shouldScrollLanzar = true;
    }, 900 + Math.random() * 400);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollLanzar && this.lanzarScrollEl) {
      const el = this.lanzarScrollEl.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScrollLanzar = false;
    }
  }

  readonly signals: GaliSignalData[] = [
    {
      id: 'sig-001',
      agente: 'Vigilante',
      agente_id: 'vigilante',
      tipo: 'critica',
      estado: 'pending_decision',
      titulo: 'Coordinadora Bogotá: 15% novedad hoy',
      contexto:
        'Tasa 3× por encima del umbral (5%). 12 pedidos de hoy en riesgo. Último pico: hace 3 días con 11%.',
      timestamp: 'hace 18 min',
      urgencia: 'alta',
      afectados: 12,
      metrica_label: 'Novedad Coordinadora',
      metrica_valor: '15%',
      umbral: '5%',
      opciones: [
        { id: 'a', label: 'Cambiar todos → Servientrega', sublabel: 'Tasa actual: 3.8%' },
        { id: 'b', label: 'Cambiar solo los de hoy', sublabel: 'Esperar datos de mañana' },
        { id: 'c', label: 'Crear regla automática', sublabel: 'Para futuros picos' },
      ],
      tabla_label: 'pedidos afectados',
      tabla_items: [
        { id: 'P-8841', cliente: 'María L.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'En camino' },
        { id: 'P-8839', cliente: 'Carlos M.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'En camino' },
        { id: 'P-8835', cliente: 'Sandra P.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'Entregando' },
        { id: 'P-8832', cliente: 'Jorge R.', ciudad: 'Bogotá', transportadora: 'Coordinadora', estado: 'En camino' },
      ],
    },
    {
      id: 'sig-002',
      agente: 'Roax',
      agente_id: 'roax',
      tipo: 'completada',
      estado: 'completed',
      titulo: 'Cambié Video A → Video B (CTR mejora)',
      contexto: 'Video A cayó a CTR 0.7% durante 48h. Activé Video B automáticamente.',
      timestamp: 'hace 2h',
      urgencia: 'baja',
      resultado_antes: 'CTR: 1.2% · ROAS: 2.6x',
      resultado_despues: 'CTR: 1.8% · ROAS: 2.9x',
      cta_followup: '¿Crear skill para esto?',
      cta_followup_label: 'Crear skill',
    },
    {
      id: 'sig-003',
      agente: 'Chatea Pro',
      agente_id: 'chatea',
      tipo: 'decision',
      estado: 'pending_decision',
      titulo: '1 novedad requiere tu decisión',
      contexto:
        '8 novedades resueltas automáticamente. Pedido P-8801 tiene reporte inusual de transportadora.',
      timestamp: 'hace 1h',
      urgencia: 'media',
      afectados: 1,
      opciones: [
        { id: 'a', label: 'Autorizar devolución', sublabel: 'Crédito automático al cliente' },
        { id: 'b', label: 'Llamar al cliente', sublabel: 'Verificar antes de resolver' },
        { id: 'c', label: 'Escalar a CAS', sublabel: 'Asignar a agente humano' },
      ],
    },
    {
      id: 'sig-004',
      agente: 'ADA Spy',
      agente_id: 'ada',
      tipo: 'oportunidad',
      estado: 'pending_decision',
      titulo: 'Difusor aromaterapia: +340% ventas',
      contexto: 'Margen est: 68%. Ventana de 10–14 días antes de saturación. Score: 87/100.',
      timestamp: 'hace 1h',
      urgencia: 'baja',
      metrica_label: 'Score oportunidad',
      metrica_valor: '87/100',
      opciones: [
        { id: 'a', label: 'Lanzar proyecto', sublabel: 'Ir a Modo Lanzar' },
        { id: 'b', label: 'Ver análisis completo', sublabel: 'Caza Productos' },
        { id: 'c', label: 'Guardar para después', sublabel: 'Alerta si baja el score' },
      ],
    },
  ];

  readonly proyectos: ProjectPanelData[] = [
    {
      id: 'collar-gps-2026',
      nombre: 'Collar GPS para mascotas',
      estado: 'en_escala',
      roas: '2.9x',
      pedidos: '47/sem',
      ganancia: '$411k',
      alertaActiva: true,
      alertaMensaje: 'Novedad alta en Cali',
      galiMensaje: 'Tu novedad en Cali está afectando el margen. Actúa hoy.',
      agentes: [
        { nombre: 'Roax', id: 'roax', activo: true },
        { nombre: 'Vigilante', id: 'vigilante', activo: true },
        { nombre: 'Chatea Pro', id: 'chatea', activo: true },
      ],
      skills: [
        { nombre: 'Auto-pausa CTR', activa: true },
        { nombre: 'Escalado ROAS', activa: true },
        { nombre: 'Smart routing', activa: false },
      ],
    },
    {
      id: 'skincare-kbeauty',
      nombre: 'Skincare K-Beauty',
      estado: 'activo',
      roas: '2.1x',
      pedidos: '23/sem',
      ganancia: '$187k',
      alertaActiva: false,
      galiMensaje: 'Todo en orden. Margen estable esta semana.',
      agentes: [
        { nombre: 'Roax', id: 'roax', activo: true },
        { nombre: 'ADA Spy', id: 'ada', activo: false },
      ],
      skills: [{ nombre: 'Auto-pausa CTR', activa: true }],
    },
    {
      id: 'fitness-bands',
      nombre: 'Bandas de Fitness',
      estado: 'pausado',
      roas: '—',
      pedidos: '—',
      ganancia: '—',
      alertaActiva: false,
      galiMensaje: 'CTR se recuperó. ¿Reanudamos?',
      agentes: [{ nombre: 'ADA Spy', id: 'ada', activo: false }],
      skills: [],
    },
  ];

  readonly agentes: AgentLive[] = [
    {
      id: 'roax',
      nombre: 'Roax',
      icono: '⚡',
      estado: 'activo',
      descripcion: 'ROAS 2.9x · Pauta $66k/día · Video B ganando',
      ultimaAccion: 'Escaló presupuesto +15% · hace 2h',
      color: '#f97316',
    },
    {
      id: 'vigilante',
      nombre: 'Vigilante',
      icono: '🚛',
      estado: 'activo',
      descripcion: '12 pedidos en zona de riesgo (Coordinadora)',
      ultimaAccion: 'Detectó novedad 15% Bogotá · hace 18 min',
      color: '#fbbf24',
    },
    {
      id: 'chatea',
      nombre: 'Chatea Pro',
      icono: '💬',
      estado: 'activo',
      descripcion: '43/47 confirmados · 1 caso pendiente',
      ultimaAccion: 'Resolvió 8 novedades · hace 1h',
      color: '#34d399',
    },
    {
      id: 'ada',
      nombre: 'ADA Spy',
      icono: '🔍',
      estado: 'esperando',
      descripcion: '3 oportunidades analizadas esta semana',
      ultimaAccion: 'Difusor aromaterapia · hace 1h',
      color: '#818cf8',
    },
  ];

  readonly expandedPLId = signal<string | null>('collar-gps');

  readonly proyectosPL: ProyectoPL[] = [
    {
      id: 'collar-gps',
      nombre: 'Collar GPS para mascotas',
      estado: 'escala',
      pedidos_sem: 47,
      revenue: '$1.82M',
      cogs: '-$728k',  cogs_pct: 40,
      flete: '-$146k', flete_pct: 8,
      pauta: '-$462k', pauta_pct: 25,
      novedades: '-$55k', novedades_pct: 3,
      garantias: '-$18k', garantias_pct: 1,
      ganancia_neta: '$411k',
      margen: 22,
      roas_meta: '5.0x',
      roas_dropi: '2.9x',
      semana_delta: '+$89k vs sem anterior',
      semana_delta_ok: true,
      gali_nota: 'ROAS real 2.9x estable. Skill de escalado subió pauta +15% hace 4h. Margen por encima del objetivo (20%).',
      trend: 'up',
    },
    {
      id: 'skincare-kbeauty',
      nombre: 'Skincare K-Beauty',
      estado: 'activo',
      pedidos_sem: 23,
      revenue: '$920k',
      cogs: '-$368k',  cogs_pct: 40,
      flete: '-$74k',  flete_pct: 8,
      pauta: '-$230k', pauta_pct: 25,
      novedades: '-$18k', novedades_pct: 2,
      garantias: '-$9k',  garantias_pct: 1,
      ganancia_neta: '$221k',
      margen: 24,
      roas_meta: '3.8x',
      roas_dropi: '2.1x',
      semana_delta: '-$12k vs sem anterior',
      semana_delta_ok: false,
      gali_nota: 'Tendencia levemente negativa — CTR bajó a 1.1%. Roax evaluando cambio de creativo. Margen aún por encima del umbral.',
      trend: 'down',
    },
    {
      id: 'fitness-bands',
      nombre: 'Bandas de Fitness',
      estado: 'pausado',
      pedidos_sem: 0,
      revenue: '$0',
      cogs: '-',    cogs_pct: 0,
      flete: '-',   flete_pct: 0,
      pauta: '-',   pauta_pct: 0,
      novedades: '-', novedades_pct: 0,
      garantias: '-', garantias_pct: 0,
      ganancia_neta: '$0',
      margen: 0,
      roas_meta: '—',
      roas_dropi: '—',
      semana_delta: 'Pausado — CTR recuperado',
      semana_delta_ok: true,
      gali_nota: 'Pausado hace 5 días. CTR se recuperó a 1.4%. Roax sugiere reanudar con presupuesto reducido ($20k/día).',
      trend: 'stable',
    },
  ];

  readonly campanasMedir: CampanaMedir[] = [
    {
      id: 'c1',
      nombre: 'Collar GPS — Video B (UGC)',
      proyecto: 'Collar GPS',
      estado: 'escalando',
      ctr: '1.8%',
      ctr_trend: 'up',
      roas: '3.1x',
      spend_dia: '$66k/día',
      conversiones: 31,
      skill: 'Escalado ROAS automático',
      gali_accion: 'Roax subió presupuesto +15% hace 4h · ROAS ≥ 2.8x por 52h',
    },
    {
      id: 'c2',
      nombre: 'Collar GPS — Video A (Demo)',
      proyecto: 'Collar GPS',
      estado: 'pausada',
      ctr: '0.7%',
      ctr_trend: 'down',
      roas: '1.2x',
      spend_dia: '$0',
      conversiones: 0,
      skill: 'Auto-pausa CTR',
      gali_accion: 'Pausada por Auto-pausa CTR — CTR cayó a 0.7% por 48h',
    },
    {
      id: 'c3',
      nombre: 'Skincare K-Beauty — Carrusel',
      proyecto: 'Skincare K-Beauty',
      estado: 'activa',
      ctr: '1.1%',
      ctr_trend: 'down',
      roas: '2.1x',
      spend_dia: '$32k/día',
      conversiones: 23,
      skill: 'Sin skill activa',
    },
  ];

  readonly adaOportunidades = [
    { nombre: 'Difusor aromaterapia', score: 87, margen: '68%', ventana: '10–14 días' },
    { nombre: 'Collar GPS v2', score: 82, margen: '42%', ventana: '14–21 días' },
    { nombre: 'Bandas fitness premium', score: 71, margen: '38%', ventana: '21–28 días' },
    { nombre: 'Purificador de agua mini', score: 65, margen: '44%', ventana: '7–10 días' },
  ];

  readonly skillHistory = [
    { fecha: '29/05 14:30', resultado: 'ejecutado', detalle: 'CTR Video A fue 0.7% — Pausé, activé B', impacto: 'CTR: 1.2%→1.8%' },
    { fecha: '28/05 10:15', resultado: 'ejecutado', detalle: 'CTR Video C fue 0.6% — Pausé', impacto: 'ROAS estabilizado' },
    { fecha: '27/05 —', resultado: 'no_activado', detalle: 'CTR sobre umbral todo el día', impacto: '—' },
    { fecha: '26/05 08:00', resultado: 'ejecutado', detalle: 'CTR cayó 0.5% — Pausé, activé backup', impacto: 'CTR: 0.5%→1.4%' },
  ];

  readonly marketplaceSkills = [
    { nombre: 'Smart routing novedad', uses: '3.4k' },
    { nombre: 'P&L real vs ROAS', uses: '1.2k' },
    { nombre: 'Restock alerta proveedor', uses: '890' },
  ];

  readonly communitySkills = [
    { id: 'cs-1', category: 'Logística', nombre: 'Auto-reasignación por novedad', descripcion: 'Cambia automáticamente la transportadora cuando la novedad supera el umbral en cualquier ciudad.', uses: '3.4k' },
    { id: 'cs-2', category: 'Marketing', nombre: 'Escalado ROAS inteligente', descripcion: 'Incrementa el presupuesto de forma gradual cuando el ROAS supera 2.5x durante 24h.', uses: '2.1k' },
    { id: 'cs-3', category: 'Financiero', nombre: 'P&L real vs ROAS declarado', descripcion: 'Detecta discrepancias entre el ROAS reportado por la plataforma y el P&L real del negocio.', uses: '1.2k' },
    { id: 'cs-4', category: 'Productos', nombre: 'Alerta saturación de nicho', descripcion: 'Monitorea cuando 3+ competidores nuevos entran a tu nicho en 7 días.', uses: '987' },
    { id: 'cs-5', category: 'CAS', nombre: 'Resolución automática de novedades comunes', descripcion: 'Clasifica y resuelve novedades recurrentes sin intervención humana.', uses: '756' },
    { id: 'cs-6', category: 'Marketing', nombre: 'Pausa-por-CTR + A/B automático', descripcion: 'Pausa el creativo con CTR bajo y activa el alternativo. Registra el resultado.', uses: '1.8k' },
  ];

  // ── Anatomy grid interactivo ──────────────────────────────────────────────
  readonly activeNode = signal<string | null>(null);

  toggleNode(id: string): void {
    this.activeNode.update(cur => cur === id ? null : id);
  }

  readonly nodeDetailMap: Record<string, { agentName: string; color: string; description: string; lastAction: string; impacts: Array<{ label: string; route: string }>; ctaLabel: string; ctaRoute: string }> = {
    'producto': {
      agentName: 'ADA Spy', color: '#818cf8',
      description: '3 oportunidades · stock 847u (18 días)',
      lastAction: 'Difusor aromaterapia score 87/100 · hace 1h',
      impacts: [
        { label: 'Proyectos', route: '/gali-v5/proyectos' },
        { label: 'Marketing', route: '/gali-v5/marketing/roax-lanzador' },
      ],
      ctaLabel: 'Ver catálogo', ctaRoute: '/gali-v5/productos/catalogo',
    },
    'marketing': {
      agentName: 'Roax', color: '#f97316',
      description: 'ROAS 2.9x · $66k/día · Video B ganando',
      lastAction: 'Escaló presupuesto +15% por CTR 1.8% · hace 2h',
      impacts: [
        { label: 'Pedidos (+47)', route: '/gali-v5/mis-pedidos/mis-pedidos' },
        { label: 'Finanzas (34% margen)', route: '/gali-v5/financiero/historial-de-cartera' },
      ],
      ctaLabel: 'Ver campañas', ctaRoute: '/gali-v5/marketing/roax-informes',
    },
    'pedidos': {
      agentName: 'Vigilante', color: '#fbbf24',
      description: '47 activas · 3 pendientes tu decisión',
      lastAction: 'Detectó novedad 15% Coordinadora · hace 18 min',
      impacts: [
        { label: 'Logística (smart routing)', route: '/gali-v5/logistica/transportadoras' },
        { label: 'Finanzas (28 sin facturar)', route: '/gali-v5/financiero/historial-de-cartera' },
      ],
      ctaLabel: 'Ver órdenes', ctaRoute: '/gali-v5/mis-pedidos/mis-pedidos',
    },
    'logistica': {
      agentName: 'Vigilante', color: '#fbbf24',
      description: 'Smart routing activo · 12 pedidos redirigidos',
      lastAction: 'Redirigió pedidos a Servientrega · hace 18 min',
      impacts: [
        { label: 'Pedidos (riesgo)', route: '/gali-v5/mis-pedidos/novedades' },
        { label: 'Finanzas (margen +3pts)', route: '/gali-v5/financiero/historial-de-cartera' },
      ],
      ctaLabel: 'Ver transportadoras', ctaRoute: '/gali-v5/logistica/transportadoras',
    },
    'finanzas': {
      agentName: 'Gali', color: '#ff6102',
      description: '$450k pendiente · Siigo sin conectar',
      lastAction: 'Detectó discrepancia ROAS Meta vs real · hace 3h',
      impacts: [
        { label: 'Conexiones (Siigo)', route: '/gali-v5/conexiones' },
        { label: 'Reportes (P&L)', route: '/gali-v5/reportes/dashboard' },
      ],
      ctaLabel: 'Conectar Siigo', ctaRoute: '/gali-v5/conexiones',
    },
    'rendimiento': {
      agentName: 'Roax', color: '#f97316',
      description: 'CPA $21.4k · Margen neto 34%',
      lastAction: 'Actualizó ROAS real 2.9x vs Meta 3.1x · hace 2h',
      impacts: [
        { label: 'Marketing (ROAS)', route: '/gali-v5/marketing/roax-informes' },
        { label: 'Finanzas (P&L)', route: '/gali-v5/financiero/historial-de-cartera' },
      ],
      ctaLabel: 'Ver reportes', ctaRoute: '/gali-v5/reportes/dashboard',
    },
    'reportes': {
      agentName: 'Roax', color: '#f97316',
      description: 'ROAS real 1.93x vs Meta 2.9x · CPA $21.4k · Margen neto 34%',
      lastAction: 'Detectó discrepancia ROAS: 40% del margen absorbido por novedades en Cali · hace 2h',
      impacts: [
        { label: 'Marketing (optimizar ROAS)', route: '/gali-v5/marketing/roax-informes' },
        { label: 'Finanzas (P&L completo)', route: '/gali-v5/financiero/historial-de-cartera' },
      ],
      ctaLabel: 'Ver reportes', ctaRoute: '/gali-v5/reportes/dashboard',
    },
  };

  activeNodeDetail() {
    const key = this.activeNode();
    return key ? (this.nodeDetailMap[key] ?? null) : null;
  }

  openChatWithNode(nodeId: string): void {
    const detail = this.nodeDetailMap[nodeId];
    if (!detail) return;
    this.gali.togglePanel();
    setTimeout(() => this.gali.sendMessage(`Cuéntame sobre ${detail.agentName} en ${nodeId}`), 300);
  }

  get pendingSignals(): number {
    return this.signals.filter(s => s.estado === 'pending_decision').length;
  }

  goToProject(id: string): void {
    this.router.navigate(['/gali-v5/proyecto', id]);
  }

  readonly showNewSkill = signal(false);

  openNewSkill(): void {
    this.router.navigate(['/gali-v5/skills/nueva']);
  }

  goToSkills(): void {
    this.router.navigate(['/gali-v5/skills']);
  }

  goToMode(mode: 'lanzar' | 'construir' | 'medir'): void {
    this.ws.setMode(mode);
  }

  togglePL(id: string): void {
    this.expandedPLId.update(cur => (cur === id ? null : id));
  }

  readonly installedSkills = signal<string[]>([]);

  installSkill(id: string): void {
    this.installedSkills.update(s => s.includes(id) ? s : [...s, id]);
    // After 600ms navigate to skills page to show it installed
    setTimeout(() => this.router.navigate(['/gali-v5/skills']), 800);
  }

  isInstalled(id: string): boolean {
    return this.installedSkills().includes(id);
  }

  readonly selectedOpp = signal<string | null>(null);
  readonly lanzarStep = signal<'seleccionar' | 'configurando' | 'listo'>('seleccionar');

  selectOportunidad(nombre: string): void {
    this.selectedOpp.set(nombre);
    this.lanzarStep.set('configurando');
  }

  constructor() {
    this.auth.user$.subscribe(u => {
      if (u?.name) this.userName.set(u.name.split(' ')[0]);
    });
  }
}
