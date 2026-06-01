import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Integration {
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  category: string;
}

@Component({
  selector: 'app-integraciones-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./integraciones.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configuraciones</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Integraciones</span>
      </nav>

      <div class="page-header">
        <div>
          <h1 class="page-title">Integraciones</h1>
          <p class="page-subtitle">Conecta tu tienda con las principales plataformas de e-commerce</p>
        </div>
        <div class="stats-row">
          <div class="stat-pill">
            <span class="stat-number">{{ getConnectedCount() }}</span>
            <span class="stat-label">Conectadas</span>
          </div>
          <div class="stat-pill stat-pill--inactive">
            <span class="stat-number">{{ getDisconnectedCount() }}</span>
            <span class="stat-label">Disponibles</span>
          </div>
        </div>
      </div>

      <!-- Integration Cards Grid -->
      <div class="integrations-grid">
        <div
          class="integration-card"
          *ngFor="let integration of integrations; let i = index"
          [style.animation-delay]="i * 60 + 'ms'"
        >
          <div class="card-header">
            <div class="card-icon">
              <i [class]="'pi ' + integration.icon"></i>
            </div>
            <span
              class="status-badge"
              [class.connected]="integration.status === 'connected'"
              [class.disconnected]="integration.status === 'disconnected'"
            >
              <span class="status-dot"></span>
              {{ integration.status === 'connected' ? 'Conectado' : 'Desconectado' }}
            </span>
          </div>

          <div class="card-body">
            <h3 class="card-title">{{ integration.name }}</h3>
            <p class="card-description">{{ integration.description }}</p>
            <span class="card-category">{{ integration.category }}</span>
          </div>

          <div class="card-footer">
            <button
              class="btn-integration"
              [class.btn-connected]="integration.status === 'connected'"
              [class.btn-disconnected]="integration.status === 'disconnected'"
              (click)="toggleConnection(integration)"
            >
              <i [class]="integration.status === 'connected' ? 'pi pi-check' : 'pi pi-link'"></i>
              {{ integration.status === 'connected' ? 'Conectado' : 'Conectar' }}
            </button>
            <button class="btn-config" *ngIf="integration.status === 'connected'">
              <i class="pi pi-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class IntegracionesNewComponent {
  integrations: Integration[] = [
    {
      name: 'Shopify',
      description: 'Sincroniza tu catalogo de productos, pedidos e inventario con tu tienda Shopify',
      icon: 'pi-shopping-bag',
      status: 'connected',
      category: 'E-commerce',
    },
    {
      name: 'WooCommerce',
      description: 'Conecta tu tienda WordPress con WooCommerce para gestionar productos y pedidos',
      icon: 'pi-shopping-cart',
      status: 'connected',
      category: 'E-commerce',
    },
    {
      name: 'Tienda Nube',
      description: 'Integra tu tienda Tienda Nube y sincroniza automaticamente tus productos',
      icon: 'pi-cloud',
      status: 'disconnected',
      category: 'E-commerce',
    },
    {
      name: 'API Dropi',
      description: 'Accede a nuestra API REST para integraciones personalizadas con tu sistema',
      icon: 'pi-code',
      status: 'disconnected',
      category: 'Desarrollo',
    },
    {
      name: 'Mercado Libre',
      description: 'Publica y sincroniza tus productos directamente en Mercado Libre',
      icon: 'pi-tag',
      status: 'disconnected',
      category: 'Marketplace',
    },
    {
      name: 'WhatsApp Business',
      description: 'Envia notificaciones de pedidos y seguimiento por WhatsApp automaticamente',
      icon: 'pi-whatsapp',
      status: 'connected',
      category: 'Comunicacion',
    },
    {
      name: 'Google Analytics',
      description: 'Conecta Google Analytics para rastrear el rendimiento de tu tienda y campanas',
      icon: 'pi-chart-bar',
      status: 'disconnected',
      category: 'Analitica',
    },
    {
      name: 'Facebook Pixel',
      description: 'Instala el pixel de Facebook para rastrear conversiones y crear audiencias',
      icon: 'pi-facebook',
      status: 'disconnected',
      category: 'Marketing',
    },
  ];

  getConnectedCount(): number {
    return this.integrations.filter(i => i.status === 'connected').length;
  }

  getDisconnectedCount(): number {
    return this.integrations.filter(i => i.status === 'disconnected').length;
  }

  toggleConnection(integration: Integration): void {
    integration.status = integration.status === 'connected' ? 'disconnected' : 'connected';
  }
}
