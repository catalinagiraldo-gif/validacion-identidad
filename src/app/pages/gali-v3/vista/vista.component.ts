import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GaliBusinessService } from '../../../services/gali-v3/business.service';
import { GaliProjectService } from '../../../services/gali-v3/project.service';
import { GaliMarketplaceService } from '../../../services/gali-v3/marketplace.service';
import { GaliSignalsService } from '../../../services/gali-v3/signals.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { GaliBloqueBuilderService } from '../../../services/gali-v3/bloque-builder.service';
import { GaliRightPanelService } from '../../../services/gali-v3/right-panel.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';
import { BlockVigilanteLogisticoComponent } from '../../../components/gali-v3/blocks/block-vigilante-logistico.component';
import { BlockRentabilidadComponent } from '../../../components/gali-v3/blocks/block-rentabilidad.component';

type WidgetId =
  | 'pedidos-dia'
  | 'novedades-pendientes'
  | 'campanas-activas'
  | 'wallet-proyeccion'
  | 'vigilante-logistico'
  | 'rentabilidad-real'
  | 'productos-top'
  | 'flows-activos'
  | 'agentes-trabajando'
  | 'memoria-snapshot'
  | 'senales-criticas';

interface Vista {
  slug: string;
  name: string;
  description: string;
  widgets: WidgetId[];
}

const VISTAS_DEFAULT: Record<string, Vista> = {
  'operacion-hoy': {
    slug: 'operacion-hoy',
    name: 'Mi operación de hoy',
    description: 'Todo lo que importa hoy en una pantalla. Vigilante logístico + P&L + operación diaria.',
    widgets: ['pedidos-dia', 'novedades-pendientes', 'vigilante-logistico', 'rentabilidad-real', 'campanas-activas', 'wallet-proyeccion'],
  },
  'rentabilidad-semana': {
    slug: 'rentabilidad-semana',
    name: 'Rentabilidad semana',
    description: 'Modo Medir — P&L, métricas ROAS, logística y snapshot proveedor.',
    widgets: ['rentabilidad-real', 'campanas-activas', 'vigilante-logistico', 'wallet-proyeccion'],
  },
  'productos-ganadores': {
    slug: 'productos-ganadores',
    name: 'Mis productos ganadores',
    description: 'Productos con ROAS sostenido + flows activos sobre ellos.',
    widgets: ['productos-top', 'campanas-activas', 'flows-activos'],
  },
  'centro-mando': {
    slug: 'centro-mando',
    name: 'Centro de mando',
    description: 'Vista densa para estratega — todo a la vista.',
    widgets: ['pedidos-dia', 'campanas-activas', 'wallet-proyeccion', 'senales-criticas', 'flows-activos', 'agentes-trabajando', 'memoria-snapshot'],
  },
};

const STORAGE_KEY = 'gali_v3_vistas_custom';
const ALL_WIDGETS: Array<{ id: WidgetId; label: string; icon: string }> = [
  { id: 'pedidos-dia', label: 'Pedidos del día', icon: '🛒' },
  { id: 'novedades-pendientes', label: 'Novedades pendientes', icon: '📦' },
  { id: 'campanas-activas', label: 'Campañas activas + ROAS', icon: '📣' },
  { id: 'wallet-proyeccion', label: 'Wallet + proyección', icon: '💰' },
  { id: 'vigilante-logistico', label: 'Vigilante Logístico', icon: '🚛' },
  { id: 'rentabilidad-real', label: 'Rentabilidad Real (P&L)', icon: '💰' },
  { id: 'productos-top', label: 'Productos top', icon: '⚡' },
  { id: 'flows-activos', label: 'Flows automatizando', icon: '🔧' },
  { id: 'agentes-trabajando', label: 'Agentes trabajando', icon: '🤖' },
  { id: 'memoria-snapshot', label: 'Lo que sabe Gali', icon: '🧠' },
  { id: 'senales-criticas', label: 'Señales críticas', icon: '⚠️' },
];

