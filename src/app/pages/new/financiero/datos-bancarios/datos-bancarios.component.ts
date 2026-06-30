import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DatoBancario {
  pais: string;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: string;
  identificacion: string;
}

@Component({
  selector: 'app-datos-bancarios-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./datos-bancarios.component.scss'],
  template: `
    <div class="page-wrapper">
      <nav class="breadcrumb">
        <span class="breadcrumb-item breadcrumb-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Financiero</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Wallet</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Datos bancarios</span>
      </nav>

      <div class="page-header">
        <h1 class="page-title">Datos bancarios</h1>
        <button class="btn-primary" type="button">
          <i class="pi pi-plus"></i>
          Agregar
        </button>
      </div>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>País</th>
              <th>Banco</th>
              <th>Número de cuenta</th>
              <th>Tipo de cuenta</th>
              <th>Identificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of datosBancarios">
              <td>{{ item.pais }}</td>
              <td>{{ item.banco }}</td>
              <td>
                <span class="cuenta-tag">{{ item.numeroCuenta }}</span>
              </td>
              <td>{{ item.tipoCuenta }}</td>
              <td>{{ item.identificacion }}</td>
              <td class="acciones-cell">
                <button class="icon-btn" title="Editar"><i class="pi pi-pencil"></i></button>
                <button class="icon-btn icon-btn-danger" title="Eliminar"><i class="pi pi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <button class="pag-btn"><i class="pi pi-angle-double-left"></i></button>
        <button class="pag-btn"><i class="pi pi-angle-left"></i></button>
        <button class="pag-btn pag-btn-active">1</button>
        <button class="pag-btn"><i class="pi pi-angle-right"></i></button>
        <button class="pag-btn"><i class="pi pi-angle-double-right"></i></button>
      </div>
    </div>
  `,
})
export class DatosBancariosNewComponent {
  datosBancarios: DatoBancario[] = [
    { pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '*****3031', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '*****3012', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { pais: 'Colombia', banco: 'Banco de Bogotá', numeroCuenta: '*****8821', tipoCuenta: 'Corriente', identificacion: 'CC: 98023411256' },
    { pais: 'Colombia', banco: 'Davivienda', numeroCuenta: '*****4490', tipoCuenta: 'Ahorro', identificacion: 'CC: 10025634512' },
    { pais: 'México', banco: 'BBVA México', numeroCuenta: '*****2201', tipoCuenta: 'Débito', identificacion: 'RFC: MELG890512A34' },
    { pais: 'Colombia', banco: 'Nequi', numeroCuenta: '*****7732', tipoCuenta: 'Ahorro', identificacion: 'CC: 55671923045' },
    { pais: 'Colombia', banco: 'Daviplata', numeroCuenta: '*****1155', tipoCuenta: 'Ahorro', identificacion: 'CC: 40123987256' },
    { pais: 'Ecuador', banco: 'Banco Pichincha', numeroCuenta: '*****6698', tipoCuenta: 'Ahorro', identificacion: 'CI: 1723045678' },
    { pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '*****9944', tipoCuenta: 'Ahorro', identificacion: 'CC: 78902134567' },
    { pais: 'Colombia', banco: 'BBVA Colombia', numeroCuenta: '*****3370', tipoCuenta: 'Corriente', identificacion: 'NIT: 900234561-8' },
  ];
}
