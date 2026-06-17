import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export type MaestriaNivel = 'aprendiz' | 'operador' | 'estratega';

export interface MaestriaPersona {
  nivel: MaestriaNivel;
  label: string;
  tagline: string;
  densidad: 'baja' | 'media' | 'alta';
  verbosidad: 'didactica' | 'conversacional' | 'telegrafica';
  controlesAvanzados: boolean;
  toneCopy: string;
}

export const MAESTRIA_PERSONAS: Record<MaestriaNivel, MaestriaPersona> = {
  aprendiz: {
    nivel: 'aprendiz',
    label: 'Aprendiz',
    tagline: 'Estás aprendiendo el oficio. Gali te acompaña y explica.',
    densidad: 'baja',
    verbosidad: 'didactica',
    controlesAvanzados: false,
    toneCopy: 'cálido, paciente, explicativo',
  },
  operador: {
    nivel: 'operador',
    label: 'Operador',
    tagline: 'Ya tienes ritmo. Gali sugiere y tú decides.',
    densidad: 'media',
    verbosidad: 'conversacional',
    controlesAvanzados: false,
    toneCopy: 'colaborativo, directo',
  },
  estratega: {
    nivel: 'estratega',
    label: 'Estratega',
    tagline: 'Llevas la operación. Gali es tu co-piloto, no tu tutor.',
    densidad: 'alta',
    verbosidad: 'telegrafica',
    controlesAvanzados: true,
    toneCopy: 'telegráfico, denso, operativo',
  },
};

interface VoiceVariants {
  aprendiz: string;
  operador: string;
  estratega: string;
}

interface VoteRecord {
  source: string;
  weight: number;
  timestamp: number;
}

const STORAGE_KEY = 'gali_v2_maestria_nivel';
const VOTES_KEY = 'gali_v2_maestria_votes';

@Injectable({ providedIn: 'root' })
export class MaestriaService {
  private nivelSubject = new BehaviorSubject<MaestriaNivel>(this.loadNivel());
  readonly nivel$: Observable<MaestriaNivel> = this.nivelSubject.asObservable();
  readonly persona$: Observable<MaestriaPersona> = this.nivel$.pipe(
    map(n => MAESTRIA_PERSONAS[n]),
  );

  private votes: VoteRecord[] = this.loadVotes();

  get nivel(): MaestriaNivel {
    return this.nivelSubject.value;
  }

  get persona(): MaestriaPersona {
    return MAESTRIA_PERSONAS[this.nivel];
  }

  setNivel(nivel: MaestriaNivel) {
    if (nivel === this.nivelSubject.value) return;
    this.nivelSubject.next(nivel);
    try {
      localStorage.setItem(STORAGE_KEY, nivel);
    } catch {}
  }

  /**
   * Otros servicios votan por una promoción cuando detectan señales de competencia.
   * Cuando el peso acumulado supera 100, se sugiere subir de nivel (no automático).
   */
  vote(source: string, weight: number) {
    this.votes.push({ source, weight, timestamp: Date.now() });
    this.persistVotes();
  }

  /**
   * Reformula el mismo mensaje según el nivel.
   * Acepta tres variantes literales o un texto base que será adaptado por reglas suaves.
   */
  voice(variants: VoiceVariants | string): string {
    if (typeof variants === 'string') {
      return this.applyRules(variants);
    }
    return variants[this.nivel];
  }

  /**
   * Versión observable de voice — útil en templates con async pipe.
   */
  voice$(variants: VoiceVariants | string): Observable<string> {
    return this.nivel$.pipe(
      map(() => this.voice(variants)),
    );
  }

  private applyRules(base: string): string {
    switch (this.nivel) {
      case 'aprendiz':
        return base;
      case 'operador':
        return base.replace(/Te explico:\s*/gi, '').replace(/\s+por si te ayuda\.?/gi, '.');
      case 'estratega':
        return base
          .replace(/Te explico:\s*/gi, '')
          .replace(/Considera\s+/gi, '')
          .replace(/Te sugiero\s+/gi, '')
          .replace(/\s+por si te ayuda\.?/gi, '')
          .replace(/\s+\(.*?\)/g, '');
    }
  }

  private loadNivel(): MaestriaNivel {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'aprendiz' || stored === 'operador' || stored === 'estratega') {
        return stored;
      }
    } catch {}
    return 'aprendiz';
  }

  private loadVotes(): VoteRecord[] {
    try {
      const raw = localStorage.getItem(VOTES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }

  private persistVotes() {
    try {
      localStorage.setItem(VOTES_KEY, JSON.stringify(this.votes));
    } catch {}
  }
}
