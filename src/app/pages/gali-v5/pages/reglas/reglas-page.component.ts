import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface EscalamientoRegla {
  id: string;
  condicion: string;
  accion: string;
  tipo: 'escalar' | 'pausar' | 'rotar' | 'ahorrar' | 'expandir';
  metrica: string;
  umbral: string;
  active: boolean;
  info: string;
}

const ESCALAMIENTO_DEFAULTS: EscalamientoRegla[] = [
  { id: 'e1', condicion: 'ROAS > objetivo × 1.3 por 48h y CPA bajo objetivo', accion: 'Escalar presupuesto +20%', tipo: 'escalar', metrica: 'ROAS', umbral: '>1.3×/48h', active: true, info: 'Regla del 20% — igual que Revealbot. Si ROAS se mantiene, Roax escala cada 48h sin pedir permiso.' },
  { id: 'e2', condicion: 'CTR < 0.8% durante 24h continuas', accion: 'Pausar anuncio + activar creativo de respaldo', tipo: 'pausar', metrica: 'CTR', umbral: '<0.8%/24h', active: true, info: 'Evita gastar plata en un anuncio que no conecta. Roax activa el siguiente creativo del banco.' },
  { id: 'e3', condicion: 'Frecuencia > 3.0 durante 3 días seguidos', accion: 'Rotar creativos automáticamente', tipo: 'rotar', metrica: 'Freq.', umbral: '>3.0/3d', active: false, info: 'Cuando la misma persona ve el anuncio 3+ veces, el CTR colapsa. Rotar refresca la campaña.' },
  { id: 'e4', condicion: 'Hora actual > 22:30 o < 06:00 (dayparting)', accion: 'Pausar pauta hasta las 6am', tipo: 'ahorrar', metrica: 'Hora', umbral: '>22:30', active: false, info: 'Ahorra ~22% en horas con conversión mínima. Muy útil en skincare y hogar.' },
  { id: 'e5', condicion: 'CPA > objetivo × 1.5 por más de 6h', accion: 'Reducir presupuesto 30%', tipo: 'pausar', metrica: 'CPA', umbral: '>1.5×/6h', active: true, info: 'Para la hemorragia antes de que se vuelva crítica. Mejor cortar 30% que pausar todo.' },
  { id: 'e6', condicion: 'CPM sube >40% en 3 días (saturación)', accion: 'Expandir audiencia lookalike 1% → 2%', tipo: 'expandir', metrica: 'CPM', umbral: '>40%/3d', active: false, info: 'Cuando la audiencia se satura, ampliarla 1% baja el CPM sin perder calidad.' },
];

export interface GaliRegla {
  id: string;
  agent: 'Chatea Pro' | 'Roax' | 'Vigilante';
  agentColor: string;
  ifLabel: string;
  thenLabel: string;
  ejemplo: string;
  active: boolean;
  scope: string;
}

const STORAGE_KEY = 'gali_reglas_state';

@Component({
  selector: 'app-reglas-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reglas-page.component.html',
  styleUrl: './reglas-page.component.scss',
})
export class ReglasPageComponent {
  readonly reglas = signal<GaliRegla[]>(this.loadReglas());
  readonly escalamiento = signal<EscalamientoRegla[]>(ESCALAMIENTO_DEFAULTS);
  readonly showEscalamientoInfo = signal<string | null>(null);

  toggleEscalamiento(id: string): void {
    this.escalamiento.update(list =>
      list.map(r => r.id === id ? { ...r, active: !r.active } : r),
    );
  }

  get activeEscalamientoCount(): number {
    return this.escalamiento().filter(r => r.active).length;
  }

  tipoIcon(tipo: EscalamientoRegla['tipo']): string {
    return { escalar: '↑', pausar: '⏸', rotar: '↻', ahorrar: '💡', expandir: '⊕' }[tipo];
  }

  tipoClass(tipo: EscalamientoRegla['tipo']): string {
    return `esc-badge--${tipo}`;
  }

  private loadReglas(): GaliRegla[] {
    const defaults: GaliRegla[] = [
      {
        id: 'r1',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'el pedido va pa\' municipio y la transportadora marca zona rural',
        thenLabel: 'le escribe al cliente pidiendo anticipo de $25.000 antes de despachar',
        ejemplo: 'Ej: "Parce, para despachar a Leticia necesitamos un anticipo de $25.000. ¿Te sirve?"',
        active: true,
        scope: 'WhatsApp · confirmación',
      },
      {
        id: 'r2',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'el cliente dejó el carrito tirado más de 6 horas',
        thenLabel: 'manda la secuencia de 3 mensajes (suave → urgencia → oferta final)',
        ejemplo: 'Ej: "Oye, tu difusor sigue reservado. Hoy cerramos envíos a las 5 pm."',
        active: true,
        scope: 'WhatsApp · recuperación',
      },
      {
        id: 'r3',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'la huella del cliente está verde y la billetera al día',
        thenLabel: 'confirma el pedido solo y genera guía sin que tú entres',
        ejemplo: 'Para clientes recurrentes en Bogotá/Medellín con historial limpio.',
        active: true,
        scope: 'Pedidos · auto-confirmación',
      },
      {
        id: 'r4',
        agent: 'Chatea Pro',
        agentColor: '#34d399',
        ifLabel: 'hay novedad logística y el cliente pregunta por WhatsApp',
        thenLabel: 'responde con el estado real y ofrece reenvío o cambio de dirección',
        ejemplo: 'Evita que el cliente piense que lo están estafando.',
        active: false,
        scope: 'CAS · novedades',
      },
      {
        id: 'r5',
        agent: 'Roax',
        agentColor: '#f97316',
        ifLabel: 'el ROAS lleva 48h por encima del objetivo y el CPA está bajo',
        thenLabel: 'sube el presupuesto un 20% (tope diario que tú defines)',
        ejemplo: 'Regla del 20% — como Revealbot pero en español y con tus números reales.',
        active: true,
        scope: 'Meta Ads · escalamiento',
      },
      {
        id: 'r6',
        agent: 'Roax',
        agentColor: '#f97316',
        ifLabel: 'son las 11 pm y la campaña sigue prendida',
        thenLabel: 'pausa la pauta hasta las 6 am (ahorra ~22% en horas muertas)',
        ejemplo: 'Muy usada en skincare y hogar cuando la conversión cae de noche.',
        active: false,
        scope: 'Meta Ads · ahorro',
      },
      {
        id: 'r7',
        agent: 'Vigilante',
        agentColor: '#fbbf24',
        ifLabel: 'la novedad de Coordinadora en Bogotá supera el 10%',
        thenLabel: 'reasigna pedidos nuevos a Servientrega en esa ciudad',
        ejemplo: 'Solo aplica a pedidos que aún no tienen guía impresa.',
        active: true,
        scope: 'Logística · smart routing',
      },
    ];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      const saved = JSON.parse(raw) as Record<string, boolean>;
      return defaults.map(r => ({ ...r, active: saved[r.id] ?? r.active }));
    } catch {
      return defaults;
    }
  }

  private persist(): void {
    const map = Object.fromEntries(this.reglas().map(r => [r.id, r.active]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }

  toggle(id: string): void {
    this.reglas.update(list =>
      list.map(r => (r.id === id ? { ...r, active: !r.active } : r)),
    );
    this.persist();
  }

  readonly showNewRule = signal(false);
}
