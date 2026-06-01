import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface ArchOption {
  id: 'old' | 'new';
  icon: string;
  title: string;
  description: string;
  route: string;
}

const ARCH_OPTIONS: ArchOption[] = [
  {
    id: 'old',
    icon: 'pi pi-history',
    title: 'Antigua Arquitectura',
    description: 'Prototipos basados en el sistema de diseno actual',
    route: '/old/profile-select',
  },
  {
    id: 'new',
    icon: 'pi pi-sparkles',
    title: 'Nueva Arquitectura',
    description: 'Prototipos basados en el nuevo sistema de diseno',
    route: '/new/profile-select',
  },
];

const STORAGE_KEY = 'dropi.selectedArch';

@Component({
  selector: 'app-arch-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="arch-select">
      <div class="arch-select__container">
        <div class="arch-select__header">
          <img
            src="assets/images/dropi-logo.svg"
            alt="Dropi"
            class="arch-select__logo"
          />
          <h1 class="arch-select__greeting">
            Hola, {{ user?.displayName || 'Usuario' }}
          </h1>
          <p class="arch-select__subtitle">
            Selecciona la arquitectura con la que deseas navegar
          </p>
        </div>

        <div class="arch-select__cards">
          <button
            *ngFor="let option of archOptions"
            class="arch-select__card"
            [class.arch-select__card--new]="option.id === 'new'"
            (click)="onSelect(option)"
          >
            <i [class]="option.icon + ' arch-select__card-icon'"></i>
            <h2 class="arch-select__card-title">{{ option.title }}</h2>
            <p class="arch-select__card-desc">{{ option.description }}</p>
            <span class="arch-select__card-btn">Ingresar</span>
          </button>
        </div>

        <div class="arch-select__footer">
          <button class="arch-select__back" (click)="onLogout()">
            <i class="pi pi-arrow-left"></i>
            Cerrar sesi&oacute;n
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './arch-select.component.scss',
})
export class ArchSelectComponent {
  archOptions = ARCH_OPTIONS;
  user = this.auth.currentUser;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSelect(option: ArchOption) {
    localStorage.setItem(STORAGE_KEY, option.id);
    this.router.navigate([option.route]);
  }

  async onLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
