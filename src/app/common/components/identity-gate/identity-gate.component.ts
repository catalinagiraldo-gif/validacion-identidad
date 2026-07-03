import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateService } from '../../services/identity-demo-state.service';
import { IdentityModalService, OrigenModal } from '../../services/identity-modal.service';

export type GateContexto = 'retiro' | 'dropicard' | 'transferencia' | 'facturacion';

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
  private modalSvc = inject(IdentityModalService);

  readonly status = this.stateSvc.status;

  readonly isVisible = computed(() => {
    const s = this.stateSvc.status();
    return s !== 'aprobado';
  });

  readonly titulo = computed(() => {
    const m: Record<GateContexto, string> = {
      retiro:       'Para retirar dinero debes verificar tu identidad',
      dropicard:    'Para usar tu DropiCard debes verificar tu identidad',
      transferencia:'Para transferir saldo debes verificar tu identidad',
      facturacion:  'Tu validación de identidad está en proceso',
    };
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'Tu verificación está siendo revisada';
    if (s === 'rechazado')   return 'Tu verificación fue rechazada';
    return m[this.contexto];
  });

  readonly subtitulo = computed(() => {
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'En 1-3 días hábiles te notificaremos por email con el resultado.';
    if (s === 'rechazado')   return 'Puedes volver a intentarlo. Asegúrate de que tu documento esté vigente y la imagen sea clara.';
    return 'Es un proceso de una sola vez (~5 min) para proteger tus fondos y cumplir requisitos regulatorios.';
  });

  readonly ctaLabel = computed(() => {
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'Ver estado de mi verificación';
    if (s === 'rechazado')   return 'Reintentar verificación';
    return 'Verificar identidad';
  });

  readonly variant = computed((): 'bloqueado' | 'en_revision' | 'rechazado' => {
    const s = this.stateSvc.status();
    if (s === 'en_revision') return 'en_revision';
    if (s === 'rechazado')   return 'rechazado';
    return 'bloqueado';
  });

  private get origenFromContexto(): OrigenModal {
    const map: Record<GateContexto, OrigenModal> = {
      retiro:        'retiro',
      dropicard:     'dropicard',
      transferencia: 'wallet',
      facturacion:   'facturacion',
    };
    return map[this.contexto];
  }

  onCta(): void {
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
