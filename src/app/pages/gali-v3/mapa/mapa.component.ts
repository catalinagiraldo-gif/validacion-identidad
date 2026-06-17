import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BusinessMapService } from '../../../services/gali-v3/business-map.service';
import { BacklinksService } from '../../../services/gali-v3/backlinks.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

@Component({
  selector: 'app-gali-v3-mapa',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class GaliV3MapaComponent {
  private mapSvc = inject(BusinessMapService);
  private backlinksSvc = inject(BacklinksService);
  private router = inject(Router);

  zonas = this.mapSvc.zonas;
  hoveredNodeId = signal<string | null>(null);
  editMode = signal(false);

  // DnD state
  draggingNodeId = signal<string | null>(null);
  draggingFromZone = signal<string | null>(null);
  draggingFromIdx = signal<number | null>(null);
  dragOverZone = signal<string | null>(null);
  dragOverIdx = signal<number | null>(null);

  // Para "estás aquí", usamos la última ruta de Gali v3 que NO sea /mapa
  private lastNonMapUrl = signal<string>(this.router.url.includes('/mapa') ? '/gali-v3' : this.router.url);

  activeNodeId = computed(() => this.mapSvc.findActiveNodeId(this.lastNonMapUrl()));

  highlightedNodes = computed<Set<string>>(() => {
    const id = this.hoveredNodeId();
    if (!id) return new Set();
    const set = new Set<string>([id]);
    this.mapSvc.edgesTouching(id).forEach(e => {
      set.add(e.from);
      set.add(e.to);
    });
    return set;
  });

  activeNode = computed(() => {
    const id = this.activeNodeId();
    return id ? this.mapSvc.getNodo(id) : null;
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        if (!e.urlAfterRedirects.includes('/mapa')) {
          this.lastNonMapUrl.set(e.urlAfterRedirects);
        }
      });
  }

  nodosFor(zonaId: string) {
    return this.mapSvc.nodosByZona(zonaId);
  }

  onHover(nodeId: string | null) {
    this.hoveredNodeId.set(nodeId);
  }

  go(route: string, nodeId?: string, label?: string) {
    if (this.editMode()) return;
    if (nodeId === 'n-proyecto' || label?.includes('Collar GPS')) {
      this.backlinksSvc.select('collar-gps', label || 'Collar GPS');
    } else if (nodeId?.startsWith('n-proveedor')) {
      this.backlinksSvc.select('petstore', label || 'Proveedor');
    }
    this.router.navigateByUrl(route);
  }

  isActive(nodeId: string): boolean {
    return this.activeNodeId() === nodeId;
  }

  isHighlighted(nodeId: string): boolean {
    return this.highlightedNodes().has(nodeId);
  }

  toggleEdit() {
    this.editMode.update(v => !v);
  }

  resetOrder() {
    this.mapSvc.resetOrder();
  }

  // --- DnD ---

  onNodeDragStart(ev: DragEvent, nodeId: string, zonaId: string, idx: number) {
    if (!this.editMode()) {
      ev.preventDefault();
      return;
    }
    this.draggingNodeId.set(nodeId);
    this.draggingFromZone.set(zonaId);
    this.draggingFromIdx.set(idx);
    ev.dataTransfer?.setData('text/plain', nodeId);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }

  onNodeDragOver(ev: DragEvent, zonaId: string, idx: number) {
    if (!this.editMode() || !this.draggingNodeId()) return;
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
    this.dragOverZone.set(zonaId);
    this.dragOverIdx.set(idx);
  }

  onZoneDragOver(ev: DragEvent, zonaId: string) {
    if (!this.editMode() || !this.draggingNodeId()) return;
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
    this.dragOverZone.set(zonaId);
  }

  onDrop(ev: DragEvent, targetZonaId: string, targetIdx: number) {
    ev.preventDefault();
    const nodeId = this.draggingNodeId();
    const fromZone = this.draggingFromZone();
    const fromIdx = this.draggingFromIdx();
    if (!nodeId || !fromZone || fromIdx === null) return;

    if (fromZone === targetZonaId) {
      // Reorder dentro de la misma zona
      let target = targetIdx;
      if (target > fromIdx) target--;
      this.mapSvc.reorderInZone(fromZone, fromIdx, target);
    } else {
      // Mover entre zonas
      this.mapSvc.moveToZone(nodeId, targetZonaId);
    }
    this.onDragEnd();
  }

  onZoneDrop(ev: DragEvent, targetZonaId: string) {
    // Drop al final de la zona (después del último nodo)
    const nodos = this.nodosFor(targetZonaId);
    this.onDrop(ev, targetZonaId, nodos.length);
  }

  onDragEnd() {
    this.draggingNodeId.set(null);
    this.draggingFromZone.set(null);
    this.draggingFromIdx.set(null);
    this.dragOverZone.set(null);
    this.dragOverIdx.set(null);
  }
}
