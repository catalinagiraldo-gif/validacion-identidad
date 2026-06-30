import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IdentityProfileService } from '../../../../common/services/identity-profile.service';
import { IdentityBlockBannerComponent } from '../../../../common/components/identity-block-banner/identity-block-banner.component';

interface BancoOption {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-retiros-saldo-new',
  standalone: true,
  imports: [CommonModule, FormsModule, IdentityBlockBannerComponent],
  styleUrls: ['./retiros-saldo.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item muted">Financiero</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item muted">Wallet</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item">Retiros de Saldo</span>
      </nav>

      <!-- Page header -->
      <div class="page-header">
        <h1 class="page-title">Retiros de Saldo</h1>
        <button class="btn-secondary" (click)="onHistorial()">
          <span>Historial de Retiros</span>
        </button>
      </div>

      <app-identity-block-banner [motivo]="identity.bloqueoMotivo()" contexto="retiro"></app-identity-block-banner>

      <!-- Form -->
      <form class="withdraw-form" (ngSubmit)="onProcesar()">
        <div class="form-row">
          <div class="form-group">
            <label for="monto">Monto a Retirar</label>
            <input
              type="text"
              id="monto"
              name="monto"
              [(ngModel)]="montoRetirar"
              placeholder="Monto a Retirar"
              inputmode="numeric"
            />
          </div>
          <div class="form-group">
            <label for="banco">Banco</label>
            <div class="select-wrapper">
              <select id="banco" name="banco" [(ngModel)]="bancoSeleccionado">
                <option [ngValue]="null" disabled selected hidden>Banco</option>
                <option *ngFor="let banco of bancos" [ngValue]="banco.id">{{ banco.nombre }}</option>
              </select>
              <i class="pi pi-chevron-down select-icon"></i>
            </div>
          </div>
        </div>

        <div class="form-row form-row--single">
          <div class="form-group">
            <label for="concepto">Concepto de Retiro</label>
            <input
              type="text"
              id="concepto"
              name="concepto"
              [(ngModel)]="conceptoRetiro"
              placeholder="Monto a Retirar"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" [disabled]="identity.retirosBloqueados()">Procesar</button>
        </div>
      </form>

      <!-- Toast -->
      <div class="toast" *ngIf="showToast" [ngClass]="toastType">
        <i class="pi" [ngClass]="{
          'pi-check-circle': toastType === 'success',
          'pi-info-circle': toastType === 'info'
        }"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  `,
})
export class RetirosSaldoNewComponent {
  readonly identity = inject(IdentityProfileService);

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  montoRetirar = '';
  conceptoRetiro = '';
  bancoSeleccionado: number | null = null;

  bancos: BancoOption[] = [
    { id: 1, nombre: 'Bancolombia' },
    { id: 2, nombre: 'Davivienda' },
    { id: 3, nombre: 'Banco de Bogota' },
    { id: 4, nombre: 'BBVA Colombia' },
    { id: 5, nombre: 'Banco Agrario' },
    { id: 6, nombre: 'Banco Caja Social' },
    { id: 7, nombre: 'Banco Popular' },
    { id: 8, nombre: 'Banco de Occidente' },
    { id: 9, nombre: 'Nequi' },
    { id: 10, nombre: 'Daviplata' },
  ];

  onHistorial(): void {
    this.notify('Abriendo historial de retiros', 'info');
  }

  onProcesar(): void {
    if (this.identity.retirosBloqueados()) {
      this.notify('Completa tu validación de identidad para poder retirar saldo', 'info');
      return;
    }
    if (!this.montoRetirar || !this.bancoSeleccionado || !this.conceptoRetiro) {
      this.notify('Completa todos los campos para procesar el retiro', 'info');
      return;
    }
    this.notify('Retiro procesado correctamente', 'success');
    this.montoRetirar = '';
    this.conceptoRetiro = '';
    this.bancoSeleccionado = null;
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
