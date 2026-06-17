import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MaestriaService } from './maestria.service';

export type IntencionTipo = 'informativa' | 'ejecutable' | 'proactiva';

export interface RespuestaGali {
  id: string;
  intencion: IntencionTipo;
  texto: string;
  acciones?: AccionGali[];
  productos?: ProductoSugerido[];
  proyectoSugerido?: { nombre: string };
  timestamp: number;
}

export interface AccionGali {
  id: string;
  label: string;
  tipo: 'primaria' | 'secundaria' | 'destructiva';
  payload?: unknown;
}

export interface ProductoSugerido {
  id: string;
  nombre: string;
  roasPerfil: string;
  diasAntesSaturacion: number;
}

const RESPUESTAS_DEMO: Array<{ keywords: string[]; build: (n: 'aprendiz' | 'operador' | 'estratega') => Omit<RespuestaGali, 'id' | 'timestamp'> }> = [
  {
    keywords: ['producto', 'vender', 'elegir', 'qué', 'que vendo', 'recomiendas'],
    build: nivel => ({
      intencion: 'informativa',
      texto:
        nivel === 'aprendiz'
          ? 'Te explico: para esta semana veo tres productos que encajan con tu perfil. El collar GPS es el que más fuerza tiene en Bogotá ahora mismo — vendedores parecidos a ti están dando ROAS de 2.8x. Te muestro los tres, por si te ayuda.'
          : nivel === 'operador'
            ? 'Tres opciones para esta semana, en orden de fuerza: collar GPS (ROAS 2.8x perfil similar, Bogotá), masajeador cervical (Cali, curva entrada), lámpara LED escritorio (estable). Te muestro los tres.'
            : 'Top 3 semana: collar GPS (BOG, ROAS 2.8x), masajeador cervical (CALI, curva entrada 14d), lámpara LED (estable). Detalle abajo.',
      productos: [
        { id: 'p-collar', nombre: 'Collar GPS para mascotas', roasPerfil: '2.8x', diasAntesSaturacion: 10 },
        { id: 'p-masaj', nombre: 'Masajeador cervical', roasPerfil: '3.1x', diasAntesSaturacion: 14 },
        { id: 'p-led', nombre: 'Lámpara LED escritorio', roasPerfil: '2.4x', diasAntesSaturacion: 28 },
      ],
      acciones: [
        { id: 'crear-proyecto', label: 'Crear proyecto con uno', tipo: 'primaria' },
        { id: 'mas-info', label: 'Cuéntame más', tipo: 'secundaria' },
      ],
    }),
  },
  {
    keywords: ['novedad', 'novedades', 'pedido', 'pedidos'],
    build: nivel => ({
      intencion: 'informativa',
      texto:
        nivel === 'aprendiz'
          ? 'Te explico: tienes 14 novedades en total. 3 son críticas (necesitan tu decisión), 6 las estoy manejando yo, y 5 ya se resolvieron hoy. Vamos primero por las 3 críticas — todas son del mismo tipo: dirección incorrecta.'
          : nivel === 'operador'
            ? 'Tienes 14 novedades: 3 críticas (dirección incorrecta), 6 en proceso, 5 resueltas hoy. Vamos por las críticas.'
            : '14 novedades: 3 críticas (dir. incorrecta) · 6 en proceso · 5 resueltas. Abro críticas.',
      acciones: [
        { id: 'ir-novedades', label: 'Ver novedades', tipo: 'primaria' },
      ],
    }),
  },
  {
    keywords: ['campaña', 'campana', 'meta', 'ads', 'roas'],
    build: nivel => ({
      intencion: 'informativa',
      texto:
        nivel === 'aprendiz'
          ? 'Te explico: tienes 4 campañas activas. La del collar GPS está dando ROAS 2.8x — eso es bueno. La de silla ergonómica está en 0.8x — pierdes plata ahí. Te sugiero pausar esa y revisar el ángulo conmigo.'
          : nivel === 'operador'
            ? '4 campañas activas. Collar GPS: ROAS 2.8x ↑. Silla ergonómica: 0.8x ↓ — ángulo no resuena. ¿Pauso la segunda?'
            : '4 activas. Collar GPS 2.8x. Silla ergonómica 0.8x — pause sugerido.',
      acciones: [
        { id: 'pausar-mala', label: 'Pausar silla ergonómica', tipo: 'destructiva' },
        { id: 'ver-comparativa', label: 'Ver comparativa', tipo: 'secundaria' },
      ],
    }),
  },
];

const RESPUESTA_DEFAULT = (nivel: 'aprendiz' | 'operador' | 'estratega'): Omit<RespuestaGali, 'id' | 'timestamp'> => ({
  intencion: 'informativa',
  texto:
    nivel === 'aprendiz'
      ? 'Estoy aquí, contigo. Puedo ayudarte a elegir qué vender, revisar tus pedidos, mirar tus campañas, o crear un proyecto nuevo. ¿Por dónde empezamos?'
      : nivel === 'operador'
        ? 'Listo. ¿Productos, pedidos, campañas, o un proyecto nuevo?'
        : 'Listo. Productos · pedidos · campañas · proyecto.',
  acciones: [
    { id: 'qp-productos', label: 'Productos', tipo: 'secundaria' },
    { id: 'qp-pedidos', label: 'Pedidos', tipo: 'secundaria' },
    { id: 'qp-campanas', label: 'Campañas', tipo: 'secundaria' },
    { id: 'qp-proyecto', label: 'Nuevo proyecto', tipo: 'primaria' },
  ],
});

@Injectable({ providedIn: 'root' })
export class OrquestadorService {
  private maestria = inject(MaestriaService);

  private respuestaActualSubject = new BehaviorSubject<RespuestaGali | null>(null);
  readonly respuestaActual$ = this.respuestaActualSubject.asObservable();

  private actuandoSubject = new BehaviorSubject<boolean>(false);
  readonly actuando$ = this.actuandoSubject.asObservable();

  private accionSubject = new Subject<AccionGali>();
  readonly accionEjecutada$: Observable<AccionGali> = this.accionSubject.asObservable();

  enviar(prompt: string): RespuestaGali {
    const norm = prompt.toLowerCase();
    const match = RESPUESTAS_DEMO.find(r => r.keywords.some(k => norm.includes(k)));
    const builder = match ? match.build : RESPUESTA_DEFAULT;
    const raw = builder(this.maestria.nivel);

    const respuesta: RespuestaGali = {
      id: `r-${Date.now()}`,
      timestamp: Date.now(),
      ...raw,
    };
    this.actuandoSubject.next(true);
    this.respuestaActualSubject.next(respuesta);
    return respuesta;
  }

  cerrar() {
    this.actuandoSubject.next(false);
    this.respuestaActualSubject.next(null);
  }

  ejecutar(accion: AccionGali) {
    this.accionSubject.next(accion);
  }
}
