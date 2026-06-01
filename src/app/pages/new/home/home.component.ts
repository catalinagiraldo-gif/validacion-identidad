import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Provider {
  name: string;
  avatar: string;
  badge: 'verified' | 'star';
}

interface QuickAction {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-home-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./home.component.scss'],
  template: `
    <div class="page-wrapper">
      <h1 class="greeting">{{ greeting }}</h1>

      <div class="home-layout">
        <!-- LEFT COLUMN (765px) -->
        <div class="home-main">
          <!-- Alert banner (765x68) -->
          <div class="alert-banner">
            <div class="alert-icon">
              <img
                src="assets/images/home/icon-megaphone.svg"
                alt="Megaphone"
                width="24"
                height="24"
              />
            </div>
            <p class="alert-text">{{ alertMessage }}</p>
          </div>

          <!-- Quick actions (765x102) — 4 buttons -->
          <div class="quick-actions">
            <div
              class="quick-action"
              *ngFor="let action of quickActions"
            >
              <img
                class="quick-action-icon"
                [src]="'assets/images/home/' + action.icon"
                [alt]="action.label"
              />
              <span class="quick-action-label">{{ action.label }}</span>
            </div>
          </div>

          <!-- Two-column section (765x406) -->
          <div class="two-columns">
            <!-- Proveedores destacados (366.5x406) -->
            <div class="providers-section">
              <h2 class="section-title">Proveedores destacados de la semana</h2>
              <div class="providers-card">
                <div
                  class="provider-row"
                  *ngFor="let provider of providers; let last = last"
                  [class.provider-row--last]="last"
                >
                  <div class="provider-info">
                    <div class="provider-avatar-wrapper">
                      <img
                        class="provider-avatar"
                        [src]="'assets/images/home/' + provider.avatar"
                        [alt]="provider.name"
                      />
                      <img
                        class="provider-badge"
                        [src]="'assets/images/home/badge-' + provider.badge + '.png'"
                        [alt]="provider.badge"
                      />
                    </div>
                    <span class="provider-name">{{ provider.name }}</span>
                  </div>
                  <button class="btn-contact">Contactar</button>
                </div>
              </div>
            </div>

            <!-- Nueva actualizacion (366.5x406) -->
            <div class="update-section">
              <h2 class="section-title">Nueva actualizacion</h2>
              <div class="update-card">
                <img
                  class="update-banner"
                  src="assets/images/home/banner-tiendanube.png"
                  alt="Tienda Nube"
                />
                <div class="update-content">
                  <h3 class="update-title">Tienda Nube</h3>
                  <p class="update-description">
                    Descubre la nueva integracion con Tienda Nube. Ahora puedes
                    sincronizar tus productos, gestionar inventario y
                    procesar pedidos directamente desde Dropi.
                  </p>
                  <button class="btn-manual">Ver manual</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDEBAR BANNER (363x624) -->
        <aside class="sidebar-banner">
          <img
            class="sidebar-banner-img"
            src="assets/images/home/slide-colombia.png"
            alt="Bienvenidos a Dropi Colombia"
          />
        </aside>
      </div>
    </div>
  `,
})
export class HomeNewComponent {
  greeting = '¡Hola, Alejandra!';

  alertMessage =
    '🚨¡Nueva actualizacion Dropify - Tienda Nube! Ahora puedes configurar tus pagos';

  quickActions: QuickAction[] = [
    { label: 'Encuentra productos', icon: 'action-encuentra.png' },
    { label: 'Gestionar ordenes', icon: 'action-gestionar.png' },
    { label: 'Metrica de ventas', icon: 'action-metrica.png' },
    { label: 'Aprende con Academy', icon: 'action-academy.png' },
  ];

  providers: Provider[] = [
    { name: 'Prendas Control', avatar: 'avatar-prendas.png', badge: 'verified' },
    { name: 'Faka Store', avatar: 'avatar-faka.png', badge: 'star' },
    { name: 'D&S GROUP COLOMBIA', avatar: 'avatar-dsg.png', badge: 'verified' },
    { name: 'Perfumeria Glow', avatar: 'avatar-cachy.png', badge: 'star' },
  ];
}
