import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SenalTipo = 'campana' | 'novedad' | 'oportunidad' | 'memoria';
export type SenalUrgencia = 'alta' | 'media' | 'baja';

export interface Senal {
  id: string;
  tipo: SenalTipo;
  urgencia: SenalUrgencia;
  titulo: string;
  descripcion: string;
  metrica?: string;
  accionSugerida?: string;
  contexto?: string;
  timestamp: number;
  visto: boolean;
}

const MOCK_SENALES: Omit<Senal, 'timestamp' | 'visto'>[] = [
  {
    id: 'sn-001',
    tipo: 'campana',
    urgencia: 'media',
    titulo: 'Campaña Collar GPS — 72h en curso',
    descripcion: 'ROAS 2.8x ↑ vs 2.1x del perfil promedio. El creative B duplica al A en CTR.',
    metrica: '+ $42 / día',
    accionSugerida: 'Pausar creative A',
    contexto: 'Meta Ads · Bogotá',
  },
  {
    id: 'sn-002',
    tipo: 'novedad',
    urgencia: 'alta',
    titulo: '3 pedidos sin entregar > 5 días',
    descripcion: 'Cliente Andrea M. ya escribió 2 veces. Te sugiero responder hoy.',
    accionSugerida: 'Ver novedades',
    contexto: 'Pedidos · Medellín',
  },
  {
    id: 'sn-003',
    tipo: 'oportunidad',
    urgencia: 'media',
    titulo: 'Masajeador cervical entrando en Cali',
    descripcion: 'Curva de entrada — 14 días antes de saturación. ROAS perfil similar: 3.1x.',
    accionSugerida: 'Crear proyecto',
    contexto: 'Catálogo',
  },
];

@Injectable({ providedIn: 'root' })
export class SenalesService {
  private senalesSubject = new BehaviorSubject<Senal[]>(
    MOCK_SENALES.map((s, i) => ({
      ...s,
      timestamp: Date.now() - (i + 1) * 1000 * 60 * 17,
      visto: false,
    })),
  );

  readonly senales$: Observable<Senal[]> = this.senalesSubject.asObservable();

  get senales(): Senal[] {
    return this.senalesSubject.value;
  }

  noVistas(): Senal[] {
    return this.senales.filter(s => !s.visto);
  }

  marcarVisto(id: string) {
    this.senalesSubject.next(
      this.senales.map(s => (s.id === id ? { ...s, visto: true } : s)),
    );
  }

  marcarTodasVistas() {
    this.senalesSubject.next(this.senales.map(s => ({ ...s, visto: true })));
  }

  push(senal: Omit<Senal, 'timestamp' | 'visto' | 'id'>) {
    const nueva: Senal = {
      ...senal,
      id: `sn-${Date.now()}`,
      timestamp: Date.now(),
      visto: false,
    };
    this.senalesSubject.next([nueva, ...this.senales]);
  }
}
