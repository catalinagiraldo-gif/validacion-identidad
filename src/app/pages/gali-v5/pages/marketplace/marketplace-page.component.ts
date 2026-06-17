import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillsEditorModalComponent } from '../../components/skills-editor-modal/skills-editor-modal.component';

export type SkillTipo = 'gratuita' | 'experto' | 'premium';
export type AgenteFiltro = 'todos' | 'Roax' | 'ADA Spy' | 'Chatea Pro' | 'Vigilante' | 'Financiero';

interface Skill {
  id: string;
  nombre: string;
  agente: string;
  icono: string;
  tipo: SkillTipo;
  rating: number;
  usos: number;
  creador: string;
  verificado: boolean;
  descripcion: string;
  instalada: boolean;
  categoria: string;
}

interface PersonalizedSkill {
  id: string;
  title: string;
  reason: string;
  agent: string;
  agentColor: string;
  cta: string;
  installed: boolean;
}

@Component({
  selector: 'app-marketplace-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SkillsEditorModalComponent],
  templateUrl: './marketplace-page.component.html',
  styleUrl: './marketplace-page.component.scss',
})

export class MarketplacePageComponent {
  agenteTab = signal<AgenteFiltro>('todos');
  tipoFiltro = signal<SkillTipo | 'todos'>('todos');
  busqueda = signal('');
  instalandoId = signal<string | null>(null);
  instaladosHoy = signal<string[]>([]);
  showEditor = signal(false);

  readonly personalizedSkills: PersonalizedSkill[] = [
    {
      id: 'ps1',
      title: 'Auto-swap si novedad > 10%',
      reason: 'Tu Coordinadora Bogotá está en 15% esta semana. Este skill ya aplicaría ahora mismo.',
      agent: 'Vigilante',
      agentColor: '#f59e0b',
      cta: 'Activar ahora',
      installed: false,
    },
    {
      id: 'ps2',
      title: 'Escalar pauta 15% si ROAS > 2.5x por 48h',
      reason: 'Tu ROAS es 2.9x en Collar GPS. Roax podría escalarlo automáticamente.',
      agent: 'Roax',
      agentColor: '#ff6102',
      cta: 'Activar para Collar GPS',
      installed: false,
    },
    {
      id: 'ps3',
      title: 'P&L real automático semanal',
      reason: 'Tu gap ROAS declarado vs real fue -1.0x esta semana. Automatiza el seguimiento.',
      agent: 'Agente Financiero',
      agentColor: '#8b5cf6',
      cta: 'Activar skill',
      installed: false,
    },
  ];

  personalizedInstalled = signal<string[]>([]);

  installPersonalized(id: string): void {
    this.personalizedInstalled.update(l => [...l, id]);
  }

  isPersonalizedInstalled(id: string): boolean {
    return this.personalizedInstalled().includes(id);
  }

  readonly agenteTabs: { id: AgenteFiltro; label: string; icono: string }[] = [
    { id: 'todos', label: 'Destacadas', icono: '⭐' },
    { id: 'Roax', label: 'Roax', icono: '⚡' },
    { id: 'ADA Spy', label: 'ADA Spy', icono: '🔍' },
    { id: 'Chatea Pro', label: 'Chatea Pro', icono: '💬' },
    { id: 'Vigilante', label: 'Vigilante', icono: '🚛' },
    { id: 'Financiero', label: 'Financiero', icono: '📊' },
  ];

