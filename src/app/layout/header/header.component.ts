import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header__left">
        <div *ngIf="userRole" class="header__role-badge">
          <span class="header__role-tag">{{ userRole | uppercase }}</span>
        </div>
      </div>

      <div class="header__right">
        <div class="header__wallet">
          <i class="pi pi-wallet"></i>
          <span>{{ walletBalance | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
        </div>

        <div class="header__notifications">
          <i class="pi pi-bell"></i>
          <span *ngIf="notificationCount > 0" class="header__badge">
            {{ notificationCount }}
          </span>
        </div>

        <div class="header__user">
          <span class="header__avatar">
            {{ userName.charAt(0).toUpperCase() }}
          </span>
          <span class="header__user-name">{{ userName }}</span>
          <i class="pi pi-chevron-down header__user-chevron"></i>
        </div>

        <button class="header__logout" (click)="onLogout()" title="Cerrar sesión">
          <i class="pi pi-sign-out"></i>
        </button>

        <span class="header__env-tag">PROTOTYPE</span>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() userName = 'Usuario';
  @Input() userRole = '';
  @Input() walletBalance = 2717360;
  @Input() notificationCount = 1;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
