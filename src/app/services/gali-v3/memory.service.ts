import { Injectable, signal } from '@angular/core';
import memoryData from '../../../../mocks/gali-v3/gali-memory.json';
import { GaliMemory } from './types';

const STORAGE_KEY = 'gali_v3_memory';

@Injectable({ providedIn: 'root' })
export class GaliMemoryService {
  readonly memory = signal<GaliMemory>(this.load());

  reload() {
    this.memory.set(this.load());
  }

  updateAprendizaje(index: number, text: string) {
    const m = { ...this.memory() };
    m.aprendizajes = [...m.aprendizajes];
    m.aprendizajes[index] = text;
    this.memory.set(m);
    this.persist(m);
  }

  removeAprendizaje(index: number) {
    const m = { ...this.memory() };
    m.aprendizajes = m.aprendizajes.filter((_, i) => i !== index);
    this.memory.set(m);
    this.persist(m);
  }

  addAprendizaje(text: string) {
    const m = { ...this.memory() };
    m.aprendizajes = [...m.aprendizajes, text];
    this.memory.set(m);
    this.persist(m);
  }

  setNivel(nivel: GaliMemory['perfil']['nivel']) {
    const m = { ...this.memory() };
    m.perfil = { ...m.perfil, nivel };
    this.memory.set(m);
    this.persist(m);
  }

  private load(): GaliMemory {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return memoryData as GaliMemory;
  }

  private persist(m: GaliMemory) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
    } catch {}
  }
}
