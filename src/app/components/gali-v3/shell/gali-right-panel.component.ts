import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GaliRightPanelService, RightPanelTab } from '../../../services/gali-v3/right-panel.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { GaliBloqueBuilderService } from '../../../services/gali-v3/bloque-builder.service';
import { GaliSignalsService } from '../../../services/gali-v3/signals.service';
import { AgentOrchestratorService } from '../../../services/gali-v3/agent-orchestrator.service';
import { BacklinksService } from '../../../services/gali-v3/backlinks.service';
import { GaliChatComponent } from '../chat/gali-chat.component';
import { GaliBusinessContextComponent } from './gali-business-context.component';

@Component({
  selector: 'gali-right-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, GaliChatComponent, GaliBusinessContextComponent],
  templateUrl: './gali-right-panel.component.html',
  styleUrls: ['./gali-right-panel.component.scss'],
})
export class GaliRightPanelComponent {
  private svc = inject(GaliRightPanelService);
  private chatSvc = inject(GaliChatService);
  private bloqueSvc = inject(GaliBloqueBuilderService);
  private signalsSvc = inject(GaliSignalsService);
  private agentSvc = inject(AgentOrchestratorService);
  private backlinksSvc = inject(BacklinksService);
  private router = inject(Router);

  open = this.svc.open;
  tab = this.svc.tab;
  businessExpanded = this.svc.businessExpanded;

  agentsExpanded = signal(true);
  signalsExpanded = signal(true);
  tablerosExpanded = signal(false);

  bloques = this.bloqueSvc.bloquesGuardados;
  bloquesCount = computed(() => this.bloques().length);
  agentes = this.agentSvc.activos;
  signals = this.signalsSvc.active;
  backlinks = this.backlinksSvc.backlinks;
  backlinkLabel = this.backlinksSvc.entityLabel;

  unreadCount = computed(() => {
    const msgs = this.chatSvc.messages();
    const last = msgs[msgs.length - 1];
    return last && last.role === 'gali' && !this.open() ? 1 : 0;
  });

  toggle() { this.svc.toggle(); }
  setTab(t: RightPanelTab) { this.svc.setTab(t); }
  toggleBusiness() { this.svc.toggleBusiness(); }

  toggleAgents() { this.agentsExpanded.update(v => !v); }
  toggleSignals() { this.signalsExpanded.update(v => !v); }
  toggleTableros() { this.tablerosExpanded.update(v => !v); }

  irAlConstructor() { this.router.navigateByUrl('/gali-v3/bloque-builder'); }

  toggleAgentPausa(id: string, ev: Event) {
    ev.stopPropagation();
    this.agentSvc.togglePausa(id);
  }

  toggleSignalReasoning(id: string) { this.signalsSvc.toggleReasoning(id); }
  isSignalReasoningExpanded(id: string) { return this.signalsSvc.isReasoningExpanded(id); }

  executeSignal(id: string, ev: Event) {
    ev.stopPropagation();
    this.signalsSvc.executeSignal(id);
  }

  dismissSignal(id: string, ev: Event) {
    ev.stopPropagation();
    this.signalsSvc.dismiss(id);
  }

  goToSignalRoute(route: string) { this.router.navigateByUrl(route); }

  goToReceta(route: string) { this.router.navigateByUrl(route); }

  confianzaPct(c: number | undefined): string {
    return `${Math.round((c ?? 0.5) * 100)}%`;
  }

  confianzaTone(c: number | undefined) { return this.signalsSvc.confianzaTone(c); }
  agentConfianzaTone(c: number) { return this.agentSvc.confianzaTone(c); }

  agentEstadoIcon(estado: string): string {
    switch (estado) {
      case 'activo': return '◉';
      case 'esperando': return '⏸';
      case 'completado': return '✓';
      case 'fallido': return '✕';
      case 'pausa': return '○';
      default: return '○';
    }
  }
}
