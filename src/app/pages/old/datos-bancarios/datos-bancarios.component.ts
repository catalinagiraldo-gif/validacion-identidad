import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentityActivationCardComponent } from '../../../common/components/identity-activation-card/identity-activation-card.component';

interface CuentaBancaria {
  id: number;
  pais: string;
  banco: string;
}

@Component({
  selector: 'app-datos-bancarios',
  standalone: true,
  imports: [CommonModule, FormsModule, IdentityActivationCardComponent],
  templateUrl: './datos-bancarios.component.html',
  styleUrls: ['./datos-bancarios.component.scss'],
})
export class DatosBancariosComponent {
  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus() {
    return this.identityDemo.status();
  }

  cuentas: CuentaBancaria[] = [
    { id: 1, pais: 'COLOMBIA', banco: 'BANCOLOMBIA' },
  ];

  showBlockModal = false;

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
