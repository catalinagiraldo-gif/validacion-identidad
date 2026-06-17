import { Injectable, computed, signal } from '@angular/core';
import agentesData from '../../../../mocks/gali-v3/agentes-activos.json';
import { AgenteActivo, AgenteEstado } from './types';

const STORAGE_KEY = 'gali_v3_agentes_estado';

@Injectable({ providedIn: 'root' })
export class AgentOrchestratorService {
  private agentes = signal<AgenteActivo[]>(
    this.mergeStored((agentesData as { agentes: AgenteActivo[] }).agentes),
  );

  readonly activos = computed(() => this.agentes());
  readonly countActivos = computed(() =>
    this.agentes().filter(a => a.estado === 'activo' || a.estado === 'esperando').length,
  );

  readonly expandedReasoning = signal<Set<string>>(new Set());

  toggleReasoning(id: string) {
    const next = new Set(this.expandedReasoning());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.expandedReasoning.set(next);
  }

  isReasoningExpanded(id: string): boolean {
    return this.expandedReasoning().has(id);
  }

  setEstado(id: string, estado: AgenteEstado) {
    this.agentes.update(list =>
      list.map(a => (a.id === id ? { ...a, estado } : a)),
    );
    this.persist();
  }

  togglePausa(id: string) {
    const agent = this.agentes().find(a => a.id === id);
    if (!agent) return;
    this.setEstado(id, agent.estado === 'pausa' ? 'activo' : 'pausa');
  }

  activarAgenteLogistico() {
    const exists = this.agentes().some(a => a.id === 'ag-vigilante-log');
    if (exists) {
      this.setEstado('ag-vigilante-log', 'activo');
      return;
    }
    this.agentes.update(list => [
      {
        id: 'ag-vigilante-log',
        nombre: 'Vigilante logístico',
        icono: '🚛',
        estado: 'activo',
        progreso_texto: 'Iniciando reclamo por 3 pedidos en novedad…',
        confianza: 0.91,
        memoria_usada: ['Collar GPS', 'Cali', 'Coordinadora'],
        iniciado_hace: 'ahora',
        marketplace_id: 'ag-2',
      },
      ...list,
    ]);
    this.persist();
  }

  confianzaTone(c: number): 'sage' | 'amber' | 'rust' {
    if (c >= 0.85) return 'sage';
    if (c >= 0.7) return 'amber';
    return 'rust';
  }

  private mergeStored(base: AgenteActivo[]): AgenteActivo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const stored = JSON.parse(raw) as Record<string, AgenteEstado>;
      return base.map(a => (stored[a.id] ? { ...a, estado: stored[a.id] } : a));
    } catch {
      return base;
    }
  }

  private persist() {
    try {
      const map: Record<string, AgenteEstado> = {};
      this.agentes().forEach(a => { map[a.id] = a.estado; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {}
  }
}