  readonly allSkills: Skill[] = [
    { id:'sk-001', nombre:'Anti-Baneo Meta', agente:'Roax', icono:'🛡️', tipo:'gratuita', rating:4.8, usos:1200, creador:'Dropi Team', verificado:true, descripcion:'Detecta señales de restricción y pausa automáticamente antes de que Meta limite tu cuenta.', instalada:true, categoria:'Protección' },
    { id:'sk-002', nombre:'Escalador ROAS 20%', agente:'Roax', icono:'🚀', tipo:'experto', rating:4.6, usos:847, creador:'@MarinaDrops', verificado:true, descripcion:'Si el ROAS supera el objetivo por 48h, sube el presupuesto 20% automáticamente.', instalada:false, categoria:'Escalamiento' },
    { id:'sk-003', nombre:'Prepago Zona Rural', agente:'Vigilante', icono:'🌍', tipo:'gratuita', rating:4.9, usos:2100, creador:'Dropi Team', verificado:true, descripcion:'Si el pedido va a municipio rural, solicita prepago automáticamente.', instalada:true, categoria:'Logística' },
    { id:'sk-004', nombre:'Cierre Cálido WhatsApp', agente:'Chatea Pro', icono:'💬', tipo:'premium', rating:4.7, usos:634, creador:'@JuanDropper1847', verificado:true, descripcion:'Script de 5 pasos para confirmar pedidos por WhatsApp con tono cercano y manejo de objeciones.', instalada:false, categoria:'Cierre' },
    { id:'sk-005', nombre:'P&L Semanal Auto', agente:'Financiero', icono:'📊', tipo:'gratuita', rating:4.5, usos:980, creador:'Dropi Team', verificado:true, descripcion:'Cada domingo Gali genera el P&L de la semana con desglose de costos y ganancia neta.', instalada:false, categoria:'Reportes' },
    { id:'sk-006', nombre:'Pausa Nocturna', agente:'Roax', icono:'🌙', tipo:'gratuita', rating:4.3, usos:1450, creador:'Dropi Team', verificado:true, descripcion:'Pausa campañas entre 11pm y 6am. Ahorra hasta 25% del presupuesto en horas de baja conversión.', instalada:false, categoria:'Ahorro' },
    { id:'sk-007', nombre:'Alerta Novedad Alta', agente:'Vigilante', icono:'⚠️', tipo:'gratuita', rating:4.7, usos:1876, creador:'Dropi Team', verificado:true, descripcion:'Si la tasa de novedad supera el umbral, reasigna automáticamente a la mejor transportadora.', instalada:true, categoria:'Logística' },
    { id:'sk-008', nombre:'Bundle Mascotas x5', agente:'ADA Spy', icono:'🐾', tipo:'experto', rating:4.6, usos:412, creador:'@PetDropCO', verificado:false, descripcion:'Los 5 productos de nicho mascotas que mejor se venden juntos en Colombia 2026.', instalada:false, categoria:'Productos' },
    { id:'sk-009', nombre:'Recuperación Carritos x3', agente:'Chatea Pro', icono:'🛒', tipo:'gratuita', rating:4.4, usos:765, creador:'Dropi Team', verificado:true, descripcion:'Secuencia de 3 mensajes (2h, 6h, 24h) para recuperar compradores indecisos. Tasa promedio: 18%.', instalada:false, categoria:'Retención' },
    { id:'sk-010', nombre:'Stack Skincare LATAM', agente:'ADA Spy', icono:'✨', tipo:'experto', rating:4.8, usos:523, creador:'@DropiBeauty', verificado:true, descripcion:'Los ángulos de venta de skincare que más convierten en Colombia y México 2026.', instalada:false, categoria:'Productos' },
    { id:'sk-011', nombre:'Proyección Flujo Caja', agente:'Financiero', icono:'💰', tipo:'premium', rating:4.9, usos:289, creador:'@ContadorDropi', verificado:true, descripcion:'Proyecta el flujo de caja de los próximos 14 días basado en pedidos activos y tasas históricas.', instalada:false, categoria:'Finanzas' },
    { id:'sk-012', nombre:'Detección Saturación 7d', agente:'ADA Spy', icono:'📉', tipo:'gratuita', rating:4.5, usos:1123, creador:'Dropi Team', verificado:true, descripcion:'Alerta con 7 días de anticipación antes de saturación de cualquier producto favorito.', instalada:false, categoria:'Investigación' },
    { id:'sk-013', nombre:'Confirmar y Despachar Auto', agente:'Chatea Pro', icono:'⚡', tipo:'experto', rating:4.6, usos:678, creador:'@FastDropCO', verificado:true, descripcion:'Para pedidos con huella verde y monto bajo, confirma y genera etiqueta automáticamente.', instalada:false, categoria:'Automatización' },
    { id:'sk-014', nombre:'Reporte Transportadoras', agente:'Vigilante', icono:'🚛', tipo:'gratuita', rating:4.2, usos:834, creador:'Dropi Team', verificado:true, descripcion:'Resumen semanal de tasa de entrega por transportadora y ciudad, con recomendación.', instalada:false, categoria:'Logística' },
    { id:'sk-015', nombre:'Tono Amigable Colombia', agente:'Chatea Pro', icono:'🇨🇴', tipo:'gratuita', rating:4.8, usos:2340, creador:'Dropi Team', verificado:true, descripcion:'Configura el tono de todos los mensajes con expresiones colombianas. Aumenta respuesta 12%.', instalada:false, categoria:'Comunicación' },
    { id:'sk-016', nombre:'Scaling Vertical Meta', agente:'Roax', icono:'📈', tipo:'experto', rating:4.7, usos:892, creador:'@AlexScalerCO', verificado:true, descripcion:'Estrategia completa: ABO test → CBO scale → +20% cada 72h. 300+ campañas exitosas en COL.', instalada:false, categoria:'Escalamiento' },
    { id:'sk-017', nombre:'Alerta ROAS Caída Rápida', agente:'Roax', icono:'🔴', tipo:'gratuita', rating:4.6, usos:1567, creador:'Dropi Team', verificado:true, descripcion:'Si el ROAS cae más de 30% en 6h, pausa y notifica con diagnóstico inmediato.', instalada:false, categoria:'Protección' },
    { id:'sk-018', nombre:'Nicho Fitness 2026', agente:'ADA Spy', icono:'💪', tipo:'experto', rating:4.4, usos:334, creador:'@FitDropLATAM', verificado:false, descripcion:'Los 8 productos fitness con mayor crecimiento en Q2 2026 en Colombia.', instalada:false, categoria:'Productos' },
    { id:'sk-019', nombre:'Cierre Zona Cali', agente:'Chatea Pro', icono:'🏙️', tipo:'experto', rating:4.8, usos:445, creador:'@CaliDropper', verificado:true, descripcion:'Script para Cali: anticipo si novedad > 8%, tono directo, objeciones locales.', instalada:false, categoria:'Cierre' },
    { id:'sk-020', nombre:'Facturación Automática Siigo', agente:'Financiero', icono:'🧾', tipo:'premium', rating:4.5, usos:178, creador:'Dropi Team', verificado:true, descripcion:'Genera facturas en Siigo automáticamente al marcar pedido como entregado.', instalada:false, categoria:'Contabilidad' },
  ];

