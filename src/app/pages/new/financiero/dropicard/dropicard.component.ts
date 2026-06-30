import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityActivationCardComponent } from '../../../../common/components/identity-activation-card/identity-activation-card.component';

import { IdentityProfileService } from '../../../../common/services/identity-profile.service';
import { IdentityBlockBannerComponent } from '../../../../common/components/identity-block-banner/identity-block-banner.component';

interface Transaction {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  status: 'Aprobada' | 'Pendiente' | 'Rechazada';
}

@Component({
  selector: 'app-dropicard-new',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, IdentityBlockBannerComponent],
=======
  imports: [CommonModule, IdentityActivationCardComponent],
>>>>>>> 676de9db534c7c03070b27cebe346aa8e035f5b7
  styleUrls: ['./dropicard.component.scss'],
  template: `
    <div class="dropicard-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Financiero</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item">Dropicard</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Dropicard</h1>

<<<<<<< HEAD
      <app-identity-block-banner [motivo]="identity.bloqueoMotivo()" contexto="dropicard"></app-identity-block-banner>
=======
      <app-identity-activation-card
        context="dropicard"
        blockedAction="solicitar Dropicard"
        [sticky]="true"
        identityRoute="/new/configuraciones/flujo-identidad-2026-06-18"
      />
>>>>>>> 676de9db534c7c03070b27cebe346aa8e035f5b7

      <!-- Card + Details grid -->
      <div class="card-section" *ngIf="hasCard">
        <!-- Card preview -->
        <div class="card-preview-wrapper">
          <div class="credit-card">
            <div class="card-shine"></div>
            <div class="card-top">
              <span class="card-label">Dropicard</span>
              <span class="card-type">VISA</span>
            </div>
            <div class="card-chip">
              <div class="chip-lines">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div class="card-number">
              <span>****</span>
              <span>****</span>
              <span>****</span>
              <span>{{ cardLast4 }}</span>
            </div>
            <div class="card-bottom">
              <div class="card-holder">
                <span class="label">TITULAR</span>
                <span class="value">{{ cardHolder }}</span>
              </div>
              <div class="card-expiry">
                <span class="label">VENCE</span>
                <span class="value">{{ cardExpiry }}</span>
              </div>
            </div>
            <div class="card-logo-accent"></div>
          </div>
        </div>

        <!-- Card details -->
        <div class="card-details">
          <h2 class="section-title">Detalles de la tarjeta</h2>
          <div class="detail-rows">
            <div class="detail-row">
              <span class="detail-label">Numero de tarjeta</span>
              <span class="detail-value masked">
                **** **** **** {{ cardLast4 }}
                <button class="btn-toggle-mask" (click)="toggleCardNumber()" [title]="showFullCard ? 'Ocultar' : 'Mostrar'">
                  <i class="pi" [ngClass]="showFullCard ? 'pi-eye-slash' : 'pi-eye'"></i>
                </button>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fecha de vencimiento</span>
              <span class="detail-value">{{ cardExpiry }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">CVV</span>
              <span class="detail-value masked">
                {{ showCvv ? cardCvv : '***' }}
                <button class="btn-toggle-mask" (click)="toggleCvv()" [title]="showCvv ? 'Ocultar' : 'Mostrar'">
                  <i class="pi" [ngClass]="showCvv ? 'pi-eye-slash' : 'pi-eye'"></i>
                </button>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estado</span>
              <span class="detail-value">
                <span class="status-badge" [ngClass]="identity.dropicardBloqueada() ? 'frozen' : 'active'">
                  {{ identity.dropicardBloqueada() ? 'Congelada' : 'Activa' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- No card state -->
      <div class="no-card-state" *ngIf="!hasCard">
        <div class="no-card-illustration">
          <i class="pi pi-credit-card"></i>
        </div>
        <h2>Aun no tienes una Dropicard</h2>
        <p>Solicita tu tarjeta Dropicard y empieza a disfrutar de todos los beneficios.</p>
        <button class="btn-primary" (click)="onRequestCard()" [disabled]="identity.dropicardBloqueada()">
          Solicitar tarjeta
        </button>
      </div>

      <!-- Transaction history -->
      <div class="transactions-section" *ngIf="hasCard">
        <h2 class="section-title">Historial de transacciones</h2>
        <div class="table-scroll">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Comercio</th>
                <th class="col-amount">Monto</th>
                <th class="col-status">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let tx of transactions; let i = index"
                class="table-row"
                [style.animation-delay]="i * 0.05 + 's'"
              >
                <td>{{ tx.date }}</td>
                <td>{{ tx.merchant }}</td>
                <td class="col-amount">{{ formatCurrency(tx.amount) }}</td>
                <td class="col-status">
                  <span
                    class="status-badge"
                    [ngClass]="{
                      'approved': tx.status === 'Aprobada',
                      'pending': tx.status === 'Pendiente',
                      'rejected': tx.status === 'Rechazada'
                    }"
                  >
                    {{ tx.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
export class DropicardNewComponent {
  readonly identity = inject(IdentityProfileService);

  hasCard = true;
  showFullCard = false;
  showCvv = false;

  cardHolder = 'MARIA OSSA LOPEZ';
  cardLast4 = '7842';
  cardExpiry = '09/28';
  cardCvv = '314';

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  transactions: Transaction[] = [
    {
      id: 1,
      date: '28/05/2026 3:45 pm',
      merchant: 'Shopify Payments',
      amount: 245000,
      status: 'Aprobada',
    },
    {
      id: 2,
      date: '25/05/2026 10:20 am',
      merchant: 'Google Ads',
      amount: 180500,
      status: 'Aprobada',
    },
    {
      id: 3,
      date: '22/05/2026 6:15 pm',
      merchant: 'Meta Ads (Facebook)',
      amount: 320000,
      status: 'Pendiente',
    },
    {
      id: 4,
      date: '18/05/2026 9:00 am',
      merchant: 'Amazon Web Services',
      amount: 95200,
      status: 'Aprobada',
    },
    {
      id: 5,
      date: '15/05/2026 2:30 pm',
      merchant: 'Canva Pro',
      amount: 52900,
      status: 'Rechazada',
    },
  ];

  toggleCardNumber(): void {
    this.showFullCard = !this.showFullCard;
  }

  toggleCvv(): void {
    this.showCvv = !this.showCvv;
  }

  onRequestCard(): void {
    if (this.identity.dropicardBloqueada()) {
      this.notify('Completa tu validación de identidad para solicitar tu Dropicard', 'info');
      return;
    }
    this.notify('Solicitud de tarjeta enviada correctamente', 'success');
    this.hasCard = true;
  }

  formatCurrency(amount: number): string {
    return '$ ' + amount.toLocaleString('es-CO');
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
