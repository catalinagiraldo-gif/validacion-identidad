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
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import {
  ExecutionStep,
  GaliDashboardData,
  OnboardingQuestion,
  OnboardingRecommendation,
} from '../gali-descubrimiento/models/gali.models';
import { DemoNavComponent } from '../gali-descubrimiento/components/demo-nav/demo-nav.component';
import { GaliAvatarComponent } from '../gali-descubrimiento/components/gali-avatar/gali-avatar.component';
import { GaliExecutionStreamComponent } from '../gali-descubrimiento/components/gali-execution-stream/gali-execution-stream.component';

@Component({
  selector: 'app-gali-onboarding',
  standalone: true,
  imports: [CommonModule, DemoNavComponent, GaliAvatarComponent, GaliExecutionStreamComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ob">
      <div class="ob__brand">
        <span class="ob__brand-mark">D</span>
        <span class="ob__brand-text">dropi</span>
        <span class="ob__brand-divider">/</span>
        <span class="ob__brand-ai">ai-first</span>
      </div>

      <div class="ob__shell" [attr.data-state]="state()">
        <!-- QUESTIONS STATE -->
        <ng-container *ngIf="state() === 'questions'">
          <div class="ob__avatar">
            <gali-avatar size="hero" [state]="avatarState()"></gali-avatar>
          </div>

          <p class="ob__welcome" *ngIf="step() === 0 && welcomeMsg">
            {{ welcomeMsg }}
          </p>

          <p class="ob__welcome" *ngIf="!welcomeMsg">
            Hola, Sebas. Soy Gali, tu copiloto de ventas. Te hago 3 preguntas rápidas.
          </p>

          <ng-container *ngIf="currentQuestion() as q">
            <h2 class="ob__question">{{ q.label }}</h2>

            <div class="ob__options">
              <button
                *ngFor="let opt of q.options; let i = index"
                class="ob__option"
                [style.animation-delay.ms]="i * 80"
                (click)="answer(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
          </ng-container>

          <div class="ob__loading" *ngIf="!currentQuestion()">
            <span class="ob__loading-dot"></span>
            <span class="ob__loading-dot"></span>
            <span class="ob__loading-dot"></span>
          </div>

          <div class="ob__progress">
            <span
              *ngFor="let _ of progressDots; let i = index"
              class="ob__dot"
              [class.ob__dot--active]="i === step()"
              [class.ob__dot--done]="i < step()"
            ></span>
          </div>

          <button class="ob__skip" (click)="skipAll()">Saltar onboarding ✕</button>
        </ng-container>

        <!-- THINKING -->
        <ng-container *ngIf="state() === 'thinking'">
          <div class="ob__avatar">
            <gali-avatar size="hero" [state]="'thinking'"></gali-avatar>
          </div>
          <h2 class="ob__thinking-msg">{{ thinkingMsg }}</h2>
          <gali-execution-stream
            *ngIf="executionStream()"
            [steps]="executionStream()!"
          ></gali-execution-stream>
        </ng-container>

        <!-- RECOMMENDATION -->
        <ng-container *ngIf="state() === 'ready' && recommendation">
          <div class="ob__avatar">
            <gali-avatar size="hero" state="success"></gali-avatar>
          </div>

          <p class="ob__ready-prefix">✨ Perfecto, Sebas.</p>
          <p class="ob__ready-body">
            {{ readyMsg }}
          </p>

          <div class="ob__mission-card">
            <div class="ob__mission-icon">🎯</div>
            <h3 class="ob__mission-title">{{ recommendation.title }}</h3>
            <p class="ob__mission-subtitle">{{ recommendation.subtitle }}</p>

            <div class="ob__mission-stats">
              <div class="ob__stat">
                <span class="ob__stat-num">{{ recommendation.stats.completedBy }}</span>
                <span class="ob__stat-label">completaron esta semana</span>
              </div>
              <div class="ob__stat">
                <span class="ob__stat-num">{{ recommendation.stats.avgDays }}d</span>
                <span class="ob__stat-label">promedio</span>
              </div>
              <div class="ob__stat">
                <span class="ob__stat-num">{{ recommendation.stats.successRate }}%</span>
                <span class="ob__stat-label">éxito</span>
              </div>
            </div>

            <p class="ob__mission-rationale">{{ recommendation.rationale }}</p>

            <div class="ob__actions">
              <button class="ob__btn ob__btn--ghost" (click)="goDashboard()">
                Ver otras misiones
              </button>
              <button class="ob__btn ob__btn--primary" (click)="startMission()">
                🚀 Empezar esta misión
              </button>
            </div>
          </div>
        </ng-container>
      </div>

      <demo-nav></demo-nav>
    </div>
  `,
  styleUrl: './gali-onboarding.component.scss',
})
export class GaliOnboardingComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);

  state = signal<'questions' | 'thinking' | 'ready'>('questions');
  step = signal(0);
  avatarState = signal<'idle' | 'thinking' | 'speaking' | 'alert' | 'success'>('speaking');
  executionStream = signal<ExecutionStep[] | null>(null);

  // Fallback data (siempre disponible — la HTTP enriquece esto al cargar)
  questions: OnboardingQuestion[] = [
    {
      id: 'q-time',
      label: '¿Cuánto tiempo llevas en dropshipping?',
      options: [
        { value: 'new', label: 'Soy nuevo, nunca he vendido' },
        { value: '0-3', label: 'Menos de 3 meses' },
        { value: '3-12', label: '3-12 meses, tengo algunas ventas' },
        { value: '1y+', label: 'Más de 1 año, vendo regularmente' },
      ],
    },
    {
      id: 'q-niche',
      label: '¿Tienes algún nicho en mente?',
      options: [
        { value: 'no', label: 'No, necesito ayuda para encontrarlo' },
        { value: 'yes-mascotas', label: 'Sí — mascotas' },
        { value: 'yes-skincare', label: 'Sí — skincare' },
        { value: 'explore', label: 'Quiero explorar varias opciones' },
      ],
    },
    {
      id: 'q-goal',
      label: '¿Cuál es tu objetivo más urgente?',
      options: [
        { value: 'first-sale', label: 'Hacer mi primera venta' },
        { value: 'consistent', label: 'Llegar a ventas consistentes' },
        { value: 'scale', label: 'Escalar lo que ya funciona' },
        { value: 'explore-new', label: 'Explorar productos nuevos' },
      ],
    },
  ];
  answers: Record<string, string> = {};
  recommendation: OnboardingRecommendation | null = {
    missionId: 'm-001',
    title: 'Lanza tu primer producto ganador',
    subtitle: 'en 72 horas',
    stats: { completedBy: 247, avgDays: 2.4, successRate: 68 },
    rationale: 'Basado en tu perfil — perfecto para activar tu primera venta con foco y datos.',
  };
  welcomeMsg = 'Hola, Sebas. Soy Gali, tu copiloto de ventas. Te hago 3 preguntas rápidas para recomendarte la mejor misión.';
  thinkingMsg = 'Calibrando recomendación con tu perfil...';
  readyMsg = 'Basado en tu perfil, te propongo empezar con esta misión:';

  progressDots = Array.from({ length: 3 });

  private sub?: Subscription;
  private timeouts: any[] = [];

  ngOnInit(): void {
    // Avatar transitions
    this.timeouts.push(setTimeout(() => this.avatarState.set('idle'), 2400));

    // Enrich with HTTP data (interceptor mock) — async, no bloquea el render
    this.sub = this.http.get<GaliDashboardData>('/api/gali-dashboard').subscribe({
      next: data => {
        if (data?.onboarding?.questions) {
          this.questions = data.onboarding.questions;
          this.welcomeMsg = data.onboarding.messages.welcome;
          this.thinkingMsg = data.onboarding.messages.thinking;
          this.readyMsg = data.onboarding.messages.recommendationReady;
          this.recommendation = data.onboarding.recommendation;
        }
      },
      error: err => {
        console.warn('Onboarding HTTP fallback to embedded data:', err);
      },
    });
  }

  currentQuestion(): OnboardingQuestion | null {
    return this.questions[this.step()] ?? null;
  }

  answer(value: string): void {
    const q = this.currentQuestion();
    if (!q) return;
    this.answers[q.id] = value;

    if (this.step() < this.questions.length - 1) {
      this.step.update(s => s + 1);
      this.avatarState.set('speaking');
      this.timeouts.push(setTimeout(() => this.avatarState.set('idle'), 1400));
    } else {
      this.beginThinking();
    }
  }

  private beginThinking(): void {
    this.state.set('thinking');
    const steps: ExecutionStep[] = [
      { label: 'Analizando tus respuestas', duration: 900, status: 'pending' },
      { label: 'Cruzando con 12.000 perfiles similares LATAM', duration: 1200, status: 'pending' },
      { label: 'Seleccionando misión óptima', duration: 700, status: 'pending' },
    ];
    this.executionStream.set(steps);

    let cum = 200;
    steps.forEach((s, i) => {
      this.timeouts.push(
        setTimeout(() => {
          const cur = this.executionStream();
          if (!cur) return;
          this.executionStream.set(
            cur.map((st, idx) =>
              idx === i ? { ...st, status: 'running' as const } : st,
            ),
          );
        }, cum),
      );
      cum += s.duration;
      this.timeouts.push(
        setTimeout(() => {
          const cur = this.executionStream();
          if (!cur) return;
          this.executionStream.set(
            cur.map((st, idx) =>
              idx === i ? { ...st, status: 'done' as const, elapsedMs: s.duration } : st,
            ),
          );
        }, cum),
      );
    });

    this.timeouts.push(
      setTimeout(() => {
        sessionStorage.setItem('gali-onboarding-done', '1');
        this.state.set('ready');
      }, cum + 400),
    );
  }

  startMission(): void {
    this.router.navigate(['/gali/descubrimiento']);
  }

  goDashboard(): void {
    this.router.navigate(['/gali']);
  }

  skipAll(): void {
    sessionStorage.setItem('gali-onboarding-done', '1');
    this.router.navigate(['/gali']);
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    this.skipAll();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timeouts.forEach(t => clearTimeout(t));
  }
}
