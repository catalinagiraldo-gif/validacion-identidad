import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SettingToggle {
  label: string;
  description: string;
  value: boolean;
}

@Component({
  selector: 'app-configuraciones-mkt-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./configuraciones-mkt.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Marketing</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Configuraciones</span>
      </nav>

      <!-- Page title -->
      <h1 class="page-title">Configuraciones</h1>

      <div class="settings-layout">
        <!-- General Settings -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">General</h2>
            <p class="section-desc">Configura las preferencias generales de marketing</p>
          </div>

          <div class="settings-card">
            <div class="form-group">
              <label class="form-label">Nombre del remitente</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="senderName"
                placeholder="Ej: Mi Tienda Dropi"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email del remitente</label>
              <input
                type="email"
                class="form-input"
                [(ngModel)]="senderEmail"
                placeholder="Ej: marketing@mitienda.com"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Telefono de WhatsApp</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="whatsappPhone"
                placeholder="Ej: +57 300 123 4567"
              />
            </div>
          </div>
        </section>

        <!-- Notification preferences -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Notificaciones y automatizacion</h2>
            <p class="section-desc">Controla que notificaciones se envian automaticamente</p>
          </div>

          <div class="settings-card">
            <div
              *ngFor="let toggle of toggleSettings; let i = index"
              class="toggle-row"
              [style.animation-delay]="i * 60 + 'ms'"
            >
              <div class="toggle-row__info">
                <span class="toggle-row__label">{{ toggle.label }}</span>
                <span class="toggle-row__desc">{{ toggle.description }}</span>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="toggle.value" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- Frequency settings -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Frecuencia de envio</h2>
            <p class="section-desc">Limita cuantos mensajes recibe cada contacto</p>
          </div>

          <div class="settings-card">
            <div class="form-row">
              <div class="form-group form-group--half">
                <label class="form-label">Maximo emails por semana</label>
                <input
                  type="number"
                  class="form-input"
                  [(ngModel)]="maxEmailsPerWeek"
                  min="1"
                  max="20"
                />
              </div>
              <div class="form-group form-group--half">
                <label class="form-label">Maximo SMS por semana</label>
                <input
                  type="number"
                  class="form-input"
                  [(ngModel)]="maxSmsPerWeek"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Zona horaria preferida</label>
              <select class="form-input" [(ngModel)]="timezone">
                <option value="America/Bogota">Colombia (GMT-5)</option>
                <option value="America/Mexico_City">Mexico (GMT-6)</option>
                <option value="America/Santiago">Chile (GMT-4)</option>
                <option value="America/Lima">Peru (GMT-5)</option>
                <option value="America/Buenos_Aires">Argentina (GMT-3)</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Actions -->
        <div class="actions-bar">
          <button class="btn-secondary">Descartar cambios</button>
          <button class="btn-primary">
            <i class="pi pi-check"></i>
            <span>Guardar configuracion</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfiguracionesMktNewComponent {
  senderName = 'Mi Tienda Dropi';
  senderEmail = 'marketing@mitienda.com';
  whatsappPhone = '+57 300 123 4567';
  maxEmailsPerWeek = 5;
  maxSmsPerWeek = 3;
  timezone = 'America/Bogota';

  toggleSettings: SettingToggle[] = [
    { label: 'Email de bienvenida', description: 'Envia un email automatico cuando un nuevo cliente se registra', value: true },
    { label: 'Recordatorio carrito abandonado', description: 'Notifica a los clientes que dejaron productos en el carrito', value: true },
    { label: 'Confirmacion de pedido por SMS', description: 'Envia un SMS automatico al confirmar un pedido', value: false },
    { label: 'Reporte semanal de campanas', description: 'Recibe un resumen semanal de todas las campanas activas', value: true },
    { label: 'Notificacion de rebotes', description: 'Alerta cuando un email rebota o un SMS no se entrega', value: false },
    { label: 'Auto-pausa por bajo rendimiento', description: 'Pausa automaticamente campanas con tasa de apertura menor al 5%', value: true },
  ];
}
