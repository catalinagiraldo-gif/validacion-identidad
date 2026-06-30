import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Integration {
  id: number;
  tipo: string;
  nombre: string;
}

@Component({
  selector: 'app-integraciones-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./integraciones.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configurar</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Integraciones</span>
      </nav>

      <div class="page-header">
        <h1 class="page-title">Integraciones</h1>
        <button class="btn-add" (click)="onAdd()">
          <i class="pi pi-plus"></i>
          Agregar
        </button>
      </div>

      <!-- Integrations Table -->
      <div class="table-card">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Nombre de integración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let integration of integrations">
                <td>{{ integration.id }}</td>
                <td>{{ integration.tipo }}</td>
                <td>{{ integration.nombre }}</td>
                <td>
                  <div class="row-actions">
                    <i class="pi pi-eye action-icon" title="Ver" (click)="onView(integration)"></i>
                    <i class="pi pi-user-edit action-icon" title="Editar" (click)="onEdit(integration)"></i>
                    <i class="pi pi-trash action-icon" title="Eliminar" (click)="onDelete(integration)"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginator -->
        <div class="paginator">
          <button class="page-arrow" type="button" aria-label="Primera página">
            <i class="pi pi-angle-double-left"></i>
          </button>
          <button class="page-arrow" type="button" aria-label="Página anterior">
            <i class="pi pi-angle-left"></i>
          </button>
          <button class="page-number active" type="button">1</button>
          <button class="page-arrow" type="button" aria-label="Página siguiente">
            <i class="pi pi-angle-right"></i>
          </button>
          <button class="page-arrow" type="button" aria-label="Última página">
            <i class="pi pi-angle-double-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class IntegracionesNewComponent {
  integrations: Integration[] = [
    {
      id: 176293,
      tipo: 'CHATCENTER',
      nombre: 'chatcenter',
    },
    {
      id: 59296,
      tipo: 'Confirmacion de datos',
      nombre: 'milunos',
    },
  ];

  onAdd(): void {
    // Placeholder for "Agregar" action
  }

  onView(integration: Integration): void {
    // Placeholder for view action
  }

  onEdit(integration: Integration): void {
    // Placeholder for edit action
  }

  onDelete(integration: Integration): void {
    // Placeholder for delete action
  }
}
