import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';

interface ModuleCard {
  icon: string;
  name: string;
  description: string;
  route: string;
  blockedFeature: string;
}

@Component({
  selector: 'app-identidad-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identidad-hub.component.html',
  styleUrls: ['./identidad-hub.component.scss'],
})
export class IdentidadHubComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus(): IdentitySatelliteStatus {
    return this.identityDemo.status();
  }

  readonly identityStatusOptions: IdentitySatelliteStatus[] = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];

  showPopover = false;
  private popoverTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  readonly modules: ModuleCard[] = [
    { icon: 'pi-shopping-bag',  name: 'Catálogo',          description: 'Crear órdenes',              route: '/old/productos/catalogo',                       blockedFeature: 'crear órdenes' },
    { icon: 'pi-list',          name: 'Mis Pedidos',        description: 'Gestionar pedidos',           route: '/old/mis-pedidos/mis-pedidos',                   blockedFeature: 'gestionar pedidos' },
    { icon: 'pi-store',         name: 'Proveedores',        description: 'Comprar productos',           route: '/old/productos/proveedores',                     blockedFeature: 'comprar a proveedores' },
    { icon: 'pi-wallet',        name: 'Historial Cartera',  description: 'Retirar fondos',              route: '/old/historial-de-cartera',                      blockedFeature: 'retirar fondos' },
    { icon: 'pi-credit-card',   name: 'Dropicard',          description: 'Solicitar tarjeta',           route: '/old/dropi-card/cards',                          blockedFeature: 'solicitar Dropicard' },
    { icon: 'pi-building',      name: 'Datos Bancarios',    description: 'Agregar cuenta bancaria',     route: '/old/configuraciones/datos-bancarios',           blockedFeature: 'agregar cuentas bancarias' },
    { icon: 'pi-arrow-up',      name: 'Retiro de Saldo',    description: 'Procesar retiros',            route: '/old/configuraciones/retiros-de-saldo',          blockedFeature: 'procesar retiros de saldo' },
  ];

  get isBlocked(): boolean {
    return this.demoIdentityStatus !== 'aprobado';
  }

  getModuleStatus(mod: ModuleCard): { label: string; cssClass: string } {
    if (this.demoIdentityStatus === 'aprobado') return { label: 'Activo', cssClass: 'status--active' };
    const map: Record<string, { label: string; cssClass: string }> = {
      sin_validar: { label: 'Sin validar',  cssClass: 'status--blocked' },
      pendiente:   { label: 'Incompleto',   cssClass: 'status--warning' },
      en_revision: { label: 'En revisión',  cssClass: 'status--review' },
      rechazado:   { label: 'Rechazado',    cssClass: 'status--error' },
    };
    return map[this.demoIdentityStatus] ?? { label: 'Bloqueado', cssClass: 'status--blocked' };
  }

  ngOnInit(): void {
    this.popoverTimer = setTimeout(() => {
      if (this.isBlocked) {
        this.showPopover = true;
        this.closeTimer = setTimeout(() => { this.showPopover = false; }, 5000);
      }
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.popoverTimer) clearTimeout(this.popoverTimer);
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  closePopover(): void {
    this.showPopover = false;
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  irAModulo(route: string): void {
    this.router.navigate([route]);
  }

  setStatus(s: IdentitySatelliteStatus): void {
    this.identityDemo.setStatus(s);
    if (s !== 'aprobado' && !this.showPopover) {
      this.showPopover = true;
      if (this.closeTimer) clearTimeout(this.closeTimer);
      this.closeTimer = setTimeout(() => { this.showPopover = false; }, 5000);
    } else if (s === 'aprobado') {
      this.showPopover = false;
    }
  }
}
