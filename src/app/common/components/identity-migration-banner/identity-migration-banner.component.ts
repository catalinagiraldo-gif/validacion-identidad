import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityModalService } from '../../services/identity-modal.service';

// Wiretext 4-A (Plan2.md líneas 1080-1091): aviso pedagógico previo al bloqueo
// para usuarios legacy en ventana de migración masiva (Fase 4). Nunca es
// full-screen ni bloqueante — banner persistente en Home/Wallet.

@Component({
  selector: 'app-identity-migration-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-migration-banner.component.html',
  styleUrls: ['./identity-migration-banner.component.scss'],
})
export class IdentityMigrationBannerComponent {
  private stateV2  = inject(IdentityDemoStateV2Service);
  private modalSvc = inject(IdentityModalService);

  dismissed = signal(false);

  readonly isVisible = computed(() =>
    !this.dismissed() && this.stateV2.mostrarAvisoMigracion()
  );

  onValidar(): void {
    this.modalSvc.open('home', 'screen0');
  }

  dismiss(): void {
    this.dismissed.set(true);
  }
}
