import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; route: string }[];
}

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
          <a
            *ngIf="!item.children"
            [routerLink]="item.route"
            routerLinkActive="sidebar__item--active"
            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
            class="sidebar__item"
            [title]="collapsed ? item.label : ''"
          >
            <i [class]="'pi ' + item.icon" class="sidebar__item-icon"></i>
            <span *ngIf="!collapsed" class="sidebar__item-label">{{ item.label }}</span>
          </a>

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

          <div *ngIf="item.children && expandedItem === item.label && !collapsed" class="sidebar__subitems">
            <a
              *ngFor="let child of item.children"
              [routerLink]="child.route"
              routerLinkActive="sidebar__subitem--active"
              class="sidebar__subitem"
            >
              {{ child.label }}
            </a>
          </div>
        </div>
      </nav>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() collapsed = false;
  expandedItem: string | null = null;

  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'pi-home', route: '/' },
    { label: 'Dashboard', icon: 'pi-chart-bar', route: '/dashboard' },
    {
      label: 'Productos',
      icon: 'pi-search',
      children: [
        { label: 'Catálogo', route: '/catalog' },
        { label: 'Mis productos', route: '/catalog/mine' },
      ],
    },
    {
      label: 'Pedidos',
      icon: 'pi-shopping-cart',
      children: [
        { label: 'Todos los pedidos', route: '/orders' },
        { label: 'Garantías', route: '/orders/warranties' },
      ],
    },
    {
      label: 'Reportes',
      icon: 'pi-chart-line',
      children: [
        { label: 'Ventas', route: '/reports/sales' },
        { label: 'Envíos', route: '/reports/shipping' },
      ],
    },
    {
      label: 'Financiero',
      icon: 'pi-dollar',
      children: [
        { label: 'Wallet', route: '/wallet' },
        { label: 'Facturas', route: '/invoices' },
      ],
    },
    { label: 'Marketing', icon: 'pi-megaphone', route: '/marketing' },
    { label: 'Dropi Card', icon: 'pi-credit-card', route: '/dropi-card' },
    { label: 'CAS', icon: 'pi-comments', route: '/cas' },
    { label: 'Academy', icon: 'pi-book', route: '/academy' },
    {
      label: 'Configurar',
      icon: 'pi-cog',
      children: [
        { label: 'Mi tienda', route: '/settings/store' },
        { label: 'Integraciones', route: '/settings/integrations' },
      ],
    },
  ];

  toggleExpand(label: string) {
    this.expandedItem = this.expandedItem === label ? null : label;
  }
}
