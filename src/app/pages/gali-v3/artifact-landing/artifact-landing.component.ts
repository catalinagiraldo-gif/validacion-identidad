import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GaliProjectService } from '../../../services/gali-v3/project.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

interface LandingState {
  version: number;
  badge: string;
  headline: string;
  subheadline: string;
  hook: string;
  cta: string;
  ctaSub: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  precio: string;
  precioAntes: string;
  testimonio: string;
  autor: string;
  paleta: 'mama' | 'aspiracional' | 'racional';
}

const DEFAULT_LANDING: LandingState = {
  version: 3,
  badge: '🐕 Para mamás de perros',
  headline: '¿Sabes dónde está tu perro en este momento?',
  subheadline: 'Collar GPS con ubicación en vivo. Duerme tranquila sabiendo que está a salvo.',
  hook: '+340 mamás colombianas ya están más tranquilas',
  cta: 'Sí, lo quiero ahora',
  ctaSub: 'Envío gratis · 30 días de garantía',
  bullet1: 'Ubicación en vivo desde tu celular',
  bullet2: 'Batería 7 días · resistente al agua',
  bullet3: 'Alerta si tu perro sale del área segura',
  precio: '$89.000',
  precioAntes: '$129.000',
  testimonio: '"Se escapó tres veces antes del collar. Desde que lo tiene, no he perdido una sola noche de sueño."',
  autor: 'Carolina M. · Bogotá · dueña de Luna',
  paleta: 'mama',
};

const STORAGE_KEY = 'gali_v3_landing_artifact';

@Component({
  selector: 'app-gali-v3-artifact-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './artifact-landing.component.html',
  styleUrls: ['./artifact-landing.component.scss'],
})
export class GaliV3ArtifactLandingComponent {
  private route = inject(ActivatedRoute);
  private projectSvc = inject(GaliProjectService);
  private chatSvc = inject(GaliChatService);

  paramId = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  state = signal<LandingState>(this.load());
  history = signal<LandingState[]>(this.loadHistory());
  editing = signal<keyof LandingState | null>(null);
  draft = signal('');
  preview = signal<'desktop' | 'mobile'>('desktop');

  landingId = computed(() => this.paramId().get('id') ?? 'land-1');
  project = computed(() => this.projectSvc.getById('collar-gps-2026'));

  startEdit(field: keyof LandingState, currentValue: string | number) {
    this.editing.set(field);
    this.draft.set(String(currentValue));
  }

  commitEdit() {
    const field = this.editing();
    if (!field) return;
    const value = this.draft();
    this.state.update(s => ({ ...s, [field]: value }));
    this.editing.set(null);
    this.draft.set('');
    this.persist();
  }

  cancelEdit() {
    this.editing.set(null);
    this.draft.set('');
  }

  setPaleta(p: LandingState['paleta']) {
    this.state.update(s => ({ ...s, paleta: p }));
    this.persist();
  }

  togglePreview() {
    this.preview.update(p => p === 'desktop' ? 'mobile' : 'desktop');
  }

  saveVersion() {
    const current = this.state();
    const newVersion = current.version + 1;
    this.history.update(h => [current, ...h].slice(0, 10));
    this.state.update(s => ({ ...s, version: newVersion }));
    this.persist();
    this.persistHistory();
  }

  restoreVersion(v: LandingState) {
    this.state.set({ ...v });
    this.persist();
  }

  generateVariation() {
    this.chatSvc.send('Genera una variación de esta landing con ángulo diferente');
  }

  publish() {
    this.chatSvc.send('Publica esta landing y crea una campaña de Meta con presupuesto $50k/día');
  }

  private load(): LandingState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_LANDING;
  }

  private loadHistory(): LandingState[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_history');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }

  private persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state())); } catch {}
  }

  private persistHistory() {
    try { localStorage.setItem(STORAGE_KEY + '_history', JSON.stringify(this.history())); } catch {}
  }
}
