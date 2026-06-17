import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GaliMarkComponent } from '../../../components/gali-v2/gali-mark/gali-mark.component';
import {
  Antiguedad,
  DolorPrincipal,
  PerfilDropshipper,
  PerfilEstado,
  PerfilService,
} from '../../../services/gali-v2/perfil.service';
import { GaliStreamingService } from '../../../services/gali-v2/streaming.service';

interface OpcionRadio<T> {
  value: T;
  label: string;
  hint?: string;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, GaliMarkComponent],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit, OnDestroy {
  private perfilSvc = inject(PerfilService);
  private streaming = inject(GaliStreamingService);
  private router = inject(Router);

  // 0 = saludo, 1-3 = preguntas, 4 = wow, 5 = misión
  paso = signal<0 | 1 | 2 | 3 | 4>(0);

  nombre = signal('');
  estado = signal<PerfilEstado | null>(null);
  antiguedad = signal<Antiguedad | null>(null);
  dolor = signal<DolorPrincipal | null>(null);
  dolorOtro = signal('');

  textoStreaming = signal('');
  streamingActivo = signal(false);
  private streamSub?: Subscription;

  readonly opcionesEstado: OpcionRadio<PerfilEstado>[] = [
    { value: 'empezando', label: 'Estoy empezando', hint: 'Todavía buscando mi primer producto ganador' },
    { value: 'producto-ganador', label: 'Ya tengo un producto que vende', hint: 'Quiero escalarlo' },
    { value: 'multiproducto', label: 'Tengo varios productos activos', hint: 'Necesito organizar la operación' },
    { value: 'diversificar', label: 'Busco un nicho nuevo', hint: 'Para diversificar' },
  ];

  readonly opcionesAntiguedad: OpcionRadio<Antiguedad>[] = [
    { value: 'nuevo', label: 'Soy nuevo', hint: 'Menos de 3 meses' },
    { value: 'meses', label: 'Algunos meses', hint: '3 a 12 meses' },
    { value: 'anio', label: 'Más de un año', hint: 'Ya tengo oficio' },
    { value: 'proveedor', label: 'Soy proveedor', hint: 'Quiero entender el lado dropshipper' },
  ];

  readonly opcionesDolor: OpcionRadio<DolorPrincipal>[] = [
    { value: 'no-se-que-vender', label: 'No sé qué vender', hint: 'Miedo de elegir mal' },
    { value: 'roas-bajo', label: 'Mis campañas no dan el ROAS que quiero' },
    { value: 'novedades-overwhelm', label: 'Me pierdo entre novedades', hint: 'No tengo tiempo para lo importante' },
    { value: 'finanzas', label: 'No entiendo mis finanzas', hint: 'Flujo de caja confuso' },
    { value: 'otro', label: 'Otro', hint: 'Escríbelo libre' },
  ];

  ngOnInit() {
    this.dispararStream(this.textoSaludo());
  }

  ngOnDestroy() {
    this.streamSub?.unsubscribe();
  }

  textoSaludo(): string {
    return 'Hola. Antes de empezar a operar juntos, necesito conocerte. Tres preguntas, nada más. Lo que respondas se queda contigo — puedes editarlo o borrarlo cuando quieras.';
  }

  textoPregunta(p: 1 | 2 | 3): string {
    if (p === 1) return '¿En qué está tu negocio ahora?';
    if (p === 2) return '¿Cuánto tiempo llevas en Dropi?';
    return '¿Cuál es el mayor dolor que sientes hoy?';
  }

  avanzar() {
    if (this.paso() === 0) {
      this.setPaso(1);
      return;
    }
    if (this.paso() === 1 && this.estado()) { this.setPaso(2); return; }
    if (this.paso() === 2 && this.antiguedad()) { this.setPaso(3); return; }
    if (this.paso() === 3 && this.dolor()) {
      this.completar();
    }
  }

  retroceder() {
    const p = this.paso();
    if (p === 0) return;
    this.setPaso((p - 1) as 0 | 1 | 2 | 3);
  }

  setPaso(p: 0 | 1 | 2 | 3 | 4) {
    this.paso.set(p);
    if (p === 1) this.dispararStream(this.textoPregunta(1));
    if (p === 2) this.dispararStream(this.textoPregunta(2));
    if (p === 3) this.dispararStream(this.textoPregunta(3));
  }

  completar() {
    const perfil: PerfilDropshipper = {
      estado: this.estado()!,
      antiguedad: this.antiguedad()!,
      dolor: this.dolor()!,
      dolorOtro: this.dolor() === 'otro' ? this.dolorOtro() : undefined,
      nombre: this.nombre()?.trim() || undefined,
      completadoEn: Date.now(),
    };
    this.perfilSvc.guardar(perfil);
    this.setPaso(4);

    const reflejo = this.perfilSvc.pintarReflejo(perfil);
    this.dispararStream(reflejo.titulo + '\n\n' + reflejo.resumen);
  }

  irAMision() {
    const p = this.perfilSvc.perfil;
    if (!p) {
      this.router.navigate(['/gali-v2']);
      return;
    }
    const mision = this.perfilSvc.generarMision(p);
    // Para v1 navegamos al Lienzo. La misión específica se mostrará allí cuando esté Gali activa.
    this.router.navigate(['/gali-v2'], { queryParams: { mision: mision.titulo } });
  }

  irAExplorar() {
    this.router.navigate(['/gali-v2']);
  }

  reflejoActual() {
    const p = this.perfilSvc.perfil;
    return p ? this.perfilSvc.pintarReflejo(p) : null;
  }

  misionActual() {
    const p = this.perfilSvc.perfil;
    return p ? this.perfilSvc.generarMision(p) : null;
  }

  private dispararStream(texto: string) {
    this.streamSub?.unsubscribe();
    this.textoStreaming.set('');
    this.streamingActivo.set(true);
    this.streamSub = this.streaming.stream(texto).subscribe({
      next: t => this.textoStreaming.set(t),
      complete: () => this.streamingActivo.set(false),
    });
  }

  saltarStream() {
    // click para completar inmediatamente
    if (this.streamingActivo()) {
      this.streamSub?.unsubscribe();
      const target = this.paso() === 0
        ? this.textoSaludo()
        : this.paso() === 4
          ? this.textoStreaming() // mantener tal cual
          : this.textoPregunta(this.paso() as 1 | 2 | 3);
      this.textoStreaming.set(target);
      this.streamingActivo.set(false);
    }
  }
}