  filteredSkills = computed(() => {
    let skills = this.allSkills;
    const agente = this.agenteTab();
    const tipo = this.tipoFiltro();
    const q = this.busqueda().toLowerCase();

    if (agente !== 'todos') skills = skills.filter(s => s.agente === agente);
    if (tipo !== 'todos') skills = skills.filter(s => s.tipo === tipo);
    if (q) skills = skills.filter(s => s.nombre.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q));

    return skills;
  });

  instaladosCount = computed(() =>
    this.allSkills.filter(s => s.instalada).length + this.instaladosHoy().length
  );

  getTipoBadgeClass(tipo: SkillTipo): string {
    return { gratuita: 'badge--gratuita', experto: 'badge--experto', premium: 'badge--premium' }[tipo];
  }

  formatUsos(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
  }

  instalar(skill: Skill): void {
    if (skill.instalada || this.instaladosHoy().includes(skill.id)) return;
    this.instalandoId.set(skill.id);
    setTimeout(() => {
      this.instaladosHoy.update(ids => [...ids, skill.id]);
      this.instalandoId.set(null);
    }, 700);
  }

  isInstalada(skill: Skill): boolean {
    return skill.instalada || this.instaladosHoy().includes(skill.id);
  }

  isInstalando(skill: Skill): boolean {
    return this.instalandoId() === skill.id;
  }

  setTipoFiltro(t: string): void {
    this.tipoFiltro.set(t as SkillTipo | 'todos');
  }
}
