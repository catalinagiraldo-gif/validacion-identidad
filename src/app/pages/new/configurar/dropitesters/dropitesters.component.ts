import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tester {
  name: string;
  email: string;
  role: string;
  status: 'activo' | 'pendiente' | 'inactivo';
  invitedDate: string;
  lastActivity: string;
  testsCompleted: number;
}

@Component({
  selector: 'app-dropitesters-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./dropitesters.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configuraciones</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Dropitesters</span>
      </nav>

      <div class="page-header">
        <div>
          <h1 class="page-title">Dropitesters</h1>
          <p class="page-subtitle">Gestiona tu equipo de testers y sus accesos a prototipos</p>
        </div>
        <button class="btn-primary" (click)="showInviteModal = true">
          <i class="pi pi-user-plus"></i>
          Invitar tester
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background-color: #FEF8F1">
            <i class="pi pi-users" style="color: #FF6102"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ testers.length }}</span>
            <span class="stat-label">Total testers</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background-color: #E7F8F3">
            <i class="pi pi-check-circle" style="color: #0ABB87"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getActiveCount() }}</span>
            <span class="stat-label">Activos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background-color: #EEF6FE">
            <i class="pi pi-chart-line" style="color: #50A5F1"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getTotalTests() }}</span>
            <span class="stat-label">Tests completados</span>
          </div>
        </div>
      </div>

      <!-- Invite Link -->
      <div class="invite-link-card">
        <div class="invite-link-info">
          <i class="pi pi-link invite-link-icon"></i>
          <div>
            <span class="invite-link-title">Enlace de invitacion</span>
            <span class="invite-link-url">{{ inviteLink }}</span>
          </div>
        </div>
        <button class="btn-copy" (click)="copyInviteLink()">
          <i [class]="copied ? 'pi pi-check' : 'pi pi-copy'"></i>
          {{ copied ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>

      <!-- Search -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <input
            type="text"
            placeholder="Buscar testers..."
            [(ngModel)]="searchQuery"
          />
        </div>
        <select class="filter-select" [(ngModel)]="statusFilter">
          <option value="">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="pendiente">Pendientes</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      <!-- Testers List -->
      <div class="testers-list">
        <div
          class="tester-card"
          *ngFor="let tester of filteredTesters; let i = index"
          [style.animation-delay]="i * 40 + 'ms'"
        >
          <div class="tester-main">
            <div class="tester-avatar">{{ getInitial(tester.name) }}</div>
            <div class="tester-info">
              <span class="tester-name">{{ tester.name }}</span>
              <span class="tester-email">{{ tester.email }}</span>
            </div>
          </div>
          <div class="tester-meta">
            <div class="tester-meta-item">
              <span class="meta-label">Rol</span>
              <span class="meta-value">{{ tester.role }}</span>
            </div>
            <div class="tester-meta-item">
              <span class="meta-label">Tests</span>
              <span class="meta-value meta-value--bold">{{ tester.testsCompleted }}</span>
            </div>
            <div class="tester-meta-item">
              <span class="meta-label">Ultima actividad</span>
              <span class="meta-value">{{ tester.lastActivity }}</span>
            </div>
          </div>
          <div class="tester-actions">
            <span
              class="status-badge"
              [class.activo]="tester.status === 'activo'"
              [class.pendiente]="tester.status === 'pendiente'"
              [class.inactivo]="tester.status === 'inactivo'"
            >
              {{ tester.status | titlecase }}
            </span>
            <div class="action-buttons">
              <button class="action-btn" title="Reenviar invitacion" *ngIf="tester.status === 'pendiente'">
                <i class="pi pi-send"></i>
              </button>
              <button class="action-btn" title="Editar">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="action-btn action-btn--danger" title="Revocar acceso">
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Invite Modal -->
      <div class="modal-backdrop" *ngIf="showInviteModal" (click)="showInviteModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Invitar tester</h3>
            <button class="modal-close" (click)="showInviteModal = false">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-input" placeholder="Nombre del tester" />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" placeholder="correo@ejemplo.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Rol</label>
              <select class="form-select">
                <option value="">Seleccionar rol</option>
                <option>Tester interno</option>
                <option>Tester externo</option>
                <option>Product Designer</option>
                <option>Sponsor</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Mensaje personalizado (opcional)</label>
              <textarea class="form-textarea" placeholder="Escribe un mensaje de bienvenida..." rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showInviteModal = false">Cancelar</button>
            <button class="btn-primary" (click)="showInviteModal = false">
              <i class="pi pi-send"></i>
              Enviar invitacion
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DropitestersNewComponent {
  searchQuery = '';
  statusFilter = '';
  showInviteModal = false;
  copied = false;
  inviteLink = 'https://dropitesters.co/invite/abc123-xyz789';

  testers: Tester[] = [
    { name: 'Michel Pino', email: 'michel.pino@dropi.co', role: 'UX Engineer', status: 'activo', invitedDate: '10 Ene 2024', lastActivity: 'Hace 5 min', testsCompleted: 42 },
    { name: 'Laura Torres', email: 'laura.torres@dropi.co', role: 'Product Designer', status: 'activo', invitedDate: '10 Ene 2024', lastActivity: 'Hace 1 hora', testsCompleted: 38 },
    { name: 'Carlos Mendez', email: 'carlos.m@dropi.co', role: 'Tester interno', status: 'activo', invitedDate: '15 Ene 2024', lastActivity: 'Hace 2 horas', testsCompleted: 27 },
    { name: 'Ana Sofia Restrepo', email: 'ana.restrepo@gmail.com', role: 'Tester externo', status: 'activo', invitedDate: '20 Ene 2024', lastActivity: 'Ayer', testsCompleted: 15 },
    { name: 'Diego Vargas', email: 'diego.v@dropi.co', role: 'Tester interno', status: 'activo', invitedDate: '22 Ene 2024', lastActivity: 'Hace 3 horas', testsCompleted: 31 },
    { name: 'Patricia Gomez', email: 'patricia.g@outlook.com', role: 'Sponsor', status: 'activo', invitedDate: '01 Feb 2024', lastActivity: 'Hace 1 dia', testsCompleted: 8 },
    { name: 'Roberto Salazar', email: 'roberto.s@dropi.co', role: 'Tester interno', status: 'pendiente', invitedDate: '10 Feb 2024', lastActivity: 'Nunca', testsCompleted: 0 },
    { name: 'Valentina Cruz', email: 'valentina.c@gmail.com', role: 'Tester externo', status: 'pendiente', invitedDate: '12 Feb 2024', lastActivity: 'Nunca', testsCompleted: 0 },
    { name: 'Andres Moreno', email: 'andres.m@dropi.co', role: 'Product Designer', status: 'activo', invitedDate: '05 Feb 2024', lastActivity: 'Hoy', testsCompleted: 19 },
    { name: 'Camila Ospina', email: 'camila.o@hotmail.com', role: 'Tester externo', status: 'inactivo', invitedDate: '20 Dic 2023', lastActivity: 'Hace 30 dias', testsCompleted: 12 },
    { name: 'Fernando Rios', email: 'fernando.r@dropi.co', role: 'Tester interno', status: 'activo', invitedDate: '15 Feb 2024', lastActivity: 'Hace 4 horas', testsCompleted: 23 },
    { name: 'Isabella Jaramillo', email: 'isabella.j@gmail.com', role: 'Tester externo', status: 'activo', invitedDate: '18 Feb 2024', lastActivity: 'Ayer', testsCompleted: 9 },
    { name: 'Sebastian Cano', email: 'sebastian.c@dropi.co', role: 'Tester interno', status: 'inactivo', invitedDate: '10 Nov 2023', lastActivity: 'Hace 45 dias', testsCompleted: 35 },
    { name: 'Natalia Herrera', email: 'natalia.h@outlook.com', role: 'Sponsor', status: 'pendiente', invitedDate: '25 Feb 2024', lastActivity: 'Nunca', testsCompleted: 0 },
    { name: 'Gabriel Arango', email: 'gabriel.a@dropi.co', role: 'Product Designer', status: 'activo', invitedDate: '08 Feb 2024', lastActivity: 'Hoy', testsCompleted: 16 },
    { name: 'Daniela Ortega', email: 'daniela.o@gmail.com', role: 'Tester externo', status: 'activo', invitedDate: '20 Feb 2024', lastActivity: 'Hace 6 horas', testsCompleted: 7 },
    { name: 'Ricardo Betancur', email: 'ricardo.b@dropi.co', role: 'Tester interno', status: 'activo', invitedDate: '01 Mar 2024', lastActivity: 'Hoy', testsCompleted: 4 },
    { name: 'Paula Castillo', email: 'paula.c@hotmail.com', role: 'Tester externo', status: 'pendiente', invitedDate: '05 Mar 2024', lastActivity: 'Nunca', testsCompleted: 0 },
    { name: 'Jorge Echeverri', email: 'jorge.e@dropi.co', role: 'Tester interno', status: 'activo', invitedDate: '28 Feb 2024', lastActivity: 'Ayer', testsCompleted: 11 },
    { name: 'Sofia Ramirez', email: 'sofia.r@gmail.com', role: 'Tester externo', status: 'activo', invitedDate: '02 Mar 2024', lastActivity: 'Hace 2 dias', testsCompleted: 5 },
  ];

  get filteredTesters(): Tester[] {
    return this.testers.filter(t => {
      const matchSearch = !this.searchQuery ||
        t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = !this.statusFilter || t.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  getActiveCount(): number {
    return this.testers.filter(t => t.status === 'activo').length;
  }

  getTotalTests(): number {
    return this.testers.reduce((sum, t) => sum + t.testsCompleted, 0);
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  copyInviteLink(): void {
    navigator.clipboard.writeText(this.inviteLink);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }
}
