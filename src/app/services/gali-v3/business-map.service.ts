import { Injectable, signal } from '@angular/core';
import mapData from '../../../../mocks/gali-v3/business-map.json';

export interface MapZona {
  id: string;
  label: string;
  color: string;
  icon: string;
  descripcion: string;
}

export interface MapNodo {
  id: string;
  zona: string;
  label: string;
  subtitle: string;
  icon: string;
  route: string;
  estado: 'ready' | 'active' | 'legacy' | 'soon' | 'available';
  kpi: string;
}

export interface MapEdge {
  from: string;
  to: string;
  label: string;
}

const STORAGE_KEY_ORDER = 'gali_v3_map_order';

@Injectable({ providedIn: 'root' })
export class BusinessMapService {
  readonly zonas = signal<MapZona[]>(mapData.zonas as MapZona[]);
  readonly nodos = signal<MapNodo[]>(this.loadNodosWithOrder());
  readonly edges = signal<MapEdge[]>(mapData.edges as MapEdge[]);

  /** Reordena nodos dentro de una zona */
  reorderInZone(zonaId: string, fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;
    const all = [...this.nodos()];
    const inZone = all.filter(n => n.zona === zonaId);
    if (fromIdx < 0 || fromIdx >= inZone.length) return;
    if (toIdx < 0 || toIdx >= inZone.length) return;
    const [moved] = inZone.splice(fromIdx, 1);
    inZone.splice(toIdx, 0, moved);
    // Reemplazar los nodos de la zona en el array completo
    let zoneIndex = 0;
    const next = all.map(n => (n.zona === zonaId ? inZone[zoneIndex++] : n));
    this.nodos.set(next);
    this.persistOrder();
  }

  /** Mueve un nodo de una zona a otra */
  moveToZone(nodeId: string, targetZonaId: string) {
    const all = [...this.nodos()];
    const idx = all.findIndex(n => n.id === nodeId);
    if (idx === -1) return;
    if (all[idx].zona === targetZonaId) return;
    all[idx] = { ...all[idx], zona: targetZonaId };
    this.nodos.set(all);
    this.persistOrder();
  }

  resetOrder() {
    this.nodos.set(mapData.nodos as MapNodo[]);
    try { localStorage.removeItem(STORAGE_KEY_ORDER); } catch {}
  }

  private loadNodosWithOrder(): MapNodo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ORDER);
      if (raw) {
        const saved = JSON.parse(raw) as Array<{ id: string; zona: string }>;
        const original = mapData.nodos as MapNodo[];
        // Aplicar el orden guardado pero preservar todos los nodos del config
        const byId = new Map(original.map(n => [n.id, n]));
        const ordered: MapNodo[] = [];
        saved.forEach(s => {
          const node = byId.get(s.id);
          if (node) {
            ordered.push({ ...node, zona: s.zona });
            byId.delete(s.id);
          }
        });
        // Append nodos nuevos que no estaban en el storage
        byId.forEach(n => ordered.push(n));
        return ordered;
      }
    } catch {}
    return mapData.nodos as MapNodo[];
  }

  private persistOrder() {
    try {
      const minimal = this.nodos().map(n => ({ id: n.id, zona: n.zona }));
      localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(minimal));
    } catch {}
  }

  nodosByZona(zonaId: string): MapNodo[] {
    return this.nodos().filter(n => n.zona === zonaId);
  }

  /** Determina cuál nodo coincide con la URL actual */
  findActiveNodeId(url: string): string | null {
    // Match más específico primero (rutas largas)
    const sorted = [...this.nodos()].sort((a, b) => b.route.length - a.route.length);
    const match = sorted.find(n => url.includes(n.route) && n.route !== '/gali-v3');
    if (match) return match.id;
    // Fallback: si estamos exactamente en /gali-v3
    if (url === '/gali-v3' || url === '/gali-v3/') return 'n-inicio';
    return null;
  }

  /** Aristas que tocan un nodo dado (origen o destino) */
  edgesTouching(nodeId: string): MapEdge[] {
    return this.edges().filter(e => e.from === nodeId || e.to === nodeId);
  }

  getNodo(id: string): MapNodo | undefined {
    return this.nodos().find(n => n.id === id);
  }

  getZona(id: string): MapZona | undefined {
    return this.zonas().find(z => z.id === id);
  }
}
