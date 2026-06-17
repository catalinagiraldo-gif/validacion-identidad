import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from './gali-workspace.service';

export type GaliMode = 0 | 1 | 2;

export interface AgentStatus {
  id: string;
  name: string;
  color: string;
  status: 'activo' | 'esperando' | 'pausado';
  action: string;
  skills: string[];
}

export interface GaliSignal {
  id: string;
  type: 'critica' | 'info' | 'sugerencia';
  emoji: string;
  message: string;
  time: string;
  cta?: string;
  ctaAction?: string;
}

export interface ExecutionCard {
  phase: 'running' | 'done';
  skillName: string;
  affectedModules: Array<{ label: string; route: string }>;
  resultSummary?: string;
}

export interface ChatMessage {
  id: string;
  from: 'gali' | 'user';
  text: string;
  time: string;
  actions?: ChatAction[];
  modeChip?: string;
  executionCard?: ExecutionCard;
}

export interface ChatAction {
  label: string;
  action: string;
  isPrimary?: boolean;
}

export interface GaliPanelContext {
  id: string;
  title: string;
  subtitle?: string;
  type: 'table' | 'metrics';
  columns?: { key: string; label: string; mono?: boolean }[];
  rows?: Record<string, string>[];
  metrics?: { label: string; value: string; delta?: string; tone?: 'ok' | 'warn' | 'crit' }[];
}

