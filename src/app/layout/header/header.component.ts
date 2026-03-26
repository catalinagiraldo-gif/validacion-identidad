import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header__left">
        <div *ngIf="communityName" class="header__community">
          <span class="header__avatar header__avatar--community">
            {{ communityName.charAt(0).toUpperCase() }}
          </span>
          <span class="header__community-text">Miembro De: {{ communityName }}</span>
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

        <span class="header__env-tag">PROTOTYPE</span>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() userName = 'Michel Pino';
  @Input() communityName = '';
  @Input() walletBalance = 2717360;
  @Input() notificationCount = 1;
}
