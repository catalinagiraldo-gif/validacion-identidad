import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Novedad {
  id: number;
  date: string;
  userId: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  userType: string;
  clientName: string;
  clientPhone: string;
  novedad: string;
  carrier: string;
}

@Component({
  selector: 'app-novedades-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./novedades.component.scss'],
  template: `
    <div class="novedades-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Pedidos</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item">Novedades</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Novedades</h1>

      <!-- Action bar -->
      <div class="action-bar">
        <div class="action-bar-left">
          <!-- Acciones dropdown -->
          <div class="dropdown-wrapper">
            <button class="btn-acciones" (click)="toggleAccionesDropdown()">
              Acciones
              <i class="pi pi-chevron-down"></i>
            </button>
            <div class="dropdown-menu" *ngIf="showAccionesDropdown">
              <button class="dropdown-item" (click)="onAccion('exportar')">Exportar</button>
              <button class="dropdown-item" (click)="onAccion('marcar-leidas')">Marcar como leidas</button>
              <button class="dropdown-item" (click)="onAccion('archivar')">Archivar seleccionadas</button>
            </div>
          </div>

          <!-- Ir al Historial -->
          <button class="btn-historial">
            Ir al Historial de Novedades
          </button>
        </div>

        <div class="action-bar-right">
          <!-- Search -->
          <div class="search-input">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar novedad"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
            />
            <div class="search-dropdown">
              <select [(ngModel)]="searchField">
                <option value="all">Guia</option>
                <option value="id">ID</option>
                <option value="nombre">Nombre</option>
              </select>
              <i class="pi pi-chevron-down"></i>
            </div>
          </div>

          <!-- Filter button -->
          <button class="btn-filter" (click)="toggleFilter()">
            <i class="pi pi-filter"></i>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="novedades-table">
          <thead>
            <tr>
              <th class="col-edit">
                <i class="pi pi-pencil"></i>
              </th>
              <th class="col-id">#</th>
              <th class="col-date">Fecha de Novedad</th>
              <th class="col-tienda">Datos de la tienda</th>
              <th class="col-datos">Datos</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of paginatedNovedades; let i = index"
              [style.animation-delay]="i * 0.04 + 's'"
              class="table-row"
            >
              <td class="col-edit">
                <i class="pi pi-pencil row-icon"></i>
              </td>
              <td class="col-id">{{ item.id }}</td>
              <td class="col-date">{{ item.date }}</td>
              <td class="col-tienda">
                <div class="cell-multiline">
                  <span>Usuario Id: {{ item.userId }}</span>
                  <span>Usuario: {{ item.userName }}</span>
                  <span>Cel Usuario: {{ item.userPhone }}</span>
                  <span>Email: {{ item.userEmail }}</span>
                  <span class="user-type">{{ item.userType }}</span>
                </div>
              </td>
              <td class="col-datos">
                <div class="cell-multiline">
                  <span class="datos-name">{{ item.clientName }}</span>
                  <span>Telefono: {{ item.clientPhone }}</span>
                  <span>Novedad: {{ item.novedad }}</span>
                  <span>Transportadora: {{ item.carrier }}</span>
                </div>
              </td>
              <td class="col-actions">
                <div class="action-icons">
                  <button class="icon-btn check" (click)="onCheck(item)" title="Aprobar">
                    <i class="pi pi-check"></i>
                  </button>
                  <button class="icon-btn search" (click)="onView(item)" title="Ver detalle">
                    <i class="pi pi-search"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr *ngIf="filteredNovedades.length === 0">
              <td colspan="6" class="empty-state">
                <i class="pi pi-inbox"></i>
                <p>No se encontraron novedades</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 0">
        <button
          class="page-btn nav"
          [disabled]="currentPage === 1"
          (click)="goToPage(1)"
        >
          &laquo;
        </button>
        <button
          class="page-btn nav"
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)"
        >
          &lsaquo;
        </button>
        <button
          *ngFor="let page of visiblePages"
          class="page-btn"
          [class.active]="page === currentPage"
          (click)="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="page-btn nav"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)"
        >
          &rsaquo;
        </button>
        <button
          class="page-btn nav"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(totalPages)"
        >
          &raquo;
        </button>
      </div>

      <!-- Toast -->
      <div class="toast" *ngIf="showToast" [ngClass]="toastType">
        <i class="pi" [ngClass]="{
          'pi-check-circle': toastType === 'success',
          'pi-info-circle': toastType === 'info',
          'pi-times-circle': toastType === 'error'
        }"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  `,
})
export class NovedadesNewComponent {
  searchQuery = '';
  searchField = 'all';
  showAccionesDropdown = false;
  showFilter = false;
  currentPage = 1;
  itemsPerPage = 10;

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  novedades: Novedad[] = [
    {
      id: 1236589,
      date: '08/03/2026 6:20 pm',
      userId: 56486,
      userName: 'Maria Ossa',
      userPhone: '31523865526',
      userEmail: 'maria@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Paola Angulo',
      clientPhone: '3205233232',
      novedad: 'No se localiza direccion del destinatario',
      carrier: 'ENVIA',
    },
    {
      id: 1236590,
      date: '08/03/2026 4:10 pm',
      userId: 56487,
      userName: 'Carlos Ramirez',
      userPhone: '3176543210',
      userEmail: 'carlos.ramirez@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Andrea Lopez',
      clientPhone: '3112345678',
      novedad: 'Destinatario no se encuentra en la direccion',
      carrier: 'SERVIENTREGA',
    },
    {
      id: 1236591,
      date: '07/03/2026 2:45 pm',
      userId: 56488,
      userName: 'Laura Gutierrez',
      userPhone: '3209876543',
      userEmail: 'laura.g@hotmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Juan Perez',
      clientPhone: '3001234567',
      novedad: 'Paquete con danos visibles en el empaque',
      carrier: 'COORDINADORA',
    },
    {
      id: 1236592,
      date: '07/03/2026 11:30 am',
      userId: 56489,
      userName: 'Pedro Martinez',
      userPhone: '3154321098',
      userEmail: 'pedro.m@yahoo.com',
      userType: 'PROVEEDOR',
      clientName: 'Sofia Hernandez',
      clientPhone: '3187654321',
      novedad: 'Direccion incompleta, falta numero de apartamento',
      carrier: 'ENVIA',
    },
    {
      id: 1236593,
      date: '06/03/2026 9:15 am',
      userId: 56490,
      userName: 'Ana Rodriguez',
      userPhone: '3221098765',
      userEmail: 'ana.rodriguez@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Miguel Torres',
      clientPhone: '3045678901',
      novedad: 'Cliente solicita cambio de direccion de entrega',
      carrier: 'TCC',
    },
    {
      id: 1236594,
      date: '06/03/2026 8:00 am',
      userId: 56491,
      userName: 'Diego Sanchez',
      userPhone: '3163456789',
      userEmail: 'diego.s@outlook.com',
      userType: 'DROPSHIPPER',
      clientName: 'Valentina Castro',
      clientPhone: '3198765432',
      novedad: 'Producto agotado en inventario del proveedor',
      carrier: 'SERVIENTREGA',
    },
    {
      id: 1236595,
      date: '05/03/2026 5:50 pm',
      userId: 56492,
      userName: 'Camila Florez',
      userPhone: '3107890123',
      userEmail: 'camila.f@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Andres Morales',
      clientPhone: '3012345678',
      novedad: 'Numero de telefono del destinatario no responde',
      carrier: 'COORDINADORA',
    },
    {
      id: 1236596,
      date: '05/03/2026 3:20 pm',
      userId: 56493,
      userName: 'Felipe Vargas',
      userPhone: '3142345678',
      userEmail: 'felipe.v@gmail.com',
      userType: 'PROVEEDOR',
      clientName: 'Isabella Ruiz',
      clientPhone: '3156789012',
      novedad: 'Zona de dificil acceso para la transportadora',
      carrier: 'ENVIA',
    },
    {
      id: 1236597,
      date: '04/03/2026 1:10 pm',
      userId: 56494,
      userName: 'Natalia Mejia',
      userPhone: '3183456789',
      userEmail: 'natalia.m@hotmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Sebastian Diaz',
      clientPhone: '3204567890',
      novedad: 'Paquete devuelto por exceder intentos de entrega',
      carrier: 'TCC',
    },
    {
      id: 1236598,
      date: '04/03/2026 10:05 am',
      userId: 56495,
      userName: 'Ricardo Ospina',
      userPhone: '3195678901',
      userEmail: 'ricardo.o@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Daniela Pardo',
      clientPhone: '3116789012',
      novedad: 'Cliente rechaza el paquete en el momento de entrega',
      carrier: 'SERVIENTREGA',
    },
    {
      id: 1236599,
      date: '03/03/2026 7:45 pm',
      userId: 56496,
      userName: 'Monica Restrepo',
      userPhone: '3126789012',
      userEmail: 'monica.r@yahoo.com',
      userType: 'DROPSHIPPER',
      clientName: 'Alejandro Munoz',
      clientPhone: '3067890123',
      novedad: 'Direccion no existe segun la transportadora',
      carrier: 'COORDINADORA',
    },
    {
      id: 1236600,
      date: '03/03/2026 4:30 pm',
      userId: 56497,
      userName: 'Julian Camacho',
      userPhone: '3137890123',
      userEmail: 'julian.c@gmail.com',
      userType: 'PROVEEDOR',
      clientName: 'Camila Ortega',
      clientPhone: '3178901234',
      novedad: 'Error en el numero de guia asignado',
      carrier: 'ENVIA',
    },
    {
      id: 1236601,
      date: '02/03/2026 2:15 pm',
      userId: 56498,
      userName: 'Valentina Gomez',
      userPhone: '3148901234',
      userEmail: 'valentina.g@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Nicolas Cardona',
      clientPhone: '3089012345',
      novedad: 'Producto entregado con referencia incorrecta',
      carrier: 'TCC',
    },
    {
      id: 1236602,
      date: '02/03/2026 11:00 am',
      userId: 56499,
      userName: 'Santiago Herrera',
      userPhone: '3159012345',
      userEmail: 'santiago.h@outlook.com',
      userType: 'DROPSHIPPER',
      clientName: 'Paula Rivera',
      clientPhone: '3190123456',
      novedad: 'Cobro al destinatario no coincide con el valor declarado',
      carrier: 'SERVIENTREGA',
    },
    {
      id: 1236603,
      date: '01/03/2026 9:30 am',
      userId: 56500,
      userName: 'Adriana Molina',
      userPhone: '3160123456',
      userEmail: 'adriana.m@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'David Suarez',
      clientPhone: '3021234567',
      novedad: 'Destinatario solicita reprogramar entrega para otra fecha',
      carrier: 'COORDINADORA',
    },
    {
      id: 1236604,
      date: '01/03/2026 8:15 am',
      userId: 56501,
      userName: 'Andres Pineda',
      userPhone: '3171234567',
      userEmail: 'andres.p@hotmail.com',
      userType: 'PROVEEDOR',
      clientName: 'Maria Jose Leal',
      clientPhone: '3132345678',
      novedad: 'Envio retenido en bodega por documentos faltantes',
      carrier: 'ENVIA',
    },
    {
      id: 1236605,
      date: '28/02/2026 6:50 pm',
      userId: 56502,
      userName: 'Carolina Duque',
      userPhone: '3182345678',
      userEmail: 'carolina.d@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Felipe Guzman',
      clientPhone: '3043456789',
      novedad: 'Paquete sin rotulo visible, devuelto a bodega',
      carrier: 'TCC',
    },
    {
      id: 1236606,
      date: '28/02/2026 3:40 pm',
      userId: 56503,
      userName: 'Oscar Londono',
      userPhone: '3193456789',
      userEmail: 'oscar.l@yahoo.com',
      userType: 'DROPSHIPPER',
      clientName: 'Luisa Fernanda Rios',
      clientPhone: '3154567890',
      novedad: 'Error en datos del destinatario, nombre incorrecto',
      carrier: 'SERVIENTREGA',
    },
    {
      id: 1236607,
      date: '27/02/2026 1:25 pm',
      userId: 56504,
      userName: 'Paola Monsalve',
      userPhone: '3104567890',
      userEmail: 'paola.m@gmail.com',
      userType: 'DROPSHIPPER',
      clientName: 'Carlos Alberto Vega',
      clientPhone: '3165678901',
      novedad: 'Zona declarada en paro, no se puede realizar entrega',
      carrier: 'COORDINADORA',
    },
    {
      id: 1236608,
      date: '27/02/2026 10:10 am',
      userId: 56505,
      userName: 'Esteban Arias',
      userPhone: '3115678901',
      userEmail: 'esteban.a@outlook.com',
      userType: 'PROVEEDOR',
      clientName: 'Mariana Quintero',
      clientPhone: '3076789012',
      novedad: 'Producto diferente al solicitado por el cliente',
      carrier: 'ENVIA',
    },
  ];

