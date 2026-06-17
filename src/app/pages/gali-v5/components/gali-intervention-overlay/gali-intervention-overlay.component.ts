import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InterventionOption {
  id: string;
  label: string;
  sublabel?: string;
  isPrimary?: boolean;
}

export interface InterventionContext {
  titulo: string;
  proyecto?: string;
  modulo?: string;
  descripcion: string;
  detalle?: string;
  opciones: InterventionOption[];
}

type OverlayState = 'deciding' | 'executing' | 'result';

@Component({
  selector: 'gali-intervention-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-intervention-overlay.component.html',
  styleUrl: './gali-intervention-overlay.component.scss',
})
export class GaliInterventionOverlayComponent {
  @Input({ required: true }) context!: InterventionContext;
  @Output() closed = new EventEmitter<void>();
  @Output() decided = new EventEmitter<{ opcionId: string }>();

  readonly state = signal<OverlayState>('deciding');
  readonly selectedOpcion = signal<InterventionOption | null>(null);
  readonly resultText = signal('');

  select(opcion: InterventionOption): void {
    this.selectedOpcion.set(opcion);
    this.state.set('executing');
    this.resultText.set('');

    setTimeout(() => {
      this.state.set('result');
      this.resultText.set(
        `✓ Ejecutado: ${opcion.label}. Gali aplicó los cambios y actualizó el estado del proyecto.`,
      );
      this.decided.emit({ opcionId: opcion.id });
    }, 2000);
  }

  close(): void {
    this.closed.emit();
  }
}
