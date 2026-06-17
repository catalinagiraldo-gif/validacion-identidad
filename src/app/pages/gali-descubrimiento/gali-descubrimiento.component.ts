import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GaliService } from '../../services/gali.service';
import {
  AvatarState,
  ExecutionStep,
  GaliMessage,
  LayoutState,
  Mission,
  Product,
} from './models/gali.models';
import { GaliAvatarComponent } from './components/gali-avatar/gali-avatar.component';
import { DemoNavComponent } from './components/demo-nav/demo-nav.component';
import { DemoTourOverlayComponent } from './components/demo-tour-overlay/demo-tour-overlay.component';
import { FiltersBarComponent } from './components/filters-bar/filters-bar.component';
import { GaliHeroComponent } from './components/gali-hero/gali-hero.component';
import { GaliSidebarComponent } from './components/gali-sidebar/gali-sidebar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ReasoningAnchorComponent } from './components/reasoning-anchor/reasoning-anchor.component';
import { TopbarGaliComponent } from './components/topbar-gali/topbar-gali.component';

@Component({
  selector: 'app-gali-descubrimiento',
  standalone: true,
  imports: [
    CommonModule,
    DemoNavComponent,
    DemoTourOverlayComponent,
    FiltersBarComponent,
    GaliAvatarComponent,
    GaliHeroComponent,
    GaliSidebarComponent,
    ProductCardComponent,
    ReasoningAnchorComponent,
    TopbarGaliComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gw" [attr.data-layout]="layout">
      <demo-tour-overlay *ngIf="showTour()" (completed)="onTourDone()"></demo-tour-overlay>

      <topbar-gali
        [mission]="mission"
        (toggleSidebar)="toggleDropiSidebar.emit()"
      ></topbar-gali>

      <div class="gw__body">
        <!-- HERO STATE -->
        <gali-hero
          *ngIf="layout === 'hero'"
          [initialMessage]="initialMessage"
          [suggestions]="heroSuggestions"
          [avatarState]="avatarState"
          [streamingEnabled]="streamingEnabled"
          (submitted)="onSubmit($event)"
          (suggestionClicked)="onSubmit($event)"
          (toggleStream)="onToggleStream()"
        ></gali-hero>

        <!-- WORKSPACE STATE -->
        <ng-container *ngIf="layout === 'workspace'">
          <main class="gw__canvas">
            <filters-bar
              [activeCategory]="activeCategory"
              [activeSort]="activeSort"
              (categoryChanged)="onFilterCategory($event)"
              (sortChanged)="onSort($event)"
            ></filters-bar>

            <reasoning-anchor [text]="reasoningText"></reasoning-anchor>

            <div class="gw__grid" *ngIf="(products?.length ?? 0) > 0; else loading">
              <product-card
                *ngFor="let p of products; let i = index; trackBy: trackById"
                [product]="p"
                [selected]="selectedProduct?.id === p.id"
                [dimmed]="selectedProduct != null && selectedProduct.id !== p.id"
                [animDelay]="i * 80"
                (choose)="onChoose($event)"
                (details)="onDetails($event)"
                (hovered)="onHover($event)"
              ></product-card>
            </div>

            <ng-template #loading>
              <div class="gw__loading">
                <gali-avatar size="hero" [state]="avatarState"></gali-avatar>
                <p>Gali está analizando...</p>
              </div>
            </ng-template>
          </main>

          <gali-sidebar
            #sidebar
            [messages]="messages"
            [executionStream]="executionStream"
            [avatarState]="avatarState"
            [suggestions]="currentSuggestions"
            [showSuggestions]="!processing || !!selectedProduct"
            [acceptChipIndex]="acceptChipIndex"
            [streamingEnabled]="streamingEnabled"
            [processing]="processing && !selectedProduct"
            (submitted)="onSubmit($event)"
            (suggestionClicked)="onSuggestionClick($event)"
            (toggleStream)="onToggleStream()"
            (reset)="onReset()"
          ></gali-sidebar>
        </ng-container>
      </div>

      <!-- TOAST -->
      <div class="gw__toast" *ngIf="toast()" role="status">
        <span class="gw__toast-icon">✓</span>
        {{ toast() }}
      </div>

      <!-- NEXT STEP MODAL -->
      <div class="gw__modal-backdrop" *ngIf="nextStepModal()" (click)="nextStepModal.set(false)">
        <div class="gw__modal" (click)="$event.stopPropagation()">
          <div class="gw__modal-icon">🎯</div>
          <h3>Próximamente: Modo Estrategia</h3>
          <p>
            Aquí Gali generaría ángulos de venta personalizados (BuyerPersonaCards)
            basados en el producto seleccionado y datos de copies exitosos en LATAM.
          </p>
          <p class="gw__modal-meta">Pantalla 3 del spec · No incluida en esta iteración.</p>
          <button class="gw__modal-btn" (click)="nextStepModal.set(false)">Entiendo</button>
        </div>
      </div>

      <demo-nav></demo-nav>
    </div>
  `,
  styleUrl: './gali-descubrimiento.component.scss',
})
export class GaliDescubrimientoComponent implements OnInit, OnDestroy, AfterViewInit {
  private galiSvc = inject(GaliService);
  private router = inject(Router);

  @ViewChild('sidebar') sidebarRef?: GaliSidebarComponent;

  showTour = signal(true);
  toast = signal('');
  nextStepModal = signal(false);

  layout: LayoutState = 'hero';
  avatarState: AvatarState = 'idle';
  messages: GaliMessage[] = [];
  executionStream: ExecutionStep[] | null = null;
  products: Product[] | null = null;
  mission: Mission | null = null;
  selectedProduct: Product | null = null;
  reasoningText = '';
  streamingEnabled = true;
  processing = false;
  activeCategory = 'todos';
  activeSort: 'sales' | 'trend' | 'margin' = 'sales';

  initialMessage =
    '¿Qué tipo de producto estás buscando? Puedo sugerirte algo basado en lo que está vendiendo ahora en Colombia, o si tienes algún nicho en mente, cuéntame.';

  heroSuggestions: string[] = [
    'Quiero ver tendencias de hoy',
    'Busco algo en la categoría de hogar',
    'Tengo un producto en mente',
  ];
  workspaceSuggestions = [
    '¿Cuál tiene el mejor margen?',
    'Muéstrame solo productos en tendencia',
    '¿Hay algo nuevo esta semana?',
  ];
  postSelectSuggestions = ['Sí, vamos', 'Quiero ver más productos'];

  currentSuggestions: string[] = [];
  acceptChipIndex: number | null = null;

  toggleDropiSidebar = (() => {
    const fn = () => {
      window.dispatchEvent(new CustomEvent('gali:toggle-rail'));
    };
    return { emit: fn };
  })() as any;

  private subs: Subscription[] = [];
  private toastTimer: any;

  ngOnInit(): void {
    // Subscribe to all streams from GaliService
    this.subs.push(
      this.galiSvc.processing$.subscribe(p => (this.processing = p)),
      this.galiSvc.messages$.subscribe(m => {
        this.messages = m;
        const latestReasoning = [...m].reverse().find(msg => msg.type === 'reasoning');
        this.reasoningText = latestReasoning?.text ?? '';
      }),
      this.galiSvc.products$.subscribe(p => {
        this.products = p;
      }),
      this.galiSvc.layout$.subscribe(l => {
        this.layout = l;
      }),
      this.galiSvc.avatarState$.subscribe(s => {
        this.avatarState = s;
      }),
      this.galiSvc.executionStream$.subscribe(es => {
        this.executionStream = es;
      }),
      this.galiSvc.mission$.subscribe(m => {
        this.mission = m;
      }),
      this.galiSvc.selectedProduct$.subscribe(p => {
        this.selectedProduct = p;
        this.currentSuggestions = p ? this.postSelectSuggestions : this.workspaceSuggestions;
        this.acceptChipIndex = p ? 0 : null;
      }),
      this.galiSvc.streamingEnabled$.subscribe(e => {
        this.streamingEnabled = e;
      }),
    );

    this.galiSvc.loadData().subscribe();
    this.currentSuggestions = this.workspaceSuggestions;
  }

  ngAfterViewInit(): void {
    // Auto-focus hero input after tour
    setTimeout(() => {
      if (this.layout === 'hero') {
        document.querySelector<HTMLInputElement>('.gi__field')?.focus();
      }
    }, 800);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.querySelector<HTMLInputElement>('.gi__field');
      input?.focus();
    }
  }

  onSubmit(text: string): void {
    this.galiSvc.sendIntent(text);
  }

  onSuggestionClick(event: { label: string; index: number }): void {
    if (this.selectedProduct) {
      // post-select chips
      if (event.index === 0) {
        // Sí, vamos → naviga al Modo Estrategia
        this.router.navigate(['/gali/estrategia']);
      } else {
        // Quiero ver más productos
        this.galiSvc.deselectProduct();
        this.showToast('Volviendo a explorar productos');
      }
    } else {
      this.onSubmit(event.label);
    }
  }

  onFilterCategory(cat: string): void {
    this.activeCategory = cat;
    if (cat === 'todos') {
      this.galiSvc.sendIntent('Muéstrame top productos hoy');
    } else {
      this.galiSvc.sendIntent(cat);
    }
  }

  onSort(by: 'sales' | 'trend' | 'margin'): void {
    this.activeSort = by;
    this.galiSvc.reorderProducts(by);
  }

  onChoose(p: Product): void {
    this.galiSvc.selectProduct(p);
    this.showToast(`✓ ${p.name} seleccionado`);
  }

  onDetails(p: Product): void {
    this.showToast(`Próximamente: detalle de ${p.name}`);
  }

  onHover(p: Product): void {
    this.galiSvc.trackProductHover(p.name);
  }

  onToggleStream(): void {
    this.galiSvc.toggleStreaming();
    this.showToast(
      this.streamingEnabled ? 'Streaming desactivado' : 'Streaming activado',
    );
  }

  onReset(): void {
    if (confirm('¿Empezar de cero? Esto borra la conversación y lo que Gali ha aprendido.')) {
      this.galiSvc.reset();
      this.showToast('Conversación reiniciada');
    }
  }

  onTourDone(): void {
    this.showTour.set(false);
  }

  trackById(_: number, p: Product): string {
    return p.id;
  }

  private showToast(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(''), 3000);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    clearTimeout(this.toastTimer);
  }
}