  get filteredNovedades(): Novedad[] {
    if (!this.searchQuery.trim()) {
      return this.novedades;
    }

    const q = this.searchQuery.toLowerCase();
    return this.novedades.filter(n => {
      switch (this.searchField) {
        case 'id':
          return n.id.toString().includes(q);
        case 'nombre':
          return (
            n.userName.toLowerCase().includes(q) ||
            n.clientName.toLowerCase().includes(q)
          );
        default:
          return (
            n.id.toString().includes(q) ||
            n.userName.toLowerCase().includes(q) ||
            n.clientName.toLowerCase().includes(q) ||
            n.novedad.toLowerCase().includes(q) ||
            n.carrier.toLowerCase().includes(q)
          );
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredNovedades.length / this.itemsPerPage);
  }

  get paginatedNovedades(): Novedad[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredNovedades.slice(start, start + this.itemsPerPage);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  toggleAccionesDropdown(): void {
    this.showAccionesDropdown = !this.showAccionesDropdown;
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.notify('Filtros ' + (this.showFilter ? 'activados' : 'desactivados'), 'info');
  }

  onAccion(accion: string): void {
    this.showAccionesDropdown = false;
    switch (accion) {
      case 'exportar':
        this.notify('Exportando novedades...', 'info');
        break;
      case 'marcar-leidas':
        this.notify('Novedades marcadas como leidas', 'success');
        break;
      case 'archivar':
        this.notify('Novedades archivadas', 'success');
        break;
    }
  }

  onCheck(item: Novedad): void {
    this.notify(`Novedad #${item.id} aprobada`, 'success');
  }

  onView(item: Novedad): void {
    this.notify(`Abriendo detalle de novedad #${item.id}`, 'info');
  }

  private notify(msg: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
