import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavItem, UserRole, SIDEBAR_NAV } from '../../config/sidebar-nav.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="collapsed">
      <div class="sidebar__top">
        <div class="sidebar__logo">
          <img
            *ngIf="!collapsed"
            src="assets/images/dropi-logo.svg"
            alt="Dropi"
            class="sidebar__logo-full"
          />
          <img
            *ngIf="collapsed"
            src="assets/images/dropi-logo.svg"
            alt="Dropi"
            class="sidebar__logo-icon"
          />
        </div>
        <button class="sidebar__toggle" (click)="collapsed = !collapsed">
          <i class="pi pi-bars"></i>
        </button>
      </div>

      <nav class="sidebar__nav">
        <div *ngFor="let item of menuItems" class="sidebar__item-wrapper">
          <!-- Simple item (no children) -->
          <a
            *ngIf="!item.children"
            [routerLink]="item.route"
            routerLinkActive="sidebar__item--active"
            [routerLinkActiveOptions]="{ exact: item.route === '/home' }"
            class="sidebar__item"
            [title]="collapsed ? item.label : ''"
          >
            <i [class]="'pi ' + item.icon" class="sidebar__item-icon"></i>
            <span *ngIf="!collapsed" class="sidebar__item-label">{{ item.label }}</span>
          </a>

          <!-- Parent item (with children) -->
          <div
            *ngIf="item.children"
            class="sidebar__item"
            [class.sidebar__item--expanded]="expandedItem === item.label"
            (click)="toggleExpand(item.label)"
          >
            <i [class]="'pi ' + item.icon" class="sidebar__item-icon"></i>
            <span *ngIf="!collapsed" class="sidebar__item-label">{{ item.label }}</span>
            <i *ngIf="!collapsed" class="pi pi-chevron-down sidebar__item-chevron"
               [class.sidebar__item-chevron--open]="expandedItem === item.label"></i>
          </div>

          <!-- Children -->
          <div *ngIf="item.children && expandedItem === item.label && !collapsed" class="sidebar__subitems">
            <a
              *ngFor="let child of item.children"
              [routerLink]="child.route"
              routerLinkActive="sidebar__subitem--active"
              class="sidebar__subitem"
            >
              <span class="sidebar__subitem-dot"></span>
              {{ child.label }}
            </a>
          </div>
        </div>
      </nav>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  expandedItem: string | null = null;
  menuItems: NavItem[] = [];

  private sub?: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.sub = this.auth.user$.subscribe(user => {
      const role = (user?.role as UserRole) ?? 'dropshipper';
      this.menuItems = SIDEBAR_NAV[role] ?? SIDEBAR_NAV['dropshipper'];
      this.expandedItem = null;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  toggleExpand(label: string) {
    this.expandedItem = this.expandedItem === label ? null : label;
  }
}
