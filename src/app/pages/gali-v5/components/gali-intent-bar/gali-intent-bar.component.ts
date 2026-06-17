import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GaliWorkspaceService, WorkspaceMode } from '../../services/gali-workspace.service';
import { GaliStateService } from '../../services/gali-state.service';

interface IntentShortcut {
  label: string;
  icon: string;
  mode: WorkspaceMode;
}

const INTENT_MAP: Array<{ patterns: string[]; mode: WorkspaceMode; navigate?: string }> = [
  { patterns: ['señal', 'señales', 'novedad', 'novedades', 'pedido', 'problemas', 'operar'], mode: 'operar' },
  { patterns: ['lanzar', 'producto', 'campaña', 'vender', 'iniciar', 'nuevo proyecto'], mode: 'lanzar' },
  { patterns: ['medir', 'roas', 'ganancia', 'p&l', 'análisis', 'reportes', 'cuánto gané'], mode: 'medir' },
  { patterns: ['skill', 'skills', 'construir', 'automatizar', 'automatización', 'regla'], mode: 'construir' },
  { patterns: ['comunidad', 'marketplace', 'compartir', 'mentor'], mode: 'comunidad' },
];

@Component({
  selector: 'gali-intent-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali-intent-bar.component.html',
  styleUrl: './gali-intent-bar.component.scss',
})
export class GaliIntentBarComponent {
  private readonly ws = inject(GaliWorkspaceService);
  private readonly galiState = inject(GaliStateService);
  private readonly router = inject(Router);

  readonly query = signal('');
  readonly isActive = signal(false);

  readonly shortcuts: IntentShortcut[] = [
    { label: 'Señales', icon: '⚡', mode: 'operar' },
    { label: 'Lanzar', icon: '🚀', mode: 'lanzar' },
    { label: 'Medir', icon: '📊', mode: 'medir' },
  ];

  onFocus(): void {
    this.isActive.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.isActive.set(false), 150);
  }

  triggerShortcut(mode: WorkspaceMode): void {
    this.ws.setMode(mode);
    if (!this.router.url.startsWith('/gali-v5') || this.router.url.includes('/gali-v5/')) {
      this.router.navigate(['/gali-v5']);
    }
  }

  submitIntent(): void {
    const q = this.query().toLowerCase().trim();
    if (!q) return;

    for (const entry of INTENT_MAP) {
      if (entry.patterns.some(p => q.includes(p))) {
        this.ws.setMode(entry.mode);
        this.router.navigate(['/gali-v5']);
        this.query.set('');
        return;
      }
    }

    // Fallback: open chat in right panel
    this.galiState.togglePanel();
    this.query.set('');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submitIntent();
    if (event.key === 'Escape') {
      this.query.set('');
      (event.target as HTMLElement).blur();
    }
  }
}
