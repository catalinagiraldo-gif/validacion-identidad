import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
import { IdentityFase0BackstageDotComponent } from '../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component';
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
  /** Blueprint (Etapa Continua, Pendiente-en-revisión): "se agrega junto a 'Entendido'" — no abre el widget, solo orienta. */
  ctaSecundarioLabel?: string;
  /** Prototipo: permite X / backdrop para retirar el modal sin continuar a Sumsub. */
  puedeCerrar?: boolean;
  backstage: string;
}

const RESULT_VIEWS: Record<Fase0ResultKind, ResultView> = {
  aprobado: {
    icon: 'pi-check-circle',
    tone: 'aprobado',
    headline: '¡Cuenta verificada!',
    body: 'Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard.',
    ctaLabel: null,
    backstage: 'Legal descargó el estado desde el backoffice de Sumsub y actualizó el Google Sheet a mano; Admin apagó el pop-up de UserPilot y CRM ya envió el WhatsApp de aprobación.',
  },
  'revision-financiero': {
    icon: 'pi-clock',
    tone: 'info',
    headline: 'Tu verificación sigue en proceso',
    body: 'Según la cola de revisión, puede tomar hasta 72 horas hábiles. Te avisaremos apenas esté lista — no necesitas hacer nada más.',
    ctaLabel: 'Entendido',
    ctaSecundarioLabel: 'Contactar a soporte',
    backstage: 'El usuario ya completó Sumsub. Está en cola manual: Financiero audita los datos tributarios cruzados contra Dropi. SLA operativo 48-72h hábiles — no es el tiempo fijo de una sola revisión. El botón secundario "Contactar a soporte" se agregó porque antes esta pantalla no ofrecía ninguna vía de contacto; NO abre el widget automáticamente, solo orienta al chip "Validación de identidad" → "Mi verificación sigue en revisión".',
  },
  incompleta: {
    icon: 'pi-exclamation-circle',
    tone: 'incompleta',
    headline: 'Tu verificación quedó incompleta',
    body: 'Empezaste el proceso pero no lo terminaste en Sumsub. Complétalo para poder operar sin restricciones.',
    ctaLabel: 'Continuar verificación',
    puedeCerrar: true,
    backstage: 'A diferencia de "Pendiente Financiero", aquí no hay caso completo en Sumsub — el usuario abandonó a mitad de camino. CRM puede repetir este recordatorio (a diferencia del de Financiero, que es de una sola vez). En el prototipo se puede cerrar con X; al reintentar una acción financiera reaparece.',
  },
  rechazado: {
    icon: 'pi-times-circle',
    tone: 'rechazado',
    headline: 'No pudimos verificar tu identidad',
    body: 'Por seguridad, restringimos las operaciones de esta cuenta. Si crees que es un error, contáctanos y lo revisamos.',
    ctaLabel: 'Contactar a soporte',
    backstage: 'El botón NO abre el widget automáticamente — solo orienta a abrir por su cuenta el widget de soporte flotante, chip "Validación de identidad" → "Me rechazaron la verificación". Sin CRM propio: esta notificación se muestra una sola vez y "luego expulsión (ver Etapa 1)" — al cerrarla, cualquier intento posterior ya no vuelve a mostrar este modal ligero: escala directo al Freno Seco persistente.',
  },
};

@Component({
  selector: 'app-identity-fase0-result',
  standalone: true,
  imports: [CommonModule, IdentityFase0BackstageDotComponent],
  templateUrl: './identity-fase0-result.component.html',
  styleUrls: ['./identity-fase0-result.component.scss'],
})
export class IdentityFase0ResultComponent {
  readonly fase0 = inject(IdentityFase0Service);

  readonly view = computed<ResultView | null>(() => {
    const kind = this.fase0.activeResult();
    return kind ? RESULT_VIEWS[kind] : null;
  });

  readonly mostrarHintSoporte = signal(false);

  onCta(): void {
    const kind = this.fase0.activeResult();
    if (kind === 'incompleta') {
      // Blueprint: "Continuar verificación" lleva directo a Sumsub (ya no vuelve a pasar por el interceptor de Etapa 0.5).
      this.fase0.dismissResult();
      this.fase0.openSumsubStandin();
      return;
    }
    if (kind === 'rechazado') {
      // Blueprint: "Contactar a soporte" no es un cierre benigno tipo X — solo
      // indica el widget de soporte; el estado real es "expulsión (ver Etapa
      // 1)". Cerrar esta notificación pasa directo al Freno Seco persistente.
      this.fase0.dismissResult();
      this.fase0.openBlock('rechazado');
      return;
    }
    this.fase0.dismissResult();
  }

  /** Blueprint: el botón secundario NO abre el widget automáticamente — solo orienta al usuario a abrirlo por su cuenta. No cierra el modal. */
  onCtaSecundario(): void {
    this.mostrarHintSoporte.set(true);
  }

  /** Solo incompleta: retira el modal sin ir a Sumsub (prototipo). */
  cerrar(): void {
    if (this.fase0.activeResult() !== 'incompleta') return;
    this.mostrarHintSoporte.set(false);
    this.fase0.dismissResult();
  }
}
