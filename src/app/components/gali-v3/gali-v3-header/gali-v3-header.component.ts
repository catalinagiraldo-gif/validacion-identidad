import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { OrquestadorService } from '../../../services/gali-v2/orquestador.service';
import { SenalesService } from '../../../services/gali-v2/senales.service';
import { PerfilService } from '../../../services/gali-v2/perfil.service';
import { CanvasService } from '../../../services/gali-v3/canvas.service';

@Component({
  selector: 'gali-v3-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali-v3-header.component.html',
  styleUrls: ['./gali-v3-header.component.scss'],
})
export class GaliV3HeaderComponent {
  private orquestador = inject(OrquestadorService);
  private senalesSvc = inject(SenalesService);
  private perfilSvc = inject(PerfilService);
  private canvas = inject(CanvasService);
  private router = inject(Router);

  @ViewChild('galiInput') galiInput?: ElementRef<HTMLInputElement>;

  texto = signal('');
  enfocado = signal(false);
  saldoVisible = signal(true);

  // Balance mock — TODO: leer de wallet.service
  saldo = 1_245_900;

  readonly perfil$ = toSignal(this.perfilSvc.perfil$, { initialValue: this.perfilSvc.perfil });
  readonly senales$ = toSignal(this.senalesSvc.senales$, { initialValue: this.senalesSvc.senales });

  readonly nombreCorto = computed(() => {
    const p = this.perfil$();
    if (p?.nombre) return p.nombre.split(' ')[0];
    return 'Alejandra';
  });

  readonly inicial = computed(() => this.nombreCorto().charAt(0).toUpperCase());

  readonly senalesNoVistas = computed(() => this.senales$()?.filter(s => !s.visto).length ?? 0);

  toggleSaldo() { this.saldoVisible.update(v => !v); }

  enviar() {
    const t = this.texto().trim();
    if (!t) return;
    if (CanvasService.esPromptDeLayout(t)) {
      this.canvas.proponerDesdePrompt(t);
      // Asegurar que estamos en el lienzo para ver la preview
      this.router.navigate(['/gali-v3']);
    } else {
      this.orquestador.enviar(t);
    }
    this.texto.set('');
    this.enfocado.set(false);
    this.galiInput?.nativeElement.blur();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.galiInput?.nativeElement.focus();
      this.enfocado.set(true);
    }
    if (e.key === 'Escape' && document.activeElement === this.galiInput?.nativeElement) {
      this.galiInput?.nativeElement.blur();
      this.enfocado.set(false);
    }
  }

  formatearCOP(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  }
}
