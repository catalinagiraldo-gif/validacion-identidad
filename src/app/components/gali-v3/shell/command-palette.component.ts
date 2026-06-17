import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GaliProjectService } from '../../../services/gali-v3/project.service';
import { GaliMarketplaceService } from '../../../services/gali-v3/marketplace.service';
import { GaliFlowService } from '../../../services/gali-v3/flow.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { GaliBloqueBuilderService } from '../../../services/gali-v3/bloque-builder.service';
import { GaliRightPanelService } from '../../../services/gali-v3/right-panel.service';

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  group: string;
  action: () => void;
  keywords: string;
}

@Component({
  selector: 'gali-command-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss'],
})
export class GaliCommandPaletteComponent implements OnDestroy {
  private router = inject(Router);
  private projectSvc = inject(GaliProjectService);
  private marketSvc = inject(GaliMarketplaceService);
  private flowSvc = inject(GaliFlowService);
  private chatSvc = inject(GaliChatService);
  private bloqueBuilderSvc = inject(GaliBloqueBuilderService);
  private rpanelSvc = inject(GaliRightPanelService);

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  open = signal(false);
  query = signal('');
  selectedIdx = signal(0);

  allItems = computed<PaletteItem[]>(() => {
    const items: PaletteItem[] = [
      { id: 'go-inicio', title: 'Ir a Inicio', subtitle: 'Welcome + sugerencias contextuales', icon: '🏠', group: 'Navegar', action: () => this.router.navigateByUrl('/gali-v3'), keywords: 'inicio home welcome' },
      { id: 'go-builder', title: 'Ir a Recetas', subtitle: 'Automatizaciones conversacionales', icon: '⚡', group: 'Navegar', action: () => this.router.navigateByUrl('/gali-v3/builder'), keywords: 'recetas builder automatización flow make' },
      { id: 'go-mercado', title: 'Ir al Mercado', subtitle: 'Plantillas, agentes, conexiones', icon: '🛒', group: 'Navegar', action: () => this.router.navigateByUrl('/gali-v3/mercado'), keywords: 'mercado marketplace plantillas agentes' },
      { id: 'go-catalogo', title: 'Ir al Catálogo despertado', subtitle: 'Productos con análisis Gali', icon: '📦', group: 'Navegar', action: () => this.router.navigateByUrl('/gali-v3/dropi/catalogo'), keywords: 'catalogo productos' },
      { id: 'go-pedidos', title: 'Ir a Pedidos · Triage Gali', subtitle: 'Críticas, en proceso, resueltas', icon: '🛒', group: 'Navegar', action: () => this.router.navigateByUrl('/gali-v3/dropi/pedidos'), keywords: 'pedidos ordenes triage' },
      { id: 'go-campanas', title: 'Ir a Campañas · health-indicator', subtitle: 'Diagnóstico Gali por campaña', icon: '📣', group: 'Navegar', action: () => this.router.navigateByUrl('/gali-v3/dropi/campanas'), keywords: 'campañas ads roas' },
      { id: 'go-vista', title: 'Mis vistas · Operación hoy', subtitle: 'Pedidos + vigilante + P&L + campañas', icon: '📊', group: 'Navegar', action: () => this.router.navigateByUrl('/gali-v3/vista/operacion-hoy'), keywords: 'vista operacion hoy resumen mis vistas' },
      { id: 'go-agentes', title: 'Ver agentes activos', subtitle: 'Panel orquestador Gali', icon: '◉', group: 'Gali', action: () => { this.rpanelSvc.setOpen(true); }, keywords: 'agentes activos orquestador panel' },
      { id: 'modo-operar', title: 'Modo Operar', subtitle: 'Vista operación de hoy', icon: '⚡', group: 'Gali', action: () => this.router.navigateByUrl('/gali-v3/vista/operacion-hoy'), keywords: 'operar hoy operacion' },
      { id: 'go-vista-medir', title: 'Modo Medir · Rentabilidad semana', subtitle: 'P&L + ROAS + logística', icon: '📊', group: 'Gali', action: () => this.router.navigateByUrl('/gali-v3/vista/rentabilidad-semana'), keywords: 'medir rentabilidad semana pnl' },
      { id: 'new-project', title: 'Crear proyecto nuevo', subtitle: 'Define un objetivo y Gali arma el plan', icon: '📁', group: 'Crear', action: () => this.router.navigateByUrl('/gali-v3/proyecto/nuevo'), keywords: 'crear proyecto nuevo objetivo' },
      { id: 'new-flow', title: 'Crear automatización en blanco', subtitle: 'Builder con canvas vacío', icon: '⚙️', group: 'Crear', action: () => { const f = this.flowSvc.createBlankFlow(); this.router.navigateByUrl('/gali-v3/builder'); }, keywords: 'crear flow automatización trigger' },
      { id: 'new-vista', title: 'Crear vista personalizada', subtitle: 'Compón widgets en una pantalla', icon: '📋', group: 'Crear', action: () => this.router.navigateByUrl('/gali-v3/vista/nueva'), keywords: 'crear vista personalizada widgets' },
      { id: 'new-bloque', title: 'Crear bloque custom con Gali', subtitle: 'Constructor con chat + preview en vivo', icon: '✦', group: 'Crear', action: () => this.router.navigateByUrl('/gali-v3/bloque-builder'), keywords: 'crear bloque custom constructor chart gráfica métrica tabla cohort funnel' },
    ];

    // Bloques Custom guardados (output Vista 8)
    this.bloqueBuilderSvc.bloquesGuardados().forEach(b => {
      items.push({
        id: `bloque-${b.id}`,
        title: `${b.icono} ${b.titulo}`,
        subtitle: `Bloque custom · ${b.categoria} · ${b.datos_simulados ? 'simulado' : 'datos reales'}`,
        icon: b.icono,
        group: 'Mis Bloques',
        action: () => this.router.navigateByUrl('/gali-v3/bloque-builder'),
        keywords: `${b.titulo} ${b.descripcion} ${b.categoria} bloque custom`,
      });
    });

    // Proyectos
    this.projectSvc.projects().forEach(p => {
      items.push({
        id: `proj-${p.id}`,
        title: `${p.icon} ${p.name}`,
        subtitle: `Proyecto · ${p.status} · ROAS ${p.metrics.roas_actual}x`,
        icon: p.icon,
        group: 'Proyectos',
        action: () => this.router.navigateByUrl(`/gali-v3/proyecto/${p.id}`),
        keywords: `${p.name} ${p.product?.name ?? ''} ${p.status}`,
      });
    });

    // Agentes
    this.marketSvc.agentes().forEach(a => {
      items.push({
        id: `ag-${a.id}`,
        title: `${a.name}`,
        subtitle: a.instalado ? `Agente instalado · ${a.tagline}` : `Agente disponible · ${a.tagline}`,
        icon: a.icon,
        group: 'Agentes',
        action: () => this.router.navigateByUrl(`/gali-v3/mercado/agente/${a.id}`),
        keywords: `${a.name} ${a.tagline} agente`,
      });
    });

    // Flows
    this.flowSvc.flows().forEach(f => {
      items.push({
        id: `flow-${f.id}`,
        title: `${f.name}`,
        subtitle: `Automatización · ${f.nodes.length} bloques`,
        icon: '⚡',
        group: 'Flows',
        action: () => this.router.navigateByUrl('/gali-v3/builder'),
        keywords: `${f.name} flow`,
      });
    });

    // Acciones rápidas Gali
    items.push(
      { id: 'gali-renueva', title: 'Renovar mis creatives', subtitle: 'Gali genera 3 variaciones del Collar GPS', icon: '✦', group: 'Acciones Gali', action: () => { this.chatSvc.send('Renueva los creatives del Collar GPS'); this.router.navigateByUrl('/gali-v3/proyecto/collar-gps-2026'); }, keywords: 'renovar creatives gali variaciones' },
      { id: 'gali-escala', title: 'Escalar mi mejor campaña', subtitle: 'Aplica el playbook del p75 LATAM', icon: '✦', group: 'Acciones Gali', action: () => { this.chatSvc.send('Escala la campaña que va mejor'); this.router.navigateByUrl('/gali-v3/dropi/campanas'); }, keywords: 'escalar campaña roas escala' },
      { id: 'gali-reporte', title: 'Generar reporte semanal por WhatsApp', subtitle: 'Resumen al WA todos los domingos 8pm', icon: '✦', group: 'Acciones Gali', action: () => { this.chatSvc.send('Genera un reporte semanal por WhatsApp'); this.router.navigateByUrl('/gali-v3/mercado'); }, keywords: 'reporte whatsapp wa semanal' },
    );

    return items;
  });

