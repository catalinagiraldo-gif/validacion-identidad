import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Recoleccion {
  id: number;
  adminId: string;
  garantiaId: number;
  ordenId: number;
  fechaCreacion: string;
  transportadora: string;
  fechaRecepcion: string;
  selected: boolean;
}

@Component({
  selector: 'app-garantias-recolecciones-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./garantias-recolecciones.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-right"></i>
        </span>
        <span class="breadcrumb-item muted">Pedidos</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-right"></i>
        </span>
        <span class="breadcrumb-item muted">Garant&iacute;as</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-right"></i>
        </span>
        <span class="breadcrumb-item active">Garant&iacute;as recolecciones</span>
      </nav>

      <!-- Header row -->
      <div class="page-header">
        <h1 class="page-title">Garant&iacute;as recolecciones</h1>
        <button class="btn-exportar" (click)="exportar()">
          Exportar
        </button>
      </div>

      <!-- Action bar -->
      <div class="action-bar">
        <button class="btn-actualizacion" (click)="actualizacionMasiva()">
          Actualizaci&oacute;n masiva
        </button>
        <button class="btn-filter" (click)="toggleFilter()">
          <i class="pi pi-filter"></i>
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th class="col-checkbox">
                  <input
                    type="checkbox"
                    [checked]="allSelected"
                    (change)="toggleSelectAll()"
                  />
                </th>
                <th class="col-actions">
                  <i class="pi pi-pencil"></i>
                </th>
                <th class="col-id">Id</th>
                <th class="col-admin">Admin Id</th>
                <th class="col-garantia">Garant&iacute;a Id</th>
                <th class="col-orden">Orden Id</th>
                <th class="col-fecha-creacion">Fecha de Creaci&oacute;n</th>
                <th class="col-transportadora">Transportadora</th>
                <th class="col-fecha-recepcion">Fecha de re...</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let item of paginatedRecolecciones; let i = index"
                [class.row-selected]="item.selected"
              >
                <td class="col-checkbox">
                  <input
                    type="checkbox"
                    [(ngModel)]="item.selected"
                    (change)="updateSelectAll()"
                  />
                </td>
                <td class="col-actions">
                  <button class="btn-edit" (click)="editRow(item)">
                    <i class="pi pi-pencil"></i>
                  </button>
                </td>
                <td class="col-id">{{ item.id }}</td>
                <td class="col-admin">{{ item.adminId }}</td>
                <td class="col-garantia">{{ item.garantiaId }}</td>
                <td class="col-orden">{{ item.ordenId }}</td>
                <td class="col-fecha-creacion">{{ item.fechaCreacion }}</td>
                <td class="col-transportadora">{{ item.transportadora }}</td>
                <td class="col-fecha-recepcion">{{ item.fechaRecepcion }}</td>
              </tr>

              <!-- Empty state -->
              <tr *ngIf="paginatedRecolecciones.length === 0">
                <td colspan="9" class="empty-state">
                  <i class="pi pi-inbox"></i>
                  <span>No se encontraron recolecciones</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button
            class="pagination-btn"
            [disabled]="currentPage === 1"
            (click)="goToPage(1)"
          >
            &laquo;
          </button>
          <button
            class="pagination-btn"
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
          >
            &lsaquo;
          </button>
          <button
            *ngFor="let page of visiblePages"
            class="pagination-btn"
            [class.active]="page === currentPage"
            (click)="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="pagination-btn"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
          >
            &rsaquo;
          </button>
          <button
            class="pagination-btn"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(totalPages)"
          >
            &raquo;
          </button>
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
export class GarantiasRecoleccionesNewComponent {
  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Select all
  allSelected = false;

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  // Mock data
  recolecciones: Recoleccion[] = [
    {
      id: 50028,
      adminId: 'wendy.rojas@dropi.co',
      garantiaId: 37458,
      ordenId: 29380223,
      fechaCreacion: '2026-12-18T20:12:03.000000Z',
      transportadora: 'ENVIA',
      fechaRecepcion: '2026-12-01 00:00:00',
      selected: false,
    },
    {
      id: 50029,
      adminId: 'carlos.perez@dropi.co',
      garantiaId: 37459,
      ordenId: 29380224,
      fechaCreacion: '2026-12-19T10:30:00.000000Z',
      transportadora: 'INTERRAPIDISIMO',
      fechaRecepcion: '2026-12-02 00:00:00',
      selected: false,
    },
    {
      id: 50030,
      adminId: 'laura.martinez@dropi.co',
      garantiaId: 37460,
      ordenId: 29380225,
      fechaCreacion: '2026-12-20T08:45:00.000000Z',
      transportadora: 'SERVIENTREGA',
      fechaRecepcion: '2026-12-03 00:00:00',
      selected: false,
    },
    {
      id: 50031,
      adminId: 'andres.lopez@dropi.co',
      garantiaId: 37461,
      ordenId: 29380226,
      fechaCreacion: '2026-12-21T14:20:00.000000Z',
      transportadora: 'COORDINADORA',
      fechaRecepcion: '2026-12-04 00:00:00',
      selected: false,
    },
    {
      id: 50032,
      adminId: 'maria.garcia@dropi.co',
      garantiaId: 37462,
      ordenId: 29380227,
      fechaCreacion: '2026-12-22T11:00:00.000000Z',
      transportadora: 'ENVIA',
      fechaRecepcion: '2026-12-05 00:00:00',
      selected: false,
    },
    {
      id: 50033,
      adminId: 'juan.rodriguez@dropi.co',
      garantiaId: 37463,
      ordenId: 29380228,
      fechaCreacion: '2026-12-23T09:15:00.000000Z',
      transportadora: 'TCC',
      fechaRecepcion: '2026-12-06 00:00:00',
      selected: false,
    },
    {
      id: 50034,
      adminId: 'diana.hernandez@dropi.co',
      garantiaId: 37464,
      ordenId: 29380229,
      fechaCreacion: '2026-12-24T16:30:00.000000Z',
      transportadora: 'INTERRAPIDISIMO',
      fechaRecepcion: '2026-12-07 00:00:00',
      selected: false,
    },
    {
      id: 50035,
      adminId: 'pedro.sanchez@dropi.co',
      garantiaId: 37465,
      ordenId: 29380230,
      fechaCreacion: '2026-12-25T07:45:00.000000Z',
      transportadora: 'SERVIENTREGA',
      fechaRecepcion: '2026-12-08 00:00:00',
      selected: false,
    },
    {
      id: 50036,
      adminId: 'sofia.ramirez@dropi.co',
      garantiaId: 37466,
      ordenId: 29380231,
      fechaCreacion: '2026-12-26T13:00:00.000000Z',
      transportadora: 'COORDINADORA',
      fechaRecepcion: '2026-12-09 00:00:00',
      selected: false,
    },
    {
      id: 50037,
      adminId: 'nicolas.castro@dropi.co',
      garantiaId: 37467,
      ordenId: 29380232,
      fechaCreacion: '2026-12-27T10:30:00.000000Z',
      transportadora: 'ENVIA',
      fechaRecepcion: '2026-12-10 00:00:00',
      selected: false,
    },
    {
      id: 50038,
      adminId: 'camila.ortiz@dropi.co',
      garantiaId: 37468,
      ordenId: 29380233,
      fechaCreacion: '2026-12-28T15:00:00.000000Z',
      transportadora: 'TCC',
      fechaRecepcion: '2026-12-11 00:00:00',
      selected: false,
    },
    {
      id: 50039,
      adminId: 'santiago.morales@dropi.co',
      garantiaId: 37469,
      ordenId: 29380234,
      fechaCreacion: '2026-12-29T08:00:00.000000Z',
      transportadora: 'INTERRAPIDISIMO',
      fechaRecepcion: '2026-12-12 00:00:00',
      selected: false,
    },
    {
      id: 50040,
      adminId: 'valentina.torres@dropi.co',
      garantiaId: 37470,
      ordenId: 29380235,
      fechaCreacion: '2026-12-30T12:15:00.000000Z',
      transportadora: 'SERVIENTREGA',
      fechaRecepcion: '2026-12-13 00:00:00',
      selected: false,
    },
    {
      id: 50041,
      adminId: 'david.vargas@dropi.co',
      garantiaId: 37471,
      ordenId: 29380236,
      fechaCreacion: '2026-12-31T17:45:00.000000Z',
      transportadora: 'COORDINADORA',
      fechaRecepcion: '2026-12-14 00:00:00',
      selected: false,
    },
    {
      id: 50042,
      adminId: 'isabela.jimenez@dropi.co',
      garantiaId: 37472,
      ordenId: 29380237,
      fechaCreacion: '2027-01-01T09:30:00.000000Z',
      transportadora: 'ENVIA',
      fechaRecepcion: '2026-12-15 00:00:00',
      selected: false,
    },
    {
      id: 50043,
      adminId: 'felipe.ruiz@dropi.co',
      garantiaId: 37473,
      ordenId: 29380238,
      fechaCreacion: '2027-01-02T11:00:00.000000Z',
      transportadora: 'TCC',
      fechaRecepcion: '2026-12-16 00:00:00',
      selected: false,
    },
    {
      id: 50044,
      adminId: 'paula.mendoza@dropi.co',
      garantiaId: 37474,
      ordenId: 29380239,
      fechaCreacion: '2027-01-03T14:30:00.000000Z',
      transportadora: 'INTERRAPIDISIMO',
      fechaRecepcion: '2026-12-17 00:00:00',
      selected: false,
    },
    {
      id: 50045,
      adminId: 'miguel.cardenas@dropi.co',
      garantiaId: 37475,
      ordenId: 29380240,
      fechaCreacion: '2027-01-04T16:00:00.000000Z',
      transportadora: 'SERVIENTREGA',
      fechaRecepcion: '2026-12-18 00:00:00',
      selected: false,
    },
    {
      id: 50046,
      adminId: 'daniela.silva@dropi.co',
      garantiaId: 37476,
      ordenId: 29380241,
      fechaCreacion: '2027-01-05T10:45:00.000000Z',
      transportadora: 'COORDINADORA',
      fechaRecepcion: '2026-12-19 00:00:00',
      selected: false,
    },
    {
      id: 50047,
      adminId: 'alejandro.rios@dropi.co',
      garantiaId: 37477,
      ordenId: 29380242,
      fechaCreacion: '2027-01-06T13:15:00.000000Z',
      transportadora: 'ENVIA',
      fechaRecepcion: '2026-12-20 00:00:00',
      selected: false,
    },
  ];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.recolecciones.length / this.pageSize));
  }

  get paginatedRecolecciones(): Recoleccion[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.recolecciones.slice(start, start + this.pageSize);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateSelectAll();
    }
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    this.paginatedRecolecciones.forEach(r => (r.selected = this.allSelected));
  }

  updateSelectAll(): void {
    const paginated = this.paginatedRecolecciones;
    this.allSelected =
      paginated.length > 0 && paginated.every(r => r.selected);
  }

  editRow(item: Recoleccion): void {
    this.notify(`Editando recoleccion ${item.id}`, 'info');
  }

  exportar(): void {
    this.notify('Exportando datos...', 'success');
  }

  actualizacionMasiva(): void {
    const selected = this.recolecciones.filter(r => r.selected);
    if (selected.length === 0) {
      this.notify('Seleccione al menos un registro', 'info');
      return;
    }
    this.notify(
      `Actualizacion masiva de ${selected.length} registro(s)`,
      'success'
    );
  }

  toggleFilter(): void {
    this.notify('Filtros abiertos', 'info');
  }

  private notify(
    msg: string,
    type: 'success' | 'info' = 'success'
  ): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
