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
import landingsData from '../../../../../../mocks/gali-v5/marketing-landings.json';

interface LandingRow {
  id: string;
  producto: string;
  fecha: string;
  origenUrl: string;
  estado: string;
  exportaciones: number;
  imagen: string;
}

@Component({
  selector: 'app-creador-paginas-page',
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
  templateUrl: './creador-paginas-page.component.html',
  styleUrl: './creador-paginas-page.component.scss',
})
export class CreadorPaginasPageComponent {
  searchQuery = '';
  readonly breadcrumbs = ['Marketing', 'Creador de páginas'];
  readonly rows: LandingRow[] = landingsData.pages;

  get filteredRows(): LandingRow[] {
    if (!this.searchQuery) return this.rows;
    const q = this.searchQuery.toLowerCase();
    return this.rows.filter(row => row.producto.toLowerCase().includes(q));
  }
}
