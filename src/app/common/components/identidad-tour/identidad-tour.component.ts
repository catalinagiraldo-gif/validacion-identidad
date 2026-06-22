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
import { IdentidadTourService, TourPlacement } from '../../services/identidad-tour.service';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPos {
  top: number;
  left: number;
  placement: TourPlacement;
}

@Component({
  selector: 'app-identidad-tour',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './identidad-tour.component.html',
  styleUrls: ['./identidad-tour.component.scss'],
})
export class IdentidadTourComponent implements OnDestroy {
  readonly tour = inject(IdentidadTourService);

  readonly pad = 8;
  readonly radius = 12;

  spotlight = signal<SpotlightRect | null>(null);
  tooltip = signal<TooltipPos | null>(null);

  private cardRef = viewChild<ElementRef<HTMLElement>>('card');
  private measureTimer: ReturnType<typeof setTimeout> | null = null;

  isLast = computed(() => this.tour.isLast());

  constructor() {
    effect(() => {
      // Re-measure whenever the tour opens or the step changes.
      this.tour.stepIndex();
      if (this.tour.active()) this.scheduleMeasure();
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

  onPrev(): void {
    this.tour.prev();
    this.scheduleMeasure();
  }

  scheduleMeasure(): void {
    if (this.measureTimer) clearTimeout(this.measureTimer);
    this.measureTimer = setTimeout(() => this.measure(), 90);
  }

  private measure(): void {
    const step = this.tour.currentStep();
    if (!step?.target) {
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
