import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { GaliSignalsService } from '../../../services/gali-v3/signals.service';
import { GaliMemoryService } from '../../../services/gali-v3/memory.service';
import { GaliRightPanelService } from '../../../services/gali-v3/right-panel.service';
import { GaliGuideTourService } from '../../../services/gali-v3/guide-tour.service';
import { WorkspaceContextService, WORKSPACE_MODOS } from '../../../services/gali-v3/workspace-context.service';

@Component({
  selector: 'gali-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali-topbar.component.html',
  styleUrls: ['./gali-topbar.component.scss'],
})
export class GaliTopbarComponent {
  private signalsSvc = inject(GaliSignalsService);
  private memorySvc = inject(GaliMemoryService);
  private router = inject(Router);
  private rpanelSvc = inject(GaliRightPanelService);
  private tourSvc = inject(GaliGuideTourService);
  private workspaceSvc = inject(WorkspaceContextService);

  signalsCount = this.signalsSvc.count;
  signalsActive = this.signalsSvc.active;
  signalsCriticas = this.signalsSvc.criticas;
  memoria = this.memorySvc.memory;
  rpanelOpen = this.rpanelSvc.open;
  modeHeader = this.workspaceSvc.modeHeader;
  modoActivo = this.workspaceSvc.modoActivo;
  modos = WORKSPACE_MODOS;

  popoverOpen = signal(false);

  togglePanel() { this.rpanelSvc.toggle(); }
  togglePopover() { this.popoverOpen.update(v => !v); }
  closePopover() { this.popoverOpen.set(false); }

  goToSignal(target: string, signalId: string) {
    const [path, qs] = target.split('?');
    const existing = qs ? new URLSearchParams(qs) : new URLSearchParams();
    existing.set('signal', signalId);
    this.router.navigateByUrl(`${path}?${existing.toString()}`);
    this.closePopover();
    this.rpanelSvc.setOpen(true);
  }

  dismissSignal(id: string, ev: Event) {
    ev.stopPropagation();
    this.signalsSvc.dismiss(id);
  }

  openCommandPalette(): void {
    window.dispatchEvent(new CustomEvent('gali:open-cmdk'));
  }

  restartTour(): void { this.tourSvc.restart(); }

  navigateModo(modoId: string) {
    this.workspaceSvc.navigateModo(modoId as typeof WORKSPACE_MODOS[number]['id']);
  }

  isModoActive(id: string): boolean {
    return this.modoActivo() === id;
  }
}
