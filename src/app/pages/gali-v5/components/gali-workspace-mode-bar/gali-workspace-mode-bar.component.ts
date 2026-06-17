import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  GaliWorkspaceService,
  WORKSPACE_MODES,
  WorkspaceMode,
} from '../../services/gali-workspace.service';
import { GaliStateService } from '../../services/gali-state.service';
import { GaliAutopilotConfigComponent } from '../gali-autopilot-config/gali-autopilot-config.component';

@Component({
  selector: 'gali-workspace-mode-bar',
  standalone: true,
  imports: [CommonModule, GaliAutopilotConfigComponent],
  templateUrl: './gali-workspace-mode-bar.component.html',
  styleUrl: './gali-workspace-mode-bar.component.scss',
})
export class GaliWorkspaceModeBarComponent {
  @Input() objetivoActual = 38;
  @Input() objetivoMeta = 50;
  @Input() objetivoLabel = '50 ventas/semana';
  @Input() objetivoPeriodo = 'Sem 3 de 4';

  readonly ws = inject(GaliWorkspaceService);
  private gali = inject(GaliStateService);
  private router = inject(Router);
  readonly modes = WORKSPACE_MODES;
  readonly showAutopilotConfig = signal(false);

  onAutopilotClick(): void {
    if (this.ws.autopilot()) {
      // Already on — turn off directly
      this.ws.toggleAutopilot();
    } else {
      // Turn on — show config first
      this.showAutopilotConfig.set(true);
    }
  }

  private isOnHome(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/gali-v5' || url === '/gali-v5/';
  }

  /** Active mode — considers sub-routes to highlight the right tab */
  get activeMode(): string {
    const url = this.router.url;
    if (url.includes('/skills')) return 'construir';
    if (url.includes('/proyectos') || url.includes('/proyecto/')) return 'operar';
    return this.ws.activeMode();
  }

  setMode(mode: WorkspaceMode): void {
    this.ws.setMode(mode);
    if (!this.isOnHome()) {
      this.router.navigate(['/gali-v5']);
    }
  }

  onGaliStatusClick(): void {
    // Abre el panel derecho en la pestaña Live
    if (this.gali.galiMode() === 0) {
      this.gali.togglePanel();
    }
    // Navega al home si estamos en sub-ruta
    if (!this.isOnHome()) {
      this.router.navigate(['/gali-v5']);
    }
  }

  get progress(): number {
    return Math.min(100, Math.round((this.objetivoActual / this.objetivoMeta) * 100));
  }

  get currentSubRoute(): string {
    const url = this.router.url.split('?')[0];
    if (url.includes('/skills/nueva')) return 'Nueva skill';
    if (url.includes('/skills')) return 'Mis Skills';
    if (url.includes('/proyectos')) return 'Proyectos';
    if (url.includes('/proyecto/')) return 'Detalle';
    return '';
  }
}
