import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GaliObjetivoService } from '../../../services/gali-v3/objetivo.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import {
  ObjetivoPaso,
  ObjetivoSemana,
  ObjetivoPreguntaOnboarding,
} from '../../../services/gali-v3/types';

@Component({
  selector: 'app-gali-v3-objetivo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './objetivo.component.html',
  styleUrls: ['./objetivo.component.scss'],
})
export class GaliV3ObjetivoComponent {
  private objetivoSvc = inject(GaliObjetivoService);
  private chatSvc = inject(GaliChatService);
  private router = inject(Router);

  objetivo = this.objetivoSvc.objetivoActivo;
  historicos = this.objetivoSvc.objetivosHistoricos;
  preguntas = this.objetivoSvc.preguntasOnboarding;

  progreso = this.objetivoSvc.progresoActual;
  proyeccion = this.objetivoSvc.proyeccionGali;
  semanaActiva = this.objetivoSvc.semanaActiva;
  pasosCompletados = this.objetivoSvc.pasosCompletadosTotal;
  pasosTotal = this.objetivoSvc.pasosTotal;

  // Onboarding inline state
  mostrandoOnboarding = signal(false);
  pasoOnboarding = signal(0);
  respuestas = signal<Record<string, string>>({});

  // Roadmap state
  semanaExpandida = signal<number | null>(null);
  mostrandoRazonamientoGali = signal(false);
  mostrandoConfianzaPaso = signal<string | null>(null);

  iniciarOnboarding() {
    this.mostrandoOnboarding.set(true);
    this.pasoOnboarding.set(0);
    this.respuestas.set({});
  }

  responderPregunta(preguntaId: string, valor: string) {
    this.respuestas.update(r => ({ ...r, [preguntaId]: valor }));
  }

  siguientePaso() {
    const total = this.preguntas().length;
    if (this.pasoOnboarding() < total - 1) {
      this.pasoOnboarding.update(p => p + 1);
    } else {
      this.completarOnboarding();
    }
  }

  pasoAnterior() {
    if (this.pasoOnboarding() > 0) {
      this.pasoOnboarding.update(p => p - 1);
    }
  }

  completarOnboarding() {
    // Mock: activar objetivo demo
    this.objetivoSvc.activarObjetivoMock();
    this.objetivoSvc.cerrarOnboarding();
    this.mostrandoOnboarding.set(false);
  }

  preguntaActual = computed<ObjetivoPreguntaOnboarding | null>(() => {
    const idx = this.pasoOnboarding();
    return this.preguntas()[idx] ?? null;
  });

  respuestaPreguntaActual = computed(() => {
    const p = this.preguntaActual();
    return p ? (this.respuestas()[p.id] ?? '') : '';
  });

  toggleSemana(num: number) {
    this.semanaExpandida.update(curr => (curr === num ? null : num));
  }

  togglePaso(paso: ObjetivoPaso) {
    this.objetivoSvc.togglePaso(paso.id);
  }

  irAPaso(paso: ObjetivoPaso) {
    this.router.navigateByUrl(paso.ruta_dropi);
  }

  toggleRazonamiento() {
    this.mostrandoRazonamientoGali.update(v => !v);
  }

  toggleConfianzaPaso(pasoId: string) {
    this.mostrandoConfianzaPaso.update(curr => (curr === pasoId ? null : pasoId));
  }

  preguntarAjuste() {
    const o = this.objetivo();
    if (!o) return;
    this.chatSvc.send(
      `Quiero ajustar mi objetivo "${o.declaracion_usuario}". ¿Qué me recomiendas?`,
    );
  }

  consultarLider() {
    const o = this.objetivo();
    if (!o) return;
    this.chatSvc.send(
      `Líder virtual, otros dropshippers con objetivo "${o.metrica.valor_objetivo} ${o.metrica.unidad}" ¿qué hicieron primero?`,
    );
  }

  semanaIcono(s: ObjetivoSemana): string {
    if (s.estado === 'completada') return '✓';
    if (s.estado === 'activa') return '◉';
    return '○';
  }

  pasoIcono(estado: ObjetivoPaso['estado']): string {
    if (estado === 'completado') return '✓';
    if (estado === 'en_progreso') return '◐';
    return '○';
  }

  confianzaTexto(valor: number): string {
    if (valor >= 0.8) return 'Alta';
    if (valor >= 0.65) return 'Media-alta';
    if (valor >= 0.5) return 'Media';
    return 'Baja — datos limitados';
  }

  confianzaColor(valor: number): string {
    if (valor >= 0.8) return 'sage';
    if (valor >= 0.65) return 'amber';
    return 'rust';
  }

  formatoMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO').format(valor);
  }
}
