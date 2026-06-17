import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  title: string;
  body: string;
  position: 'center' | 'bottom-right';
}

@Component({
  selector: 'demo-tour-overlay',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tour" *ngIf="visible()" role="dialog" aria-modal="true">
      <div class="tour__backdrop"></div>

      <div class="tour__step" [attr.data-position]="currentStep().position">
        <div class="tour__meta">
          <span class="tour__counter">{{ stepIndex() + 1 }} de {{ steps.length }}</span>
          <button class="tour__skip" (click)="skip()">Saltar ✕</button>
        </div>
        <h3 class="tour__title">{{ currentStep().title }}</h3>
        <p class="tour__body">{{ currentStep().body }}</p>
        <div class="tour__actions">
          <button class="tour__btn" (click)="next()">
            {{ stepIndex() === steps.length - 1 ? 'Empecemos →' : 'Siguiente →' }}
          </button>
        </div>
        <div class="tour__progress">
          <span
            *ngFor="let _ of steps; let i = index"
            class="tour__dot"
            [class.tour__dot--active]="i === stepIndex()"
          ></span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './demo-tour-overlay.component.scss',
})
export class DemoTourOverlayComponent implements OnInit {
  @Output() completed = new EventEmitter<void>();

  visible = signal(true);
  stepIndex = signal(0);

  steps: Step[] = [
    {
      title: 'Soy Gali, tu copiloto',
      body: 'Te ayudo a encontrar producto ganador en Dropi. No navegues — háblame.',
      position: 'center',
    },
    {
      title: 'Cuéntame qué buscas',
      body: 'Escribe tu intención en lenguaje natural. Ej: "tendencias en mascotas".',
      position: 'center',
    },
    {
      title: 'O empieza por aquí',
      body: 'Tres sugerencias para arrancar rápido. Click en una y te muestro qué hago.',
      position: 'center',
    },
  ];

  currentStep = () => this.steps[this.stepIndex()];

  ngOnInit(): void {
    const seen = sessionStorage.getItem('gali-demo-seen');
    if (seen === '1') {
      this.visible.set(false);
      queueMicrotask(() => this.completed.emit());
    }
    document.addEventListener('keydown', this.onEsc);
  }

  next(): void {
    const i = this.stepIndex();
    if (i < this.steps.length - 1) {
      this.stepIndex.set(i + 1);
    } else {
      this.finish();
    }
  }

  skip(): void {
    this.finish();
  }

  private finish(): void {
    sessionStorage.setItem('gali-demo-seen', '1');
    this.visible.set(false);
    this.completed.emit();
    document.removeEventListener('keydown', this.onEsc);
  }

  private onEsc = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.skip();
  };
}
