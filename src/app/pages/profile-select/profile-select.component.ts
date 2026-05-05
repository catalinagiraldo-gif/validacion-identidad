import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProfileService, PROFILE_OPTIONS, HubProfile } from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-select">
      <div class="profile-select__container">
        <div class="profile-select__header">
          <img *ngIf="user?.photoURL" [src]="user?.photoURL" class="profile-select__avatar" referrerpolicy="no-referrer" />
          <div *ngIf="!user?.photoURL" class="profile-select__avatar-fallback">
            {{ user?.displayName?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <h1 class="profile-select__greeting">Hola, {{ user?.displayName || 'Usuario' }}</h1>
          <p class="profile-select__subtitle">Selecciona el perfil con el que deseas navegar</p>
        </div>

        <div class="profile-select__cards">
          <button
            *ngFor="let option of profileOptions"
            class="profile-select__card"
            (click)="onSelect(option.id)"
          >
            <i [class]="option.icon + ' profile-select__card-icon'"></i>
            <h2 class="profile-select__card-title">{{ option.label }}</h2>
            <p class="profile-select__card-desc">{{ option.description }}</p>
          </button>
        </div>

        <button class="profile-select__logout" (click)="onLogout()">
          <i class="pi pi-sign-out"></i>
          Cerrar sesión
        </button>
      </div>
    </div>
  `,
  styleUrl: './profile-select.component.scss',
})
export class ProfileSelectComponent {
  profileOptions = PROFILE_OPTIONS;
  user = this.auth.currentUser;

  constructor(
    private auth: AuthService,
    private profile: ProfileService,
    private router: Router,
  ) {}

  onSelect(id: HubProfile) {
    this.profile.selectProfile(id);
  }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
