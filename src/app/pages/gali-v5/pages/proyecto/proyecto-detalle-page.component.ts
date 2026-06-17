import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DiagnosticoModalComponent } from '../../components/diagnostico-modal/diagnostico-modal.component';
import { SkillsEditorModalComponent } from '../../components/skills-editor-modal/skills-editor-modal.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

export type TabId = 'resumen' | 'producto' | 'estrategia' | 'creativos' | 'campanas' | 'pedidos' | 'pl';
export type AgentStatus = 'activo' | 'esperando' | 'pausa';

interface ProyectoAgent {
  id: string;
  nombre: string;
  herramienta: string;
  icono: string;
  estado: AgentStatus;
  observacion: string;
  ultimaAccion: string;
  route: string;
}

interface PipelineStep {
  stage: string;
  status: 'completado' | 'activo' | 'pendiente';
  label: string;
}

interface MetricCard {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  alert?: boolean;
}

interface Creative {
  id: string;
  nombre: string;
  tipo: string;
  estado: 'activo' | 'pausado' | 'ganador';
  ctr: string;
  roas?: string;
  nota?: string;
}

interface LoopEntry {
  icono: string;
  agente: string;
  accion: string;
  resultado: string;
  hace: string;
  tipo: 'positivo' | 'neutro' | 'pendiente';
  cta?: string;
}

interface PlLine {
  label: string;
  value: string;
  pct: string;
  variant: 'ingreso' | 'costo' | 'neto' | 'alerta';
}

@Component({
  selector: 'app-proyecto-detalle-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DiagnosticoModalComponent, SkillsEditorModalComponent],
  templateUrl: './proyecto-detalle-page.component.html',
  styleUrl: './proyecto-detalle-page.component.scss',
})
export class ProyectoDetallePageComponent implements OnInit {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  activeTab = signal<TabId>('resumen');
  showDiagnostic = signal(false);
  showSkillsEditor = signal(false);
  skillsEditorAgente = signal('Roax');

  goToSignals(): void {
    this.ws.setMode('operar');
    this.router.navigate(['/gali-v5']);
  }