// Context-aware Gali responses
const SMART_RESPONSES: Record<string, { text: string; actions?: ChatAction[]; context?: GaliPanelContext }> = {
  'novedad': {
    text: 'Coordinadora tiene 15% de novedad en Bogotá — 3× el umbral. Tengo 12 pedidos en riesgo hoy. Puedo reasignarlos a Servientrega (tasa actual 3.8%) o crear una regla automática para el futuro.',
    context: {
      id: 'pedidos-riesgo',
      title: 'Pedidos en riesgo',
      subtitle: 'Coordinadora · Bogotá · hoy',
      type: 'table',
      columns: [
        { key: 'id', label: 'Pedido', mono: true },
        { key: 'cliente', label: 'Cliente' },
        { key: 'ciudad', label: 'Ciudad' },
        { key: 'estado', label: 'Estado' },
      ],
      rows: [
        { id: 'P-8841', cliente: 'María L.', ciudad: 'Bogotá', estado: 'En camino' },
        { id: 'P-8839', cliente: 'Carlos M.', ciudad: 'Bogotá', estado: 'En camino' },
        { id: 'P-8835', cliente: 'Sandra P.', ciudad: 'Bogotá', estado: 'Entregando' },
        { id: 'P-8832', cliente: 'Jorge R.', ciudad: 'Bogotá', estado: 'En camino' },
        { id: 'P-8828', cliente: 'Ana T.', ciudad: 'Bogotá', estado: 'En camino' },
        { id: 'P-8824', cliente: 'Luis G.', ciudad: 'Bogotá', estado: 'En camino' },
      ],
    },
    actions: [
      { label: 'Reasignar ahora', action: 'reasignar-pedidos', isPrimary: true },
      { label: 'Crear skill de routing', action: 'crear-skill-routing' },
    ],
  },
  'roas': {
    text: 'Roax tiene ROAS 2.9x hoy — por encima del objetivo de 2.5x durante 52h. La skill "Escalado ROAS" se activó hace 4h y subió el presupuesto de $57.5k a $66k/día. ¿Quieres que siga subiendo?',
    context: {
      id: 'roas-snapshot',
      title: 'ROAS · Collar GPS',
      subtitle: 'Últimas 48h',
      type: 'metrics',
      metrics: [
        { label: 'ROAS actual', value: '2.9x', delta: '+0.3x', tone: 'ok' },
        { label: 'Presupuesto/día', value: '$66k', delta: '+15%', tone: 'ok' },
        { label: 'CTR creativo B', value: '1.8%', delta: '+0.6pp', tone: 'ok' },
        { label: 'Objetivo', value: '2.5x', tone: 'warn' },
      ],
    },
    actions: [
      { label: 'Ver skill activa', action: 'ver-skill-roas' },
      { label: 'Ajustar umbral', action: 'editar-skill' },
    ],
  },
  'hoy': {
    text: 'Resumen de hoy: ROAS 2.9x, 47 pedidos confirmados, 1 pendiente de tu decisión, 1 señal crítica y ganancia estimada $411k.',
    context: {
      id: 'resumen-hoy',
      title: 'Resumen del día',
      subtitle: '29 mayo 2026',
      type: 'metrics',
      metrics: [
        { label: 'ROAS', value: '2.9x', delta: '↑ desde 2.6x', tone: 'ok' },
        { label: 'Pedidos', value: '47', delta: '1 pendiente', tone: 'warn' },
        { label: 'Señales críticas', value: '1', tone: 'crit' },
        { label: 'Ganancia est.', value: '$411k', tone: 'ok' },
      ],
    },
    actions: [
      { label: 'Ver señal crítica', action: 'ir-a-senales', isPrimary: true },
      { label: 'Ver P&L completo', action: 'ir-medir' },
    ],
  },
  'skill': {
    text: 'Tienes 3 skills activas: "Auto-pausa CTR" (se activó hace 2h), "Escalado ROAS" (se activó hace 4h), y "Smart routing novedad" (pausada). ¿Quieres crear una nueva o ver el historial?',
    actions: [
      { label: 'Crear nueva skill', action: 'crear-skill', isPrimary: true },
      { label: 'Ver historial', action: 'ir-construir' },
    ],
  },
  'proyecto': {
    text: 'Collar GPS está en escala con ROAS 2.9x y 47 pedidos/sem. Hay una alerta activa: novedad alta en Cali. Skincare K-Beauty está normal. Bandas de Fitness está pausado — el CTR se recuperó.',
    actions: [
      { label: 'Ver proyectos', action: 'ir-operar' },
      { label: 'Lanzar nuevo proyecto', action: 'ir-lanzar' },
    ],
  },
  'lanzar': {
    text: 'Para lanzar un producto, cambio al modo Lanzar donde puedes hablar conmigo sobre el producto mientras ADA Spy te muestra oportunidades en tiempo real. ¿Tienes un producto en mente o quieres ver mis sugerencias?',
    actions: [
      { label: 'Ir a Modo Lanzar', action: 'ir-lanzar', isPrimary: true },
    ],
  },
  'senales': {
    text: 'Yendo al modo Operar. Tienes 2 señales pendientes de decisión: una crítica (Coordinadora Bogotá 15% novedad) y una de oportunidad (Difusor aromaterapia score 87). ¿Las revisamos?',
    actions: [
      { label: 'Ver señales', action: 'ir-a-senales', isPrimary: true },
    ],
  },
  'medir': {
    text: 'Cambiando a Modo Medir. Tu mejor proyecto esta semana es Collar GPS con ROAS 2.9x y $411k de ganancia estimada. Skincare K-Beauty está en 1.8x — en el umbral de corte.',
    actions: [
      { label: 'Ver P&L completo', action: 'ir-medir', isPrimary: true },
    ],
  },
  'construir': {
    text: 'Cambiando a Modo Construir. Tienes 2 skills activas y 1 pausada. La de Smart Routing novedad necesita tu atención — lleva 2 días pausada.',
    actions: [
      { label: 'Ver mis skills', action: 'ir-construir', isPrimary: true },
      { label: 'Nueva skill', action: 'crear-skill' },
    ],
  },
  'autopilot': {
    text: 'Activando autopilot. Gali tomará decisiones rutinarias por ti: routing de novedades, pausa de creativos con CTR bajo y confirmación de pedidos con huella verde. Siempre te aviso en el feed en vivo.',
    actions: [
      { label: 'Activar autopilot', action: 'toggle-autopilot', isPrimary: true },
    ],
  },
  'arma-mi-dia': {
    text: '📋 Aquí tu día — Semana 22:',
    actions: [
      { label: 'Ver novedades', action: 'ir-a-senales', isPrimary: true },
      { label: 'Conectar Siigo', action: 'ir-operar' },
    ],
  },
  'personalizar': {
    text: 'Abriendo el panel de personalización del dashboard. Puedes activar o desactivar: Insight de Gali, Anatomía del proyecto, Señales activas, Chat y Recomendaciones Akademy.',
    actions: [
      { label: 'Abrir personalización', action: 'abrir-customizer', isPrimary: true },
    ],
  },
  'akademy': {
    text: 'Basado en tus métricas actuales, te recomiendo en Akademy: "Optimización de P&L real en Meta Ads" (38 min) — porque tu ROAS declarado es 2.9x pero el real es 1.93x. La diferencia está en las novedades de Cali.',
    actions: [
      { label: 'Ir a Akademy', action: 'ir-akademy', isPrimary: true },
    ],
  },
  'default': {
    text: 'Entendido. Voy a procesar eso. Mientras tanto, recuerda que tienes 1 señal crítica activa (Coordinadora 15% novedad) y el ROAS está en 2.9x. ¿Quieres que priorice algo específico?',
    actions: [
      { label: 'Ver señales', action: 'ir-a-senales' },
      { label: 'Ver todo el resumen', action: 'hoy' },
    ],
  },
};

