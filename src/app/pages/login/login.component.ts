import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login">
      <div class="login__banner">
        <img src="assets/images/login-banner.jpg" alt="Dropi" class="login__banner-img" />
      </div>

      <div class="login__form-side">
        <div class="login__form-container">
          <div class="login__form-header">
            <img src="assets/images/dropi-logo.svg" alt="Dropi" class="login__logo" />
          </div>

          <div class="login__form-body">
            <h1 class="login__title">RPP Hub</h1>
            <p class="login__subtitle">Portal de prototipos interactivos</p>

            <button
              class="login__google-btn"
              (click)="onGoogleLogin()"
              [disabled]="loading"
            >
              <img
                *ngIf="!loading"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google" width="20" height="20"
              />
              <i *ngIf="loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ loading ? 'Conectando...' : 'Iniciar sesión con Google' }}</span>
            </button>

            <p *ngIf="error" class="login__error">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/arch-select']);
    }
  }

  async onGoogleLogin() {
    this.loading = true;
    this.error = '';

    try {
      await this.auth.loginWithGoogle();
      this.router.navigate(['/arch-select']);
    } catch (err: any) {
      this.error = err?.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
