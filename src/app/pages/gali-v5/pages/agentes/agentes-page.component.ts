import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface AgentSkill {
  name: string;
  status: 'active' | 'paused';
  runs: number;
}

interface AgentAction {
  text: string;
  time: string;
  result: 'ok' | 'warn' | 'info';
  impact?: string;
}

interface AgentCTA {
  label: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'warn';
}

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  status: 'activo' | 'esperando' | 'pausa';
  lastAction: string;
  lastActionTime: string;
  successRate: number;
  actionsThisWeek: number;
  skills: AgentSkill[];
  description: string;
  capabilities: string[];
  recentHistory: AgentAction[];
  ctas: AgentCTA[];
}

const AGENTS: Agent[] = [
  {
    id: 'roax',
    name: 'Roax',
    role: 'Media Buyer',
    color: '#f97316',
    status: 'activo',
    lastAction: 'Escaló presupuesto de Collar GPS +30%',
    lastActionTime: 'hace 2h',
    successRate: 94,
    actionsThisWeek: 18,
    description: 'Gestiona tus campañas en Meta Ads. Monitorea ROAS, escala presupuestos cuando funcionan y pausa cuando no.',
    capabilities: [
      'Escalar presupuesto cuando ROAS supera meta',
      'Pausar adsets con CTR bajo por 3 días',
      'Cambiar creativos con saturación alta',
      'Generar informes de atribución',
      'Configurar audiencias lookalike automáticas',
    ],
    skills: [
      { name: 'Auto-pausa si CTR cae', status: 'active', runs: 7 },
      { name: 'Escalado ROAS automático', status: 'active', runs: 3 },
    ],
    recentHistory: [
      { text: 'Escaló presupuesto Collar GPS de $50k → $65k/día', time: 'hace 2h', result: 'ok', impact: '+23% pedidos estimados' },
      { text: 'Pausó adset "Jóvenes 18-24 Cali" — CTR 0.4% por 4 días', time: 'hace 6h', result: 'warn', impact: 'Ahorró $35k en gasto ineficiente' },
      { text: 'Informe semanal generado — ROAS promedio 3.2x', time: 'ayer 9pm', result: 'info' },
      { text: 'Detectó saturación creativo "Collar rojo" — sugiere nueva versión', time: 'hace 2 días', result: 'warn' },
    ],
    ctas: [
      { label: 'Escalar campaña activa', icon: 'pi-arrow-up-right', variant: 'primary' },
      { label: 'Ver informe de ROAS', icon: 'pi-chart-line', variant: 'secondary' },
      { label: 'Pausar todo hasta revisar', icon: 'pi-pause', variant: 'warn' },
    ],
  },
  {
    id: 'vigilante',
    name: 'Vigilante',
    role: 'Logística & Pedidos',
    color: '#fbbf24',
    status: 'activo',
    lastAction: 'Cambió 12 pedidos de Coordinadora a Servientrega',
    lastActionTime: 'hace 2h',
    successRate: 91,
    actionsThisWeek: 34,
    description: 'Monitorea tus pedidos 24/7. Detecta novedades, cambia transportadoras automáticamente y alerta cuando algo requiere tu atención.',
    capabilities: [
      'Detectar pedidos estancados +72h en bodega',
      'Cambiar transportadora automáticamente en novedades',
      'Evaluar "huella digital" del cliente antes de despachar',
      'Alertar pedidos con riesgo de fraude',
      'Reagendar entregas fallidas con cliente',
    ],
    skills: [
      { name: 'Smart routing de novedades', status: 'active', runs: 12 },
      { name: 'Alerta de pedidos estancados', status: 'paused', runs: 5 },
    ],
    recentHistory: [
      { text: 'Redirigió 12 pedidos Bogotá de Coordinadora a Servientrega por novedades', time: 'hace 2h', result: 'ok', impact: 'Tasa de entrega 94%→97%' },
      { text: 'Detectó 3 pedidos estancados en Medellín +72h — enviado a CAS', time: 'hace 5h', result: 'warn', impact: 'Clientes notificados' },
      { text: 'Alertó: pedido #P-4892 con historial de fraude — requiere revisión', time: 'hace 1 día', result: 'warn' },
      { text: 'Procesó 89 despachos sin novedades', time: 'ayer', result: 'ok', impact: '$2.3M en pedidos' },
    ],
    ctas: [
      { label: 'Ver pedidos con novedad', icon: 'pi-exclamation-triangle', variant: 'warn' },
      { label: 'Activar smart routing', icon: 'pi-cog', variant: 'primary' },
      { label: 'Ver torre logística', icon: 'pi-map', variant: 'secondary' },
    ],
  },
  {
    id: 'chatea',
    name: 'Chatea Pro',
    role: 'Cierre & CAS',
    color: '#34d399',
    status: 'activo',
    lastAction: 'Confirmó 43 pedidos por WhatsApp',
    lastActionTime: 'hace 4h',
    successRate: 88,
    actionsThisWeek: 127,
    description: 'Gestiona tus conversaciones de WhatsApp. Confirma pedidos, responde preguntas frecuentes y escala a ti cuando no puede resolver.',
    capabilities: [
      'Confirmar pedidos nuevos por WhatsApp',
      'Responder preguntas de estado de envío',
      'Recuperar carritos abandonados',
      'Escalar a CAS cuando no puede resolver',
      'Aprender de tus respuestas para mejorar',
    ],
    skills: [
      { name: 'Confirmación automática de pedidos', status: 'active', runs: 89 },
      { name: 'Recuperación de carritos abandonados', status: 'active', runs: 23 },
    ],
    recentHistory: [
      { text: 'Confirmó 43 pedidos por WhatsApp sin intervención', time: 'hace 4h', result: 'ok', impact: '$4.7M en pedidos' },
      { text: 'Recuperó 7 carritos abandonados — respondió "¿llegará a tiempo?"', time: 'hace 8h', result: 'ok', impact: '+$630k recuperados' },
      { text: 'Escaló 3 tickets a CAS — no pudo resolver reclamo de garantía', time: 'hace 1 día', result: 'warn' },
      { text: 'Aprendió nueva respuesta sobre cambios de dirección', time: 'hace 2 días', result: 'info' },
    ],
    ctas: [
      { label: 'Ver bandeja CAS', icon: 'pi-inbox', variant: 'primary' },
      { label: 'Enseñarle nueva respuesta', icon: 'pi-book', variant: 'secondary' },
      { label: 'Ver historial de conversaciones', icon: 'pi-comments', variant: 'secondary' },
    ],
  },
  {
    id: 'ada',
    name: 'ADA Spy',
    role: 'Research & Oportunidades',
    color: '#818cf8',
    status: 'esperando',
    lastAction: 'Detectó oportunidad: Difusor aromaterapia (score 87)',
    lastActionTime: 'hace 8h',
    successRate: 79,
    actionsThisWeek: 6,
    description: 'Analiza el mercado para encontrar productos con alta demanda y baja competencia. Evalúa márgenes, tendencias y riesgo.',
    capabilities: [
      'Detectar productos con alta demanda y baja saturación',
      'Calcular margen real incluyendo flete y COGS',
      'Analizar competencia y ventana de oportunidad',
      'Rankear productos por "fit" con tu historial de nichos',
      'Buscar por descripción semántica de audiencia',
    ],
    skills: [
      { name: 'Alerta de oportunidades diaria', status: 'active', runs: 14 },
    ],
    recentHistory: [
      { text: 'Detectó: Difusor aromaterapia — score 87, ventana 12 días', time: 'hace 8h', result: 'ok', impact: 'Margen estimado 65%' },
      { text: 'Analizó 34 productos en nicho salud y bienestar', time: 'ayer', result: 'info' },
      { text: 'Alertó: Rodillo de jade aumenta 40% en Bogotá esta semana', time: 'hace 2 días', result: 'warn', impact: '8 días de ventana' },
      { text: 'Completó análisis de competencia para Collar GPS', time: 'hace 3 días', result: 'ok' },
    ],
    ctas: [
      { label: 'Buscar nueva oportunidad', icon: 'pi-search', variant: 'primary' },
      { label: 'Ver análisis de mercado', icon: 'pi-eye', variant: 'secondary' },
      { label: 'Ir a Caza Productos', icon: 'pi-bolt', variant: 'secondary' },
    ],
  },
];

