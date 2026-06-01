import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  name: string;
  email: string;
  role: string;
  status: 'activo' | 'inactivo' | 'pendiente';
  lastLogin: string;
  avatar?: string;
}

@Component({
  selector: 'app-usuarios-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./usuarios.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configuraciones</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Usuarios</span>
      </nav>

      <div class="page-header">
        <div>
          <h1 class="page-title">Usuarios</h1>
          <p class="page-subtitle">Gestiona los usuarios y permisos de tu equipo</p>
        </div>
        <button class="btn-primary" (click)="showAddModal = true">
          <i class="pi pi-plus"></i>
          Agregar usuario
        </button>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-pill">
          <span class="stat-number">{{ users.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-pill stat-pill--success">
          <span class="stat-number">{{ getByStatus('activo') }}</span>
          <span class="stat-label">Activos</span>
        </div>
        <div class="stat-pill stat-pill--warning">
          <span class="stat-number">{{ getByStatus('pendiente') }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-pill stat-pill--gray">
          <span class="stat-number">{{ getByStatus('inactivo') }}</span>
          <span class="stat-label">Inactivos</span>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            [(ngModel)]="searchQuery"
          />
        </div>
        <select class="filter-select" [(ngModel)]="roleFilter">
          <option value="">Todos los roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Operador">Operador</option>
          <option value="Visor">Visor</option>
        </select>
      </div>

      <!-- Users Table -->
      <div class="table-card">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Ultima conexion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">{{ getInitial(user.name) }}</div>
                    <span class="user-name">{{ user.name }}</span>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span
                    class="status-badge"
                    [class.activo]="user.status === 'activo'"
                    [class.pendiente]="user.status === 'pendiente'"
                    [class.inactivo]="user.status === 'inactivo'"
                  >
                    <span class="status-dot"></span>
                    {{ user.status | titlecase }}
                  </span>
                </td>
                <td class="meta-cell">{{ user.lastLogin }}</td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn" title="Editar">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="action-btn action-btn--danger" title="Eliminar">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add User Modal -->
      <div class="modal-backdrop" *ngIf="showAddModal" (click)="showAddModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Agregar usuario</h3>
            <button class="modal-close" (click)="showAddModal = false">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input type="text" class="form-input" placeholder="Nombre del usuario" />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" placeholder="correo@ejemplo.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Rol</label>
              <select class="form-select">
                <option value="">Seleccionar rol</option>
                <option>Admin</option>
                <option>Editor</option>
                <option>Operador</option>
                <option>Visor</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showAddModal = false">Cancelar</button>
            <button class="btn-primary" (click)="showAddModal = false">Agregar</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UsuariosNewComponent {
  searchQuery = '';
  roleFilter = '';
  showAddModal = false;

  users: User[] = [
    { name: 'Alejandra Martinez', email: 'alejandra@dropi.co', role: 'Admin', status: 'activo', lastLogin: 'Hace 5 minutos' },
    { name: 'Carlos Rodriguez', email: 'carlos.r@dropi.co', role: 'Editor', status: 'activo', lastLogin: 'Hace 1 hora' },
    { name: 'Maria Lopez', email: 'maria.l@dropi.co', role: 'Operador', status: 'activo', lastLogin: 'Hace 2 horas' },
    { name: 'Juan Perez', email: 'juan.p@dropi.co', role: 'Visor', status: 'pendiente', lastLogin: 'Nunca' },
    { name: 'Ana Garcia', email: 'ana.g@dropi.co', role: 'Editor', status: 'activo', lastLogin: 'Hace 30 minutos' },
    { name: 'Diego Martinez', email: 'diego.m@dropi.co', role: 'Operador', status: 'inactivo', lastLogin: 'Hace 15 dias' },
    { name: 'Laura Sanchez', email: 'laura.s@dropi.co', role: 'Visor', status: 'activo', lastLogin: 'Hace 3 horas' },
    { name: 'Pedro Gomez', email: 'pedro.g@dropi.co', role: 'Editor', status: 'activo', lastLogin: 'Ayer' },
    { name: 'Sofia Torres', email: 'sofia.t@dropi.co', role: 'Operador', status: 'pendiente', lastLogin: 'Nunca' },
    { name: 'Andres Ramirez', email: 'andres.r@dropi.co', role: 'Admin', status: 'activo', lastLogin: 'Hace 1 hora' },
    { name: 'Camila Herrera', email: 'camila.h@dropi.co', role: 'Visor', status: 'activo', lastLogin: 'Hace 4 horas' },
    { name: 'Ricardo Morales', email: 'ricardo.m@dropi.co', role: 'Operador', status: 'inactivo', lastLogin: 'Hace 30 dias' },
    { name: 'Valentina Diaz', email: 'valentina.d@dropi.co', role: 'Editor', status: 'activo', lastLogin: 'Hoy' },
    { name: 'Fernando Castro', email: 'fernando.c@dropi.co', role: 'Visor', status: 'activo', lastLogin: 'Hace 6 horas' },
    { name: 'Isabella Vargas', email: 'isabella.v@dropi.co', role: 'Operador', status: 'pendiente', lastLogin: 'Nunca' },
    { name: 'Alejandro Ruiz', email: 'alejandro.r@dropi.co', role: 'Admin', status: 'activo', lastLogin: 'Hace 20 minutos' },
    { name: 'Daniela Ortiz', email: 'daniela.o@dropi.co', role: 'Editor', status: 'activo', lastLogin: 'Ayer' },
    { name: 'Sebastian Jimenez', email: 'sebastian.j@dropi.co', role: 'Visor', status: 'inactivo', lastLogin: 'Hace 45 dias' },
    { name: 'Natalia Mendoza', email: 'natalia.m@dropi.co', role: 'Operador', status: 'activo', lastLogin: 'Hace 2 horas' },
    { name: 'Gabriel Rojas', email: 'gabriel.r@dropi.co', role: 'Editor', status: 'activo', lastLogin: 'Hoy' },
  ];

  get filteredUsers(): User[] {
    return this.users.filter(u => {
      const matchSearch = !this.searchQuery ||
        u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchRole = !this.roleFilter || u.role === this.roleFilter;
      return matchSearch && matchRole;
    });
  }

  getByStatus(status: string): number {
    return this.users.filter(u => u.status === status).length;
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
