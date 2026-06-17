import { Component, EventEmitter, Output, computed, effect, inject, signal, ViewChild, ElementRef, AfterViewChecked, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GaliStateService } from '../../services/gali-state.service';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { loadAutopilotScope } from '../gali-autopilot-config/gali-autopilot-config.component';
import { DropiPanelSplitterComponent } from '../dropi-panel-splitter/dropi-panel-splitter.component';

type PanelTab = 'chat' | 'agentes' | 'senales' | 'live' | 'memory' | 'files';

@Component({
  selector: 'gali-right-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, DropiPanelSplitterComponent],
  templateUrl: './gali-right-panel.component.html',
  styleUrl: './gali-right-panel.component.scss',
})
export class GaliRightPanelComponent implements AfterViewChecked {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('chatEnd') chatEnd?: ElementRef;

  readonly gali = inject(GaliStateService);
  readonly ws = inject(GaliWorkspaceService);
  private ngZone = inject(NgZone);
  private shouldScrollChat = false;
  readonly Math = Math;
  private router = inject(Router);

  activeTab = signal<PanelTab>('chat');
  chatInput = signal('');

  // Agente más relevante actualmente (basado en el agente con status 'activo' más reciente)
  readonly activeAgentInfo = computed(() => {
    return this.gali.agents().find(a => a.status === 'activo') ?? null;
  });

  private readonly agentColors: Record<string, string> = {
    roax: '#f97316',
    vigilante: '#fbbf24',
    chatea: '#34d399',
    ada: '#818cf8',
    vigilante_logístico: '#fbbf24',
  };

  agentColor(id: string): string {
    return this.agentColors[id.toLowerCase()] ?? '#9b9ba8';
  }

  constructor() {
    effect(() => {
      const req = this.gali.requestedPanelTab();
      if (req) {
        this.activeTab.set(req as PanelTab);
        this.gali.requestedPanelTab.set(null);
      }
    }, { allowSignalWrites: true });
  }

  setTab(tab: PanelTab): void {
    this.activeTab.set(tab);
  }

  close(): void {
    this.closed.emit();
  }

  toggleAutopilot(): void {
    const next = !this.ws.autopilot();
    this.gali.setAutopilot(next);
  }

  quickAsk(text: string): void {
    this.chatInput.set('');
    this.gali.sendMessage(text);
    this.markScrollNeeded();
  }

  executeAction(action: string): void {
    this.gali.executeAction(action);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.close();
  }

