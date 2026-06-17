import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GaliService } from '../../services/gali.service';
import {
  AvatarState,
  CanvasTab,
  Creative,
  ExecutionStep,
  GaliMessage,
  LandingTemplate,
  Mission,
  Product,
} from '../gali-descubrimiento/models/gali.models';
import { GaliAvatarComponent } from '../gali-descubrimiento/components/gali-avatar/gali-avatar.component';
import { GaliExecutionStreamComponent } from '../gali-descubrimiento/components/gali-execution-stream/gali-execution-stream.component';
import { GaliMessageComponent } from '../gali-descubrimiento/components/gali-message/gali-message.component';
import { DemoNavComponent } from '../gali-descubrimiento/components/demo-nav/demo-nav.component';
import { TopbarGaliComponent } from '../gali-descubrimiento/components/topbar-gali/topbar-gali.component';
import { CreativeGridComponent } from './components/creative-grid/creative-grid.component';
import { LandingCanvasComponent } from './components/landing-canvas/landing-canvas.component';
import { ProductMiniRailComponent } from './components/product-mini-rail/product-mini-rail.component';

@Component({
  selector: 'app-gali-creacion',
  standalone: true,
  imports: [
    CommonModule,
    CreativeGridComponent,
    DemoNavComponent,
    GaliAvatarComponent,
    GaliExecutionStreamComponent,
    GaliMessageComponent,
    LandingCanvasComponent,
    ProductMiniRailComponent,
    TopbarGaliComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gw">
      <topbar-gali [mission]="mission" (toggleSidebar)="toggleRail()"></topbar-gali>

      <div class="gw__body">
        <product-mini-rail [product]="product"></product-mini-rail>

        <main class="gw__canvas">
          <div class="gw__head">
            <div class="gw__crumbs">
              <span class="gw__crumb gw__crumb--done">✓ Producto</span>
              <span class="gw__sep">→</span>
              <span class="gw__crumb gw__crumb--done">✓ Estrategia</span>
              <span class="gw__sep">→</span>
              <span class="gw__crumb gw__crumb--active">Creación</span>
              <span class="gw__sep">→</span>
              <span class="gw__crumb gw__crumb--locked">Lanzamiento</span>
            </div>

            <div class="gw__tabs" role="tablist">
              <button
                role="tab"
                class="gw__tab"
                [class.gw__tab--active]="tab() === 'landing'"
                (click)="tab.set('landing')"
              >
                📄 Landing Page
              </button>
              <button
                role="tab"
                class="gw__tab"
                [class.gw__tab--active]="tab() === 'creatives'"
                (click)="tab.set('creatives')"
              >
                🎨 Creatives <span class="gw__tab-count">{{ creatives.length }}</span>
              </button>
            </div>
          </div>

          <gali-execution-stream
            *ngIf="executionStream && !executionDone"
            [steps]="executionStream"
          ></gali-execution-stream>

          <ng-container [ngSwitch]="tab()">
            <landing-canvas
              *ngSwitchCase="'landing'"
              [template]="landingTemplate"
              [product]="product"
              (fieldEdited)="onFieldEdited($event)"
            ></landing-canvas>

            <creative-grid
              *ngSwitchCase="'creatives'"
              [creatives]="creatives"
              [selected]="selectedCreatives"
              (toggleSelected)="onToggleCreative($event)"
              (plusClicked)="onPlusClicked()"
            ></creative-grid>
          </ng-container>

          <footer class="gw__footer">
            <button class="gw__btn gw__btn--ghost" (click)="goBack()">
              ← Volver a Estrategia
            </button>
            <button
              class="gw__btn gw__btn--primary"
              [disabled]="selectedCreatives.length === 0 && !landingTemplate"
              (click)="onContinue()"
            >
              Continuar con campaña →
            </button>
          </footer>
        </main>

        <aside class="gw__copilot">
          <header class="gw__copilot-header">
            <gali-avatar size="sidebar" [state]="avatarState"></gali-avatar>
            <div class="gw__copilot-title">
              <span class="gw__copilot-name">Gali</span>
              <span class="gw__copilot-state">copilot</span>
            </div>
          </header>

          <div class="gw__copilot-thread">
            <gali-message
              *ngFor="let msg of creationMessages; trackBy: trackByMsgId"
              [message]="msg"
            ></gali-message>
          </div>

          <div class="gw__copilot-hint">
            <span class="gw__hint-icon">💡</span>
            Click cualquier elemento de la landing para editar
          </div>
        </aside>
      </div>

      <div class="gw__toast" *ngIf="toast()">{{ toast() }}</div>

      <div class="gw__modal-backdrop" *ngIf="modal()" (click)="modal.set(null)">
        <div class="gw__modal" (click)="$event.stopPropagation()">
          <div class="gw__modal-icon">{{ modalIcon }}</div>
          <h3>{{ modalTitle }}</h3>
          <p>{{ modalBody }}</p>
          <p class="gw__modal-meta">{{ modalMeta }}</p>
          <button class="gw__modal-btn" (click)="modal.set(null)">Entiendo</button>
        </div>
      </div>

      <demo-nav></demo-nav>
    </div>
  `,
  styleUrl: './gali-creacion.component.scss',
})
export class GaliCreacionComponent implements OnInit, OnDestroy {
  private galiSvc = inject(GaliService);
  private router = inject(Router);

  toast = signal('');
  tab = signal<CanvasTab>('landing');
  modal = signal<'launch' | 'plus' | null>(null);

  product: Product | null = null;
  mission: Mission | null = null;
  landingTemplate: LandingTemplate | null = null;
  creatives: Creative[] = [];
  selectedCreatives: string[] = [];
  creationMessages: GaliMessage[] = [];
  executionStream: ExecutionStep[] | null = null;
  avatarState: AvatarState = 'idle';

  private subs: Subscription[] = [];
  private toastTimer: any;

  modalIcon = '';
  modalTitle = '';
  modalBody = '';
  modalMeta = '';

  ngOnInit(): void {
    // Seed context si el usuario llega directo
    this.galiSvc.ensureSelectedProduct();
    this.galiSvc.ensureSelectedPersona();
    this.galiSvc.ensureMission();

    this.subs.push(
      this.galiSvc.selectedProduct$.subscribe(p => (this.product = p)),
      this.galiSvc.mission$.subscribe(m => (this.mission = m)),
      this.galiSvc.landingTemplate$.subscribe(t => (this.landingTemplate = t)),
      this.galiSvc.creatives$.subscribe(c => (this.creatives = c)),
      this.galiSvc.selectedCreatives$.subscribe(s => (this.selectedCreatives = s)),
      this.galiSvc.creationMessages$.subscribe(m => (this.creationMessages = m)),
      this.galiSvc.executionStream$.subscribe(es => (this.executionStream = es)),
      this.galiSvc.avatarState$.subscribe(s => (this.avatarState = s)),
    );

    this.galiSvc.loadCreationData().subscribe({
      next: () => this.galiSvc.enterCreationMode(),
      error: err => {
        console.warn('Creation HTTP failed, using inline fallback:', err);
        this.galiSvc.enterCreationMode();
      },
    });
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    if (this.modal()) this.modal.set(null);
  }

  get executionDone(): boolean {
    if (!this.executionStream) return true;
    return this.executionStream.every(s => s.status === 'done');
  }

  trackByMsgId(_: number, m: GaliMessage): string {
    return m.id;
  }

  onFieldEdited(e: { path: string; value: string }): void {
    this.galiSvc.editLandingField(e.path, e.value);
    this.showToast(`✓ "${e.value.slice(0, 30)}..." actualizado`);
  }

  onToggleCreative(id: string): void {
    this.galiSvc.toggleCreativeSelected(id);
    const c = this.creatives.find(c => c.id === id);
    if (c && !this.selectedCreatives.includes(id)) {
      this.showToast(`✓ ${c.label} seleccionado`);
    }
  }

  onPlusClicked(): void {
    this.modalIcon = '✨';
    this.modalTitle = 'Próximamente: Dropi AI Plus';
    this.modalBody =
      'Genera hasta 20 variaciones por producto, A/B automático y videos con avatar usando HeyGen MCP.';
    this.modalMeta = 'Feature gateada — Fase 6 del roadmap.';
    this.modal.set('plus');
  }

  onContinue(): void {
    if (this.selectedCreatives.length === 0) {
      this.showToast('Selecciona al menos 1 creative');
      return;
    }
    this.galiSvc.proceedToLaunch();
    setTimeout(() => this.router.navigate(['/gali/lanzamiento']), 800);
  }

  goBack(): void {
    this.router.navigate(['/gali/estrategia']);
  }

  toggleRail(): void {
    window.dispatchEvent(new CustomEvent('gali:toggle-rail'));
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
