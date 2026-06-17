import { Injectable, computed, signal } from '@angular/core';

export interface Backlink {
  tipo_relacion: string;
  label: string;
  count: number;
  target_route: string;
  estado: 'ok' | 'atencion' | 'critico';
}

const BACKLINKS_BY_ENTITY: Record<string, Backlink[]> = {
  'collar-gps': [
    { tipo_relacion: 'campaña', label: 'campañas activas lo usan', count: 2, target_route: '/gali-v3/dropi/campanas', estado: 'ok' },
    { tipo_relacion: 'proveedor', label: 'proveedor lo suministra', count: 1, target_route: '/gali-v3/dropi/proveedores', estado: 'ok' },
    { tipo_relacion: 'pedido', label: 'pedidos activos hoy', count: 47, target_route: '/gali-v3/dropi/pedidos', estado: 'atencion' },
    { tipo_relacion: 'receta', label: 'recetas lo monitoran', count: 3, target_route: '/gali-v3/builder', estado: 'ok' },
    { tipo_relacion: 'landing', label: 'landing publicada', count: 1, target_route: '/gali-v3/artifact/landing/land-1', estado: 'ok' },
  ],
  'petstore': [
    { tipo_relacion: 'producto', label: 'productos en catálogo', count: 12, target_route: '/gali-v3/dropi/catalogo', estado: 'ok' },
    { tipo_relacion: 'pedido', label: 'pedidos este mes', count: 47, target_route: '/gali-v3/dropi/pedidos', estado: 'ok' },
    { tipo_relacion: 'receta', label: 'alertas de stock activas', count: 1, target_route: '/gali-v3/builder', estado: 'ok' },
  ],
};

@Injectable({ providedIn: 'root' })
export class BacklinksService {
  readonly selectedEntity = signal<string | null>(null);
  readonly entityLabel = signal<string>('');

  readonly backlinks = computed(() => {
    const id = this.selectedEntity();
    if (!id) return [];
    return BACKLINKS_BY_ENTITY[id] ?? [];
  });

  select(entityId: string, label: string) {
    this.selectedEntity.set(entityId);
    this.entityLabel.set(label);
  }

  clear() {
    this.selectedEntity.set(null);
    this.entityLabel.set('');
  }
}