@Component({
  selector: 'app-gali-v3-vista',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent, BlockVigilanteLogisticoComponent, BlockRentabilidadComponent],
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.scss'],
})
export class GaliV3VistaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private businessSvc = inject(GaliBusinessService);
  private projectSvc = inject(GaliProjectService);
  private marketSvc = inject(GaliMarketplaceService);
  private signalsSvc = inject(GaliSignalsService);
  private chatSvc = inject(GaliChatService);
  private bloqueSvc = inject(GaliBloqueBuilderService);
  private rpanelSvc = inject(GaliRightPanelService);

  bloquesCustom = this.bloqueSvc.bloquesGuardados;

  paramSlug = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  isCreating = computed(() => this.paramSlug().get('slug') === 'nueva');

  customVistas = signal<Record<string, Vista>>(this.loadCustom());

  vista = computed<Vista | null>(() => {
    const slug = this.paramSlug().get('slug');
    if (!slug || slug === 'nueva') return null;
    return VISTAS_DEFAULT[slug] ?? this.customVistas()[slug] ?? null;
  });

  snapshot = this.businessSvc.snapshot;
  proyectosActivos = this.projectSvc.proyectosActivos;
  agentesInstalados = this.marketSvc.agentesInstalados;
  signals = this.signalsSvc.active;

  allWidgets = ALL_WIDGETS;
  editing = signal(false);
  newPrompt = signal('');
  generating = signal(false);
  composedWidgets = signal<WidgetId[]>([]);

  format(n: number) { return this.businessSvc.formatCurrency(n); }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug === 'operacion-hoy' || this.route.snapshot.queryParamMap.get('panel') === 'open') {
      this.rpanelSvc.setOpen(true);
    }
  }

  toggleEdit() { this.editing.update(v => !v); }

  toggleWidget(id: WidgetId) {
    const v = this.vista();
    if (!v) return;
    const has = v.widgets.includes(id);
    const next = has ? v.widgets.filter(w => w !== id) : [...v.widgets, id];
    const updated: Record<string, Vista> = { ...this.customVistas(), [v.slug]: { ...v, widgets: next } };
    this.customVistas.set(updated);
    this.persistCustom();
  }

  generateFromPrompt() {
    const prompt = this.newPrompt().trim();
    if (!prompt) return;
    this.generating.set(true);
    this.composedWidgets.set([]);

    // Heurística mock: extraer widgets según el prompt
    const inferred: WidgetId[] = [];
    const p = prompt.toLowerCase();
    if (p.includes('pedido') || p.includes('orden') || p.includes('operac')) inferred.push('pedidos-dia');
    if (p.includes('novedad') || p.includes('logist')) inferred.push('novedades-pendientes');
    if (p.includes('campañ') || p.includes('campan') || p.includes('ads') || p.includes('roas') || p.includes('publicidad')) inferred.push('campanas-activas');
    if (p.includes('wallet') || p.includes('cartera') || p.includes('plata') || p.includes('saldo') || p.includes('proyecc')) inferred.push('wallet-proyeccion');
    if (p.includes('product')) inferred.push('productos-top');
    if (p.includes('flow') || p.includes('automat')) inferred.push('flows-activos');
    if (p.includes('agente')) inferred.push('agentes-trabajando');
    if (p.includes('señal') || p.includes('senal') || p.includes('alerta') || p.includes('riesgo')) inferred.push('senales-criticas');
    if (p.includes('memoria') || p.includes('aprend')) inferred.push('memoria-snapshot');
    if (inferred.length === 0) inferred.push('pedidos-dia', 'campanas-activas', 'wallet-proyeccion');

    // Animar la composición: agregar uno por uno con delay
    let i = 0;
    const tick = () => {
      if (i >= inferred.length) {
        this.generating.set(false);
        return;
      }
      this.composedWidgets.set([...this.composedWidgets(), inferred[i]]);
      i++;
      setTimeout(tick, 480);
    };
    setTimeout(tick, 280);
  }

  saveComposed() {
    const widgets = this.composedWidgets();
    if (!widgets.length) return;
    const slug = `vista-${Date.now()}`;
    const name = this.newPrompt().slice(0, 80) || 'Vista nueva';
    const nuevo: Vista = { slug, name, description: this.newPrompt(), widgets };
    const updated = { ...this.customVistas(), [slug]: nuevo };
    this.customVistas.set(updated);
    this.persistCustom();
    this.chatSvc.send(`Guarda la vista "${name}" y agrégala al menú lateral`);
    this.composedWidgets.set([]);
    this.newPrompt.set('');
  }

  widgetMeta(id: WidgetId) {
    return ALL_WIDGETS.find(w => w.id === id);
  }

  private loadCustom(): Record<string, Vista> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }

  private persistCustom() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customVistas())); } catch {}
  }
}
