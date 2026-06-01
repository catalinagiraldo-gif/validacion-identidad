import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

interface Carrier {
  rank: number;
  name: string;
  color: string;
  insureByDefault?: boolean;
}

@Component({
  selector: 'app-transportadoras-new',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  styleUrls: ['./transportadoras.component.scss'],
  template: `
    <div class="transportadoras-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Logistica</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item">Transportadora</span>
      </nav>

      <!-- Page header -->
      <div class="page-header">
        <h1 class="page-title">Preferencias de transportadoras</h1>
        <button class="btn-help" (click)="onHelpClick()">
          <i class="pi pi-question-circle"></i>
          Como elegir la mejor transportadora?
        </button>
      </div>

      <!-- Section description -->
      <div class="section-info">
        <h2 class="section-subtitle">Transportadora favorita</h2>
        <p class="section-description">
          Arrastra y suelta para seleccionar el orden de preferencia de tus
          transportadoras (Util para integraciones y cargue masivo)
        </p>
      </div>

      <!-- Ranked carrier list (drag & drop) -->
      <div
        class="carrier-list"
        cdkDropList
        (cdkDropListDropped)="onDrop($event)"
      >
        <div
          *ngFor="let carrier of carriers; let i = index"
          class="carrier-row"
          cdkDrag
          [style.animation-delay]="i * 0.04 + 's'"
        >
          <!-- Drag handle -->
          <div class="drag-handle" cdkDragHandle>
            <i class="pi pi-bars"></i>
          </div>

          <!-- Rank number -->
          <span class="rank-number">#{{ i + 1 }}</span>

          <!-- Carrier logo (circle with first letter) -->
          <div
            class="carrier-logo"
            [style.background-color]="carrier.color"
          >
            {{ carrier.name.charAt(0) }}
          </div>

          <!-- Carrier name -->
          <span class="carrier-name">{{ carrier.name }}</span>

          <!-- Insurance checkbox (only for #1) -->
          <label
            *ngIf="i === 0"
            class="insurance-check"
          >
            <input
              type="checkbox"
              [(ngModel)]="carrier.insureByDefault"
            />
            <span class="check-label">Asegurar paquete por defecto</span>
            <i
              class="pi pi-info-circle info-icon"
              title="Si activas esta opcion, todos los envios con esta transportadora tendran seguro automaticamente."
            ></i>
          </label>

          <!-- Drag placeholder -->
          <div class="carrier-placeholder" *cdkDragPlaceholder></div>
        </div>
      </div>

      <!-- Toast -->
      <div class="toast" *ngIf="showToast" [ngClass]="toastType">
        <i
          class="pi"
          [ngClass]="{
            'pi-check-circle': toastType === 'success',
            'pi-info-circle': toastType === 'info'
          }"
        ></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  `,
})
export class TransportadorasNewComponent {
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  carriers: Carrier[] = [
    { rank: 1, name: 'ENVIA', color: '#E53935', insureByDefault: false },
    { rank: 2, name: 'INTERRAPIDISIMO', color: '#7B1FA2' },
    { rank: 3, name: 'DOMINA', color: '#1565C0' },
    { rank: 4, name: 'COORDINADORA', color: '#00838F' },
    { rank: 5, name: 'VELOCES', color: '#C62828' },
    { rank: 6, name: '99MINUTOS', color: '#FF8F00' },
    { rank: 7, name: 'TCC', color: '#D32F2F' },
    { rank: 8, name: 'JAMV-DRIVE', color: '#0277BD' },
  ];

  onDrop(event: CdkDragDrop<Carrier[]>): void {
    moveItemInArray(this.carriers, event.previousIndex, event.currentIndex);
    this.carriers.forEach((c, i) => (c.rank = i + 1));
    this.notify(
      `${this.carriers[event.currentIndex].name} movida a posicion #${event.currentIndex + 1}`,
      'success',
    );
  }

  onHelpClick(): void {
    this.notify(
      'Elige la transportadora segun cobertura, tiempos y costos de envio.',
      'info',
    );
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