  filtered = computed<PaletteItem[]>(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.allItems().slice(0, 12);
    return this.allItems().filter(it =>
      it.title.toLowerCase().includes(q) ||
      it.subtitle.toLowerCase().includes(q) ||
      it.keywords.toLowerCase().includes(q),
    );
  });

  grouped = computed<Array<{ name: string; items: PaletteItem[] }>>(() => {
    const groups: Record<string, PaletteItem[]> = {};
    this.filtered().forEach(it => {
      if (!groups[it.group]) groups[it.group] = [];
      groups[it.group].push(it);
    });
    return Object.entries(groups).map(([name, items]) => ({ name, items }));
  });

  flatFiltered = computed(() => this.filtered());

  constructor() {
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.inputEl?.nativeElement?.focus());
      }
    });
    // Reset selection when query changes
    effect(() => {
      this.query();
      this.selectedIdx.set(0);
    });

    window.addEventListener('gali:open-cmdk', this.handleOpenCmdk);
  }

  ngOnDestroy(): void {
    window.removeEventListener('gali:open-cmdk', this.handleOpenCmdk);
  }

  private handleOpenCmdk = (): void => {
    this.open.set(true);
    this.query.set('');
    this.selectedIdx.set(0);
  };

  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    const isMeta = ev.metaKey || ev.ctrlKey;
    if (isMeta && ev.key === 'k') {
      ev.preventDefault();
      this.toggle();
      return;
    }
    if (isMeta && ev.key === 'm') {
      ev.preventDefault();
      this.router.navigateByUrl('/gali-v3/mapa');
      this.close();
      return;
    }
    if (isMeta && ev.key === 'j') {
      ev.preventDefault();
      this.rpanelSvc.toggle();
      return;
    }
    if (!this.open()) return;
    if (ev.key === 'Escape') { this.close(); return; }
    if (ev.key === 'ArrowDown') { ev.preventDefault(); this.move(1); return; }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); this.move(-1); return; }
    if (ev.key === 'Enter') { ev.preventDefault(); this.activate(this.selectedIdx()); return; }
  }

  toggle() {
    this.open.update(v => !v);
    if (this.open()) { this.query.set(''); this.selectedIdx.set(0); }
  }

  close() {
    this.open.set(false);
  }

  move(delta: number) {
    const max = this.flatFiltered().length;
    if (!max) return;
    this.selectedIdx.set((this.selectedIdx() + delta + max) % max);
  }

  activate(idx: number) {
    const item = this.flatFiltered()[idx];
    if (!item) return;
    item.action();
    this.close();
  }
}
