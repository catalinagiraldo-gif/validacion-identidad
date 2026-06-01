import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Proveedor {
  id: string;
  name: string;
  productsCount: number;
  categories: string;
  imageUrl: string;
  badge: string | null;
  isFavorite: boolean;
  city: string;
  type: string;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  searchQuery = '';
  favoritos = false;
  tipoProveedor = 'Todos';
  ciudad = 'Todas';
  categoria = 'Todas';

  tiposProveedor = ['Todos', 'premium', 'verificado', 'estándar'];
  ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'];
  categorias = ['Todas', 'Moda', 'Deporte', 'Hogar', 'Salud', 'Belleza', 'Tecnología', 'Cocina', 'Vaporizadores', 'Mascotas'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Proveedor[]>('/api/proveedores').subscribe((data) => {
      this.proveedores = data;
    });
  }

  get filteredProveedores(): Proveedor[] {
    let result = this.proveedores;

    if (this.favoritos) {
      result = result.filter(p => p.isFavorite);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categories.toLowerCase().includes(q)
      );
    }

    if (this.tipoProveedor !== 'Todos') {
      result = result.filter(p => p.type === this.tipoProveedor);
    }

    if (this.ciudad !== 'Todas') {
      result = result.filter(p => p.city === this.ciudad);
    }

    if (this.categoria !== 'Todas') {
      result = result.filter(p => p.categories.toLowerCase().includes(this.categoria.toLowerCase()));
    }

    return result;
  }

  toggleFavorite(proveedor: Proveedor): void {
    proveedor.isFavorite = !proveedor.isFavorite;
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  aplicarFiltros(): void {
    // Filters are reactive via getters, this is just for the button UX
  }
}
