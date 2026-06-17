import { Injectable, signal, computed } from '@angular/core';
import signalsData from '../../../../mocks/gali-v3/signals.json';
import { Signal, SignalEstadoEjecucion } from './types';
import { CanvasHighlightService } from './canvas-highlight.service';

@Injectable({ providedIn: 'root' })
export class GaliSignalsService {
  readonly signals = signal<Signal[]>((signalsData as { signals: Signal[] }).signals);
  readonly dismissed = signal<Set<string>>(this.loadDismissed());
  readonly expandedReasoning = signal<Set<string>>(new Set());
  readonly executing = signal<Set<string>>(new Set());

  readonly active = computed(() =>
    this.signals().filter(s => !this.dismissed().has(s.id)),
  );

  readonly count = computed(() => this.active().length);

  readonly criticas = computed(() => this.active().filter(s => s.urgencia === 'alta'));

  constructor(private highlightSvc: CanvasHighlightService) {}

  dismiss(id: string) {
    const next = new Set(this.dismissed());
    next.add(id);
    this.dismissed.set(next);
    this.persist();
  }

  toggleReasoning(id: string) {
    const next = new Set(this.expandedReasoning());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.expandedReasoning.set(next);
  }

  isReasoningExpanded(id: string): boolean {
    return this.expandedReasoning().has(id);
  }

  confianzaTone(c: number | undefined): 'sage' | 'amber' | 'rust' {
    const v = c ?? 0.5;
    if (v >= 0.85) return 'sage';
    if (v >= 0.7) return 'amber';
    return 'rust';
  }

  executeSignal(id: string) {
    const sig = this.signals().find(s => s.id === id);
    if (!sig || sig.estado_ejecucion === 'resultado') return;

    this.executing.update(s => new Set(s).add(id));
    this.updateSignal(id, { estado_ejecucion: 'ejecutado' });
    this.highlightSvc.highlight('metricas', 'active');

    setTimeout(() => {
      this.executing.update(s => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
      if (id === 'sig-2') {
        this.updateSignal(id, { estado_ejecucion: 'resultado' });
        this.highlightSvc.highlight('metricas', 'done', '+0.3 ROAS ↑');
      } else {
        this.updateSignal(id, { estado_ejecucion: 'resultado' });
        this.highlightSvc.clear();
      }
    }, 2000);
  }

  private updateSignal(id: string, patch: Partial<Signal>) {
    this.signals.update(list =>
      list.map(s => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  reset() {
    this.dismissed.set(new Set());
    this.persist();
  }

  private loadDismissed(): Set<string> {
    try {
      const raw = localStorage.getItem('gali_v3_signals_dismissed');
      if (raw) return new Set(JSON.parse(raw));
    } catch {}
    return new Set();
  }

  private persist() {
    try {
      localStorage.setItem(
        'gali_v3_signals_dismissed',
        JSON.stringify(Array.from(this.dismissed())),
      );
    } catch {}
  }
}
