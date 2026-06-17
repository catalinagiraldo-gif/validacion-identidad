import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiPaginatorComponent,
} from '../../components/shared';
import soldProductsData from '../../../../../../mocks/gali-v5/sold-products.json';

interface SoldProduct {
  id: string;
  title: string;
  provider: string;
  warehouses: string;
  category: string;
  stock: string;
  stockLevel: string;
  image: string;
  sold: number;
  inTransit: number;
  returns: number;
  delivered: number;
  earnings: string;
}

@Component({
  selector: 'app-productos-vendidos-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiPaginatorComponent,
  ],
  templateUrl: './productos-vendidos-page.component.html',
  styleUrl: './productos-vendidos-page.component.scss',
})
export class ProductosVendidosPageComponent {
  searchQuery = '';
  readonly breadcrumbs = ['Reportes', 'Productos vendidos'];
  readonly products: SoldProduct[] = soldProductsData.products;
}
