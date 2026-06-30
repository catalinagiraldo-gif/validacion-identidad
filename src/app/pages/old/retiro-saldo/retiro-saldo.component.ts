import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentityActivationCardComponent } from '../../../common/components/identity-activation-card/identity-activation-card.component';

@Component({
  selector: 'app-retiro-saldo',
  standalone: true,
  imports: [CommonModule, FormsModule, IdentityActivationCardComponent],
  templateUrl: './retiro-saldo.component.html',
  styleUrls: ['./retiro-saldo.component.scss'],
})
export class RetiroSaldoComponent {
  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus() {
    return this.identityDemo.status();
  }

  monto = '';
  bancoSeleccionado = '';
  saldoDisponible = 2717360700;
  showBlockModal = false;

  readonly bancos = ['BANCOLOMBIA', 'BANCO BOGOTÁ', 'DAVIVIENDA', 'BANCO DE OCCIDENTE', 'BBVA'];

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
