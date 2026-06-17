import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GaliGuideTourService,
  GuideTourPlacement,
} from '../../../services/gali-v3/guide-tour.service';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPos {
  top: number;
  left: number;
  placement: GuideTourPlacement;
}

@Component({
  selector: 'gali-guide-tour',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="tour.active()"
      class="gtour"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gtour-title"
      aria-describedby="gtour-body"
    >
      <!-- Backdrop + spotlight cutout -->
      <svg class="gtour__mask" aria-hidden="true">
        <defs>
          <mask id="gtour-spot-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              *ngIf="spotlight()"
              [attr.x]="spotlight()!.left - pad"
              [attr.y]="spotlight()!.top - pad"
              [attr.width]="spotlight()!.width + pad * 2"
              [attr.height]="spotlight()!.height + pad * 2"
              [attr.rx]="radius"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(26, 22, 18, 0.62)"
          mask="url(#gtour-spot-mask)"
        />
      </svg>

      <!-- Spotlight ring -->
      <div
        *ngIf="spotlight()"
        class="gtour__ring"
        [style.top.px]="spotlight()!.top - pad"
        [style.left.px]="spotlight()!.left - pad"
        [style.width.px]="spotlight()!.width + pad * 2"
        [style.height.px]="spotlight()!.height + pad * 2"
        aria-hidden="true"
      ></div>

      <!-- Tooltip card -->
      <div
        #card
        class="gtour__card"
        [class.gtour__card--center]="!spotlight()"
        [style.top.px]="tooltip()?.top"
        [style.left.px]="tooltip()?.left"
        [attr.data-placement]="tooltip()?.placement ?? 'center'"
      >
        <header class="gtour__head">
          <span class="gtour__badge">Tour · {{ tour.stepIndex() + 1 }} / {{ tour.steps.length }}</span>
          <button type="button" class="gtour__skip" (click)="tour.skip()">Saltar</button>
        </header>

        <h2 id="gtour-title" class="gtour__title">{{ tour.currentStep().title }}</h2>
        <p id="gtour-body" class="gtour__body">{{ tour.currentStep().body }}</p>

        <footer class="gtour__foot">
          <div class="gtour__dots" aria-hidden="true">
            <span
              *ngFor="let s of tour.steps; let i = index"
              class="gtour__dot"
              [class.gtour__dot--on]="i === tour.stepIndex()"
            ></span>
          </div>
          <div class="gtour__actions">
            <button
              *ngIf="tour.stepIndex() > 0"
              type="button"
              class="gtour__btn gtour__btn--ghost"
              (click)="tour.prev(); scheduleMeasure()"
            >
              ← Atrás
            </button>
            <button type="button" class="gtour__btn gtour__btn--primary" (click)="onNext()">
              {{ isLast() ? 'Empezar →' : 'Siguiente →' }}
            </button>
          </div>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './gali-guide-tour.component.scss',
})
export class GaliGuideTourComponent implements OnDestroy {
  readonly tour = inject(GaliGuideTourService);

  readonly pad = 8;
  readonly radius = 12;

  spotlight = signal<SpotlightRect | null>(null);
  tooltip = signal<TooltipPos | null>(null);

  private cardRef = viewChild<ElementRef<HTMLElement>>('card');
  private measureTimer: ReturnType<typeof setTimeout> | null = null;

  isLast = computed(() => this.tour.stepIndex() === this.tour.steps.length - 1);

  constructor() {
    effect(() => {
      if (this.tour.active()) {
        this.scheduleMeasure();
      }
    });

    effect(() => {
      // Re-measure when step changes
      this.tour.stepIndex();
      if (this.tour.active()) {
        this.scheduleMeasure();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.measureTimer) clearTimeout(this.measureTimer);
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    if (this.tour.active()) this.measure();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.tour.active()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.tour.skip();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      this.onNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.tour.prev();
      this.scheduleMeasure();
    }
  }

  onNext(): void {
    this.tour.next();
    this.scheduleMeasure();
  }

  scheduleMeasure(): void {
    if (this.measureTimer) clearTimeout(this.measureTimer);
    this.measureTimer = setTimeout(() => this.measure(), 80);
  }

  private measure(): void {
    const step = this.tour.currentStep();
    if (!step.target) {
      this.spotlight.set(null);
      this.tooltip.set({ top: 0, left: 0, placement: 'center' });
      return;
    }

    const el = document.querySelector(step.target);
    if (!el) {
      this.spotlight.set(null);
      this.tooltip.set({ top: 0, left: 0, placement: 'center' });
      return;
    }

    const rect = el.getBoundingClientRect();
    const spot: SpotlightRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
    this.spotlight.set(spot);

    const placement = step.placement ?? 'bottom';
    const card = this.cardRef()?.nativeElement;
    const cardW = card?.offsetWidth ?? 380;
    const cardH = card?.offsetHeight ?? 220;
    const gap = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 16;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'bottom':
        top = spot.top + spot.height + this.pad + gap;
        left = spot.left + spot.width / 2 - cardW / 2;
        break;
      case 'top':
        top = spot.top - this.pad - gap - cardH;
        left = spot.left + spot.width / 2 - cardW / 2;
        break;
      case 'right':
        top = spot.top + spot.height / 2 - cardH / 2;
        left = spot.left + spot.width + this.pad + gap;
        break;
      case 'left':
        top = spot.top + spot.height / 2 - cardH / 2;
        left = spot.left - this.pad - gap - cardW;
        break;
      default:
        top = vh / 2 - cardH / 2;
        left = vw / 2 - cardW / 2;
    }

    left = Math.max(margin, Math.min(left, vw - cardW - margin));
    top = Math.max(margin, Math.min(top, vh - cardH - margin));

    this.tooltip.set({ top, left, placement });
  }
}
