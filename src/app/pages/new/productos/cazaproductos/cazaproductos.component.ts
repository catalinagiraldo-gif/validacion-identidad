import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CazaProductoItem {
  id: number;
  name: string;
  category: string;
  dateRange: string;
  price: number;
  proposals: number;
  status: 'activo' | 'por_finalizar' | 'finalizado';
  image: string;
}

@Component({
  selector: 'app-cazaproductos-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cazaproductos.component.html',
  styleUrls: ['./cazaproductos.component.scss'],
})
export class CazaproductosNewComponent {
  searchQuery = '';
  selectedCategory = 'Todas';
  selectedStatus = 'Todos';
  conPropuestas = false;
  sortBy = 'Mas recientes';

  categories = [
    'Todas',
    'Moda',
    'Deporte',
    'Hogar',
    'Salud',
    'Belleza',
    'Tecnologia',
    'Cocina',
    'Jugueteria',
    'Mascotas',
  ];

  statuses = ['Todos', 'activo', 'por_finalizar', 'finalizado'];

  products: CazaProductoItem[] = [
    {
      id: 1,
      name: 'Zapatillas adidas Ultraboost 2024',
      category: 'Moda',
      dateRange: '15/12/2024 - 22/12/2024',
      price: 62000,
      proposals: 5,
      status: 'activo',
      image: 'assets/images/productos/product-05.png',
    },
    {
      id: 2,
      name: 'Reloj Inteligente T800 Ultra Series 8',
      category: 'Moda',
      dateRange: '15/12/2024 - 22/12/2024',
      price: 62000,
      proposals: 0,
      status: 'activo',
      image: 'assets/images/productos/product-02.png',
    },
    {
      id: 3,
      name: 'Carpa Infantil 130x102cm Azul',
      category: 'Jugueteria',
      dateRange: '15/12/2024 - 22/12/2024',
      price: 62000,
      proposals: 2,
      status: 'activo',
      image: 'assets/images/productos/product-04.png',
    },
    {
      id: 4,
      name: 'Zapatera Closet De 9 Niveles Armable',
      category: 'Hogar',
      dateRange: '15/12/2024 - 22/12/2024',
      price: 62000,
      proposals: 0,
      status: 'activo',
      image: 'assets/images/productos/product-01.png',
    },
    {
      id: 5,
      name: 'Ropa Deportiva Conjunto Mujer',
      category: 'Moda',
      dateRange: '15/12/2024 - 22/12/2024',
      price: 45000,
      proposals: 3,
      status: 'por_finalizar',
      image: 'assets/images/productos/product-03.png',
    },
    {
      id: 6,
      name: 'Crispetera Silicona Premium',
      category: 'Cocina',
      dateRange: '10/12/2024 - 20/12/2024',
      price: 35000,
      proposals: 1,
      status: 'por_finalizar',
      image: 'assets/images/productos/product-04.png',
    },
    {
      id: 7,
      name: 'Organizador Multi-uso Hogar',
      category: 'Hogar',
      dateRange: '01/12/2024 - 15/12/2024',
      price: 28000,
      proposals: 0,
      status: 'por_finalizar',
      image: 'assets/images/productos/product-01.png',
    },
    {
      id: 8,
      name: 'Smart Watch Deportivo GPS',
      category: 'Tecnologia',
      dateRange: '05/12/2024 - 18/12/2024',
      price: 89000,
      proposals: 7,
      status: 'activo',
      image: 'assets/images/productos/product-02.png',
    },
    {
      id: 9,
      name: 'Vestido Largo Estampado Floral Verano',
      category: 'Moda',
      dateRange: '14/12/2024 - 28/12/2024',
      price: 48000,
      proposals: 6,
      status: 'activo',
      image: 'assets/images/productos/product-03.png',
    },
    {
      id: 10,
      name: 'Licuadora Industrial 2L Acero Inoxidable',
      category: 'Cocina',
      dateRange: '03/12/2024 - 17/12/2024',
      price: 210000,
      proposals: 2,
      status: 'por_finalizar',
      image: 'assets/images/productos/product-05.png',
    },
    {
      id: 11,
      name: 'Tapete de Yoga Antideslizante 6mm',
      category: 'Deporte',
      dateRange: '16/12/2024 - 30/12/2024',
      price: 35000,
      proposals: 0,
      status: 'activo',
      image: 'assets/images/productos/product-01.png',
    },
    {
      id: 12,
      name: 'Serum Facial Acido Hialuronico 30ml',
      category: 'Belleza',
      dateRange: '11/12/2024 - 24/12/2024',
      price: 28000,
      proposals: 8,
      status: 'activo',
      image: 'assets/images/productos/product-04.png',
    },
    {
      id: 13,
      name: 'Organizador de Closet 6 Niveles Plegable',
      category: 'Hogar',
      dateRange: '07/12/2024 - 21/12/2024',
      price: 42000,
      proposals: 1,
      status: 'activo',
      image: 'assets/images/productos/product-01.png',
    },
    {
      id: 14,
      name: 'Peluche Gigante Oso 1.2 Metros',
      category: 'Jugueteria',
      dateRange: '19/12/2024 - 02/01/2025',
      price: 78000,
      proposals: 3,
      status: 'activo',
      image: 'assets/images/productos/product-03.png',
    },
    {
      id: 15,
      name: 'Collar Antipulgas Natural para Perro',
      category: 'Mascotas',
      dateRange: '02/12/2024 - 16/12/2024',
      price: 18000,
      proposals: 0,
      status: 'finalizado',
      image: 'assets/images/productos/product-05.png',
    },
    {
      id: 16,
      name: 'Vitamina C Efervescente Tubo x20',
      category: 'Salud',
      dateRange: '13/12/2024 - 27/12/2024',
      price: 15000,
      proposals: 2,
      status: 'activo',
      image: 'assets/images/productos/product-02.png',
    },
    {
      id: 17,
      name: 'Smartwatch Deportivo IP68 Resistente al Agua',
      category: 'Tecnologia',
      dateRange: '09/12/2024 - 23/12/2024',
      price: 135000,
      proposals: 9,
      status: 'activo',
      image: 'assets/images/productos/product-02.png',
    },
    {
      id: 18,
      name: 'Sarten Wok Antiadherente 30cm con Tapa',
      category: 'Cocina',
      dateRange: '17/12/2024 - 31/12/2024',
      price: 65000,
      proposals: 0,
      status: 'activo',
      image: 'assets/images/productos/product-04.png',
    },
    {
      id: 19,
      name: 'Zapatillas Running Amortiguacion Gel',
      category: 'Deporte',
      dateRange: '06/12/2024 - 20/12/2024',
      price: 155000,
      proposals: 4,
      status: 'por_finalizar',
      image: 'assets/images/productos/product-05.png',
    },
    {
      id: 20,
      name: 'Cortinas Blackout Termicas 2 Paneles',
      category: 'Hogar',
      dateRange: '15/12/2024 - 29/12/2024',
      price: 89000,
      proposals: 1,
      status: 'activo',
      image: 'assets/images/productos/product-03.png',
    },
  ];

  get filteredProducts(): CazaProductoItem[] {
    let result = this.products;

    if (this.selectedCategory !== 'Todas') {
      result = result.filter((p) => p.category === this.selectedCategory);
    }

    if (this.selectedStatus !== 'Todos') {
      result = result.filter((p) => p.status === this.selectedStatus);
    }

    if (this.conPropuestas) {
      result = result.filter((p) => p.proposals > 0);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }

  formatPrice(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'por_finalizar':
        return 'Por finalizar';
      case 'finalizado':
        return 'Finalizado';
      default:
        return '';
    }
  }
}
