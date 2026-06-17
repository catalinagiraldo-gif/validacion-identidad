import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LandingElementId,
  LandingTemplate,
  Product,
} from '../../../gali-descubrimiento/models/gali.models';

@Component({
  selector: 'landing-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lc" *ngIf="template && product">
      <div class="lc__chrome">
        <div class="lc__chrome-dots">
          <span></span><span></span><span></span>
        </div>
        <div class="lc__chrome-url">
          landing-{{ slug }}.dropi.co
        </div>
        <div class="lc__chrome-meta">
          <span class="lc__chrome-tag">EDITABLE</span>
        </div>
      </div>

      <div class="lc__page">
        <!-- HERO -->
        <section class="lc__hero">
          <div class="lc__urgency" *ngIf="template.hero.heroLine">
            ⚡ {{ template.hero.heroLine }}
          </div>
          <h1
            class="lc__headline"
            [class.lc__editing]="editingId() === 'hero.headline'"
            (click)="startEdit('hero.headline')"
            title="Click para editar"
          >
            <ng-container *ngIf="editingId() === 'hero.headline'; else headlineRO">
              <input
                #editor
                type="text"
                [(ngModel)]="editValue"
                (keydown.enter)="commitEdit()"
                (keydown.escape)="cancelEdit()"
                (blur)="commitEdit()"
                class="lc__inline-input lc__inline-input--display"
                [attr.aria-label]="'Editar headline'"
              />
            </ng-container>
            <ng-template #headlineRO>{{ template.hero.headline }}</ng-template>
          </h1>

          <p
            class="lc__subheadline"
            [class.lc__editing]="editingId() === 'hero.subheadline'"
            (click)="startEdit('hero.subheadline')"
            title="Click para editar"
          >
            <ng-container *ngIf="editingId() === 'hero.subheadline'; else subRO">
              <input
                #editor
                type="text"
                [(ngModel)]="editValue"
                (keydown.enter)="commitEdit()"
                (keydown.escape)="cancelEdit()"
                (blur)="commitEdit()"
                class="lc__inline-input lc__inline-input--sub"
              />
            </ng-container>
            <ng-template #subRO>{{ template.hero.subheadline }}</ng-template>
          </p>

          <div class="lc__hero-product">
            <img [src]="product.image" [alt]="product.name" />
          </div>

          <button
            class="lc__cta"
            [class.lc__editing]="editingId() === 'hero.ctaText'"
            (click)="startEdit('hero.ctaText'); $event.stopPropagation()"
            title="Click para editar"
          >
            <ng-container *ngIf="editingId() === 'hero.ctaText'; else ctaRO">
              <input
                #editor
                type="text"
                [(ngModel)]="editValue"
                (keydown.enter)="commitEdit()"
                (keydown.escape)="cancelEdit()"
                (blur)="commitEdit()"
                (click)="$event.stopPropagation()"
                class="lc__inline-input lc__inline-input--cta"
              />
            </ng-container>
            <ng-template #ctaRO>{{ template.hero.ctaText }}</ng-template>
          </button>
        </section>

        <!-- BENEFITS -->
        <section class="lc__benefits">
          <div *ngFor="let b of template.benefits" class="lc__benefit">
            <div class="lc__benefit-icon">{{ b.icon }}</div>
            <div class="lc__benefit-title">{{ b.title }}</div>
            <div class="lc__benefit-desc">{{ b.desc }}</div>
          </div>
        </section>

        <!-- TESTIMONIALS -->
        <section class="lc__testimonials">
          <h3 class="lc__section-title">Lo que dicen los compradores</h3>
          <div class="lc__testi-grid">
            <div *ngFor="let t of template.testimonials" class="lc__testi">
              <div class="lc__testi-stars">
                <span *ngFor="let _ of starsArr(t.stars)">★</span>
              </div>
              <p class="lc__testi-text">"{{ t.text }}"</p>
              <div class="lc__testi-author">— {{ t.author }}</div>
            </div>
          </div>
        </section>

        <!-- FINAL CTA -->
        <section class="lc__cta-final">
          <div class="lc__urgency-final" (click)="startEdit('ctaFinal.urgencyText')" title="Click para editar">
            <ng-container *ngIf="editingId() === 'ctaFinal.urgencyText'; else urgRO">
              <input
                #editor
                type="text"
                [(ngModel)]="editValue"
                (keydown.enter)="commitEdit()"
                (keydown.escape)="cancelEdit()"
                (blur)="commitEdit()"
                class="lc__inline-input"
              />
            </ng-container>
            <ng-template #urgRO>⏰ {{ template.ctaFinal.urgencyText }}</ng-template>
          </div>
          <div class="lc__price">
            <span class="lc__price-old">\${{ formatCop(template.ctaFinal.priceStruck) }}</span>
            <span class="lc__price-new">\${{ formatCop(template.ctaFinal.price) }} COP</span>
          </div>
          <button
            class="lc__cta lc__cta--final"
            (click)="startEdit('ctaFinal.ctaText'); $event.stopPropagation()"
          >
            <ng-container *ngIf="editingId() === 'ctaFinal.ctaText'; else ctaFRO">
              <input
                #editor
                type="text"
                [(ngModel)]="editValue"
                (keydown.enter)="commitEdit()"
                (keydown.escape)="cancelEdit()"
                (blur)="commitEdit()"
                (click)="$event.stopPropagation()"
                class="lc__inline-input lc__inline-input--cta"
              />
            </ng-container>
            <ng-template #ctaFRO>{{ template.ctaFinal.ctaText }}</ng-template>
          </button>
        </section>

        <footer class="lc__footer">
          <span>Tono: <strong>{{ template.tone }}</strong></span>
          <span>·</span>
          <span>Ángulo: <strong>{{ template.angle }}</strong></span>
          <span>·</span>
          <span>Click cualquier elemento para editarlo</span>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './landing-canvas.component.scss',
})
export class LandingCanvasComponent {
  @Input() template: LandingTemplate | null = null;
  @Input() product: Product | null = null;
  @Output() fieldEdited = new EventEmitter<{ path: string; value: string }>();

  @ViewChild('editor') editorRef?: ElementRef<HTMLInputElement>;

  editingId = signal<LandingElementId | null>(null);
  editValue = '';

  get slug(): string {
    return this.product?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) ?? 'producto';
  }

  formatCop(n: number): string {
    return new Intl.NumberFormat('es-CO').format(n);
  }

  starsArr(n: number): unknown[] {
    return Array.from({ length: n });
  }

  startEdit(id: LandingElementId): void {
    if (!this.template) return;
    this.editingId.set(id);
    this.editValue = this.getValue(id);
    setTimeout(() => {
      this.editorRef?.nativeElement?.focus();
      this.editorRef?.nativeElement?.select();
    }, 50);
  }

  commitEdit(): void {
    const id = this.editingId();
    if (!id) return;
    if (this.editValue.trim() && this.editValue !== this.getValue(id)) {
      this.fieldEdited.emit({ path: id, value: this.editValue.trim() });
    }
    this.editingId.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  private getValue(id: LandingElementId): string {
    if (!this.template) return '';
    const keys = id.split('.');
    let v: any = this.template;
    for (const k of keys) v = v?.[k];
    return v ?? '';
  }
}
