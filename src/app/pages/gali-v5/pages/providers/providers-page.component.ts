import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

interface ProviderCard {
  name: string;
  avatar: string;
  productCount: number;
  categories: string;
  premium?: boolean;
  verified?: boolean;
  favorite?: boolean;
}

@Component({
  selector: 'app-providers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DropiGaliBarComponent],
  templateUrl: './providers-page.component.html',
  styleUrl: './providers-page.component.scss',
})
export class ProvidersPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  showFavorites = signal(false);
  searchQuery = '';
  city = '';
  category = 'Todas';

  goToLanzar(): void {
    this.ws.setMode('lanzar');
    this.router.navigate(['/gali-v5/proyectos/nuevo'], { queryParams: { producto: 'collar-gps' } });
  }

  verAnalisisCompleto(): void {
    this.router.navigate(['/gali-v5/productos/catalogo'], { queryParams: { ada: 'collar-gps' } });
  }

  readonly breadcrumbs = ['Productos', 'Catálogo', 'Proveedores'];

  readonly providers: ProviderCard[] = [
    { name: 'Alejandro', avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png', productCount: 1, categories: 'Moda', premium: true },
    { name: 'Astrid Carolina', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 545, categories: 'Belleza, Moda', verified: true },
    { name: 'Harold Hg', avatar: 'assets/images/dropi-baseline/provider-faka.png', productCount: 2, categories: 'Moda', premium: true },
    { name: 'Malu Express', avatar: 'assets/images/dropi-baseline/provider-prendas.png', productCount: 22, categories: 'Belleza, Cocina, Deportes…' },
    { name: 'Skorpius Centro Comercial', avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png', productCount: 157, categories: 'Moda, Otro' },
    { name: 'Juan', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 22, categories: 'Aseo, Bebé, Belleza…', premium: true },
    { name: 'Casa Andina', avatar: 'assets/images/dropi-baseline/provider-faka.png', productCount: 95, categories: 'Herramientas' },
    { name: 'ADMA', avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png', productCount: 545, categories: 'Moda, Belleza', premium: true, verified: true },
    { name: 'Suppli', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 210, categories: 'Hogar, Cocina' },
    { name: 'PUNTO BARATO', avatar: 'assets/images/dropi-baseline/provider-prendas.png', productCount: 19, categories: 'Electrónica' },
    { name: 'Resiland', avatar: 'assets/images/dropi-baseline/provider-faka.png', productCount: 41, categories: 'Deportes' },
    { name: 'Importados y más', avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png', productCount: 87, categories: 'Varios', verified: true },
  ];

  toggleFavorite(provider: ProviderCard): void {
    provider.favorite = !provider.favorite;
  }
}
