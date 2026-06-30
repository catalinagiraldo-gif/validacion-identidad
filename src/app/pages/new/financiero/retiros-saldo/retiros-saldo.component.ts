import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-retiros-saldo-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./retiros-saldo.component.scss'],
  template: `
    <div class="page-wrapper">
      <nav class="breadcrumb">
        <span class="breadcrumb-item breadcrumb-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Financiero</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Wallet</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Retiros de Saldo</span>
      </nav>

      <div class="page-header">
        <h1 class="page-title">Retiros de Saldo</h1>
        <button class="btn-outline" type="button">Historial de Retiros</button>
      </div>

      <div class="form-section">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Monto a Retirar</label>
            <input type="text" class="form-input" placeholder="Monto a Retirar" [(ngModel)]="monto" />
          </div>
          <div class="form-group">
            <label class="form-label">Banco</label>
            <div class="select-wrapper">
              <select class="form-select" [(ngModel)]="banco">
                <option value="">Banco</option>
                <option value="bancolombia">Bancolombia</option>
                <option value="bogota">Banco de Bogotá</option>
                <option value="davivienda">Davivienda</option>
                <option value="nequi">Nequi</option>
                <option value="daviplata">Daviplata</option>
                <option value="bbva">BBVA Colombia</option>
              </select>
              <i class="pi pi-chevron-down select-icon"></i>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-group-full">
            <label class="form-label">Concepto de Retiro</label>
            <input type="text" class="form-input" placeholder="Monto a Retirar" [(ngModel)]="concepto" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-primary" type="button" (click)="onProcesar()">Procesar</button>
        </div>
      </div>
    </div>
  `,
})
export class RetirosSaldoNewComponent {
  monto = '';
  banco = '';
  concepto = '';

  onProcesar(): void {
    // stub
  }
}