interface CustomAgentDraft {
  nombre: string;
  rol: string;
  descripcion: string;
  skills: string[];
  step: 1 | 2 | 3;
}

@Component({
  selector: 'app-agentes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agentes-page.component.html',
  styleUrl: './agentes-page.component.scss',
})
export class AgentesPageComponent {
  readonly agents = AGENTS;
  selectedAgent = signal<Agent>(AGENTS[0]);
  readonly showCreateAgent = signal(false);
  readonly createAgentDraft = signal<CustomAgentDraft>({ nombre: '', rol: '', descripcion: '', skills: [], step: 1 });
  readonly createAgentDone = signal(false);

  selectAgent(agent: Agent): void {
    this.selectedAgent.set(agent);
  }

  getStatusLabel(status: Agent['status']): string {
    return { activo: 'Activo', esperando: 'Esperando', pausa: 'En pausa' }[status];
  }

  openCreateAgent(): void {
    this.createAgentDraft.set({ nombre: '', rol: '', descripcion: '', skills: [], step: 1 });
    this.createAgentDone.set(false);
    this.showCreateAgent.set(true);
  }

  nextCreateStep(): void {
    this.createAgentDraft.update(d => ({ ...d, step: Math.min(3, d.step + 1) as 1 | 2 | 3 }));
  }

  prevCreateStep(): void {
    this.createAgentDraft.update(d => ({ ...d, step: Math.max(1, d.step - 1) as 1 | 2 | 3 }));
  }

  setDraftNombre(v: string): void {
    this.createAgentDraft.update(d => ({ ...d, nombre: v }));
  }

  setDraftRol(v: string): void {
    this.createAgentDraft.update(d => ({ ...d, rol: v }));
  }

  launchAgent(): void {
    this.createAgentDone.set(true);
  }

  toggleSkillForAgent(skill: string): void {
    this.createAgentDraft.update(d => {
      const skills = d.skills.includes(skill)
        ? d.skills.filter(s => s !== skill)
        : [...d.skills, skill];
      return { ...d, skills };
    });
  }

  isSkillSelected(skill: string): boolean {
    return this.createAgentDraft().skills.includes(skill);
  }

  isRolSelected(rol: string): boolean {
    return this.createAgentDraft().rol === rol;
  }

  readonly availableSkills = [
    'Auto-pausa si CTR cae',
    'Escalado ROAS automático',
    'Smart routing novedad',
    'Alerta de stock-out',
    'Confirmación automática pedidos',
    'Recuperación de carritos WhatsApp',
    'Post-mortem campaña fallida',
  ];

  readonly rolSuggestions = [
    'Analista de campañas',
    'Gestor de novedades',
    'Asistente de ventas',
    'Coordinador logístico',
    'Monitor de stock',
  ];
}
