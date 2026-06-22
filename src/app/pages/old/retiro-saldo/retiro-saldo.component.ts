import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retiro-saldo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retiro-saldo.component.html',
  styleUrls: ['./retiro-saldo.component.scss'],
})
export class RetiroSaldoComponent {
  private router = inject(Router);

  monto = '';
  bancoSeleccionado = '';
  saldoDisponible = 2717360700;
  showBlockModal = false;

  readonly bancos = ['BANCOLOMBIA', 'BANCO BOGOTÁ', 'DAVIVIENDA', 'BANCO DE OCCIDENTE', 'BBVA'];

  demoIdentityStatus = 'sin_validar';
  readonly identityStatusOptions = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  readonly blockedAction = 'procesar retiros';

  private readonly alertsMap: Record<string, { type: string; icon: string; text: string; cta: string; step: number; stateLabel: string }> = {
    sin_validar: { type: 'warning', icon: 'pi-shield',               step: 1, stateLabel: 'Sin validar',             text: 'Para retirar saldo necesitas identidad verificada. Esto protege tu dinero y el de tus clientes.', cta: 'Verificar identidad' },
    pendiente:   { type: 'warning', icon: 'pi-exclamation-triangle', step: 2, stateLabel: 'Verificación incompleta', text: 'Tu verificación está incompleta. Termínala para habilitar retiros de saldo a tu cuenta bancaria.', cta: 'Continuar verificación' },
    en_revision: { type: 'info',    icon: 'pi-clock',                step: 3, stateLabel: 'En revisión',             text: 'Tu identidad está en revisión. Los retiros se habilitan automáticamente al aprobarla.', cta: 'Ver estado' },
    rechazado:   { type: 'error',   icon: 'pi-times-circle',         step: 2, stateLabel: 'Verificación rechazada',  text: 'Tu verificación fue rechazada. Reintenta para desbloquear el retiro de saldo.', cta: 'Reintentar' },
  };

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.alertsMap[this.demoIdentityStatus] : null;
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  formatSaldo(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }

  procesarRetiro(): void {
    if (this.demoIdentityStatus !== 'aprobado') {
      this.showBlockModal = true;
      return;
    }
    // placeholder — in production submits the withdrawal
  }

  closeBlockModal(): void {
    this.showBlockModal = false;
  }
}
