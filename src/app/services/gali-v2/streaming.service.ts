import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface StreamOptions {
  minMs?: number;
  maxMs?: number;
  jitter?: number;
}

@Injectable({ providedIn: 'root' })
export class GaliStreamingService {
  /**
   * Devuelve un observable que emite el texto progresivo carácter por carácter.
   * Simula el streaming de un LLM con jitter natural.
   */
  stream(text: string, opts: StreamOptions = {}): Observable<string> {
    const { minMs = 22, maxMs = 58, jitter = 0.3 } = opts;
    return new Observable<string>(observer => {
      let i = 0;
      let cancelled = false;
      let timer: any;

      const tick = () => {
        if (cancelled) return;
        if (i >= text.length) {
          observer.next(text);
          observer.complete();
          return;
        }
        i++;
        observer.next(text.slice(0, i));

        // Pausa más larga después de signos de puntuación, simula respiración
        const last = text[i - 1] ?? '';
        let base = minMs + Math.random() * (maxMs - minMs);
        if (/[.,;:!?\n]/.test(last)) base *= 4;
        if (last === ' ') base *= 1.2;
        const variance = base * jitter * (Math.random() - 0.5);
        timer = setTimeout(tick, Math.max(8, base + variance));
      };

      timer = setTimeout(tick, 80);
      return () => { cancelled = true; if (timer) clearTimeout(timer); };
    });
  }
}