  onInputChange(event: Event): void {
    this.chatInput.set((event.target as HTMLInputElement).value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send(): void {
    const text = this.chatInput().trim();
    if (!text) return;
    this.chatInput.set('');
    this.gali.sendMessage(text);
    this.markScrollNeeded();
  }

  onContextSplitChange(pct: number): void {
    this.gali.setContextSplitPercent(pct);
  }

  contextDragStart(): void {
    document.documentElement.style.setProperty('--gali-split-transition', 'none');
  }

  contextDragEnd(): void {
    document.documentElement.style.removeProperty('--gali-split-transition');
  }

  // ── Gali Memory Panel ──────────────────────────────────
  private readonly savedScope = loadAutopilotScope();

  readonly memoryItems = computed(() => {
    const scope = this.savedScope;
    const budgetK = Math.round(scope.budgetMax / 1000);
    const scopeDate = scope.savedAt
      ? new Date(scope.savedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
      : 'Hace 5 días';
    return [
      {
        id: 'm1',
        type: 'pattern' as const,
        icon: '📈',
        title: 'ROAS mejora con videos cortos',
        desc: 'Tus campañas con video <15s tienen ROAS 2.4× vs imagen estática. Aprendido en 3 proyectos.',
        date: 'Hace 2 días',
        confidence: 94,
        canUndo: false,
      },
      {
        id: 'm2',
        type: 'decision' as const,
        icon: '🔄',
        title: 'Cambio a Servientrega — Cali',
        desc: 'Coordinadora tenía 18% novedad en Cali. Gali migró Cali → Servientrega. Novedad bajó a 6%.',
        date: 'Ayer 3:12pm',
        confidence: 100,
        canUndo: true,
      },
      {
        id: 'm3',
        type: 'preference' as const,
        icon: '⚙️',
        title: `Presupuesto máx autopilot: $${budgetK}k/día`,
        desc: `Configurado en Autopilot Scope. Gali no escala campañas por encima de $${budgetK}k sin tu aprobación.${scope.changeTransportadora ? ' Cambio de transportadora habilitado.' : ''}`,
        date: scopeDate,
        confidence: 100,
        canUndo: true,
      },
      {
        id: 'm4',
        type: 'pattern' as const,
        icon: '🕐',
        title: 'Mejor hora de envío: 6–8pm',
        desc: 'Tus mensajes de WhatsApp enviados entre 6–8pm tienen 34% más conversión. Chatea Pro lo aplica automáticamente.',
        date: 'Hace 1 semana',
        confidence: 87,
        canUndo: false,
      },
      {
        id: 'm5',
        type: 'decision' as const,
        icon: '⏸️',
        title: 'Pausa campaña "Difusor Aromaterapia" — Weekend',
        desc: 'CTR cayó 40% sábado-domingo. Gali pausó automáticamente. ROAS mejoró 1.2× en días activos.',
        date: 'Hace 3 días',
        confidence: 100,
        canUndo: false,
      },
      {
        id: 'm6',
        type: 'insight' as const,
        icon: '💡',
        title: 'Segmento más rentable: Mujeres 25–34 Bogotá',
        desc: 'Analizando 847 pedidos de los últimos 30 días. Este segmento genera 61% de las ganancias netas.',
        date: 'Hace 4 días',
        confidence: 91,
        canUndo: false,
      },
    ];
  });

  undoMemoryItem(id: string): void {
    // Mock: show a toast and mark as undone
    console.log('Undo memory item', id);
  }

  // ── Cloud Files Panel ───────────────────────────────────
  readonly cloudFiles = [
    {
      id: 'f1',
      source: 'gdrive' as const,
      icon: '📄',
      name: 'Brief Difusor Aromaterapia Q2.pdf',
      size: '1.2 MB',
      modified: 'Ayer',
      usedIn: 'Proyecto Difusor',
    },
    {
      id: 'f2',
      source: 'gdrive' as const,
      icon: '🖼️',
      name: 'Creativos Skincare Pack — Mayo.zip',
      size: '34 MB',
      modified: 'Hace 3 días',
      usedIn: 'Campaña Roax',
    },
    {
      id: 'f3',
      source: 'local' as const,
      icon: '🎬',
      name: 'video_aromaterapia_v3_final.mp4',
      size: '18 MB',
      modified: 'Hace 2 días',
      usedIn: null,
    },
    {
      id: 'f4',
      source: 'gdrive' as const,
      icon: '📊',
      name: 'Dashboard Financiero Mayo 2026.xlsx',
      size: '520 KB',
      modified: 'Hoy 9am',
      usedIn: null,
    },
    {
      id: 'f5',
      source: 'local' as const,
      icon: '🖼️',
      name: 'banner_skincare_1080x1080.jpg',
      size: '890 KB',
      modified: 'Hace 5 días',
      usedIn: 'Campaña Roax',
    },
    {
      id: 'f6',
      source: 'gdrive' as const,
      icon: '📄',
      name: 'Guia Proveedores Aliados.pdf',
      size: '2.1 MB',
      modified: 'Hace 1 semana',
      usedIn: null,
    },
  ];

  readonly filesFilter = signal<'all' | 'gdrive' | 'local'>('all');

  filteredFiles() {
    const f = this.filesFilter();
    if (f === 'all') return this.cloudFiles;
    return this.cloudFiles.filter(f2 => f2.source === f);
  }

  useFileInCampaign(fileId: string): void {
    console.log('Use file in campaign', fileId);
  }

  /** Maps split % to pixel width for the internal splitter */
  contextSplitPx(): number {
    const panelW = this.gali.panelWidth();
    return Math.round(panelW * (this.gali.contextSplitWidth() / 100));
  }

  onContextSplitPxChange(px: number): void {
    const pct = Math.round((px / this.gali.panelWidth()) * 100);
    this.gali.setContextSplitPercent(pct);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat && this.chatEnd?.nativeElement) {
      this.shouldScrollChat = false;
      this.ngZone.runOutsideAngular(() => {
        this.chatEnd!.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  markScrollNeeded(): void {
    this.shouldScrollChat = true;
  }
}
