import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarNewComponent } from '../sidebar-new/sidebar-new.component';
import { HeaderNewComponent } from '../header-new/header-new.component';
import { FabMenuComponent } from '../fab-menu/fab-menu.component';
import { DropiToastComponent } from '../../common/components/dropi-toast/dropi-toast.component';
import { PrototypeDemoPanelComponent } from './demo-panel/prototype-demo-panel.component';
import { IdentitySumsubModalComponent } from '../../common/components/identity-sumsub-modal/identity-sumsub-modal.component';
import { IdentityFase0InterceptorComponent } from '../../common/components/identity-fase0-interceptor/identity-fase0-interceptor.component';
import { IdentityFase0BlockComponent } from '../../common/components/identity-fase0-block/identity-fase0-block.component';
import { IdentityFase0ResultComponent } from '../../common/components/identity-fase0-result/identity-fase0-result.component';
import { IdentityFase0CrmToastComponent } from '../../common/components/identity-fase0-crm-toast/identity-fase0-crm-toast.component';
import { IdentityFase0SumsubStandinComponent } from '../../common/components/identity-fase0-sumsub-standin/identity-fase0-sumsub-standin.component';
import { IdentityFase0StateSwitcherComponent } from '../../common/components/identity-fase0-state-switcher/identity-fase0-state-switcher.component';
import { IdentidadTourComponent } from '../../common/components/identidad-tour/identidad-tour.component';

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
    IdentityFase0InterceptorComponent,
    IdentityFase0BlockComponent,
    IdentityFase0ResultComponent,
    IdentityFase0CrmToastComponent,
    IdentityFase0SumsubStandinComponent,
    IdentityFase0StateSwitcherComponent,
    IdentidadTourComponent,
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
      <app-identity-fase0-interceptor />
      <app-identity-fase0-block />
      <app-identity-fase0-result />
      <app-identity-fase0-crm-toast />
      <app-identity-fase0-sumsub-standin />
      <app-identity-fase0-state-switcher />
      <app-identidad-tour />
    </div>
  `,
  styleUrl: './layout-new.component.scss',
})
export class LayoutNewComponent {
  sidebarCollapsed = false;
}
