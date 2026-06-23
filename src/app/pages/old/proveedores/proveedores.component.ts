import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';

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

  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus(): IdentitySatelliteStatus {
    return this.identityDemo.status();
  }

  setDemoIdentityStatus(status: IdentitySatelliteStatus): void {
    this.identityDemo.setStatus(status);
  }

  readonly identityStatusOptions: IdentitySatelliteStatus[] = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  readonly blockedAction = 'comprar a proveedores';

  private readonly alertsMap: Record<string, { type: string; icon: string; text: string; cta: string; step: number; stateLabel: string }> = {
    sin_validar: { type: 'warning', icon: 'pi-shield',                step: 1, stateLabel: 'Sin validar',             text: 'Para operar con proveedores y contratar catálogos, verifica tu identidad. Solo toma unos minutos.', cta: 'Verificar identidad' },
    pendiente:   { type: 'warning', icon: 'pi-exclamation-triangle',  step: 2, stateLabel: 'Verificación incompleta', text: 'Casi listo. Completa tu verificación de identidad para contratar con proveedores sin restricciones.', cta: 'Completar verificación' },
    en_revision: { type: 'info',    icon: 'pi-clock',                 step: 3, stateLabel: 'En revisión',             text: 'Tu identidad está en revisión. Puedes explorar proveedores — te avisamos cuando puedas contratar.', cta: 'Ver estado' },
    rechazado:   { type: 'error',   icon: 'pi-times-circle',          step: 2, stateLabel: 'Verificación rechazada',  text: 'Tu verificación fue rechazada. Reintenta para desbloquear la contratación de proveedores.', cta: 'Reintentar verificación' },
  };

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.alertsMap[this.demoIdentityStatus] : null;
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  tiposProveedor = ['Todos', 'premium', 'verificado', 'estándar'];
  ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'];
  categorias = ['Todas', 'Moda', 'Deporte', 'Hogar', 'Salud', 'Belleza', 'Tecnología', 'Cocina', 'Vaporizadores', 'Mascotas'];

  constructor(private http: HttpClient, private router: Router) {}

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
