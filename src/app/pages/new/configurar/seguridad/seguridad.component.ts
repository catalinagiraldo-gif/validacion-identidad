import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seguridad-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./seguridad.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configuraciones</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Seguridad</span>
      </nav>

      <h1 class="page-title">Seguridad</h1>

      <div class="seguridad-layout">
        <!-- Change Password -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-icon">
              <i class="pi pi-lock"></i>
            </div>
            <div>
              <h2 class="section-title">Cambiar contrasena</h2>
              <p class="section-subtitle">Actualiza tu contrasena para mantener tu cuenta segura</p>
            </div>
          </div>

          <div class="form-stack">
            <div class="form-group">
              <label class="form-label">Contrasena actual</label>
              <div class="input-password-wrapper">
                <input
                  [type]="showCurrent ? 'text' : 'password'"
                  class="form-input"
                  [(ngModel)]="passwordForm.current"
                  placeholder="Ingresa tu contrasena actual"
                />
                <button
                  class="toggle-password"
                  (click)="showCurrent = !showCurrent"
                  type="button"
                >
                  <i [class]="showCurrent ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Nueva contrasena</label>
              <div class="input-password-wrapper">
                <input
                  [type]="showNew ? 'text' : 'password'"
                  class="form-input"
                  [(ngModel)]="passwordForm.newPassword"
                  placeholder="Ingresa nueva contrasena"
                />
                <button
                  class="toggle-password"
                  (click)="showNew = !showNew"
                  type="button"
                >
                  <i [class]="showNew ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
              <div class="password-strength">
                <div class="strength-bars">
                  <div
                    class="strength-bar"
                    *ngFor="let i of [1,2,3,4]"
                    [class.active]="getStrength() >= i"
                    [class.weak]="getStrength() === 1"
                    [class.medium]="getStrength() === 2"
                    [class.strong]="getStrength() >= 3"
                  ></div>
                </div>
                <span class="strength-label">{{ getStrengthLabel() }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirmar contrasena</label>
              <div class="input-password-wrapper">
                <input
                  [type]="showConfirm ? 'text' : 'password'"
                  class="form-input"
                  [(ngModel)]="passwordForm.confirm"
                  placeholder="Confirma nueva contrasena"
                />
                <button
                  class="toggle-password"
                  (click)="showConfirm = !showConfirm"
                  type="button"
                >
                  <i [class]="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
              <span
                class="match-indicator"
                *ngIf="passwordForm.confirm.length > 0"
                [class.match]="passwordsMatch()"
                [class.no-match]="!passwordsMatch()"
              >
                <i [class]="passwordsMatch() ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                {{ passwordsMatch() ? 'Las contrasenas coinciden' : 'Las contrasenas no coinciden' }}
              </span>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-primary">Actualizar</button>
          </div>
        </div>

        <!-- 2FA Section -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-icon section-icon--teal">
              <i class="pi pi-shield"></i>
            </div>
            <div class="section-header-text">
              <h2 class="section-title">Autenticacion en dos pasos (2FA)</h2>
              <p class="section-subtitle">Anade una capa adicional de seguridad a tu cuenta</p>
            </div>
            <label class="switch">
              <input type="checkbox" [(ngModel)]="twoFactorEnabled" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="tfa-content" *ngIf="twoFactorEnabled">
            <div class="tfa-methods">
              <div
                class="tfa-method"
                *ngFor="let method of tfaMethods"
                [class.active]="method.active"
                (click)="method.active = !method.active"
              >
                <i [class]="'pi ' + method.icon"></i>
                <div class="tfa-method-info">
                  <span class="tfa-method-name">{{ method.name }}</span>
                  <span class="tfa-method-desc">{{ method.description }}</span>
                </div>
                <div class="tfa-method-status" [class.enabled]="method.active">
                  {{ method.active ? 'Activo' : 'Inactivo' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Sessions -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-icon section-icon--purple">
              <i class="pi pi-desktop"></i>
            </div>
            <div>
              <h2 class="section-title">Sesiones activas</h2>
              <p class="section-subtitle">Dispositivos donde tu cuenta esta conectada</p>
            </div>
          </div>

          <div class="sessions-list">
            <div class="session-row" *ngFor="let session of sessions">
              <div class="session-device">
                <i [class]="'pi ' + session.icon + ' session-device-icon'"></i>
                <div class="session-info">
                  <span class="session-name">{{ session.device }}</span>
                  <span class="session-meta">{{ session.location }} - {{ session.lastActive }}</span>
                </div>
              </div>
              <span
                class="session-badge"
                [class.current]="session.current"
              >
                {{ session.current ? 'Sesion actual' : 'Activa' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SeguridadNewComponent {
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  twoFactorEnabled = false;

  passwordForm = {
    current: '',
    newPassword: '',
    confirm: '',
  };

  tfaMethods = [
    { name: 'SMS', description: 'Recibe un codigo por mensaje de texto', icon: 'pi-mobile', active: true },
    { name: 'Email', description: 'Recibe un codigo por correo electronico', icon: 'pi-envelope', active: false },
    { name: 'App autenticadora', description: 'Usa Google Authenticator o similar', icon: 'pi-qrcode', active: false },
  ];

  sessions = [
    { device: 'Chrome - MacOS', location: 'Bogota, Colombia', lastActive: 'Ahora', icon: 'pi-desktop', current: true },
    { device: 'Safari - iPhone 15', location: 'Bogota, Colombia', lastActive: 'Hace 2 horas', icon: 'pi-mobile', current: false },
    { device: 'Firefox - Windows 11', location: 'Medellin, Colombia', lastActive: 'Hace 1 dia', icon: 'pi-desktop', current: false },
  ];

  getStrength(): number {
    const pw = this.passwordForm.newPassword;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  getStrengthLabel(): string {
    const s = this.getStrength();
    if (s === 0) return '';
    if (s === 1) return 'Debil';
    if (s === 2) return 'Media';
    if (s === 3) return 'Fuerte';
    return 'Muy fuerte';
  }

  passwordsMatch(): boolean {
    return this.passwordForm.newPassword === this.passwordForm.confirm && this.passwordForm.newPassword.length > 0;
  }
}
