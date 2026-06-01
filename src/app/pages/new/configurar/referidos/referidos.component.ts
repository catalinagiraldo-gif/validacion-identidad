import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Referral {
  name: string;
  email: string;
  date: string;
  status: 'activo' | 'pendiente' | 'inactivo';
  commission: number;
}

@Component({
  selector: 'app-referidos-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./referidos.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configuraciones</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Referidos</span>
      </nav>

      <h1 class="page-title">Referidos</h1>

      <!-- Referral Link Card -->
      <div class="referral-link-card">
        <div class="referral-link-content">
          <div class="referral-icon">
            <i class="pi pi-share-alt"></i>
          </div>
          <div class="referral-link-info">
            <h3 class="referral-link-title">Tu enlace de referido</h3>
            <p class="referral-link-desc">Comparte este enlace y gana comisiones por cada usuario que se registre</p>
          </div>
        </div>
        <div class="referral-link-input-row">
          <div class="referral-link-box">
            <i class="pi pi-link"></i>
            <span class="referral-url">{{ referralLink }}</span>
          </div>
          <button class="btn-copy" (click)="copyLink()">
            <i [class]="copied ? 'pi pi-check' : 'pi pi-copy'"></i>
            {{ copied ? 'Copiado!' : 'Copiar' }}
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats">
          <div class="stat-icon-wrapper" [ngStyle]="{ 'background-color': stat.bgColor }">
            <i [class]="'pi ' + stat.icon" [ngStyle]="{ color: stat.iconColor }"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Referrals Table -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Lista de referidos</h3>
          <span class="table-count">{{ referrals.length }} referidos</span>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th>Comision</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ref of referrals">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-small">{{ getInitial(ref.name) }}</div>
                    <span>{{ ref.name }}</span>
                  </div>
                </td>
                <td>{{ ref.email }}</td>
                <td>{{ ref.date }}</td>
                <td>
                  <span
                    class="status-badge"
                    [class.activo]="ref.status === 'activo'"
                    [class.pendiente]="ref.status === 'pendiente'"
                    [class.inactivo]="ref.status === 'inactivo'"
                  >
                    {{ ref.status | titlecase }}
                  </span>
                </td>
                <td class="commission-cell">{{ formatPrice(ref.commission) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ReferidosNewComponent {
  referralLink = 'https://dropi.co/ref/alejandra-martinez-2024';
  copied = false;

  stats = [
    { label: 'Referidos totales', value: '24', icon: 'pi-users', bgColor: '#FEF8F1', iconColor: '#FF6102' },
    { label: 'Activos', value: '18', icon: 'pi-check-circle', bgColor: '#E7F8F3', iconColor: '#0ABB87' },
    { label: 'Comision ganada', value: '$ 1.250.000', icon: 'pi-wallet', bgColor: '#EEF6FE', iconColor: '#50A5F1' },
  ];

  referrals: Referral[] = [
    { name: 'Carlos Rodriguez', email: 'carlos.rodriguez@gmail.com', date: '15 Mar 2024', status: 'activo', commission: 85000 },
    { name: 'Maria Lopez', email: 'maria.lopez@outlook.com', date: '12 Mar 2024', status: 'activo', commission: 62000 },
    { name: 'Juan Perez', email: 'juan.perez@gmail.com', date: '08 Mar 2024', status: 'pendiente', commission: 0 },
    { name: 'Ana Garcia', email: 'ana.garcia@hotmail.com', date: '05 Mar 2024', status: 'activo', commission: 120000 },
    { name: 'Diego Martinez', email: 'diego.m@gmail.com', date: '01 Mar 2024', status: 'inactivo', commission: 45000 },
    { name: 'Laura Sanchez', email: 'laura.s@outlook.com', date: '28 Feb 2024', status: 'activo', commission: 93000 },
    { name: 'Pedro Gomez', email: 'pedro.gomez@gmail.com', date: '25 Feb 2024', status: 'activo', commission: 78000 },
    { name: 'Sofia Torres', email: 'sofia.t@hotmail.com', date: '20 Feb 2024', status: 'pendiente', commission: 0 },
    { name: 'Andres Ramirez', email: 'andres.r@gmail.com', date: '18 Feb 2024', status: 'activo', commission: 110000 },
    { name: 'Camila Herrera', email: 'camila.h@outlook.com', date: '15 Feb 2024', status: 'activo', commission: 56000 },
    { name: 'Ricardo Morales', email: 'ricardo.m@gmail.com', date: '12 Feb 2024', status: 'inactivo', commission: 32000 },
    { name: 'Valentina Diaz', email: 'valentina.d@gmail.com', date: '10 Feb 2024', status: 'activo', commission: 88000 },
    { name: 'Fernando Castro', email: 'fernando.c@outlook.com', date: '08 Feb 2024', status: 'activo', commission: 74000 },
    { name: 'Isabella Vargas', email: 'isabella.v@hotmail.com', date: '05 Feb 2024', status: 'pendiente', commission: 0 },
    { name: 'Alejandro Ruiz', email: 'alejandro.r@gmail.com', date: '01 Feb 2024', status: 'activo', commission: 95000 },
    { name: 'Daniela Ortiz', email: 'daniela.o@gmail.com', date: '28 Ene 2024', status: 'activo', commission: 67000 },
    { name: 'Sebastian Jimenez', email: 'sebastian.j@outlook.com', date: '25 Ene 2024', status: 'inactivo', commission: 41000 },
    { name: 'Natalia Mendoza', email: 'natalia.m@gmail.com', date: '22 Ene 2024', status: 'activo', commission: 83000 },
    { name: 'Gabriel Rojas', email: 'gabriel.r@hotmail.com', date: '20 Ene 2024', status: 'activo', commission: 52000 },
    { name: 'Paula Restrepo', email: 'paula.r@gmail.com', date: '18 Ene 2024', status: 'activo', commission: 69000 },
  ];

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  formatPrice(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.referralLink);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }
}
