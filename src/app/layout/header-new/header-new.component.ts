import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-header-new',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-new">
      <div class="header-new__left">
        <img src="assets/images/dropi-logo-new.svg" alt="Dropi" class="header-new__logo" />
      </div>

      <div class="header-new__right">
        <button class="header-new__beta-toggle" (click)="betaActive = !betaActive">
          <span class="header-new__beta-label">BETA</span>
          <span class="header-new__switch" [class.header-new__switch--active]="betaActive">
            <span class="header-new__switch-indicator"></span>
          </span>
        </button>

        <div class="header-new__wallet">
          <i class="pi pi-wallet header-new__wallet-icon"></i>
          <span
            class="header-new__wallet-amount"
            [class.header-new__wallet-amount--hidden]="!walletVisible"
          >{{ walletAmount }}</span>
          <button class="header-new__wallet-toggle" (click)="walletVisible = !walletVisible">
            <i class="pi" [ngClass]="walletVisible ? 'pi-eye' : 'pi-eye-slash'"></i>
          </button>
        </div>

        <button class="header-new__user" (click)="showUserMenu = !showUserMenu; $event.stopPropagation()">
          <img
            *ngIf="user?.photoURL"
            [src]="user?.photoURL"
            class="header-new__avatar"
            referrerpolicy="no-referrer"
          />
          <span *ngIf="!user?.photoURL" class="header-new__avatar-fallback">
            {{ (user?.displayName || 'U').charAt(0).toUpperCase() }}
          </span>
          <i class="pi pi-chevron-down header-new__dropdown-arrow"></i>
        </button>

        <div class="header-new__user-menu" *ngIf="showUserMenu">
          <button class="header-new__menu-item" (click)="onChangeArch(); showUserMenu = false">
            <i class="pi pi-replay"></i>
            <span>Cambiar arquitectura</span>
          </button>
          <button class="header-new__menu-item" (click)="onChangeProfile(); showUserMenu = false">
            <i class="pi pi-users"></i>
            <span>Cambiar perfil</span>
          </button>
          <div class="header-new__menu-separator"></div>
          <button class="header-new__menu-item header-new__menu-item--danger" (click)="onLogout(); showUserMenu = false">
            <i class="pi pi-sign-out"></i>
            <span>Cerrar sesi&oacute;n</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header-new.component.scss',
})
export class HeaderNewComponent {
  betaActive = true;
  walletVisible = true;
  showUserMenu = false;
  walletAmount = '$2.717.360.700';

  get user() {
    return this.auth.currentUser;
  }

  constructor(
    private auth: AuthService,
    private profile: ProfileService,
    private router: Router,
  ) {}

  @HostListener('document:click')
  onDocumentClick() {
    this.showUserMenu = false;
  }

  onChangeArch() {
    sessionStorage.removeItem('dropi_hub_profile');
    localStorage.removeItem('dropi.selectedArch');
    this.router.navigate(['/arch-select']);
  }

  onChangeProfile() {
    this.profile.clearProfile();
  }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
