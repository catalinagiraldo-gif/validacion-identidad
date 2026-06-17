import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlockId, BlockSize, BLOCK_REGISTRY } from './block-registry';
import { LayoutItem, STARTER_PACKS, StarterPack } from './starter-packs';
import { MaestriaService } from '../gali-v2/maestria.service';

const KEY_LAYOUT = 'gali_v3_canvas_layout';
const KEY_VISTAS = 'gali_v3_canvas_vistas';

export interface VistaGuardada {
  id: string;
  nombre: string;
  prompt: string;
  layout: LayoutItem[];
  guardadaEn: number;
}

export interface PropuestaLayout {
  prompt: string;
  layout: LayoutItem[];
  explicacion: string;
}

@Injectable({ providedIn: 'root' })
export class CanvasService {
  private maestria = inject(MaestriaService);

  private layoutSubject: BehaviorSubject<LayoutItem[]>;
  readonly layout$: Observable<LayoutItem[]>;

  private pendingSubject = new BehaviorSubject<PropuestaLayout | null>(null);
  readonly pending$ = this.pendingSubject.asObservable();

  private vistasSubject: BehaviorSubject<VistaGuardada[]>;
  readonly vistas$: Observable<VistaGuardada[]>;

  constructor() {
    this.layoutSubject = new BehaviorSubject<LayoutItem[]>(this.loadLayout());
    this.layout$ = this.layoutSubject.asObservable();
    this.vistasSubject = new BehaviorSubject<VistaGuardada[]>(this.loadVistas());
    this.vistas$ = this.vistasSubject.asObservable();
  }

  get pending(): PropuestaLayout | null { return this.pendingSubject.value; }
  get vistas(): VistaGuardada[] { return this.vistasSubject.value; }

  get layout(): LayoutItem[] {
    return this.layoutSubject.value;
  }

  apply(packId: StarterPack['id']) {
    const pack = STARTER_PACKS.find(p => p.id === packId);
    if (!pack) return;
    this.set(pack.layout);
  }

  applyForCurrentNivel() {
    const nivel = this.maestria.nivel;
    const packId: StarterPack['id'] =
      nivel === 'aprendiz' ? 'primer-dia' :
      nivel === 'estratega' ? 'centro-mando' :
      'operacion-diaria';
    this.apply(packId);
  }

  set(items: LayoutItem[]) {
    this.layoutSubject.next([...items]);
    this.persist();
  }

  addBlock(blockId: BlockId, atIndex?: number) {
    const manifest = BLOCK_REGISTRY[blockId];
    if (!manifest) return;
    if (this.layout.some(it => it.blockId === blockId)) return; // sin duplicados v1
    const newItem: LayoutItem = { blockId, size: manifest.defaultSize };
    const next = [...this.layout];
    if (typeof atIndex === 'number' && atIndex >= 0 && atIndex <= next.length) {
      next.splice(atIndex, 0, newItem);
    } else {
      next.push(newItem);
    }
    this.set(next);
  }

  removeBlock(blockId: BlockId) {
    this.set(this.layout.filter(it => it.blockId !== blockId));
  }

  resizeBlock(blockId: BlockId, size: BlockSize) {
    this.set(this.layout.map(it => it.blockId === blockId ? { ...it, size } : it));
  }

  reorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const next = [...this.layout];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    this.set(next);
  }

  reset() {
    this.set([]);
  }

  hasLayout(): boolean {
    return this.layout.length > 0;
  }

  private persist() {
    try { localStorage.setItem(KEY_LAYOUT, JSON.stringify(this.layout)); } catch {}
  }

  // --- Composición conversacional (F6) ---

  /**
   * Detecta si un prompt del usuario es una petición de layout
   * (vs una pregunta normal para Gali).
   */
  static esPromptDeLayout(texto: string): boolean {
    const t = texto.toLowerCase().trim();
    const triggers = [
      'arma mi', 'arma el', 'arma un',
      'compón', 'compon', 'hazme',
      'muéstrame mi', 'muestrame mi',
      'qué necesito', 'que necesito',
      'mi día', 'mi semana', 'mi mes',
      'centro de mando',
      'subir ventas', 'enfoque en',
    ];
    return triggers.some(k => t.includes(k));
  }

  proponerDesdePrompt(prompt: string): PropuestaLayout {
    const t = prompt.toLowerCase();
    let layout: LayoutItem[];
    let explicacion: string;

    if (/(día|hoy|mañana|jornada)/.test(t)) {
      layout = [
        { blockId: 'pedidos',         size: '3x2' },
        { blockId: 'novedades',       size: '2x1' },
        { blockId: 'cartera',         size: '1x1' },
        { blockId: 'misiones',        size: '1x1' },
      ];
      explicacion = 'Para arrancar el día puse pedidos arriba, novedades a la derecha, y dejé cartera + tu misión activa al alcance.';
    } else if (/(ventas|roas|escala|crec|métric|metric)/.test(t)) {
      layout = [
        { blockId: 'metricas',         size: '3x1' },
        { blockId: 'proyecto-activo',  size: '2x2' },
        { blockId: 'productos',        size: '2x2' },
        { blockId: 'landings',         size: '2x1' },
      ];
      explicacion = 'Para subir ventas armé un centro con métricas arriba, tu proyecto activo en foco, y productos/landings al lado para iterar.';
    } else if (/(semana|estrateg|plan)/.test(t)) {
      layout = [
        { blockId: 'metricas',         size: '3x1' },
        { blockId: 'pedidos',          size: '2x2' },
        { blockId: 'novedades',        size: '1x1' },
        { blockId: 'cartera',          size: '1x1' },
        { blockId: 'integraciones',    size: '2x1' },
        { blockId: 'landings',         size: '2x1' },
        { blockId: 'memoria',          size: 'full' },
      ];
      explicacion = 'Vista de semana: métricas arriba, operación al centro, integraciones + landings, y memoria abajo para revisar decisiones.';
    } else if (/(enfoc|foco|concentr)/.test(t)) {
      layout = [
        { blockId: 'proyecto-activo',  size: 'full' },
        { blockId: 'pedidos',          size: '2x1' },
        { blockId: 'metricas',         size: '2x1' },
      ];
      explicacion = 'Modo enfoque: tu proyecto activo en pantalla completa, con pedidos y métricas como contexto mínimo.';
    } else {
      // fallback: starter pack del nivel actual
      layout = [
        { blockId: 'pedidos',     size: '3x2' },
        { blockId: 'cartera',     size: '1x1' },
        { blockId: 'novedades',   size: '2x1' },
        { blockId: 'misiones',    size: '1x1' },
      ];
      explicacion = 'Te propongo una vista equilibrada — pedidos, cartera, novedades y tu misión.';
    }

    const propuesta: PropuestaLayout = { prompt, layout, explicacion };
    this.pendingSubject.next(propuesta);
    return propuesta;
  }

  descartarPendiente() { this.pendingSubject.next(null); }

  aceptarPendiente(nombre?: string): VistaGuardada | null {
    const p = this.pendingSubject.value;
    if (!p) return null;
    this.set(p.layout);
    const vista: VistaGuardada = {
      id: 'v' + Date.now().toString(36),
      nombre: nombre || p.prompt.slice(0, 36) || 'Vista de Gali',
      prompt: p.prompt,
      layout: p.layout,
      guardadaEn: Date.now(),
    };
    const next = [vista, ...this.vistas].slice(0, 12);
    this.vistasSubject.next(next);
    this.persistVistas(next);
    this.pendingSubject.next(null);
    return vista;
  }

  aplicarVista(vistaId: string) {
    const v = this.vistas.find(x => x.id === vistaId);
    if (v) this.set(v.layout);
  }

  eliminarVista(vistaId: string) {
    const next = this.vistas.filter(v => v.id !== vistaId);
    this.vistasSubject.next(next);
    this.persistVistas(next);
  }

  private loadVistas(): VistaGuardada[] {
    try {
      const raw = localStorage.getItem(KEY_VISTAS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }
  private persistVistas(vistas: VistaGuardada[]) {
    try { localStorage.setItem(KEY_VISTAS, JSON.stringify(vistas)); } catch {}
  }

  private loadLayout(): LayoutItem[] {
    try {
      const raw = localStorage.getItem(KEY_LAYOUT);
      if (raw) return JSON.parse(raw);
    } catch {}
    // Default: pack según nivel actual
    const nivel = this.maestria.nivel;
    const packId: StarterPack['id'] =
      nivel === 'aprendiz' ? 'primer-dia' :
      nivel === 'estratega' ? 'centro-mando' :
      'operacion-diaria';
    return STARTER_PACKS.find(p => p.id === packId)?.layout ?? [];
  }
}