function matchResponse(text: string): { text: string; actions?: ChatAction[]; context?: GaliPanelContext } {
  const lower = text.toLowerCase();
  if (lower.includes('arma') || lower.includes('qué hay') || lower.includes('resumen del día') || lower.includes('cómo voy')) return SMART_RESPONSES['arma-mi-dia'];
  if (lower.includes('novedad') || lower.includes('coordinadora') || lower.includes('transportadora')) return SMART_RESPONSES['novedad'];
  if (lower.includes('roas') || lower.includes('campaña') || lower.includes('roax') || lower.includes('presupuesto')) return SMART_RESPONSES['roas'];
  if (lower.includes('hoy') || lower.includes('resumen') || lower.includes('pasó')) return SMART_RESPONSES['hoy'];
  if (lower.includes('skill') || lower.includes('automatiza') || lower.includes('regla') || lower.includes('construir')) return SMART_RESPONSES['skill'];
  if (lower.includes('proyecto') || lower.includes('collar') || lower.includes('skincare')) return SMART_RESPONSES['proyecto'];
  if (lower.includes('lanzar') || lower.includes('nuevo producto') || lower.includes('lanzamiento')) return SMART_RESPONSES['lanzar'];
  if (lower.includes('señal') || lower.includes('señales') || lower.includes('critica') || lower.includes('crítica') || lower.includes('operar')) return SMART_RESPONSES['senales'];
  if (lower.includes('medir') || lower.includes('ventas') || lower.includes('ganancia') || lower.includes('p&l')) return SMART_RESPONSES['medir'];
  if (lower.includes('autopilot') || lower.includes('auto') || lower.includes('automático')) return SMART_RESPONSES['autopilot'];
  if (lower.includes('personaliz') || lower.includes('dashboard') || lower.includes('sección') || lower.includes('config')) return SMART_RESPONSES['personalizar'];
  if (lower.includes('akademy') || lower.includes('academy') || lower.includes('aprender') || lower.includes('curso')) return SMART_RESPONSES['akademy'];
  return SMART_RESPONSES['default'];
}

