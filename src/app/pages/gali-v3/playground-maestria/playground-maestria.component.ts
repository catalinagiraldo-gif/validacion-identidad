import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GaliMarkComponent } from '../../../components/gali-v2/gali-mark/gali-mark.component';
import {
  MAESTRIA_PERSONAS,
  MaestriaNivel,
  MaestriaPersona,
  MaestriaService,
} from '../../../services/gali-v2/maestria.service';
import { CanvasService } from '../../../services/gali-v3/canvas.service';

interface SampleMessage {
  id: string;
  context: string;
  voices: { aprendiz: string; operador: string; estratega: string };
}

const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: 'novedad',
    context: 'Novedad en pedido — dirección incorrecta',
    voices: {
      aprendiz:
        'Te explico: una novedad es cuando algo se sale del flujo normal del pedido. Esta tiene la dirección incorrecta. Yo ya intenté corregirla con el cliente y te muestro lo que recibí, por si te ayuda.',
      operador:
        'Tienes una novedad: dirección incorrecta. Ya escribí al cliente — espero respuesta antes de 2h. Considera reagendar el envío.',
      estratega:
        'Dirección incorrecta. Cliente contactado. ETA respuesta 2h. Te sugiero reagendar el envío.',
    },
  },
  {
    id: 'oportunidad',
    context: 'Producto en curva de entrada',
    voices: {
      aprendiz:
        'Te explico: una "curva de entrada" significa que un producto recién empezó a venderse fuerte en tu ciudad y hay pocos vendedores activos. El collar GPS está entrando en Bogotá — vendedores con perfil parecido al tuyo están viendo ROAS de 2.8x con él.',
      operador:
        'Collar GPS entrando en Bogotá. Vendedores parecidos a ti: ROAS 2.8x. Considera lanzar antes de que sature.',
      estratega:
        'Collar GPS — Bogotá, curva entrada. ROAS perfil similar: 2.8x. 10d antes de saturación.',
    },
  },
  {
    id: 'campana',
    context: 'Campaña con bajo ROAS',
    voices: {
      aprendiz:
        'Te explico: el ROAS mide cuánto recuperas por cada peso que invertiste en publicidad. Tu campaña de la silla ergonómica está dando 0.8x — eso significa que pierdes plata. Mejores vendedores usan el ángulo "dolor de espalda" en lugar del tuyo de "calidad premium". ¿Quieres que cambiemos el ángulo juntos?',
      operador:
        'Campaña silla ergonómica: ROAS 0.8x. Ángulo "premium" no resuena — el ganador es "dolor de espalda en home office". ¿Cambiamos?',
      estratega:
        'Silla ergonómica ROAS 0.8x. Ángulo "premium" subperforma. Switch a "dolor espalda" recomendado.',
    },
  },
];

@Component({
  selector: 'app-gali-v3-playground-maestria',
  standalone: true,
  imports: [CommonModule, RouterLink, GaliMarkComponent],
  templateUrl: './playground-maestria.component.html',
  styleUrls: ['./playground-maestria.component.scss'],
})
export class GaliV3PlaygroundMaestriaComponent {
  private maestria = inject(MaestriaService);
  private canvas = inject(CanvasService);

  readonly niveles: MaestriaNivel[] = ['aprendiz', 'operador', 'estratega'];
  readonly personas = MAESTRIA_PERSONAS;
  readonly samples = SAMPLE_MESSAGES;
  readonly markStates = ['reposo', 'propuesta', 'alerta', 'actuando', 'memoria'] as const;

  readonly nivelActual$ = this.maestria.nivel$;

  persona(nivel: MaestriaNivel): MaestriaPersona {
    return this.personas[nivel];
  }

  setNivel(nivel: MaestriaNivel) {
    this.maestria.setNivel(nivel);
    // re-armar canvas con el starter pack del nuevo nivel
    this.canvas.applyForCurrentNivel();
  }
}
