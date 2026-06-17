import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { GaliMarkComponent } from '../gali-mark/gali-mark.component';
import { MaestriaService } from '../../../services/gali-v2/maestria.service';
import { OrquestadorService } from '../../../services/gali-v2/orquestador.service';
import { SenalesService } from '../../../services/gali-v2/senales.service';

export type HeaderEstado = 'default' | 'focus' | 'senal' | 'streaming';

@Component({
  selector: 'gali-header-input',
  standalone: true,
  imports: [CommonModule, FormsModule, GaliMarkComponent],
  templateUrl: './gali-header-input.component.html',
  styleUrls: ['./gali-header-input.component.scss'],
})
export class GaliHeaderInputComponent {
  @Input() contextoVista: string = 'lienzo';
  @Input() placeholderOverride?: string;

  private maestria = inject(MaestriaService);
  private orquestador = inject(OrquestadorService);
  private senales = inject(SenalesService);

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  readonly nivel = toSignal(this.maestria.nivel$, { initialValue: this.maestria.nivel });
  readonly senales$ = this.senales.senales$;
  readonly actuando = toSignal(this.orquestador.actuando$, { initialValue: false });

  texto = signal('');
  foco = signal(false);
  panelSenalesAbierto = signal(false);

  readonly placeholder = computed(() => {
    if (this.placeholderOverride) return this.placeholderOverride;
    const niv = this.nivel();
    const ctx = this.contextoVista;
    if (ctx === 'catalogo') {
      return niv === 'estratega' ? '¿Qué buscas?' : '¿Qué producto buscas o qué quieres hacer?';
    }
    if (ctx === 'novedades') {
      return niv === 'estratega' ? '¿Qué revisas?' : '¿Qué necesitas revisar hoy?';
    }
    if (ctx === 'proyectos') {
      return niv === 'estratega' ? 'Decisión / pregunta…' : '¿En qué proyecto trabajamos hoy?';
    }
    if (ctx === 'campanas') {
      return niv === 'estratega' ? 'Acción / análisis…' : '¿Cómo van tus campañas?';
    }
    return niv === 'estratega' ? '✦ pregunta o acción…' : '¿Qué quieres hacer hoy?';
  });

  readonly senalDestacada = computed(() => {
    return undefined;
  });

  readonly estado = computed<HeaderEstado>(() => {
    if (this.actuando()) return 'streaming';
    if (this.foco() || this.texto().length > 0) return 'focus';
    return 'default';
  });

  readonly markState = computed(() => {
    const e = this.estado();
    if (e === 'streaming') return 'actuando' as const;
    if (e === 'focus') return 'propuesta' as const;
    return 'reposo' as const;
  });

  sugerenciasContextuales(): string[] {
    const niv = this.nivel();
    const ctx = this.contextoVista;
    if (ctx === 'catalogo') {
      return niv === 'aprendiz'
        ? ['¿Qué producto vendo esta semana?', 'Explícame "curva de entrada"', 'Productos para empezar']
        : ['Análisis del top 5', 'Productos en curva', 'Comparar dos productos'];
    }
    if (ctx === 'novedades') {
      return ['¿Cuánto perdí esta semana?', 'Resolver las críticas', 'Resumen del día'];
    }
    return niv === 'aprendiz'
      ? ['¿Qué producto vendo?', '¿Cómo van mis pedidos?', '¿Qué hago primero?']
      : ['Top productos hoy', 'Pedidos críticos', 'Estado de campañas'];
  }

  onFocus() { this.foco.set(true); }
  onBlur() {
    setTimeout(() => {
      if (!this.texto()) this.foco.set(false);
    }, 120);
  }

  enviar() {
    const t = this.texto().trim();
    if (!t) return;
    this.orquestador.enviar(t);
    this.texto.set('');
    this.foco.set(false);
    this.inputEl?.nativeElement.blur();
  }

  usarSugerencia(s: string) {
    this.texto.set(s);
    this.inputEl?.nativeElement.focus();
  }

  toggleSenales() {
    this.panelSenalesAbierto.update(v => !v);
  }

  cerrarPanelSenales() {
    this.panelSenalesAbierto.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.panelSenalesAbierto()) this.cerrarPanelSenales();
    if (this.foco()) {
      this.foco.set(false);
      this.texto.set('');
      this.inputEl?.nativeElement.blur();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownGlobal(ev: KeyboardEvent) {
    // Cmd+K (mac) o Ctrl+K (windows) — abre input desde cualquier vista
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      const el = this.inputEl?.nativeElement;
      if (el) {
        el.focus();
        this.foco.set(true);
      }
    }
  }

  noVistasCount(senales: { visto: boolean }[] | null): number {
    return (senales ?? []).filter(s => !s.visto).length;
  }
}
