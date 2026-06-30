import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
  fechaCreacion: string;
  ultimoLogin: string;
  parentUsuarioId: string;
  parentCelular: string;
  parentEmail: string;
  avatar?: string;
  initials?: string;
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
        <span class="breadcrumb-item">Configurar</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Usuarios</span>
      </nav>

      <div class="page-header">
        <h1 class="page-title">Usuarios</h1>
        <button class="btn-primary" (click)="showAddModal = true">
          <i class="pi pi-plus"></i>
          Agregar
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <button class="btn-permisos">
          <i class="pi pi-lock"></i>
          Permisos globles
        </button>
        <div class="search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <input
            type="text"
            placeholder="Buscar"
            [(ngModel)]="searchQuery"
          />
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-card">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th class="col-avatar"></th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Fecha de Creación</th>
                <th>Último login</th>
                <th>Parent</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of pagedUsers">
                <td class="col-avatar">
                  <div class="user-avatar" [class.user-avatar--initials]="!user.avatar">
                    <img *ngIf="user.avatar" [src]="user.avatar" [alt]="user.name" />
                    <span *ngIf="!user.avatar">{{ user.initials || getInitials(user.name) }}</span>
                  </div>
                </td>
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="status-tag" [class.activo]="user.estado === 'Activo'" [class.inactivo]="user.estado === 'Inactivo'">
                    {{ user.estado }}
                  </span>
                </td>
                <td class="meta-cell">{{ user.fechaCreacion }}</td>
                <td class="meta-cell">{{ user.ultimoLogin }}</td>
                <td class="parent-cell">
                  <span>Usuario ID: {{ user.parentUsuarioId }}</span>
                  <span>Cel Usuario: {{ user.parentCelular }}</span>
                  <span>Email: {{ user.parentEmail }}</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn" title="Editar usuario">
                      <i class="pi pi-user-edit"></i>
                    </button>
                    <button class="action-btn" title="Permisos">
                      <i class="pi pi-lock"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar">
        <button class="page-nav" [disabled]="currentPage === 1" (click)="goToPage(1)">
          <i class="pi pi-angle-double-left"></i>
        </button>
        <button class="page-nav" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">
          <i class="pi pi-angle-left"></i>
        </button>
        <button
          class="page-number"
          *ngFor="let page of pageNumbers"
          [class.active]="page === currentPage"
          (click)="goToPage(page)"
        >
          {{ page }}
        </button>
        <button class="page-nav" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">
          <i class="pi pi-angle-right"></i>
        </button>
        <button class="page-nav" [disabled]="currentPage === totalPages" (click)="goToPage(totalPages)">
          <i class="pi pi-angle-double-right"></i>
        </button>
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
              <label class="form-label">Correo</label>
              <input type="email" class="form-input" placeholder="correo@ejemplo.com" />
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
  showAddModal = false;
  currentPage = 1;
  pageSize = 4;

  users: User[] = [
    { id: 176293, name: 'Paola Angulo', email: 'paola@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=47' },
    { id: 176294, name: 'Diana Aldana', email: 'Diana@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=32' },
    { id: 176295, name: 'Maria Ossa', email: 'maria@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=44' },
    { id: 176296, name: 'Michael Martínez', email: 'michael@gmail.com', estado: 'Activo', fechaCreacion: '08/03/2024 17:45 pm', ultimoLogin: '08/03/2024 17:45 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'MG' },
    { id: 176297, name: 'Carlos Rodriguez', email: 'carlos.r@gmail.com', estado: 'Activo', fechaCreacion: '09/03/2024 09:12 am', ultimoLogin: '10/03/2024 08:02 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=12' },
    { id: 176298, name: 'Juan Perez', email: 'juan.p@gmail.com', estado: 'Inactivo', fechaCreacion: '09/03/2024 09:30 am', ultimoLogin: '15/02/2024 14:21 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'JP' },
    { id: 176299, name: 'Ana Garcia', email: 'ana.g@gmail.com', estado: 'Activo', fechaCreacion: '09/03/2024 10:05 am', ultimoLogin: '10/03/2024 07:40 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=25' },
    { id: 176300, name: 'Diego Martinez', email: 'diego.m@gmail.com', estado: 'Inactivo', fechaCreacion: '10/03/2024 11:00 am', ultimoLogin: '20/02/2024 16:10 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'DM' },
    { id: 176301, name: 'Laura Sanchez', email: 'laura.s@gmail.com', estado: 'Activo', fechaCreacion: '10/03/2024 13:22 pm', ultimoLogin: '10/03/2024 13:22 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=29' },
    { id: 176302, name: 'Pedro Gomez', email: 'pedro.g@gmail.com', estado: 'Activo', fechaCreacion: '11/03/2024 08:15 am', ultimoLogin: '11/03/2024 18:00 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'PG' },
    { id: 176303, name: 'Sofia Torres', email: 'sofia.t@gmail.com', estado: 'Inactivo', fechaCreacion: '11/03/2024 09:45 am', ultimoLogin: '01/02/2024 12:00 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=20' },
    { id: 176304, name: 'Andres Ramirez', email: 'andres.r@gmail.com', estado: 'Activo', fechaCreacion: '12/03/2024 10:30 am', ultimoLogin: '12/03/2024 17:50 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'AR' },
    { id: 176305, name: 'Camila Herrera', email: 'camila.h@gmail.com', estado: 'Activo', fechaCreacion: '12/03/2024 14:00 pm', ultimoLogin: '13/03/2024 09:05 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=33' },
    { id: 176306, name: 'Ricardo Morales', email: 'ricardo.m@gmail.com', estado: 'Inactivo', fechaCreacion: '13/03/2024 08:00 am', ultimoLogin: '15/01/2024 10:00 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'RM' },
    { id: 176307, name: 'Valentina Diaz', email: 'valentina.d@gmail.com', estado: 'Activo', fechaCreacion: '13/03/2024 11:11 am', ultimoLogin: '14/03/2024 19:30 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=38' },
    { id: 176308, name: 'Fernando Castro', email: 'fernando.c@gmail.com', estado: 'Activo', fechaCreacion: '14/03/2024 09:09 am', ultimoLogin: '14/03/2024 15:05 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'FC' },
    { id: 176309, name: 'Isabella Vargas', email: 'isabella.v@gmail.com', estado: 'Inactivo', fechaCreacion: '14/03/2024 16:40 pm', ultimoLogin: '28/01/2024 10:25 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=41' },
    { id: 176310, name: 'Alejandro Ruiz', email: 'alejandro.r@gmail.com', estado: 'Activo', fechaCreacion: '15/03/2024 08:50 am', ultimoLogin: '15/03/2024 18:18 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'AR' },
    { id: 176311, name: 'Daniela Ortiz', email: 'daniela.o@gmail.com', estado: 'Activo', fechaCreacion: '15/03/2024 12:12 pm', ultimoLogin: '16/03/2024 08:08 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=45' },
    { id: 176312, name: 'Sebastian Jimenez', email: 'sebastian.j@gmail.com', estado: 'Inactivo', fechaCreacion: '16/03/2024 10:00 am', ultimoLogin: '02/02/2024 09:40 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'SJ' },
    { id: 176313, name: 'Natalia Mendoza', email: 'natalia.m@gmail.com', estado: 'Activo', fechaCreacion: '16/03/2024 13:33 pm', ultimoLogin: '17/03/2024 07:15 am', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', avatar: 'https://i.pravatar.cc/80?img=48' },
    { id: 176314, name: 'Gabriel Rojas', email: 'gabriel.r@gmail.com', estado: 'Activo', fechaCreacion: '17/03/2024 09:09 am', ultimoLogin: '17/03/2024 20:20 pm', parentUsuarioId: '74525', parentCelular: '315236235', parentEmail: 'alejandra@gmail.com', initials: 'GR' },
  ];

  get filteredUsers(): User[] {
    return this.users.filter(u => {
      const matchSearch = !this.searchQuery ||
        u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchSearch;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