  goToSkillEditor(agente = 'vigilante'): void {
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: { agente, contexto: 'proyecto' },
    });
  }

  goToMedir(): void {
    this.ws.setMode('medir');
    this.router.navigate(['/gali-v5']);
  }

  readonly tabs: { id: TabId; label: string }[] = [
    { id: 'resumen',    label: 'Resumen' },
    { id: 'producto',   label: 'Producto' },
    { id: 'estrategia', label: 'Estrategia' },
    { id: 'creativos',  label: 'Creativos' },
    { id: 'campanas',   label: 'Campañas' },
    { id: 'pedidos',    label: 'Pedidos' },
    { id: 'pl',         label: 'P&L Real (Ganancias)' },
  ];

  readonly proyecto = {
    id: 'collar-gps-2026',
    nombre: 'Collar GPS para mascotas',
    icono: '🐕',
    estado: 'en_escala',
    estadoLabel: 'En escala',
    semana: 'Semana 3',
    meta: '100 ventas/sem',
    diasActivo: 18,
    galiAlerta: 'Tu novedad en Cali está afectando el margen. Cambiar a Servientrega puede recuperar 4 pts.',
    galiCta: 'Sí, cambiar en Cali',
  };

  readonly pipeline: PipelineStep[] = [
    { stage: 'Producto',   status: 'completado', label: 'Collar GPS elegido' },
    { stage: 'Landing',    status: 'completado', label: 'landing-collar-mama-v2' },
    { stage: 'Creativos',  status: 'completado', label: '3 piezas activas' },
    { stage: 'Campaña',    status: 'activo',      label: 'Meta Ads · $80k/día' },
    { stage: 'ROAS',       status: 'activo',      label: '2.8x ↑' },
  ];

  readonly agentes: ProyectoAgent[] = [
    {
      id: 'ada-spy',
      nombre: 'ADA Spy',
      herramienta: 'Producto Research',
      icono: '🔍',
      estado: 'esperando',
      observacion: '3 competidores entraron al nicho esta semana con ángulo similar. Diagnóstico de saturación listo.',
      ultimaAccion: 'Análisis de competencia completado · hace 4h',
      route: '/gali-v5/productos/caza-productos',
    },
    {
      id: 'roax',
      nombre: 'Roax',
      herramienta: 'Media Buyer',
      icono: '⚡',
      estado: 'activo',
      observacion: 'ROAS 2.9x, Video B ganando (+50% CTR). Pausa automática activa si CTR < 0.8%.',
      ultimaAccion: 'Escaló presupuesto +15% ($57.5k → $66k/día) · hace 2h',
      route: '/gali-v5/marketing/roax-informes',
    },
    {
      id: 'chatea-pro',
      nombre: 'Chatea Pro',
      herramienta: 'Cierre & Logística',
      icono: '💬',
      estado: 'activo',
      observacion: '43/47 pedidos confirmados. 3 en zona rural esperan anticipo del 50%. Resolvió 8 novedades hoy.',
      ultimaAccion: 'Novedad en Cali resuelta (reentrega programada) · hace 1h',
      route: '/gali-v5/marketing/chatea-pro',
    },
  ];

  readonly resumenCards: MetricCard[] = [
    { label: 'ROAS real',       value: '1.93x',  sub: 'vs 2.9x declarado en Meta', alert: true },
    { label: 'Ganancia neta',   value: '$411k',  sub: 'esta semana · ↓4pts vs sem. ant.' },
    { label: 'Ventas',          value: '47',     sub: 'esta semana · meta: 100/sem' },
    { label: 'Confirmaciones',  value: '91.4%',  sub: 'Chatea Pro · 43 de 47' },
    { label: 'ROAS Meta',       value: '2.9x',   sub: 'después de Video B', accent: true },
    { label: 'Novedades',       value: '6.4%',   sub: '3 de 47 · Cali causa principal' },
  ];

  readonly creativos: Creative[] = [
    { id: 'vid-b', nombre: 'Video B',     tipo: 'Video',  estado: 'ganador', ctr: '1.8%',  roas: '2.9x', nota: 'Activado hace 2h — CTR +50%' },
    { id: 'vid-a', nombre: 'Video A',     tipo: 'Video',  estado: 'pausado', ctr: '0.9%',  nota: 'Pausado (CTR cayó 40% en 48h)' },
    { id: 'ban-1', nombre: 'Banner 1',    tipo: 'Imagen', estado: 'activo',  ctr: '1.2%' },
    { id: 'ban-2', nombre: 'Banner 2',    tipo: 'Imagen', estado: 'activo',  ctr: '1.1%' },
  ];

  readonly loopEntries: LoopEntry[] = [
    {
      icono: '⚡',
      agente: 'Roax',
      accion: 'Pausé Video A (CTR -40%) → activé Video B',
      resultado: 'CTR: 1.2% → 1.8% · ROAS: 2.6x → 2.9x',
      hace: 'hace 2h',
      tipo: 'positivo',
      cta: 'Crear receta',
    },
    {
      icono: '🚛',
      agente: 'Vigilante',
      accion: 'Cambié 12 pedidos de Coordinadora → Servientrega (Cali)',
      resultado: '4 novedades ahorradas estimadas · ahorro: $85.000',
      hace: 'hace 4h',
      tipo: 'positivo',
    },
    {
      icono: '✅',
      agente: 'Chatea Pro',
      accion: 'Gestioné 8 novedades · 7 resueltas · 1 requiere decisión',
      resultado: 'Pedido con reporte ambiguo de Envía, pero cliente contactó por WA',
      hace: 'hace 6h',
      tipo: 'pendiente',
      cta: 'Decidir: reintento o devolución',
    },
    {
      icono: '📊',
      agente: 'ADA Spy',
      accion: 'Detecté 3 competidores nuevos con ángulo similar',
      resultado: 'Ángulo "regalo mamá" posiblemente saturando en Meta LATAM',
      hace: 'hace 8h',
      tipo: 'neutro',
      cta: 'Ver diagnóstico completo',
    },
  ];

  readonly plLines: PlLine[] = [
    { label: 'Ventas brutas',          value: '$1.240.000', pct: '100%',  variant: 'ingreso' },
    { label: 'Costo proveedor (47 un)', value: '- $339.500', pct: '-27%', variant: 'costo' },
    { label: 'Inversión pauta',         value: '- $310.000', pct: '-25%', variant: 'costo' },
    { label: 'Logística / flete',       value: '- $94.000',  pct: '-8%',  variant: 'costo' },
    { label: 'Novedades (3 un.)',        value: '- $85.500',  pct: '-7%',  variant: 'alerta' },
    { label: 'Ganancia neta',           value: '$411.000',  pct: '33%',  variant: 'neto' },
  ];

  readonly memoriaDecisiones = [
    'Elegiste ángulo "Mamá / seguridad" (+38% ventas en Dropi LATAM)',
    'Pausaste Creative A — Video B tiene 2× más CTR',
    'Escalaste presupuesto a $80k/día (ROAS sostenido 48h)',
  ];

  readonly memoriaAprendizajes = [
    'Tu audiencia: mujeres 28-45, mascotas pequeñas',
    'Mejor hora de publicación: 7-9pm hora COL',
    'Bogotá responde 18% mejor que Medellín',
  ];

  readonly siguienteAccion = 'Expandir a Medellín — hay demanda sin competencia activa. Estimo +$200k/día con el mismo creative.';

  openSkillsEditor(agente: string): void {
    // Navigate to the full skill editor with agent context
    const agentMap: Record<string, string> = {
      'Roax': 'roax', 'ADA Spy': 'ada', 'Vigilante': 'vigilante', 'Chatea Pro': 'chatea',
    };
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: { agente: agentMap[agente] ?? 'roax', contexto: 'proyecto' },
    });
  }

  ngOnInit(): void {}

  setTab(id: TabId): void {
    this.activeTab.set(id);
  }

  getAgentStatusClass(estado: AgentStatus): string {
    return {
      activo: 'agent-status--active',
      esperando: 'agent-status--waiting',
      pausa: 'agent-status--paused',
    }[estado];
  }

  getPipelineClass(status: PipelineStep['status']): string {
    return {
      completado: 'step--done',
      activo: 'step--active',
      pendiente: 'step--pending',
    }[status];
  }

  getCreativeClass(estado: Creative['estado']): string {
    return {
      activo: 'creative--activo',
      pausado: 'creative--pausado',
      ganador: 'creative--ganador',
    }[estado];
  }

  getLoopClass(tipo: LoopEntry['tipo']): string {
    return {
      positivo: 'loop-entry--positive',
      neutro: 'loop-entry--neutral',
      pendiente: 'loop-entry--pending',
    }[tipo];
  }

  getPlClass(variant: PlLine['variant']): string {
    return {
      ingreso: 'pl-row--ingreso',
      costo: 'pl-row--costo',
      neto: 'pl-row--neto',
      alerta: 'pl-row--alerta',
    }[variant];
  }
}
