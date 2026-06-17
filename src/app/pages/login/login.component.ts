import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loading = false;
  error = '';
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.auth.ensureGuestAccess();
    this.router.navigate(['/old/home']);
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

  onEmailLogin() {
    // Visual-only for now — show toast message
    this.error = 'Próximamente: inicio de sesión con correo y contraseña';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