// Detecta si el texto es una instrucción de ejecución
function isExecutionIntent(text: string): { isExecution: boolean; skillName: string; modules: Array<{ label: string; route: string }> } {
  const lower = text.toLowerCase();
  if (lower.includes('ejecuta') || lower.includes('activa') || lower.includes('lanza') || lower.includes('pausa') || lower.includes('reasigna') || lower.includes('confirma')) {
    if (lower.includes('ctr') || lower.includes('pausa')) {
      return { isExecution: true, skillName: 'Auto-pausa CTR', modules: [
        { label: 'Marketing', route: '/gali-v5/marketing/roax-informes' },
        { label: 'Reportes', route: '/gali-v5/reportes/dashboard' },
      ] };
    }
    if (lower.includes('roas') || lower.includes('escala') || lower.includes('presupuesto')) {
      return { isExecution: true, skillName: 'Escalado ROAS automático', modules: [
        { label: 'Marketing', route: '/gali-v5/marketing/roax-informes' },
        { label: 'Finanzas', route: '/gali-v5/financiero/historial-de-cartera' },
      ] };
    }
    if (lower.includes('routing') || lower.includes('pedido') || lower.includes('reasigna') || lower.includes('coordinadora')) {
      return { isExecution: true, skillName: 'Smart routing novedad', modules: [
        { label: 'Pedidos', route: '/gali-v5/mis-pedidos/novedades' },
        { label: 'Logística', route: '/gali-v5/logistica/transportadoras' },
      ] };
    }
    return { isExecution: true, skillName: 'Skill de Gali', modules: [
      { label: 'Señales', route: '/gali-v5' },
    ] };
  }
  return { isExecution: false, skillName: '', modules: [] };
}

@Injectable({ providedIn: 'root' })
export class GaliStateService {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  readonly galiMode = signal<GaliMode>(0);

  readonly showCustomizer = signal(false);
  /** Tab solicitado al abrir el panel desde una notificación de agente */
  readonly requestedPanelTab = signal<string | null>(null);

  openPanelToMemory(): void {
    this.requestedPanelTab.set('memory');
    this.galiMode.set(1);
  }

  readonly agents = signal<AgentStatus[]>([
    { id: 'roax', name: 'Roax', color: '#f97316', status: 'activo', action: 'ROAS 2.9x · pauta $66k/día activa', skills: ['Auto-pausa CTR', 'Escalado ROAS'] },
    { id: 'vigilante', name: 'Vigilante', color: '#fbbf24', status: 'activo', action: 'Detectó novedad 15% Coordinadora Bogotá', skills: ['Smart routing novedad'] },
    { id: 'chatea', name: 'Chatea Pro', color: '#34d399', status: 'activo', action: '43 de 47 pedidos confirmados · 1 pendiente', skills: [] },
    { id: 'ada', name: 'ADA Spy', color: '#818cf8', status: 'esperando', action: 'Evaluando 3 productos · ventana 18 días', skills: [] },
  ]);

  readonly galiSignals = signal<GaliSignal[]>([
    { id: 's1', type: 'critica', emoji: '⚠', message: 'Coordinadora Bogotá 15% novedad · 12 pedidos en riesgo', time: 'hace 18 min', cta: 'Resolver', ctaAction: 'ir-a-senales' },
    { id: 's2', type: 'sugerencia', emoji: '⚡', message: 'Video B CTR +50% · Roax escaló presupuesto +15%', time: 'hace 2h', cta: 'Ver skill', ctaAction: 'ver-skill-roas' },
    { id: 's3', type: 'info', emoji: '✓', message: '8 novedades resueltas hoy · $480k en pérdidas evitadas', time: 'hace 3h' },
    { id: 's4', type: 'sugerencia', emoji: '💡', message: 'Bandas de Fitness: CTR recuperado. ¿Reanudamos?', time: 'hace 5h', cta: 'Reanudar', ctaAction: 'ir-operar' },
  ]);

  readonly chatHistory = signal<ChatMessage[]>([
    {
      id: 'c1',
      from: 'gali',
      text: '¡Hola! Tienes 1 señal crítica: Coordinadora tiene 15% de novedad en Bogotá — 12 pedidos en riesgo. ¿Lo resolvemos ahora?',
      time: 'hace 18 min',
      actions: [
        { label: 'Ver la señal', action: 'ir-a-senales', isPrimary: true },
        { label: 'Reasignar pedidos', action: 'reasignar-pedidos' },
      ],
    },
    { id: 'c2', from: 'user', text: 'Muéstrame las opciones', time: 'hace 16 min' },
    {
      id: 'c3',
      from: 'gali',
      text: 'Tengo 3 opciones: A) Cambiar los 12 pedidos a Servientrega (tasa 3.8%), B) Cambiar solo los de hoy y esperar, C) Crear una regla automática para el futuro. ¿Cuál prefieres?',
      time: 'hace 15 min',
      actions: [
        { label: 'Opción A — Cambiar todo', action: 'reasignar-pedidos', isPrimary: true },
        { label: 'Crear regla automática', action: 'crear-skill-routing' },
      ],
    },
  ]);

