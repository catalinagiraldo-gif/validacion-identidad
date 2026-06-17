import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiTagComponent,
} from '../../components/shared';
import addressesData from '../../../../../../mocks/gali-v5/validador-addresses.json';

interface AddressCard {
  id: string;
  alias: string;
  department: string;
  city: string;
  address: string;
  validated: boolean;
  lastUsed: string;
}

@Component({
  selector: 'app-validador-direcciones-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiTagComponent,
  ],
  templateUrl: './validador-direcciones-page.component.html',
  styleUrl: './validador-direcciones-page.component.scss',
})
export class ValidadorDireccionesPageComponent {
  searchQuery = '';
  dept = '';
  city = '';
  readonly breadcrumbs = ['Pedidos', 'Preferencias', 'Validador de direcciones'];
  readonly addresses: AddressCard[] = addressesData.addresses;
}
