import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  cuentas: CuentaBancaria[] = [
    { id: 1, pais: 'COLOMBIA', banco: 'BANCOLOMBIA' },
  ];

  showBlockModal = false;

  demoIdentityStatus = 'sin_validar';
  readonly identityStatusOptions = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];

  private readonly alertsMap: Record<string, { type: string; icon: string; text: string; cta: string }> = {
    sin_validar: { type: 'warning', icon: 'pi-shield',               text: 'Para agregar o gestionar cuentas bancarias, primero debes validar tu identidad.', cta: 'Verificar identidad' },
    pendiente:   { type: 'warning', icon: 'pi-exclamation-triangle', text: 'Tienes una verificación incompleta. Termínala para gestionar tus cuentas bancarias sin restricciones.', cta: 'Continuar verificación' },
    en_revision: { type: 'info',    icon: 'pi-clock',                text: 'Tu identidad está en revisión. Podrás editar tus cuentas bancarias cuando esté aprobada.', cta: 'Ver estado' },
    rechazado:   { type: 'error',   icon: 'pi-times-circle',         text: 'Tu verificación fue rechazada. Reintenta para desbloquear la gestión de cuentas bancarias.', cta: 'Reintentar' },
  };

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.alertsMap[this.demoIdentityStatus] : null;
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