  readonly criticalCount = signal(1);
  readonly isTyping = signal(false);

  /** Ancho del panel derecho — redimensionable estilo editor */
  readonly panelWidth = signal(parseInt(localStorage.getItem('gali-panel-width') ?? '520', 10));
  /** Ancho del panel de contexto (tablas/datos) dentro del chat */
  readonly contextSplitWidth = signal(parseInt(localStorage.getItem('gali-context-split') ?? '55', 10));
  /** Panel de datos activo (tabla, métricas) */
  readonly activeContext = signal<GaliPanelContext | null>({
    id: 'pedidos-riesgo',
    title: 'Pedidos en riesgo',
    subtitle: 'Coordinadora · Bogotá · hoy',
    type: 'table',
    columns: [
      { key: 'id', label: 'Pedido', mono: true },
      { key: 'cliente', label: 'Cliente' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'estado', label: 'Estado' },
    ],
    rows: [
      { id: 'P-8841', cliente: 'María L.', ciudad: 'Bogotá', estado: 'En camino' },
      { id: 'P-8839', cliente: 'Carlos M.', ciudad: 'Bogotá', estado: 'En camino' },
      { id: 'P-8835', cliente: 'Sandra P.', ciudad: 'Bogotá', estado: 'Entregando' },
      { id: 'P-8832', cliente: 'Jorge R.', ciudad: 'Bogotá', estado: 'En camino' },
    ],
  });

  setPanelWidth(w: number): void {
    const clamped = Math.max(380, Math.min(Math.floor(window.innerWidth * 0.78), w));
    this.panelWidth.set(clamped);
    localStorage.setItem('gali-panel-width', String(clamped));
    document.documentElement.style.setProperty('--gali-panel-width', `${clamped}px`);
  }

  setContextSplitPercent(pct: number): void {
    const clamped = Math.max(35, Math.min(70, pct));
    this.contextSplitWidth.set(clamped);
    localStorage.setItem('gali-context-split', String(clamped));
  }

  clearContext(): void {
    this.activeContext.set(null);
  }

  constructor() {
    document.documentElement.style.setProperty('--gali-panel-width', `${this.panelWidth()}px`);
  }

  togglePanel(): void {
    this.galiMode.update(m => (m === 0 ? 1 : 0));
  }

  setAutopilot(on: boolean): void {
    this.galiMode.set(on ? 2 : 1);
    if (on) this.ws.enableAutopilot();
    else this.ws.disableAutopilot();
  }

  private getModeChip(text: string): string | undefined {
    const lower = text.toLowerCase();
    if (lower.includes('señal') || lower.includes('operar')) return '→ Modo Operar activado';
    if (lower.includes('medir') || lower.includes('ventas') || lower.includes('p&l')) return '→ Modo Medir activado';
    if (lower.includes('skill') || lower.includes('construir') || lower.includes('automatiza')) return '→ Modo Construir activado';
    if (lower.includes('lanzar') || lower.includes('producto')) return '→ Modo Lanzar activado';
    if (lower.includes('autopilot')) return '→ Autopilot activado';
    return undefined;
  }

  sendMessage(text: string): void {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, from: 'user', text, time: 'ahora' };
    this.chatHistory.update(h => [...h, userMsg]);

    const { isExecution, skillName, modules } = isExecutionIntent(text);

