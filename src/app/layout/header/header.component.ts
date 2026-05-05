import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header__left">
        <div class="header__role-badge">
          <span class="header__role-tag">{{ profileLabel | uppercase }}</span>
        </div>
      </div>

      <div class="header__right">
        <button class="header__profile-switch" (click)="onChangeProfile()">
          <i class="pi pi-users"></i>
          Cambiar perfil
        </button>

        <div class="header__user">
          <img
            *ngIf="user?.photoURL"
            [src]="user?.photoURL"
            class="header__avatar-img"
            referrerpolicy="no-referrer"
          />
          <span *ngIf="!user?.photoURL" class="header__avatar">
            {{ (user?.displayName || 'U').charAt(0).toUpperCase() }}
          </span>
          <span class="header__user-name">{{ user?.displayName || 'Usuario' }}</span>
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
  get user() {
    return this.auth.currentUser;
  }

  get profileLabel() {
    return this.profile.getProfileLabel();
  }

  constructor(
    private auth: AuthService,
    private profile: ProfileService,
    private router: Router,
  ) {}

  onChangeProfile() {
    this.profile.clearProfile();
  }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
