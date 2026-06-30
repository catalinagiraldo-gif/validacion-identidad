import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Etiqueta {
  id: number;
  nombre: string;
  color: 'pink' | 'green';
  creadoPor: string;
}

@Component({
  selector: 'app-etiquetas-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./etiquetas.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item breadcrumb-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Pedidos</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Preferencias</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Etiquetas</span>
      </nav>

      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Etiquetas</h1>
        <button class="btn-nueva-etiqueta" (click)="onNuevaEtiqueta()">
          <i class="pi pi-plus"></i>
          <span>Nueva Etiqueta</span>
        </button>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="etiquetas-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th class="col-etiqueta">Etiqueta</th>
              <th class="col-nombre">Nombre etiqueta</th>
              <th class="col-creado">Creado por</th>
              <th class="col-detalles">Detalles</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of pagedEtiquetas; let i = index"
              [style.animation-delay]="i * 30 + 'ms'"
              class="etiqueta-row"
            >
              <td class="col-num">{{ item.id }}</td>
              <td class="col-etiqueta">
                <img
                  [src]="item.color === 'pink' ? tagPinkIcon : tagGreenIcon"
                  alt="Etiqueta"
                  class="tag-icon"
                />
              </td>
              <td class="col-nombre">{{ item.nombre }}</td>
              <td class="col-creado">{{ item.creadoPor }}</td>
              <td class="col-detalles">
                <div class="action-icons">
                  <button class="action-icon-btn" aria-label="Eliminar etiqueta" (click)="onDelete(item)">
                    <img [src]="trashIcon" alt="Eliminar" />
                  </button>
                  <button class="action-icon-btn" aria-label="Editar etiqueta" (click)="onEdit(item)">
                    <img [src]="userEditIcon" alt="Editar" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginator -->
      <div class="paginator" *ngIf="totalPages > 1">
        <button class="paginator-btn" [disabled]="currentPage === 1" (click)="goToPage(1)" aria-label="Primera pagina">
          <i class="pi pi-angle-double-left"></i>
        </button>
        <button class="paginator-btn" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)" aria-label="Pagina anterior">
          <i class="pi pi-angle-left"></i>
        </button>
        <button
          *ngFor="let page of pageNumbers"
          class="paginator-btn paginator-number"
          [class.active]="page === currentPage"
          (click)="goToPage(page)"
        >
          {{ page }}
        </button>
        <button class="paginator-btn" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)" aria-label="Pagina siguiente">
          <i class="pi pi-angle-right"></i>
        </button>
        <button class="paginator-btn" [disabled]="currentPage === totalPages" (click)="goToPage(totalPages)" aria-label="Ultima pagina">
          <i class="pi pi-angle-double-right"></i>
        </button>
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
export class EtiquetasNewComponent {
  readonly tagPinkIcon = 'assets/images/pedidos/etiquetas/tag-pink.svg';
  readonly tagGreenIcon = 'assets/images/pedidos/etiquetas/tag-green.svg';
  readonly trashIcon = 'assets/images/pedidos/etiquetas/trash.svg';
  readonly userEditIcon = 'assets/images/pedidos/etiquetas/user-edit.svg';

  pageSize = 10;
  currentPage = 1;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  etiquetas: Etiqueta[] = [
    { id: 1, nombre: 'Devuelto', color: 'pink', creadoPor: 'Alejandra Melo' },
    { id: 2, nombre: 'Pago', color: 'green', creadoPor: 'Alejandra Melo' },
    { id: 3, nombre: 'Cliente VIP', color: 'green', creadoPor: 'Carlos Ramirez' },
    { id: 4, nombre: 'Pedido urgente', color: 'pink', creadoPor: 'Laura Gomez' },
    { id: 5, nombre: 'Verificado', color: 'green', creadoPor: 'Daniela Vargas' },
    { id: 6, nombre: 'Pendiente revision', color: 'pink', creadoPor: 'Andres Castro' },
    { id: 7, nombre: 'Reembolsado', color: 'pink', creadoPor: 'Alejandra Melo' },
    { id: 8, nombre: 'Cliente frecuente', color: 'green', creadoPor: 'Maria Paola Diaz' },
    { id: 9, nombre: 'Garantia activa', color: 'green', creadoPor: 'Sebastian Ruiz' },
    { id: 10, nombre: 'Direccion incompleta', color: 'pink', creadoPor: 'Camila Andrade' },
    { id: 11, nombre: 'Pago confirmado', color: 'green', creadoPor: 'Felipe Ortiz' },
    { id: 12, nombre: 'Devolucion en transito', color: 'pink', creadoPor: 'Valentina Rios' },
    { id: 13, nombre: 'Producto agotado', color: 'pink', creadoPor: 'Nicolas Pena' },
    { id: 14, nombre: 'Cliente nuevo', color: 'green', creadoPor: 'Isabela Suarez' },
    { id: 15, nombre: 'Contactar cliente', color: 'pink', creadoPor: 'Mateo Jaramillo' },
    { id: 16, nombre: 'Entrega exitosa', color: 'green', creadoPor: 'Juliana Pelaez' },
    { id: 17, nombre: 'Cambio de direccion', color: 'pink', creadoPor: 'Alejandro Vega' },
    { id: 18, nombre: 'Cartera al dia', color: 'green', creadoPor: 'Natalia Cuesta' },
    { id: 19, nombre: 'Riesgo de fraude', color: 'pink', creadoPor: 'David Salazar' },
    { id: 20, nombre: 'Promocion aplicada', color: 'green', creadoPor: 'Mariana Lopez' },
    { id: 21, nombre: 'Cliente mayorista', color: 'green', creadoPor: 'Santiago Mejia' },
    { id: 22, nombre: 'Reclamo abierto', color: 'pink', creadoPor: 'Daniela Vargas' },
  ];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.etiquetas.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedEtiquetas(): Etiqueta[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.etiquetas.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  onNuevaEtiqueta(): void {
    this.notify('Funcionalidad de creacion de etiqueta proximamente', 'info');
  }

  onEdit(item: Etiqueta): void {
    this.notify(`Editar etiqueta "${item.nombre}"`, 'info');
  }

  onDelete(item: Etiqueta): void {
    this.etiquetas = this.etiquetas.filter(e => e.id !== item.id);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.notify(`Etiqueta "${item.nombre}" eliminada`, 'success');
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