    if (isExecution) {
      // Insertar execution card en fase "running"
      const execId = `exec-${Date.now()}`;
      const execMsg: ChatMessage = {
        id: execId,
        from: 'gali',
        text: '',
        time: 'ahora',
        executionCard: { phase: 'running', skillName, affectedModules: modules },
      };
      this.chatHistory.update(h => [...h, execMsg]);

      // Después de 1.8s: marcar como "done" con resultado
      setTimeout(() => {
        this.chatHistory.update(h => h.map(m => m.id === execId
          ? { ...m, executionCard: { ...m.executionCard!, phase: 'done', resultSummary: `${skillName} ejecutada con éxito. Módulos actualizados.` } }
          : m
        ));
        this.ws.addLiveEvent({ agente: 'Gali', agente_id: 'gali', mensaje: `${skillName} ejecutada desde chat`, tipo: 'action' });
      }, 1800);
      return;
    }

    this.isTyping.set(true);
    const delay = 600 + Math.random() * 600;
    const lower = text.toLowerCase();
    setTimeout(() => {
      this.isTyping.set(false);
      const response = matchResponse(text);
      if (response.context) {
        this.activeContext.set(response.context);
      }
      const galiMsg: ChatMessage = {
        id: `g-${Date.now()}`,
        from: 'gali',
        text: response.text,
        time: 'ahora',
        actions: response.actions,
        modeChip: this.getModeChip(text),
      };
      this.chatHistory.update(h => [...h, galiMsg]);

      // Auto-ejecutar customizer sin necesidad de hacer clic en el botón
      if (lower.includes('personaliz') || (lower.includes('dashboard') && (lower.includes('config') || lower.includes('secci')))) {
        setTimeout(() => {
          this.router.navigate(['/gali-v5']);
          this.showCustomizer.set(true);
          this.galiMode.set(0);
        }, 500);
      }
    }, delay);
  }

  executeAction(action: string): void {
    switch (action) {
      case 'ir-a-senales':
        this.ws.setMode('operar');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0); // close panel to see workspace
        break;
      case 'ir-operar':
        this.ws.setMode('operar');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0);
        break;
      case 'ir-lanzar':
        this.ws.setMode('lanzar');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0);
        break;
      case 'ir-construir':
        this.ws.setMode('construir');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0);
        break;
      case 'ir-medir':
        this.ws.setMode('medir');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0);
        break;
      case 'crear-skill':
      case 'crear-skill-routing':
        this.ws.setMode('construir');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0);
        this.sendMessage('Quiero crear una nueva skill de routing automático');
        break;
      case 'ver-skill-roas':
        this.ws.setMode('construir');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0);
        break;
      case 'reasignar-pedidos':
        this.ws.addLiveEvent({ agente: 'Vigilante', agente_id: 'vigilante', mensaje: 'Reasignando 12 pedidos a Servientrega…', tipo: 'action' });
        this.sendMessage('Confirmo reasignación');
        setTimeout(() => {
          this.ws.addLiveEvent({ agente: 'Vigilante', agente_id: 'vigilante', mensaje: '✓ 12 pedidos reasignados a Servientrega', tipo: 'ok' });
        }, 2000);
        break;
      case 'toggle-autopilot':
        this.ws.toggleAutopilot();
        if (this.ws.autopilot()) {
          this.ws.addLiveEvent({ agente: 'Gali', agente_id: 'gali', mensaje: 'Autopilot activado — Gali opera sin preguntar', tipo: 'action' });
        }
        this.galiMode.set(0);
        break;
      case 'ir-senales':
        this.ws.setMode('operar');
        this.router.navigate(['/gali-v5']);
        this.galiMode.set(0);
        break;
      case 'ir-akademy':
        this.router.navigate(['/gali-v5/academy']);
        this.galiMode.set(0);
        break;
      case 'editar-skill':
        this.router.navigate(['/gali-v5/skills/nueva']);
        this.galiMode.set(0);
        break;
      case 'abrir-customizer':
        this.router.navigate(['/gali-v5']);
        this.showCustomizer.set(true);
        this.galiMode.set(0);
        break;
    }
  }
}
