import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GaliFlowService, FlowGraph } from '../../../services/gali-v3/flow.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

interface DragPayload {
  source: 'palette' | 'canvas';
  blockId: string;
  type: 'trigger' | 'action' | 'condition';
  fromIndex?: number;
}

@Component({
  selector: 'app-gali-v3-builder',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class GaliV3BuilderComponent {
  private flowSvc = inject(GaliFlowService);
  private router = inject(Router);

  showNodeCanvas = signal(false);
  recipeCompartidaToast = signal<boolean>(false);

  // ✦ Compartir recipe al marketplace de comunidad (Fase 3)
  compartirRecipe() {
    const flow = this.activeFlow();
    if (!flow || !flow.nodes.length) return;
    // Mock: enviar al marketplace. En engine real → POST /api/gali/marketplace/publish
    this.recipeCompartidaToast.set(true);
    setTimeout(() => this.recipeCompartidaToast.set(false), 6000);
  }

  // ✦ Cross-view: navegar al Constructor con el output de la recipe como base
  guardarOutputComoBloque() {
    const flow = this.activeFlow();
    if (!flow) return;
    // Inferir fuente a partir de los nodos de la recipe
    const tieneAds = flow.nodes.some(n =>
      typeof n.blockId === 'string' && /meta|tiktok|google|ads|roas|ctr|campan/i.test(n.blockId),
    );
    const tienePedidos = flow.nodes.some(n =>
      typeof n.blockId === 'string' && /pedido|orden|novedad|entrega/i.test(n.blockId),
    );
    const fuente = tieneAds ? 'campanas' : tienePedidos ? 'pedidos' : null;
    const prompt = `Convierte el resultado de la recipe "${flow.name}" en un bloque visual para mi lienzo`;
    this.router.navigate(['/gali-v3/bloque-builder'], {
      queryParams: {
        ...(fuente ? { fuente } : {}),
        prompt,
        origen: 'builder',
      },
    });
  }

  catalog = this.flowSvc.catalog;
  flows = this.flowSvc.flows;
  isExecuting = this.flowSvc.isExecuting;
  executionLog = this.flowSvc.executionLog;

  activeFlowId = signal<string>(this.flows()[0]?.id ?? '');
  selectedCategory = signal<'triggers' | 'actions' | 'conditions' | 'api'>('triggers');

  // Drag-and-drop state
  draggingId = signal<string | null>(null);
  dragOverIndex = signal<number | null>(null);
  isDragFromPalette = signal<boolean>(false);
  private currentPayload: DragPayload | null = null;

  activeFlow = computed(() => this.flows().find(f => f.id === this.activeFlowId()));

  selectFlow(id: string) {
    this.activeFlowId.set(id);
  }

  createBlank() {
    const f = this.flowSvc.createBlankFlow();
    this.activeFlowId.set(f.id);
  }

  addBlock(blockId: string) {
    const flowId = this.activeFlowId();
    if (!flowId) return;
    const cat = this.selectedCategory();
    const type = cat === 'triggers' ? 'trigger' : cat === 'actions' ? 'action' : 'condition';
    this.flowSvc.addNode(flowId, type, blockId);
  }

  // API blocks se agregan como acciones (consumen el endpoint en el flow)
  addApiBlock(apiId: string) {
    const flowId = this.activeFlowId();
    if (!flowId) return;
    this.flowSvc.addNode(flowId, 'action', apiId);
  }

  removeBlock(nodeId: string) {
    const flowId = this.activeFlowId();
    if (!flowId) return;
    this.flowSvc.removeNode(flowId, nodeId);
  }

  execute() {
    const flowId = this.activeFlowId();
    if (!flowId) return;
    this.flowSvc.execute(flowId);
  }

  // --- Drag & Drop handlers ---

  onPaletteDragStart(ev: DragEvent, blockId: string) {
    const cat = this.selectedCategory();
    const type = cat === 'triggers' ? 'trigger' : cat === 'actions' ? 'action' : 'condition';
    this.currentPayload = { source: 'palette', blockId, type };
    this.isDragFromPalette.set(true);
    ev.dataTransfer?.setData('text/plain', JSON.stringify(this.currentPayload));
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'copy';
  }

  onNodeDragStart(ev: DragEvent, nodeId: string, index: number, type: 'trigger' | 'action' | 'condition', blockId: string) {
    this.currentPayload = { source: 'canvas', blockId, type, fromIndex: index };
    this.draggingId.set(nodeId);
    this.isDragFromPalette.set(false);
    ev.dataTransfer?.setData('text/plain', JSON.stringify(this.currentPayload));
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }

  onDragEnd() {
    this.draggingId.set(null);
    this.dragOverIndex.set(null);
    this.isDragFromPalette.set(false);
    this.currentPayload = null;
  }

  onSlotDragOver(ev: DragEvent, index: number) {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = this.isDragFromPalette() ? 'copy' : 'move';
    this.dragOverIndex.set(index);
  }

  onSlotDragLeave() {
    this.dragOverIndex.set(null);
  }

  onSlotDrop(ev: DragEvent, dropIndex: number) {
    ev.preventDefault();
    const payload = this.currentPayload;
    this.dragOverIndex.set(null);
    if (!payload) return;
    const flowId = this.activeFlowId();
    if (!flowId) return;

    if (payload.source === 'palette') {
      this.flowSvc.insertNode(flowId, payload.type, payload.blockId, dropIndex);
    } else if (payload.source === 'canvas' && payload.fromIndex !== undefined) {
      // Si dropIndex es después de fromIndex, ajustar porque al sacar el item el resto se corre
      let target = dropIndex;
      if (target > payload.fromIndex) target--;
      this.flowSvc.reorderNode(flowId, payload.fromIndex, target);
    }
    this.onDragEnd();
  }

  onCanvasDragOver(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = this.isDragFromPalette() ? 'copy' : 'move';
  }

  onCanvasDrop(ev: DragEvent) {
    // Drop al final del canvas (después del último nodo)
    ev.preventDefault();
    const flow = this.activeFlow();
    if (!flow) return;
    this.onSlotDrop(ev, flow.nodes.length);
  }
}
