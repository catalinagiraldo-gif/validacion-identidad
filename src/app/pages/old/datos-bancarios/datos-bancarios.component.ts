import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';

interface CuentaBancaria {
  id: number;
  pais: string;
  banco: string;
}

@Component({
  selector: 'app-datos-bancarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-bancarios.component.html',
  styleUrls: ['./datos-bancarios.component.scss'],
})
export class DatosBancariosComponent {
  private router = inject(Router);

  cuentas: CuentaBancaria[] = [
    { id: 1, pais: 'COLOMBIA', banco: 'BANCOLOMBIA' },
  ];

  showBlockModal = false;

  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus(): IdentitySatelliteStatus {
    return this.identityDemo.status();
  }

  setDemoIdentityStatus(status: IdentitySatelliteStatus): void {
    this.identityDemo.setStatus(status);
  }

  readonly identityStatusOptions: IdentitySatelliteStatus[] = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  readonly blockedAction = 'agregar cuentas bancarias';

  private readonly alertsMap: Record<string, { type: string; icon: string; text: string; cta: string; step: number; stateLabel: string }> = {
    sin_validar: { type: 'warning', icon: 'pi-shield',               step: 1, stateLabel: 'Sin validar',             text: 'Para agregar o gestionar cuentas bancarias, primero debes validar tu identidad.', cta: 'Verificar identidad' },
    pendiente:   { type: 'warning', icon: 'pi-exclamation-triangle', step: 2, stateLabel: 'Verificación incompleta', text: 'Tienes una verificación incompleta. Termínala para gestionar tus cuentas bancarias sin restricciones.', cta: 'Continuar verificación' },
    en_revision: { type: 'info',    icon: 'pi-clock',                step: 3, stateLabel: 'En revisión',             text: 'Tu identidad está en revisión. Podrás editar tus cuentas bancarias cuando esté aprobada.', cta: 'Ver estado' },
    rechazado:   { type: 'error',   icon: 'pi-times-circle',         step: 2, stateLabel: 'Verificación rechazada',  text: 'Tu verificación fue rechazada. Reintenta para desbloquear la gestión de cuentas bancarias.', cta: 'Reintentar' },
  };

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.alertsMap[this.demoIdentityStatus] : null;
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  agregarCuenta(): void {
    if (this.demoIdentityStatus !== 'aprobado') {
      this.showBlockModal = true;
      return;
    }
    // placeholder — in production opens an add-account modal
  }

  eliminarCuenta(id: number): void {
    if (this.demoIdentityStatus !== 'aprobado') {
      this.showBlockModal = true;
      return;
    }
    this.cuentas = this.cuentas.filter(c => c.id !== id);
  }

  closeBlockModal(): void {
    this.showBlockModal = false;
  }
}
