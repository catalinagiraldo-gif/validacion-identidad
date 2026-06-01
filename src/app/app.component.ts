import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <ng-container *ngIf="isStandalonePage; else appShell">
      <router-outlet />
    </ng-container>

    <ng-template #appShell>
      <div class="app-shell" [class.app-shell--collapsed]="sidebarCollapsed">
        <app-sidebar [(collapsed)]="sidebarCollapsed" />
        <div class="app-shell__main">
          <app-header />
          <main class="app-shell__content">
            <router-outlet />
          </main>
        </div>
      </div>
    </ng-template>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isStandalonePage = false;
  sidebarCollapsed = false;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map((e: any) => (e as NavigationEnd).url),
      )
      .subscribe(url => {
        this.isStandalonePage =
          url.startsWith('/login') ||
          url === '/arch-select' ||
          url.endsWith('/profile-select') ||
          url.startsWith('/new');
      });
  }
}
