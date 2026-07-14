import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
import { Fase0ResultKind } from '../../models/identity-flow-v2.models';

// Etapa Continua del Service Blueprint Fase 0: los 4 modales de resultado.
// Copy 100% textual al blueprint. 'aprobado' se autodesaparece (timer en el
// servicio) y no tiene botón; 'incompleta' reabre el Modal Interceptor de
// Etapa 0.5.

interface ResultView {
  icon: string;
  tone: 'aprobado' | 'info' | 'incompleta' | 'rechazado';
  headline: string;
  body: string;
  ctaLabel: string | null;
}

const RESULT_VIEWS: Record<Fase0ResultKind, ResultView> = {
  aprobado: {
    icon: 'pi-check-circle',
    tone: 'aprobado',
    headline: '¡Cuenta verificada!',
    body: 'Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard.',
    ctaLabel: null,
  },
  'revision-financiero': {
    icon: 'pi-clock',
    tone: 'info',
    headline: 'Tu verificación sigue en proceso',
    body: 'Puede tardar hasta 72 horas hábiles. Te avisaremos apenas esté lista — no necesitas hacer nada más.',
    ctaLabel: 'Entendido',
  },
  incompleta: {
    icon: 'pi-exclamation-circle',
    tone: 'incompleta',
    headline: 'Tu verificación quedó incompleta',
    body: 'Empezaste el proceso pero no lo terminaste en Sumsub. Complétalo para poder operar sin restricciones.',
    ctaLabel: 'Continuar verificación',
  },
  rechazado: {
    icon: 'pi-times-circle',
    tone: 'rechazado',
    headline: 'No pudimos verificar tu identidad',
    body: 'Por seguridad, restringimos las operaciones de esta cuenta. Si crees que es un error, contáctanos y lo revisamos.',
    ctaLabel: 'Contactar a soporte',
  },
};

@Component({
  selector: 'app-identity-fase0-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-fase0-result.component.html',
  styleUrls: ['./identity-fase0-result.component.scss'],
})
export class IdentityFase0ResultComponent {
  readonly fase0 = inject(IdentityFase0Service);

  readonly view = computed<ResultView | null>(() => {
    const kind = this.fase0.activeResult();
    return kind ? RESULT_VIEWS[kind] : null;
  });

  onCta(): void {
    const kind = this.fase0.activeResult();
    if (kind === 'incompleta') {
      // Blueprint: "Continuar verificación" lo regresa a Sumsub → reabre el interceptor de Etapa 0.5.
      this.fase0.dismissResult();
      this.fase0.openInterceptor('home');
      return;
    }
    this.fase0.dismissResult();
  }
}
