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
import clientsData from '../../../../../../mocks/gali-v5/clients.json';

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  marketing: boolean;
  hasTag: boolean;
}

@Component({
  selector: 'app-clientes-page',
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
  templateUrl: './clientes-page.component.html',
  styleUrl: './clientes-page.component.scss',
})
export class ClientesPageComponent {
  searchQuery = '';
  readonly breadcrumbs = ['Reportes', 'Clientes'];
  readonly clients: ClientRow[] = clientsData.clients;
}
