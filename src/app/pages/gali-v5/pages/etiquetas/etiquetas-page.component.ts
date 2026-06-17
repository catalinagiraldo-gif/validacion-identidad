import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiTagComponent,
  DropiPaginatorComponent,
} from '../../components/shared';

interface EtiquetaRow {
  pedido: string;
  cliente: string;
  guia: string;
  transportadora: string;
  destino: string;
  estado: string;
}

const CARRIERS = ['ENVIA', 'COORDINADORA', 'INTERRAPIDISIMO', 'SERVIENTREGA', 'VELOCES', 'TCC'];
const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'];
const CLIENTS = ['Olga Camacho', 'Carlos Mendoza', 'María Fernanda López', 'Andrea Gutiérrez', 'Juan Pablo Ruiz', 'Laura Torres'];
const STATES = ['Generada', 'Pendiente', 'Impresa', 'Error PDF'];

@Component({
  selector: 'app-etiquetas-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiTagComponent,
    DropiPaginatorComponent,
  ],
  templateUrl: './etiquetas-page.component.html',
  styleUrl: './etiquetas-page.component.scss',
})
export class EtiquetasPageComponent {
  searchQuery = '';
  readonly breadcrumbs = ['Pedidos', 'Preferencias', 'Etiquetas'];
  readonly rows: EtiquetaRow[] = Array.from({ length: 20 }, (_, i) => ({
    pedido: `#${160604 + i}`,
    cliente: CLIENTS[i % CLIENTS.length],
    guia: i % 3 === 0 ? '—' : `${1123266584698 + i}`,
    transportadora: CARRIERS[i % CARRIERS.length],
    destino: CITIES[i % CITIES.length],
    estado: STATES[i % STATES.length],
  }));

  tagVariant(estado: string): 'success' | 'warning' | 'error' | 'neutral' {
    if (estado === 'Generada' || estado === 'Impresa') return 'success';
    if (estado === 'Pendiente') return 'warning';
    if (estado === 'Error PDF') return 'error';
    return 'neutral';
  }
}
