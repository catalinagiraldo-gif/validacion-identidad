import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <div class="app-shell__main">
        <app-header />
        <main class="app-shell__content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {}
