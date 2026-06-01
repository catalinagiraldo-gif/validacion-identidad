import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface CazaProducto {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  offers: number;
  createdAt: string;
  userId: string;
  userName: string;
}

@Component({
  selector: 'app-caza-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caza-productos.component.html',
  styleUrls: ['./caza-productos.component.scss'],
})
export class CazaProductosComponent implements OnInit {
  publications: CazaProducto[] = [];
  searchQuery = '';
  selectedCategory = 'Todas';
  selectedStatus = 'Todos';
  conOfertas = false;
  sortBy = 'Más recientes';
  showBanner = true;

  categories = ['Todas', 'Moda', 'Deporte', 'Hogar', 'Salud', 'Belleza', 'Tecnología', 'Cocina', 'Vaporizadores', 'Mascotas'];
  statuses = ['Todos', 'activo', 'inactivo'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<CazaProducto[]>('/api/caza-productos').subscribe((data) => {
      this.publications = data;
    });
  }

  get filteredPublications(): CazaProducto[] {
    let result = this.publications;

    if (this.selectedCategory !== 'Todas') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    if (this.selectedStatus !== 'Todos') {
      result = result.filter(p => p.status === this.selectedStatus);
    }

    if (this.conOfertas) {
      result = result.filter(p => p.offers > 0);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }

  closeBanner(): void {
    this.showBanner = false;
  }
}
