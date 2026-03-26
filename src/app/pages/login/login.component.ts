import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../config/sidebar-nav.config';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login">
      <!-- Banner Left (Figma asset) -->
      <div class="login__banner">
        <img src="assets/images/login-banner.jpg" alt="Dropi" class="login__banner-img" />
      </div>

      <!-- Form Right -->
      <div class="login__form-side">
        <div class="login__form-container">
          <div class="login__form-header">
            <img src="assets/images/dropi-logo.svg" alt="Dropi" class="login__logo" />
            <div class="login__country-btn">
              <span class="login__flag">🇨🇴</span>
              <i class="pi pi-chevron-down"></i>
            </div>
          </div>

          <div class="login__form-body">
            <h1 class="login__title">Inicia sesión en Dropi</h1>

            <!-- Role Selector (RPP Prototype) -->
            <div class="login__role-selector">
              <p class="login__role-label">Selecciona un rol para prototipar:</p>
              <div class="login__role-options">
                <button
                  *ngFor="let role of roles"
                  class="login__role-btn"
                  [class.login__role-btn--active]="selectedRole === role.value"
                  (click)="selectRole(role.value)"
                >
                  <i [class]="'pi ' + role.icon"></i>
                  <span>{{ role.label }}</span>
                </button>
              </div>
            </div>

            <!-- Email -->
            <div class="login__field">
              <label class="login__label">Correo electrónico</label>
              <div class="login__input-wrapper">
                <input
                  type="email"
                  class="login__input"
                  placeholder="Ingresa tu correo"
                  [(ngModel)]="email"
                  [readonly]="true"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="login__field">
              <label class="login__label">Contraseña</label>
              <div class="login__input-wrapper">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  class="login__input"
                  placeholder="Ingresa tu contraseña"
                  [(ngModel)]="password"
                  value="prototype123"
                />
                <button class="login__eye-btn" (click)="showPassword = !showPassword">
                  <i [class]="'pi ' + (showPassword ? 'pi-eye' : 'pi-eye-slash')"></i>
                </button>
              </div>
            </div>

            <!-- Remember + Forgot -->
            <div class="login__options">
              <label class="login__checkbox-label">
                <input type="checkbox" class="login__checkbox" [(ngModel)]="remember" />
                <span>Recordarme</span>
              </label>
              <a class="login__forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <!-- Submit -->
            <button class="login__submit" (click)="onLogin()" [disabled]="!selectedRole">
              Iniciar sesión
            </button>

            <!-- Divider -->
            <div class="login__divider">
              <span class="login__divider-line"></span>
              <span class="login__divider-text">O</span>
              <span class="login__divider-line"></span>
            </div>

            <!-- Google -->
            <button class="login__google-btn" disabled>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
              <span>Iniciar sesión con Google</span>
            </button>

            <!-- Register -->
            <p class="login__register">
              ¿No tienes cuenta? <a class="login__register-link">Regístrate</a>
            </p>

            <!-- Error -->
            <p *ngIf="error" class="login__error">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email = '';
  password = 'prototype123';
  remember = true;
  showPassword = false;
  selectedRole: UserRole | null = null;
  error = '';
  users: User[] = [];

  roles = [
    { value: 'dropshipper' as UserRole, label: 'Dropshipper', icon: 'pi-shopping-bag' },
    { value: 'proveedor' as UserRole, label: 'Proveedor', icon: 'pi-box' },
    { value: 'admin' as UserRole, label: 'Admin', icon: 'pi-shield' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/home']);
      return;
    }
    this.http.get<User[]>('/api/users').subscribe(users => {
      this.users = users;
    });
  }

  selectRole(role: UserRole) {
    this.selectedRole = role;
    const user = this.users.find(u => u.role === role);
    if (user) {
      this.email = user.email;
    }
  }

  onLogin() {
    if (!this.selectedRole) return;
    this.error = '';
    this.auth.loginAs(this.selectedRole, this.users).subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        this.error = 'No se encontró un usuario para este rol';
      }
    });
  }
}
