import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropicard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropicard.component.html',
  styleUrls: ['./dropicard.component.scss'],
})
export class DropicardComponent {
  private router = inject(Router);

  showBanner = true;
  tipoTarjeta = 'Todas';

  demoIdentityStatus = 'sin_validar';
  readonly identityStatusOptions = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  readonly blockedAction = 'solicitar Dropicard';

  private readonly alertsMap: Record<string, { type: string; icon: string; text: string; cta: string; step: number; stateLabel: string }> = {
    sin_validar: { type: 'warning', icon: 'pi-shield',               step: 1, stateLabel: 'Sin validar',             text: 'Para solicitar tu Dropicard y activar pagos, necesitas identidad validada. Es rápido y solo lo haces una vez.', cta: 'Verificar identidad' },
    pendiente:   { type: 'warning', icon: 'pi-exclamation-triangle', step: 2, stateLabel: 'Verificación incompleta', text: 'Casi tienes tu Dropicard. Completa la verificación de identidad para activar la solicitud de tarjeta.', cta: 'Continuar verificación' },
    en_revision: { type: 'info',    icon: 'pi-clock',                step: 3, stateLabel: 'En revisión',             text: 'Tu identidad está en revisión. Podrás solicitar tu Dropicard en cuanto esté aprobada.', cta: 'Ver estado' },
    rechazado:   { type: 'error',   icon: 'pi-times-circle',         step: 2, stateLabel: 'Verificación rechazada',  text: 'Tu verificación fue rechazada. Vuelve a intentarlo para desbloquear tu Dropicard.', cta: 'Reintentar' },
  };

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.alertsMap[this.demoIdentityStatus] : null;
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }
  estado = 'Seleccionar';
  searchQuery = '';
  hasCards = false;

  closeBanner(): void {
    this.showBanner = false;
  }

  solicitarTarjeta(): void {
    // placeholder action
  }

  aplicarFiltros(): void {
    // placeholder action
  }

  verBeneficios(): void {
    // placeholder action
  }
}
