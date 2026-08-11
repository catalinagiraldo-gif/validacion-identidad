import { Component, Input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateService } from '../../services/identity-demo-state.service';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityModalService, OrigenModal } from '../../services/identity-modal.service';

export type BannerVariant = 'pedidos' | 'home' | 'wallet';

@Component({
  selector: 'app-identity-soft-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-soft-banner.component.html',
  styleUrls: ['./identity-soft-banner.component.scss'],
})
export class IdentitySoftBannerComponent {
  @Input() variant: BannerVariant = 'home';

  private stateSvc = inject(IdentityDemoStateService);
  private stateV2 = inject(IdentityDemoStateV2Service);
  private modalSvc = inject(IdentityModalService);

  dismissed = signal(false);

  // En Fase 0 el banner monetario desaparece (blueprint Etapa 0: el Panel Lateral
  // cubre el rol pedagógico, sin gancho monetario).
  //
  // En Fase 1-5 el aviso sigue el MISMO eje Nuevo/Activo que el track de Fase 0:
  // un usuario nuevo no ve ningún soft touchpoint de identidad (sólo un clic
  // financiero lo lleva al hard gate); un usuario activo (~20 órdenes — valor de
  // trabajo confirmado en REUCONTI.md) sí lo ve, no bloqueante y descartable.
  readonly isVisible = computed(() =>
    !this.dismissed() &&
    this.stateV2.faseProyecto() !== 'fase0' &&
    this.stateV2.fase0TipoUsuario() === 'activo' &&
    this.stateSvc.showSoftTouchpoints()
  );

  readonly titulo = computed(() => {
    const m: Record<BannerVariant, string> = {
      pedidos: '¡Tu primera venta fue entregada! 🎉',
      home:    'Ya tienes ganancias en camino',
      wallet:  'COP 45.000 disponibles en tu wallet',
    };
    return m[this.variant];
  });

  readonly subtitulo = computed(() => {
    const m: Record<BannerVariant, string> = {
      pedidos: 'COP 45.000 van a llegar a tu wallet. Para poder retirarlos, configura tu identidad ahora. Toma solo ~5 min.',
      home:    'Para retirar tus ganancias, activa tus retiros completando tu verificación de identidad.',
      wallet:  'Para retirar este dinero, valida quién eres. Solo una vez, ~5 min.',
    };
    return m[this.variant];
  });

  readonly ctaLabel = computed(() => {
    const m: Record<BannerVariant, string> = {
      pedidos: 'Activar mis retiros',
      home:    'Activar retiros',
      wallet:  'Activar retiros',
    };
    return m[this.variant];
  });

  private get origenFromVariant(): OrigenModal {
    const map: Record<BannerVariant, OrigenModal> = {
      pedidos: 'pedidos',
      home:    'home',
      wallet:  'wallet',
    };
    return map[this.variant];
  }

  onCta(): void {
    this.modalSvc.open(this.origenFromVariant, 'screen0');
  }

  dismiss(): void {
    this.dismissed.set(true);
  }
}
