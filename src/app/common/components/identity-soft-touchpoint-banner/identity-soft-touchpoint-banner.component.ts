import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { IdentityProfileService } from '../../services/identity-profile.service';

@Component({
  selector: 'app-identity-soft-touchpoint-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="soft-touchpoint">
        <div class="soft-touchpoint__icon">
          <i class="pi pi-wallet"></i>
        </div>
        <div class="soft-touchpoint__body">
          <p class="soft-touchpoint__title">¡Recibiste tu primer pago! 🎉</p>
          <p class="soft-touchpoint__text">Configura tus datos para poder retirarlo cuando quieras.</p>
        </div>
        <button type="button" class="soft-touchpoint__cta" (click)="irAConfigurar()">Configurar ahora</button>
        <button type="button" class="soft-touchpoint__dismiss" (click)="dismiss()" aria-label="Descartar">
          <i class="pi pi-times"></i>
        </button>
      </div>
    }
  `,
  styleUrls: ['./identity-soft-touchpoint-banner.component.scss'],
})
export class IdentitySoftTouchpointBannerComponent {
  private identity = inject(IdentityProfileService);
  private router = inject(Router);

  // Mock: en producción vendría de un evento real "primer pedido entregado".
  private readonly primeraVentaRecibida = signal(true);
  private readonly dismissed = signal(false);

  get visible(): boolean {
    return this.primeraVentaRecibida() && !this.dismissed() && !this.identity.duenoValidado();
  }

  irAConfigurar(): void {
    this.router.navigateByUrl('/configuraciones/cuenta');
  }

  dismiss(): void {
    this.dismissed.set(true);
  }
}
