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
  BuyerPersona,
  ExecutionStep,
  GaliMessage,
  Mission,
  Product,
  StrategySummary,
} from '../gali-descubrimiento/models/gali.models';
import { GaliAvatarComponent } from '../gali-descubrimiento/components/gali-avatar/gali-avatar.component';
import { GaliExecutionStreamComponent } from '../gali-descubrimiento/components/gali-execution-stream/gali-execution-stream.component';
import { GaliInputComponent } from '../gali-descubrimiento/components/gali-input/gali-input.component';
import { GaliLearningRibbonComponent } from '../gali-descubrimiento/components/gali-learning-ribbon/gali-learning-ribbon.component';
import { GaliMessageComponent } from '../gali-descubrimiento/components/gali-message/gali-message.component';
import { TopbarGaliComponent } from '../gali-descubrimiento/components/topbar-gali/topbar-gali.component';
import { DemoNavComponent } from '../gali-descubrimiento/components/demo-nav/demo-nav.component';
import { ApprovalUIComponent } from './components/approval-ui/approval-ui.component';
import { BuyerPersonaCardComponent } from './components/buyer-persona-card/buyer-persona-card.component';
import { ProductAnchorComponent } from './components/product-anchor/product-anchor.component';

@Component({
  selector: 'app-gali-estrategia',
  standalone: true,
  imports: [
    CommonModule,
    ApprovalUIComponent,
    BuyerPersonaCardComponent,
    DemoNavComponent,
    GaliAvatarComponent,
    GaliExecutionStreamComponent,
    GaliInputComponent,
    GaliLearningRibbonComponent,
    GaliMessageComponent,
    ProductAnchorComponent,
    TopbarGaliComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gw">
      <topbar-gali
        [mission]="mission"
        (toggleSidebar)="toggleRail()"
      ></topbar-gali>

      <div class="gw__body">
        <product-anchor [product]="product"></product-anchor>

        <main class="gw__canvas">
          <div class="gw__breadcrumb">
            <span class="gw__crumb gw__crumb--done">✓ Producto</span>
            <span class="gw__crumb-sep">→</span>
            <span class="gw__crumb gw__crumb--active">Estrategia</span>
            <span class="gw__crumb-sep">→</span>
            <span class="gw__crumb gw__crumb--locked">Creación</span>
            <span class="gw__crumb-sep">→</span>
            <span class="gw__crumb gw__crumb--locked">Lanzamiento</span>
          </div>

          <header class="gw__intro">
            <div class="gw__intro-chip">PASO 2 · ESTRATEGIA</div>
            <h1 class="gw__intro-title">Define el ángulo que va a vender</h1>
            <p class="gw__intro-text" *ngIf="personas.length === 0">
              Gali está analizando perfiles compradores de productos similares.
            </p>
          </header>

          <gali-execution-stream
            *ngIf="executionStream && !executionDone"
            [steps]="executionStream"
          ></gali-execution-stream>

          <div class="gw__personas" *ngIf="personas.length > 0">
            <buyer-persona-card
              *ngFor="let p of personas; let i = index; trackBy: trackById"
              [persona]="p"
              [index]="i"
              [selected]="selectedPersona?.id === p.id"
              [animDelay]="i * 120"
              (choose)="onChoose($event)"
              (fieldChanged)="onFieldChange($event)"
            ></buyer-persona-card>
          </div>

          <approval-ui
            *ngIf="strategySummary"
            [summary]="strategySummary"
            (confirmed)="onConfirm()"
            (changeRequested)="onChangeRequested()"
          ></approval-ui>
        </main>

        <aside class="gw__sidebar">
          <header class="gw__sidebar-header">
            <gali-avatar size="sidebar" [state]="avatarState"></gali-avatar>
            <div class="gw__sidebar-title">
              <span class="gw__sidebar-name">Gali</span>
              <span class="gw__sidebar-state">{{ stateLabel(avatarState) }}</span>
            </div>
            <button
              class="gw__back"
              (click)="goBack()"
              aria-label="Volver a Descubrimiento"
              title="Volver a Descubrimiento"
            >
              ←
            </button>
          </header>

          <div class="gw__thread">
            <gali-message
              *ngFor="let msg of strategyMessages; trackBy: trackByMsgId"
              [message]="msg"
            ></gali-message>
          </div>

          <div class="gw__sidebar-input">
            <gali-input
              [streamingEnabled]="streamingEnabled"
              [placeholder]="'Pregunta a Gali sobre la estrategia...'"
              (toggleStream)="onToggleStream()"
              (submitted)="onUserAsk($event)"
            ></gali-input>
          </div>

          <gali-learning-ribbon></gali-learning-ribbon>
        </aside>
      </div>

      <div class="gw__toast" *ngIf="toast()">{{ toast() }}</div>

      <div class="gw__modal-backdrop" *ngIf="nextModal()" (click)="nextModal.set(false)">
        <div class="gw__modal" (click)="$event.stopPropagation()">
          <div class="gw__modal-icon">🎨</div>
          <h3>Próximamente: Modo Creación</h3>
          <p>
            Aquí Gali construiría tu landing page en vivo con un canvas bidireccional
            (click-to-edit) más una galería de 6 creatives generados automáticamente
            según el ángulo elegido.
          </p>
          <p class="gw__modal-meta">Pantalla 4 del spec · Fase 2 del roadmap.</p>
          <button class="gw__modal-btn" (click)="nextModal.set(false)">Entiendo</button>
        </div>
      </div>

      <demo-nav></demo-nav>
    </div>
  `,
  styleUrl: './gali-estrategia.component.scss',
})
export class GaliEstrategiaComponent implements OnInit, OnDestroy {
  private galiSvc = inject(GaliService);
  private router = inject(Router);

  toast = signal('');
  nextModal = signal(false);

  product: Product | null = null;
  personas: BuyerPersona[] = [];
  selectedPersona: BuyerPersona | null = null;
  strategySummary: StrategySummary | null = null;
  strategyMessages: GaliMessage[] = [];
  executionStream: ExecutionStep[] | null = null;
  avatarState: AvatarState = 'idle';
  mission: Mission | null = null;
  streamingEnabled = true;

  private subs: Subscription[] = [];
  private toastTimer: any;

  ngOnInit(): void {
    // Seed context si el usuario llega directo a esta ruta
    this.galiSvc.ensureSelectedProduct();
    this.galiSvc.ensureMission();

    this.subs.push(
      this.galiSvc.selectedProduct$.subscribe(p => (this.product = p)),
      this.galiSvc.personas$.subscribe(p => (this.personas = p)),
      this.galiSvc.selectedPersona$.subscribe(p => (this.selectedPersona = p)),
      this.galiSvc.strategySummary$.subscribe(s => (this.strategySummary = s)),
      this.galiSvc.strategyMessages$.subscribe(m => (this.strategyMessages = m)),
      this.galiSvc.executionStream$.subscribe(es => (this.executionStream = es)),
      this.galiSvc.avatarState$.subscribe(s => (this.avatarState = s)),
      this.galiSvc.mission$.subscribe(m => (this.mission = m)),
      this.galiSvc.streamingEnabled$.subscribe(e => (this.streamingEnabled = e)),
    );

    this.galiSvc.loadStrategyData().subscribe({
      next: () => this.galiSvc.enterStrategyMode(),
      error: err => {
        console.warn('Strategy HTTP failed, using inline fallback:', err);
        this.galiSvc.enterStrategyMode();
      },
    });
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    if (this.nextModal()) this.nextModal.set(false);
  }

  trackById(_: number, p: BuyerPersona): string {
    return p.id;
  }

  trackByMsgId(_: number, m: GaliMessage): string {
    return m.id;
  }

  get executionDone(): boolean {
    if (!this.executionStream) return true;
    return this.executionStream.every(s => s.status === 'done');
  }

  stateLabel(s: AvatarState): string {
    const map: Record<AvatarState, string> = {
      idle: 'En línea',
      thinking: 'Pensando...',
      speaking: 'Respondiendo',
      alert: 'Te pregunta algo',
      success: '✓ Listo',
    };
    return map[s];
  }

  onChoose(persona: BuyerPersona): void {
    this.galiSvc.selectPersona(persona);
    this.showToast(`✓ Perfil "${persona.title.slice(0, 30)}..." seleccionado`);
  }

  onFieldChange(e: { id: string; field: 'tone' | 'channel' | 'copyAngle'; value: string }): void {
    this.galiSvc.editPersonaField(e.id, e.field, e.value);
  }

  onConfirm(): void {
    this.galiSvc.confirmStrategy();
    this.showToast('✓ Estrategia confirmada');
    setTimeout(() => this.router.navigate(['/gali/creacion']), 1200);
  }

  onChangeRequested(): void {
    this.galiSvc.resetStrategy();
    this.showToast('Volviendo a elegir perfil');
  }

  onUserAsk(text: string): void {
    // Placeholder — el modo Estrategia no soporta sendIntent full por ahora
    this.showToast('Pregunta libre: próximamente');
  }

  onToggleStream(): void {
    this.galiSvc.toggleStreaming();
  }

  goBack(): void {
    this.router.navigate(['/gali/descubrimiento']);
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
