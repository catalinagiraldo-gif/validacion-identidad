import { Injectable, signal } from '@angular/core';
import catalogData from '../../../../mocks/gali-v3/flow-blocks-catalog.json';
import { FlowBlocksCatalog, FlowBlockDef } from './types';

export interface FlowNode {
  id: string;
  blockId: string;
  type: 'trigger' | 'action' | 'condition';
  label: string;
  icon: string;
  color: string;
  config?: Record<string, unknown>;
  x: number;
}

export interface FlowGraph {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
}

const STORAGE_KEY = 'gali_v3_flows';

@Injectable({ providedIn: 'root' })
export class GaliFlowService {
  readonly catalog = catalogData as FlowBlocksCatalog;
  readonly flows = signal<FlowGraph[]>(this.load());
  readonly isExecuting = signal(false);
  readonly executionLog = signal<string[]>([]);

  getBlockDef(type: 'trigger' | 'action' | 'condition', blockId: string): FlowBlockDef | undefined {
    if (type === 'trigger') return this.catalog.triggers.find(b => b.id === blockId);
    if (type === 'action') return this.catalog.actions.find(b => b.id === blockId);
    return this.catalog.conditions.find(b => b.id === blockId);
  }

  createBlankFlow(name = 'Mi automatización'): FlowGraph {
    const graph: FlowGraph = {
      id: `flow-${Date.now()}`,
      name,
      description: '',
      nodes: [],
    };
    this.flows.set([graph, ...this.flows()]);
    this.persist();
    return graph;
  }

  createSeededFlow(): FlowGraph {
    const trigger = this.catalog.triggers.find(t => t.id === 't-ctr-low')!;
    const pausar = this.catalog.actions.find(a => a.id === 'a-pausar-camp')!;
    const wa = this.catalog.actions.find(a => a.id === 'a-notif-wa')!;
    const graph: FlowGraph = {
      id: `flow-${Date.now()}`,
      name: 'Auto-pausa CTR bajo',
      description: 'Si una campaña baja de CTR 2% en 24h, la pausa y te avisa por WhatsApp.',
      nodes: [
        { id: 'n1', blockId: trigger.id, type: 'trigger', label: trigger.label, icon: trigger.icon, color: trigger.color, x: 0 },
        { id: 'n2', blockId: pausar.id, type: 'action', label: pausar.label, icon: pausar.icon, color: pausar.color, x: 1 },
        { id: 'n3', blockId: wa.id, type: 'action', label: wa.label, icon: wa.icon, color: wa.color, x: 2 },
      ],
    };
    this.flows.set([graph, ...this.flows()]);
    this.persist();
    return graph;
  }

  getFlow(id: string): FlowGraph | undefined {
    return this.flows().find(f => f.id === id);
  }

  updateFlow(id: string, patch: Partial<FlowGraph>) {
    this.flows.set(this.flows().map(f => (f.id === id ? { ...f, ...patch } : f)));
    this.persist();
  }

  addNode(flowId: string, type: 'trigger' | 'action' | 'condition', blockId: string) {
    const def = this.getBlockDef(type, blockId);
    if (!def) return;
    const flow = this.getFlow(flowId);
    if (!flow) return;
    const x = flow.nodes.length;
    const node: FlowNode = {
      id: `n-${Date.now()}`,
      blockId,
      type,
      label: def.label,
      icon: def.icon,
      color: def.color,
      x,
    };
    this.updateFlow(flowId, { nodes: [...flow.nodes, node] });
  }

  removeNode(flowId: string, nodeId: string) {
    const flow = this.getFlow(flowId);
    if (!flow) return;
    const nodes = flow.nodes.filter(n => n.id !== nodeId).map((n, i) => ({ ...n, x: i }));
    this.updateFlow(flowId, { nodes });
  }

  /** Reordena un nodo del flow moviéndolo del índice from al índice to */
  reorderNode(flowId: string, fromIndex: number, toIndex: number) {
    const flow = this.getFlow(flowId);
    if (!flow || fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= flow.nodes.length) return;
    if (toIndex < 0 || toIndex >= flow.nodes.length) return;
    const nodes = [...flow.nodes];
    const [moved] = nodes.splice(fromIndex, 1);
    nodes.splice(toIndex, 0, moved);
    const reindexed = nodes.map((n, i) => ({ ...n, x: i }));
    this.updateFlow(flowId, { nodes: reindexed });
  }

  /** Inserta un bloque nuevo en un índice específico de la cadena */
  insertNode(flowId: string, type: 'trigger' | 'action' | 'condition', blockId: string, atIndex: number) {
    const def = this.getBlockDef(type, blockId);
    if (!def) return;
    const flow = this.getFlow(flowId);
    if (!flow) return;
    const node: FlowNode = {
      id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      blockId,
      type,
      label: def.label,
      icon: def.icon,
      color: def.color,
      x: atIndex,
    };
    const nodes = [...flow.nodes];
    nodes.splice(atIndex, 0, node);
    const reindexed = nodes.map((n, i) => ({ ...n, x: i }));
    this.updateFlow(flowId, { nodes: reindexed });
  }

  async execute(flowId: string) {
    const flow = this.getFlow(flowId);
    if (!flow || flow.nodes.length === 0) return;
    this.isExecuting.set(true);
    this.executionLog.set([]);
    for (const node of flow.nodes) {
      await this.tick(`▸ ${node.icon}  ${node.label}...`, 600);
      await this.tick(`  ✓ Hecho`, 320);
    }
    await this.tick(`▸ Flujo completado en ${(flow.nodes.length * 0.92).toFixed(1)}s.`, 250);
    this.isExecuting.set(false);
  }

  private tick(line: string, ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.executionLog.set([...this.executionLog(), line]);
        resolve();
      }, ms);
    });
  }

  private load(): FlowGraph[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    // First-run: include a seeded example
    const trigger = this.catalog.triggers.find(t => t.id === 't-ctr-low')!;
    const pausar = this.catalog.actions.find(a => a.id === 'a-pausar-camp')!;
    const wa = this.catalog.actions.find(a => a.id === 'a-notif-wa')!;
    return [
      {
        id: 'flow-seed-1',
        name: 'Auto-pausa CTR bajo',
        description: 'Si una campaña baja de CTR 2% en 24h, la pausa y te avisa por WhatsApp.',
        nodes: [
          { id: 'n1', blockId: trigger.id, type: 'trigger', label: trigger.label, icon: trigger.icon, color: trigger.color, x: 0 },
          { id: 'n2', blockId: pausar.id, type: 'action', label: pausar.label, icon: pausar.icon, color: pausar.color, x: 1 },
          { id: 'n3', blockId: wa.id, type: 'action', label: wa.label, icon: wa.icon, color: wa.color, x: 2 },
        ],
      },
    ];
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.flows()));
    } catch {}
  }
}
