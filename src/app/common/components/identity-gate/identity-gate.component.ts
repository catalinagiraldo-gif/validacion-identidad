import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateService } from '../../services/identity-demo-state.service';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityModalService, OrigenModal } from '../../services/identity-modal.service';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
import { Fase0ProgresoSumsub } from '../../models/identity-flow-v2.models';

export type GateContexto = 'retiro' | 'dropicard' | 'transferencia' | 'facturacion' | 'cuenta';

@Component({
  selector: 'app-identity-gate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-gate.component.html',
  styleUrls: ['./identity-gate.component.scss'],
})
export class IdentityGateComponent {
  @Input() contexto: GateContexto = 'retiro';

  private stateSvc = inject(IdentityDemoStateService);
  private stateV2 = inject(IdentityDemoStateV2Service);
  private modalSvc = inject(IdentityModalService);
  private fase0 = inject(IdentityFase0Service);

  readonly esFase0 = computed(() => this.stateV2.faseProyecto() === 'fase0');
  readonly progresoFase0 = this.fase0.progreso;

  readonly isVisible = computed(() => {
    if (this.esFase0()) {
      return this.progresoFase0() !== 'aprobado' && !this.stateV2.marcaBlanca();
    }
    return this.stateSvc.status() !== 'aprobado';
  });

  readonly variant = computed((): 'bloqueado' | 'en_revision' | 'incompleta' | 'rechazado' => {
    if (this.esFase0()) {
      const p = this.progresoFase0();
      if (p === 'pendiente-financiero') return 'en_revision';
      if (p === 'incompleta') return 'incompleta';
      if (p === 'rechazado') return 'rechazado';
      return 'bloqueado';
    }
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'en_revision';
    if (s === 'rechazado') return 'rechazado';
    return 'bloqueado';
  });

  readonly titulo = computed(() => {
    if (this.esFase0()) {
      return this.tituloFase0(this.progresoFase0());
    }
    const m: Record<GateContexto, string> = {
      retiro: 'Para retirar dinero debes verificar tu identidad',
      dropicard: 'Para usar tu DropiCard debes verificar tu identidad',
      transferencia: 'Para transferir saldo debes verificar tu identidad',
      facturacion: 'Tu validación de identidad está en proceso',
      cuenta: 'Verifica tu identidad para editar tu información de cuenta',
    };
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'Tu verificación está siendo revisada';
    if (s === 'rechazado') return 'Tu verificación fue rechazada';
    return m[this.contexto];
  });

  readonly subtitulo = computed(() => {
    if (this.esFase0()) {
      return this.subtituloFase0(this.progresoFase0());
    }
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'En hasta 24 horas te notificaremos por email con el resultado.';
    if (s === 'rechazado') return 'Puedes volver a intentarlo. Asegúrate de que tu documento esté vigente y la imagen sea clara.';
    return 'Es un proceso de una sola vez (~5 min) para proteger tus fondos y cumplir requisitos regulatorios.';
  });

  readonly ctaLabel = computed(() => {
    if (this.esFase0()) {
      const p = this.progresoFase0();
      if (p === 'pendiente-financiero') return 'Ver estado';
      if (p === 'incompleta') return 'Continuar verificación';
      if (p === 'rechazado') return 'Reintentar verificación';
      return 'Verificar identidad';
    }
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'Ver estado de mi verificación';
    if (s === 'rechazado') return 'Reintentar verificación';
    return 'Verificar identidad';
  });

  private tituloFase0(p: Fase0ProgresoSumsub): string {
    if (p === 'pendiente-financiero') return 'Tu verificación sigue en proceso';
    if (p === 'incompleta') return 'Tu verificación quedó incompleta';
    if (p === 'rechazado') return 'No pudimos verificar tu identidad';
    const m: Record<GateContexto, string> = {
      retiro: 'Para retirar dinero debes verificar tu identidad',
      dropicard: 'Para usar tu DropiCard debes verificar tu identidad',
      transferencia: 'Para transferir saldo debes verificar tu identidad',
      facturacion: 'Verifica tu identidad para editar tus datos de facturación',
      cuenta: 'Verifica tu identidad para editar tu información de cuenta',
    };
    return m[this.contexto];
  }

  private subtituloFase0(p: Fase0ProgresoSumsub): string {
    if (p === 'pendiente-financiero') {
      return 'Según la cola de revisión, puede tomar hasta 72 horas hábiles. Te avisaremos apenas esté lista.';
    }
    if (p === 'incompleta') {
      return 'Empezaste el proceso pero no lo terminaste. Continúa para poder operar sin restricciones.';
    }
    if (p === 'rechazado') {
      return 'Puedes volver a intentarlo. Asegúrate de que tu documento esté vigente y la imagen sea clara.';
    }
    return 'Es un proceso de una sola vez (~5 min) para proteger tus fondos y cumplir requisitos regulatorios.';
  }

  private get origenFromContexto(): OrigenModal {
    const map: Record<GateContexto, OrigenModal> = {
      retiro: 'retiro',
      dropicard: 'dropicard',
      transferencia: 'wallet',
      facturacion: 'facturacion',
      cuenta: 'cuenta',
    };
    return map[this.contexto];
  }

  onCta(): void {
    // Banners suaves en Fase 0: directo a Sumsub (sin interceptor intermedio).
    if (this.fase0.invitarDesdeBanner(this.origenFromContexto)) return;

    const s = this.stateSvc.status();
    if (s === 'en_revision') {
      this.modalSvc.open(this.origenFromContexto, 'screen3');
    } else if (s === 'rechazado') {
      this.modalSvc.open(this.origenFromContexto, 'screen2');
    } else {
      this.modalSvc.open(this.origenFromContexto, 'screen0');
    }
  }
}
