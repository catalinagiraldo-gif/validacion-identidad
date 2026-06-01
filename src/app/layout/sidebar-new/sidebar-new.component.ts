import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NewNavItem,
  NewNavChild,
  SIDEBAR_NEW_NAV,
} from '../../config/sidebar-new-nav.config';

@Component({
  selector: 'app-sidebar-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar-new">
      <!-- Icon Rail (56px) -->
      <div class="sidebar-new__rail">
        <div class="sidebar-new__rail-modules">
          <!-- Main modules -->
          <div class="sidebar-new__rail-group">
            <ng-container *ngFor="let item of mainModules">
              <div
                class="sidebar-new__rail-item"
                [class.sidebar-new__rail-item--active]="activeModule === item.id"
                (click)="selectModule(item)"
              >
                <div class="sidebar-new__rail-icon-bg">
                  <div class="sidebar-new__rail-icon-wrapper">
                    <img *ngIf="item.iconSvg" [src]="item.iconSvg" [alt]="item.label" class="sidebar-new__rail-icon-svg" />
                    <i *ngIf="!item.iconSvg" [class]="item.icon" class="sidebar-new__rail-icon"></i>
                    <span
                      *ngIf="item.notificationDot"
                      class="sidebar-new__notification-dot"
                    ></span>
                  </div>
                </div>

                <!-- Tooltip with subitems (always in DOM, shown on hover via CSS) -->
                <div
                  *ngIf="item.children"
                  class="sidebar-new__tooltip"
                  [class.sidebar-new__tooltip--hidden]="activeModule === item.id"
                >
                  <div class="sidebar-new__tooltip-title">{{ item.label }}</div>
                  <div
                    *ngFor="let child of getTopLevelChildren(item)"
                    class="sidebar-new__tooltip-item"
                  >
                    {{ child.label }}
                  </div>
                </div>
                <!-- Simple tooltip for modules without children -->
                <div
                  *ngIf="!item.children"
                  class="sidebar-new__tooltip sidebar-new__tooltip--simple"
                  [class.sidebar-new__tooltip--hidden]="activeModule === item.id"
                >
                  <div class="sidebar-new__tooltip-title" style="margin-bottom: 0">{{ item.label }}</div>
                </div>
              </div>
            </ng-container>
          </div>

          <!-- Separator -->
          <div class="sidebar-new__rail-separator"></div>

          <!-- Secondary modules -->
          <div class="sidebar-new__rail-group">
            <ng-container *ngFor="let item of secondaryModules">
              <div
                class="sidebar-new__rail-item"
                [class.sidebar-new__rail-item--active]="activeModule === item.id"
                (click)="selectModule(item)"
              >
                <div class="sidebar-new__rail-icon-bg">
                  <div class="sidebar-new__rail-icon-wrapper">
                    <img *ngIf="item.iconSvg" [src]="item.iconSvg" [alt]="item.label" class="sidebar-new__rail-icon-svg" />
                    <i *ngIf="!item.iconSvg" [class]="item.icon" class="sidebar-new__rail-icon"></i>
                  </div>
                </div>

                <div
                  class="sidebar-new__tooltip sidebar-new__tooltip--simple"
                  [class.sidebar-new__tooltip--hidden]="activeModule === item.id"
                >
                  <div class="sidebar-new__tooltip-title" style="margin-bottom: 0">{{ item.label }}</div>
                </div>
              </div>
            </ng-container>
          </div>
        </div>

        <!-- Footer heart -->
        <div class="sidebar-new__rail-footer">
          <i class="pi pi-heart-fill sidebar-new__rail-icon sidebar-new__rail-icon--footer"></i>
          <div class="sidebar-new__tooltip sidebar-new__tooltip--footer">
            <span>Creado con &#10084;&#65039; V.2.0</span>
            <span>&copy; Dropi 2026</span>
          </div>
        </div>
      </div>

      <!-- Submenu Panel (200px, collapsible) -->
      <div
        class="sidebar-new__submenu"
        [class.sidebar-new__submenu--collapsed]="collapsed"
      >
        <div class="sidebar-new__submenu-inner" *ngIf="!collapsed">
          <!-- Header with module name + collapse toggle -->
          <div class="sidebar-new__submenu-header">
            <span class="sidebar-new__submenu-title">{{ activeModuleLabel }}</span>
            <button
              class="sidebar-new__collapse-btn"
              (click)="toggleCollapse()"
              [attr.aria-label]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            >
              <i class="pi pi-angle-double-left"></i>
            </button>
          </div>

          <!-- Submenu items -->
          <nav
            *ngIf="activeModuleChildren && activeModuleChildren.length > 0"
            class="sidebar-new__submenu-nav"
          >
            <ng-container *ngFor="let child of activeModuleChildren">
              <!-- Leaf item (no sub-children) -->
              <a
                *ngIf="!child.children"
                [routerLink]="child.route"
                routerLinkActive="sidebar-new__submenu-item--active"
                class="sidebar-new__submenu-item"
              >
                <i *ngIf="child.icon" [class]="child.icon" class="sidebar-new__submenu-item-icon"></i>
                <span class="sidebar-new__submenu-item-label">{{ child.label }}</span>
                <span
                  *ngIf="child.badge === 'nuevo'"
                  class="sidebar-new__badge sidebar-new__badge--nuevo"
                >Nuevo</span>
                <span
                  *ngIf="child.badge === 'beta'"
                  class="sidebar-new__badge sidebar-new__badge--beta"
                >Beta</span>
              </a>

              <!-- Expandable group (has sub-children) -->
              <div *ngIf="child.children" class="sidebar-new__submenu-group">
                <div
                  class="sidebar-new__submenu-item sidebar-new__submenu-item--parent"
                  [class.sidebar-new__submenu-item--expanded]="isExpanded(child.id)"
                  (click)="toggleExpand(child.id)"
                >
                  <i *ngIf="child.icon" [class]="child.icon" class="sidebar-new__submenu-item-icon"></i>
                  <span class="sidebar-new__submenu-item-label">{{ child.label }}</span>
                  <i
                    class="pi pi-chevron-down sidebar-new__chevron"
                    [class.sidebar-new__chevron--open]="isExpanded(child.id)"
                  ></i>
                </div>

                <!-- Nested children with tree connector lines -->
                <div
                  *ngIf="isExpanded(child.id)"
                  class="sidebar-new__submenu-children"
                >
                  <a
                    *ngFor="let grandchild of child.children; let last = last"
                    [routerLink]="grandchild.route"
                    routerLinkActive="sidebar-new__submenu-child--active"
                    class="sidebar-new__submenu-child"
                  >
                    <div class="sidebar-new__tree-connector">
                      <div class="sidebar-new__tree-vert"></div>
                      <div class="sidebar-new__tree-horiz"></div>
                      <div class="sidebar-new__tree-vert" [class.sidebar-new__tree-vert--hidden]="last"></div>
                    </div>
                    <div class="sidebar-new__submenu-child-content">
                      <span class="sidebar-new__submenu-child-label">{{ grandchild.label }}</span>
                    </div>
                  </a>
                </div>
              </div>
            </ng-container>
          </nav>

          <!-- No subitems — show single link -->
          <div
            *ngIf="!activeModuleChildren || activeModuleChildren.length === 0"
            class="sidebar-new__submenu-empty"
          >
            <a
              *ngIf="activeModuleRoute"
              [routerLink]="activeModuleRoute"
              routerLinkActive="sidebar-new__submenu-item--active"
              class="sidebar-new__submenu-item"
            >
              <span class="sidebar-new__submenu-item-label">{{ activeModuleLabel }}</span>
            </a>
          </div>
        </div>

        <!-- COMPACT VIEW (icons only, shown when collapsed) -->
        <div class="sidebar-new__submenu-compact" *ngIf="collapsed">
          <div class="sidebar-new__compact-header">
            <button
              class="sidebar-new__collapse-btn"
              (click)="toggleCollapse()"
              [attr.aria-label]="'Expand sidebar'"
            >
              <i class="pi pi-angle-double-right"></i>
            </button>
          </div>

          <nav class="sidebar-new__compact-nav" *ngIf="activeModuleChildren">
            <ng-container *ngFor="let child of activeModuleChildren">
              <a
                *ngIf="!child.children"
                [routerLink]="child.route"
                routerLinkActive="sidebar-new__compact-item--active"
                class="sidebar-new__compact-item"
                (click)="onCompactItemClick()"
              >
                <i *ngIf="child.icon" [class]="child.icon"></i>
                <i *ngIf="!child.icon" class="pi pi-circle"></i>
                <span class="sidebar-new__compact-tooltip">{{ child.label }}</span>
              </a>

              <a
                *ngIf="child.children"
                class="sidebar-new__compact-item"
                [class.sidebar-new__compact-item--active]="isExpanded(child.id)"
                (click)="toggleExpand(child.id)"
              >
                <i *ngIf="child.icon" [class]="child.icon"></i>
                <i *ngIf="!child.icon" class="pi pi-folder"></i>
                <span class="sidebar-new__compact-tooltip">{{ child.label }}</span>
              </a>

              <ng-container *ngIf="child.children && isExpanded(child.id)">
                <a
                  *ngFor="let grandchild of child.children"
                  [routerLink]="grandchild.route"
                  routerLinkActive="sidebar-new__compact-item--active"
                  class="sidebar-new__compact-item sidebar-new__compact-item--nested"
                  (click)="onCompactItemClick()"
                >
                  <i class="pi pi-minus" style="font-size: 12px"></i>
                  <span class="sidebar-new__compact-tooltip">{{ grandchild.label }}</span>
                </a>
              </ng-container>
            </ng-container>
          </nav>
        </div>
      </div>
    </aside>
  `,
  styleUrl: './sidebar-new.component.scss',
})
export class SidebarNewComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  activeModule = 'productos';
  expandedItems = new Set<string>(['catalogo']);

  mainModules: NewNavItem[] = [];
  secondaryModules: NewNavItem[] = [];

  private allModules: NewNavItem[] = SIDEBAR_NEW_NAV;

  constructor() {
    this.mainModules = this.allModules.filter(m => m.section === 'main');
    this.secondaryModules = this.allModules.filter(m => m.section === 'secondary');
  }

  get activeModuleLabel(): string {
    const mod = this.allModules.find(m => m.id === this.activeModule);
    return mod?.label ?? '';
  }

  get activeModuleChildren(): NewNavChild[] | undefined {
    const mod = this.allModules.find(m => m.id === this.activeModule);
    return mod?.children;
  }

  get activeModuleRoute(): string | undefined {
    const mod = this.allModules.find(m => m.id === this.activeModule);
    return mod?.route;
  }

  getTopLevelChildren(item: NewNavItem): NewNavChild[] {
    if (!item.children) return [];
    return item.children;
  }

  selectModule(item: NewNavItem): void {
    this.activeModule = item.id;
    this.expandedItems.clear();

    if (this.collapsed && item.children) {
      this.collapsed = false;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  toggleExpand(id: string): void {
    if (this.expandedItems.has(id)) {
      this.expandedItems.delete(id);
    } else {
      this.expandedItems.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedItems.has(id);
  }

  onCompactItemClick(): void {
    // Navigate via routerLink; keep compact mode
  }
}
