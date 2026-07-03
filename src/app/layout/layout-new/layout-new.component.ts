import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarNewComponent } from '../sidebar-new/sidebar-new.component';
import { HeaderNewComponent } from '../header-new/header-new.component';
import { FabMenuComponent } from '../fab-menu/fab-menu.component';
import { DropiToastComponent } from '../../common/components/dropi-toast/dropi-toast.component';
import { PrototypeDemoPanelComponent } from './demo-panel/prototype-demo-panel.component';
import { IdentitySumsubModalComponent } from '../../common/components/identity-sumsub-modal/identity-sumsub-modal.component';

@Component({
  selector: 'app-layout-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarNewComponent,
    HeaderNewComponent,
    FabMenuComponent,
    DropiToastComponent,
    PrototypeDemoPanelComponent,
    IdentitySumsubModalComponent,
  ],
  template: `
    <div class="layout-new">
      <app-header-new class="layout-new__header" />
      <div class="layout-new__body" [class.layout-new__body--collapsed]="sidebarCollapsed">
        <app-sidebar-new [(collapsed)]="sidebarCollapsed" />
        <main class="layout-new__content">
          <app-prototype-demo-panel class="demo-panel-sticky" />
          <router-outlet />
        </main>
      </div>
      <app-fab-menu />
      <app-dropi-toast />
      <app-identity-sumsub-modal />
    </div>
  `,
  styleUrl: './layout-new.component.scss',
})
export class LayoutNewComponent {
  sidebarCollapsed = false;
}
