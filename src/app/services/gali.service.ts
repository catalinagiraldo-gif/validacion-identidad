import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import {
  AppMode,
  AvatarState,
  BuyerPersona,
  CampaignNotification,
  CampaignNotificationEvent,
  Creative,
  ExecutionStep,
  GaliCreationData,
  GaliDiscoveryData,
  GaliLaunchData,
  GaliMessage,
  GaliStrategyData,
  LandingTemplate,
  LaunchResult,
  LayoutState,
  Mission,
  PersonaChannel,
  PersonaTone,
  PostLaunchMetrics,
  Product,
  RoasEstimate,
  StrategySummary,
  TrustStage,
} from '../pages/gali-descubrimiento/models/gali.models';
import { GaliLearningService } from './gali-learning.service';

@Injectable({ providedIn: 'root' })
export class GaliService {
  private http = inject(HttpClient);
  private learning = inject(GaliLearningService);

  private messages = new BehaviorSubject<GaliMessage[]>([]);
  messages$ = this.messages.asObservable();

  private products = new BehaviorSubject<Product[] | null>(null);
  products$ = this.products.asObservable();

  private allProducts = new BehaviorSubject<Product[]>([]);

  private layout = new BehaviorSubject<LayoutState>('hero');
  layout$ = this.layout.asObservable();

  private avatarState = new BehaviorSubject<AvatarState>('idle');
  avatarState$ = this.avatarState.asObservable();

  private executionStream = new BehaviorSubject<ExecutionStep[] | null>(null);
  executionStream$ = this.executionStream.asObservable();

  private mission = new BehaviorSubject<Mission | null>(null);
  mission$ = this.mission.asObservable();

  private streamingEnabled = new BehaviorSubject<boolean>(true);
  streamingEnabled$ = this.streamingEnabled.asObservable();

  private idleNudgeShown = new BehaviorSubject<boolean>(false);
  idleNudgeShown$ = this.idleNudgeShown.asObservable();

  private selectedProduct = new BehaviorSubject<Product | null>(null);
  selectedProduct$ = this.selectedProduct.asObservable();

  // --- Fase 1: Modo Estrategia ---
  private currentMode = new BehaviorSubject<AppMode>('descubrimiento');
  currentMode$ = this.currentMode.asObservable();

  private personas = new BehaviorSubject<BuyerPersona[]>([]);
  personas$ = this.personas.asObservable();

  private selectedPersona = new BehaviorSubject<BuyerPersona | null>(null);
  selectedPersona$ = this.selectedPersona.asObservable();

  private strategySummary = new BehaviorSubject<StrategySummary | null>(null);
  strategySummary$ = this.strategySummary.asObservable();

  private strategyMessages = new BehaviorSubject<GaliMessage[]>([]);
  strategyMessages$ = this.strategyMessages.asObservable();

  private strategyData: GaliStrategyData | null = null;

  // Reactive processing flag (used by templates)
  private processingSubject = new BehaviorSubject<boolean>(false);
  processing$ = this.processingSubject.asObservable();

  // --- Fase 2: Modo Creación ---
  private creationData: GaliCreationData | null = null;

  private landingTemplate = new BehaviorSubject<LandingTemplate | null>(null);
  landingTemplate$ = this.landingTemplate.asObservable();

  private creatives = new BehaviorSubject<Creative[]>([]);
  creatives$ = this.creatives.asObservable();

  private selectedCreatives = new BehaviorSubject<string[]>([]);
  selectedCreatives$ = this.selectedCreatives.asObservable();

  private creationMessages = new BehaviorSubject<GaliMessage[]>([]);
  creationMessages$ = this.creationMessages.asObservable();

  // --- Fase 3: Modo Lanzamiento ---
  private launchData: GaliLaunchData | null = null;

  private campaignPlatform = new BehaviorSubject<string>('meta');
  campaignPlatform$ = this.campaignPlatform.asObservable();

  private campaignBudget = new BehaviorSubject<number>(50000);
  campaignBudget$ = this.campaignBudget.asObservable();

  private campaignDuration = new BehaviorSubject<number>(7);
  campaignDuration$ = this.campaignDuration.asObservable();

  private roasEstimate = new BehaviorSubject<RoasEstimate | null>(null);
  roasEstimate$ = this.roasEstimate.asObservable();

  private launchMessages = new BehaviorSubject<GaliMessage[]>([]);
  launchMessages$ = this.launchMessages.asObservable();

  private launchResult = new BehaviorSubject<LaunchResult | null>(null);
  launchResult$ = this.launchResult.asObservable();

  private notifications = new BehaviorSubject<CampaignNotification[]>([]);
  notifications$ = this.notifications.asObservable();

  // --- Fase 5: Post-launch notifications ---
  private notifEvents = new BehaviorSubject<CampaignNotificationEvent[]>([]);
  notifEvents$ = this.notifEvents.asObservable();

  private notifDrawerOpen = new BehaviorSubject<boolean>(false);
  notifDrawerOpen$ = this.notifDrawerOpen.asObservable();

  // --- Fase T1: Trust Stage ---
  private trustStage = new BehaviorSubject<TrustStage>(
    (parseInt(sessionStorage.getItem('gali-trust-stage') ?? '1', 10) as TrustStage) || 1,
  );
  trustStage$ = this.trustStage.asObservable();

  private data: GaliDiscoveryData | null = null;
  private idleTimerSub?: Subscription;
  // Internal mirror — accessor sets both
  private get processing(): boolean { return this.processingSubject.value; }
  private set processing(v: boolean) { this.processingSubject.next(v); }

  loadData(): Observable<GaliDiscoveryData> {
    const obs = this.http.get<GaliDiscoveryData>('/api/gali-discovery');
    obs.subscribe(data => {
      this.data = data;
      this.allProducts.next(data.products);
      this.mission.next(data.mission);
      this.pushInitialMessage();
    });
    return obs;
  }

  private pushInitialMessage(): void {
    const initialText =
      '¿Qué tipo de producto estás buscando? Puedo sugerirte algo basado en lo que está vendiendo ahora en Colombia, o si tienes algún nicho en mente, cuéntame.';
    this.messages.next([
      {
        id: 'msg-init',
        type: 'gali-text',
        text: initialText,
        streaming: this.streamingEnabled.value,
        timestamp: Date.now(),
      },
    ]);
    this.avatarState.next('speaking');
    const duration = this.streamingDuration(initialText);
    setTimeout(() => this.avatarState.next('idle'), duration);
  }

  /** Tiempo aproximado del streaming letra a letra (texto.length * 30ms / 5 palabras/word) */
  streamingDuration(text: string): number {
    if (!this.streamingEnabled.value) return 0;
    return Math.min(4500, Math.max(900, text.length * 18));
  }

  toggleStreaming(): void {
    this.streamingEnabled.next(!this.streamingEnabled.value);
  }

  /** Detecta keyword y devuelve template asociado */
  private detectKeyword(input: string): string {
    const norm = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const map: { keys: string[]; bucket: string }[] = [
      { keys: ['tendencia', 'tendencias', 'hoy', 'viral', 'top'], bucket: 'tendencia' },
      { keys: ['mascota', 'perro', 'gato', 'pet'], bucket: 'mascotas' },
      { keys: ['skincare', 'piel', 'belleza', 'cosmetic', 'cuidado'], bucket: 'skincare' },
      { keys: ['hogar', 'casa', 'organizar'], bucket: 'hogar' },
      { keys: ['fitness', 'ejercicio', 'yoga', 'gym', 'deport'], bucket: 'fitness' },
      { keys: ['tech', 'tecnolog', 'gadget', 'electron'], bucket: 'tech' },
    ];
    for (const m of map) {
      if (m.keys.some(k => norm.includes(k))) return m.bucket;
    }
    return 'default';
  }

  sendIntent(text: string): void {
    if (!this.data || this.processing) return;
    if (!text.trim()) return;
    this.processing = true;
    this.clearIdleTimer();
    this.idleNudgeShown.next(false);

    const bucket = this.detectKeyword(text);
    const response = this.data.responses[bucket] ?? this.data.responses['default'];
    const steps = this.data.executionSteps[bucket] ?? this.data.executionSteps['default'];

    // 1. Push user message
    this.messages.next([
      ...this.messages.value,
      {
        id: `msg-u-${Date.now()}`,
        type: 'user',
        text,
        instant: true,
        timestamp: Date.now(),
      },
    ]);

    // 2. Avatar → thinking
    this.avatarState.next('thinking');

    // 3. First intent → transition to workspace
    const isFirst = this.layout.value === 'hero';
    if (isFirst) {
      setTimeout(() => this.layout.next('workspace'), 200);
    }

    // 4. Build execution steps + animate them
    const execSteps: ExecutionStep[] = steps.map(s => ({
      label: s.label,
      duration: s.duration,
      status: 'pending',
    }));
    this.executionStream.next(execSteps);

    // Stagger steps
    let cumulativeDelay = isFirst ? 600 : 200;
    steps.forEach((s, i) => {
      setTimeout(() => {
        const current = this.executionStream.value;
        if (!current) return;
        const updated = current.map((step, idx) =>
          idx === i ? { ...step, status: 'running' as const } : step,
        );
        this.executionStream.next(updated);
      }, cumulativeDelay);

      cumulativeDelay += s.duration;

      setTimeout(() => {
        const current = this.executionStream.value;
        if (!current) return;
        const updated = current.map((step, idx) =>
          idx === i
            ? { ...step, status: 'done' as const, elapsedMs: s.duration }
            : step,
        );
        this.executionStream.next(updated);
      }, cumulativeDelay);
    });

    // 5. After all steps: emit Gali response
    setTimeout(() => {
      this.avatarState.next('speaking');
      this.messages.next([
        ...this.messages.value,
        {
          id: `msg-g-${Date.now()}`,
          type: 'gali-text',
          text: response.message,
          confidence: response.confidence,
          confidenceDetails: [
            `Basado en ${response.productIds.length * 105 + Math.floor(Math.random() * 50)} ventas similares`,
            'Datos últimos 30 días Colombia',
            `Match con tu intención: ${response.confidence > 80 ? 'alto' : response.confidence > 60 ? 'medio' : 'bajo'}`,
          ],
          streaming: this.streamingEnabled.value,
          timestamp: Date.now(),
        },
      ]);

      // Emit learning if applicable
      if (response.learning) {
        this.learning.add(
          response.learning.key,
          response.learning.icon,
          response.learning.label,
          `Mencionaste "${this.bucketLabel(bucket)}"`,
        );
      }

      // 6. Reasoning anchor for canvas
      setTimeout(() => {
        this.messages.next([
          ...this.messages.value,
          {
            id: `msg-r-${Date.now()}`,
            type: 'reasoning',
            text: response.reasoning,
            instant: true,
            timestamp: Date.now(),
          },
        ]);

        // 7. Populate canvas products
        const selected = response.productIds
          .map(id => this.allProducts.value.find(p => p.id === id))
          .filter((p): p is Product => !!p);
        this.products.next(selected);

        // 8. Avatar → idle, processing done
        const totalStream = this.streamingDuration(response.message);
        setTimeout(() => {
          this.avatarState.next('idle');
          this.processing = false;
          this.startIdleTimer();
        }, totalStream);
      }, 400);
    }, cumulativeDelay + 200);
  }

  private bucketLabel(bucket: string): string {
    const map: Record<string, string> = {
      tendencia: 'tendencia',
      mascotas: 'mascotas',
      skincare: 'skincare',
      hogar: 'hogar',
      fitness: 'fitness',
      tech: 'tech',
      default: 'productos',
    };
    return map[bucket] ?? bucket;
  }

  /** Click en filtro de categoría — re-emite con el bucket forzado */
  filterByCategory(category: string): void {
    if (!this.data || this.processing) return;
    const bucketMap: Record<string, string> = {
      mascotas: 'mascotas',
      hogar: 'hogar',
      skincare: 'skincare',
      fitness: 'fitness',
      tech: 'tech',
      accesorios: 'default',
      todos: 'tendencia',
    };
    const bucket = bucketMap[category.toLowerCase()] ?? 'default';
    this.sendIntent(category);
  }

  /** Click en "Elegir este" */
  selectProduct(product: Product): void {
    this.selectedProduct.next(product);
    this.clearIdleTimer();

    // Advance mission
    const current = this.mission.value;
    if (current) {
      this.mission.next({
        ...current,
        progressPct: 40,
        steps: current.steps.map((s, i) =>
          i === 0 ? { ...s, status: 'done', pct: 100 } : s,
        ),
      });
    }

    setTimeout(() => {
      this.avatarState.next('speaking');
      const msg = `Buena elección. ${product.name} tiene ${product.salesWeek} ventas esta semana en Colombia con un margen del ${product.margin}%. Ahora definamos cómo vas a diferenciarte para venderlo. ¿Continuamos con los ángulos de venta?`;
      this.messages.next([
        ...this.messages.value,
        {
          id: `msg-g-${Date.now()}`,
          type: 'gali-text',
          text: msg,
          confidence: 94,
          confidenceDetails: [
            `Basado en ${product.salesWeek * 2 + 200} ventas históricas`,
            'Datos productos similares LATAM',
            'Match con tu selección: muy alto',
          ],
          streaming: this.streamingEnabled.value,
          timestamp: Date.now(),
        },
      ]);
      setTimeout(() => {
        this.avatarState.next('idle');
        this.startIdleTimer();
      }, this.streamingDuration(msg));
    }, 400);
  }

  deselectProduct(): void {
    this.selectedProduct.next(null);
    const current = this.mission.value;
    if (current) {
      this.mission.next({
        ...current,
        progressPct: 20,
        steps: current.steps.map((s, i) =>
          i === 0 ? { ...s, status: 'current', pct: 20 } : s,
        ),
      });
    }
  }

  reorderProducts(by: 'sales' | 'trend' | 'margin'): void {
    const current = this.products.value;
    if (!current) return;
    const sorted = [...current].sort((a, b) => {
      if (by === 'sales') return b.salesWeek - a.salesWeek;
      if (by === 'trend') return b.trendPct - a.trendPct;
      return b.margin - a.margin;
    });
    this.products.next(sorted);
    if (by === 'margin') {
      this.learning.add('pref_high_margin', '💰', 'Te importa: margen alto', 'Clic en ordenar por margen');
    } else if (by === 'trend') {
      this.learning.add('pref_trending', '📈', 'Prefieres: productos en alza', 'Clic en ordenar por tendencia');
    }
  }

  reset(): void {
    this.messages.next([]);
    this.products.next(null);
    this.layout.next('hero');
    this.avatarState.next('idle');
    this.executionStream.next(null);
    this.selectedProduct.next(null);
    this.idleNudgeShown.next(false);
    this.learning.forgetAll();
    if (this.data) {
      this.mission.next(this.data.mission);
    }
    this.processing = false;
    this.clearIdleTimer();
    this.pushInitialMessage();
  }

  /** Track hover on product → emit learning */
  trackProductHover(productName: string): void {
    this.learning.add(
      'consideration',
      '👀',
      'Productos considerados',
      `Hover sostenido sobre ${productName}`,
    );
  }

  /** Idle nudge timer */
  private startIdleTimer(): void {
    this.clearIdleTimer();
    if (this.layout.value !== 'workspace') return;
    this.idleTimerSub = timer(25000).subscribe(() => {
      if (this.processing) return;
      this.idleNudgeShown.next(true);
      this.messages.next([
        ...this.messages.value,
        {
          id: `msg-n-${Date.now()}`,
          type: 'nudge',
          text:
            '¿Te ayudo a comparar las primeras 3? Cuéntame qué te importa más: margen, facilidad de venta o competencia en el nicho.',
          instant: true,
          timestamp: Date.now(),
        },
      ]);
      this.avatarState.next('alert');
      setTimeout(() => this.avatarState.next('idle'), 1200);
    });
  }

  private clearIdleTimer(): void {
    this.idleTimerSub?.unsubscribe();
    this.idleTimerSub = undefined;
  }

  // ============================================
  // FASE 1 — MODO ESTRATEGIA
  // ============================================

  loadStrategyData(): Observable<GaliStrategyData> {
    const obs = this.http.get<GaliStrategyData>('/api/gali-strategy');
    obs.subscribe(data => (this.strategyData = data));
    return obs;
  }

  /** Llamado al entrar a /gali/estrategia. Genera 3 personas según categoría del producto. */
  enterStrategyMode(): void {
    if (!this.strategyData) return;
    const product = this.selectedProduct.value;
    if (!product) return;

    this.currentMode.next('estrategia');
    this.processing = true;
    this.clearIdleTimer();

    // Advance mission to 60%
    const current = this.mission.value;
    if (current) {
      this.mission.next({
        ...current,
        progressPct: 60,
        currentStep: 2,
        currentStepName: 'Estrategia',
        steps: current.steps.map((s, i) =>
          i === 0
            ? { ...s, status: 'done', pct: 100 }
            : i === 1
              ? { ...s, status: 'current', pct: 30 }
              : s,
        ),
      });
    }

    // Reset strategy state
    this.personas.next([]);
    this.selectedPersona.next(null);
    this.strategySummary.next(null);
    this.strategyMessages.next([]);

    // Initial Gali message
    const introTpl = this.strategyData.messages?.intro ?? '';
    const intro = introTpl
      .replace('{cases}', String(847 + Math.floor(Math.random() * 200)));
    this.strategyMessages.next([
      {
        id: 'strat-intro',
        type: 'gali-text',
        text: intro,
        streaming: this.streamingEnabled.value,
        timestamp: Date.now(),
      },
    ]);
    this.avatarState.next('speaking');

    // Execution stream
    const steps = this.strategyData.executionSteps['strategy'];
    const execSteps: ExecutionStep[] = steps.map(s => ({
      label: s.label,
      duration: s.duration,
      status: 'pending',
    }));
    this.executionStream.next(execSteps);

    let cumulativeDelay = 600;
    steps.forEach((s, i) => {
      setTimeout(() => {
        const stream = this.executionStream.value;
        if (!stream) return;
        this.executionStream.next(
          stream.map((step, idx) =>
            idx === i ? { ...step, status: 'running' as const } : step,
          ),
        );
      }, cumulativeDelay);
      cumulativeDelay += s.duration;
      setTimeout(() => {
        const stream = this.executionStream.value;
        if (!stream) return;
        this.executionStream.next(
          stream.map((step, idx) =>
            idx === i
              ? { ...step, status: 'done' as const, elapsedMs: s.duration }
              : step,
          ),
        );
      }, cumulativeDelay);
    });

    // After all steps, emit personas
    setTimeout(() => {
      const category = product.category;
      const personasForCategory =
        this.strategyData!.personasByCategory[category] ??
        this.strategyData!.personasByCategory['default'];
      this.personas.next(personasForCategory.map(p => ({ ...p })));
      this.avatarState.next('idle');
      this.processing = false;
    }, cumulativeDelay + 400);
  }

  selectPersona(persona: BuyerPersona): void {
    this.selectedPersona.next(persona);
    this.learning.add(
      `persona_tone_${persona.tone.toLowerCase()}`,
      '🎭',
      `Tono preferido: ${persona.tone}`,
      `Persona seleccionada: ${persona.title}`,
    );
    this.learning.add(
      `persona_channel_${persona.channel.toLowerCase()}`,
      '📢',
      `Canal preferido: ${persona.channel}`,
      `Persona seleccionada: ${persona.title}`,
    );

    const tpl = this.strategyData?.messages?.personaSelected ?? '';
    const msg = tpl.replace('{salesShare}', String(persona.salesShare));
    this.strategyMessages.next([
      ...this.strategyMessages.value,
      {
        id: `strat-sel-${Date.now()}`,
        type: 'gali-text',
        text: msg,
        confidence: persona.confidence,
        confidenceDetails: [
          `Basado en ${persona.salesShare * 22} ventas de perfiles similares`,
          'Datos LATAM últimos 90 días',
          persona.reasoning,
        ],
        streaming: this.streamingEnabled.value,
        timestamp: Date.now(),
      },
    ]);
    this.avatarState.next('speaking');
    setTimeout(() => this.avatarState.next('idle'), this.streamingDuration(msg));

    // Build strategy summary
    this.buildStrategySummary(persona);
  }

  editPersonaField(
    personaId: string,
    field: 'tone' | 'channel' | 'copyAngle',
    value: string,
  ): void {
    const updated = this.personas.value.map(p =>
      p.id === personaId ? { ...p, [field]: value, modified: true } : p,
    );
    this.personas.next(updated);

    // If editing the selected persona, update summary
    const sel = this.selectedPersona.value;
    if (sel?.id === personaId) {
      const updatedPersona = updated.find(p => p.id === personaId)!;
      this.selectedPersona.next(updatedPersona);
      this.buildStrategySummary(updatedPersona);

      // Gali responds proactively
      const msg = this.strategyData?.messages?.personaModified ?? 'Recalculé la predicción.';
      this.strategyMessages.next([
        ...this.strategyMessages.value,
        {
          id: `strat-mod-${Date.now()}`,
          type: 'gali-text',
          text: msg,
          streaming: this.streamingEnabled.value,
          timestamp: Date.now(),
        },
      ]);
      this.avatarState.next('speaking');
      setTimeout(() => this.avatarState.next('idle'), this.streamingDuration(msg));
    }
  }

  private buildStrategySummary(persona: BuyerPersona): void {
    if (!this.strategyData) return;
    const product = this.selectedProduct.value;
    if (!product) return;
    const ranges = (this.strategyData as any).approvalConfidenceRanges;
    const range = ranges?.[persona.tone] ?? { min: 2.0, max: 3.5, cases: 25, confidence: 70 };
    this.strategySummary.next({
      product,
      persona,
      tone: persona.tone,
      channel: persona.channel,
      copyAngle: persona.copyAngle,
      conversionRangeMin: range.min,
      conversionRangeMax: range.max,
      basedOnCases: range.cases,
    });
  }

  confirmStrategy(): void {
    // Advance mission to 80%
    const current = this.mission.value;
    if (current) {
      this.mission.next({
        ...current,
        progressPct: 80,
        currentStep: 3,
        currentStepName: 'Creación',
        steps: current.steps.map((s, i) =>
          i < 2 ? { ...s, status: 'done', pct: 100 } : i === 2 ? { ...s, status: 'current', pct: 30 } : s,
        ),
      });
    }
    const msg = this.strategyData?.messages?.confirmed ??
      'Listo. Voy a generar tu landing y los creatives.';
    this.strategyMessages.next([
      ...this.strategyMessages.value,
      {
        id: `strat-conf-${Date.now()}`,
        type: 'gali-text',
        text: msg,
        streaming: this.streamingEnabled.value,
        timestamp: Date.now(),
      },
    ]);
    this.avatarState.next('success');
    setTimeout(() => this.avatarState.next('idle'), 1600);
  }

  resetStrategy(): void {
    this.selectedPersona.next(null);
    this.strategySummary.next(null);
  }

  // ============================================
  // FASE 2 — MODO CREACIÓN
  // ============================================

  loadCreationData(): Observable<GaliCreationData> {
    const obs = this.http.get<GaliCreationData>('/api/gali-creation');
    obs.subscribe(data => (this.creationData = data));
    return obs;
  }

  enterCreationMode(): void {
    if (!this.creationData) return;
    this.currentMode.next('creacion');
    this.processing = true;

    // Mission to 80%
    const current = this.mission.value;
    if (current) {
      this.mission.next({
        ...current,
        progressPct: 80,
        currentStep: 3,
        currentStepName: 'Creación',
        steps: current.steps.map((s, i) =>
          i < 2
            ? { ...s, status: 'done', pct: 100 }
            : i === 2
              ? { ...s, status: 'current', pct: 50 }
              : s,
        ),
      });
    }

    this.landingTemplate.next(null);
    this.creatives.next([]);
    this.selectedCreatives.next([]);
    this.creationMessages.next([]);

    // Initial Gali message
    this.creationMessages.next([
      {
        id: 'creation-intro',
        type: 'gali-text',
        text: this.creationData.messages.intro,
        streaming: this.streamingEnabled.value,
        timestamp: Date.now(),
      },
    ]);
    this.avatarState.next('speaking');

    // Execution stream
    const steps = this.creationData.executionSteps['creation'];
    const execSteps: ExecutionStep[] = steps.map(s => ({
      label: s.label,
      duration: s.duration,
      status: 'pending',
    }));
    this.executionStream.next(execSteps);

    let cumulativeDelay = 600;
    steps.forEach((s, i) => {
      setTimeout(() => {
        const stream = this.executionStream.value;
        if (!stream) return;
        this.executionStream.next(
          stream.map((step, idx) =>
            idx === i ? { ...step, status: 'running' as const } : step,
          ),
        );
      }, cumulativeDelay);
      cumulativeDelay += s.duration;
      setTimeout(() => {
        const stream = this.executionStream.value;
        if (!stream) return;
        this.executionStream.next(
          stream.map((step, idx) =>
            idx === i
              ? { ...step, status: 'done' as const, elapsedMs: s.duration }
              : step,
          ),
        );
      }, cumulativeDelay);
    });

    // After steps: emit landing + creatives
    setTimeout(() => {
      if (!this.creationData) return;
      this.landingTemplate.next({ ...this.creationData.landingTemplates['default'] });
      this.creatives.next(this.creationData.creatives.map(c => ({ ...c })));
      this.avatarState.next('idle');
      this.processing = false;
    }, cumulativeDelay + 400);
  }

  editLandingField(path: string, value: string): void {
    const current = this.landingTemplate.value;
    if (!current) return;
    const updated: any = JSON.parse(JSON.stringify(current));
    const keys = path.split('.');
    let ref = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      ref = ref[keys[i]];
    }
    ref[keys[keys.length - 1]] = value;
    this.landingTemplate.next(updated);

    // Gali responds
    if (!this.creationData) return;
    this.creationMessages.next([
      ...this.creationMessages.value,
      {
        id: `creation-edit-${Date.now()}`,
        type: 'gali-text',
        text: this.creationData.messages.elementEdited,
        streaming: this.streamingEnabled.value,
        timestamp: Date.now(),
      },
    ]);
    this.avatarState.next('speaking');
    setTimeout(
      () => this.avatarState.next('idle'),
      this.streamingDuration(this.creationData.messages.elementEdited),
    );
    this.learning.add(
      'edited_landing',
      '✏️',
      'Editaste elementos de landing',
      `Cambio en ${path}`,
    );
  }

  toggleCreativeSelected(id: string): void {
    const current = this.selectedCreatives.value;
    if (current.includes(id)) {
      this.selectedCreatives.next(current.filter(i => i !== id));
    } else {
      this.selectedCreatives.next([...current, id]);
      if (this.creationData) {
        this.creationMessages.next([
          ...this.creationMessages.value,
          {
            id: `creation-csel-${Date.now()}`,
            type: 'gali-text',
            text: this.creationData.messages.creativeSelected,
            streaming: this.streamingEnabled.value,
            timestamp: Date.now(),
          },
        ]);
        this.avatarState.next('speaking');
        setTimeout(
          () => this.avatarState.next('idle'),
          this.streamingDuration(this.creationData.messages.creativeSelected),
        );
      }
    }
  }

  proceedToLaunch(): void {
    if (this.creationData) {
      this.creationMessages.next([
        ...this.creationMessages.value,
        {
          id: `creation-proceed-${Date.now()}`,
          type: 'gali-text',
          text: this.creationData.messages.ctaProceed,
          streaming: this.streamingEnabled.value,
          timestamp: Date.now(),
        },
      ]);
      this.avatarState.next('success');
      setTimeout(() => this.avatarState.next('idle'), 1600);
    }
  }

  // ============================================
  // FASE 3 — MODO LANZAMIENTO
  // ============================================

  loadLaunchData(): Observable<GaliLaunchData> {
    const obs = this.http.get<GaliLaunchData>('/api/gali-launch');
    obs.subscribe(data => {
      this.launchData = data;
      this.campaignPlatform.next(data.campaign.preFilledValues.platform);
      this.campaignBudget.next(data.campaign.preFilledValues.budget);
      this.campaignDuration.next(data.campaign.preFilledValues.duration);
      this.notifications.next(data.notifications);
      this.computeRoas();
    });
    return obs;
  }

  enterLaunchMode(): void {
    if (!this.launchData) return;
    this.currentMode.next('lanzamiento');
    this.processing = false;

    // Mission to 90% (publishing → 100%)
    const current = this.mission.value;
    if (current) {
      this.mission.next({
        ...current,
        progressPct: 90,
        currentStep: 4,
        currentStepName: 'Lanzamiento',
        steps: current.steps.map((s, i) =>
          i < 3
            ? { ...s, status: 'done', pct: 100 }
            : i === 3
              ? { ...s, status: 'current', pct: 50 }
              : s,
        ),
      });
    }

    this.launchMessages.next([
      {
        id: 'launch-intro',
        type: 'gali-text',
        text: this.launchData.messages.intro,
        streaming: this.streamingEnabled.value,
        timestamp: Date.now(),
      },
    ]);
    this.avatarState.next('speaking');
    setTimeout(
      () => this.avatarState.next('idle'),
      this.streamingDuration(this.launchData.messages.intro),
    );
  }

  setCampaignPlatform(id: string): void {
    this.campaignPlatform.next(id);
  }

  setCampaignBudget(value: number): void {
    this.campaignBudget.next(value);
    this.computeRoas();
  }

  setCampaignDuration(days: number): void {
    this.campaignDuration.next(days);
    this.computeRoas();
  }

  toggleNotification(id: string): void {
    const updated = this.notifications.value.map(n =>
      n.id === id ? { ...n, enabled: !n.enabled } : n,
    );
    this.notifications.next(updated);
  }

  private computeRoas(): void {
    if (!this.launchData) return;
    const curve = this.launchData.roasCurve;
    const budget = this.campaignBudget.value;
    const duration = this.campaignDuration.value;

    // Linear interpolation between curve points
    let p1 = curve[0];
    let p2 = curve[curve.length - 1];
    for (let i = 0; i < curve.length - 1; i++) {
      if (budget >= curve[i].budget && budget <= curve[i + 1].budget) {
        p1 = curve[i];
        p2 = curve[i + 1];
        break;
      }
    }
    const t = p2.budget === p1.budget ? 0 : (budget - p1.budget) / (p2.budget - p1.budget);
    const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
    const lerpDec = (a: number, b: number) => parseFloat((a + (b - a) * t).toFixed(2));

    // Scale by duration (baseline is 7 days)
    const durationScale = duration / 7;

    this.roasEstimate.next({
      budget,
      duration,
      totalSpend: budget * duration,
      reach: {
        min: Math.round(lerp(p1.minReach, p2.minReach) * durationScale),
        max: Math.round(lerp(p1.maxReach, p2.maxReach) * durationScale),
      },
      sales: {
        min: Math.round(lerp(p1.minSales, p2.minSales) * durationScale),
        max: Math.round(lerp(p1.maxSales, p2.maxSales) * durationScale),
      },
      roas: {
        min: lerpDec(p1.minRoas, p2.minRoas),
        max: lerpDec(p1.maxRoas, p2.maxRoas),
      },
    });
  }

  // ============================================
  // FASE 5 — Post-launch notifications
  // ============================================

  openNotifDrawer(): void {
    this.notifDrawerOpen.next(true);
    // Mark all as read after opening
    setTimeout(() => {
      this.notifEvents.next(this.notifEvents.value.map(n => ({ ...n, read: true })));
    }, 500);
  }

  closeNotifDrawer(): void {
    this.notifDrawerOpen.next(false);
  }

  toggleNotifDrawer(): void {
    if (this.notifDrawerOpen.value) {
      this.closeNotifDrawer();
    } else {
      this.openNotifDrawer();
    }
  }

  get unreadNotifCount(): number {
    return this.notifEvents.value.filter(n => !n.read).length;
  }

  /** Programa 3 notificaciones mockeadas tras publicar (8s/16s/24s para el demo) */
  private scheduleMockNotifications(result: LaunchResult): void {
    const baseReach = result.estimate.reach.min;
    const baseSales = result.estimate.sales.min;

    const events: { delayMs: number; payload: CampaignNotificationEvent }[] = [
      {
        delayMs: 8000,
        payload: {
          id: 'n-24h',
          time: '24h',
          title: 'Primeras 24h de tu campaña',
          subtitle: 'Métricas iniciales',
          metrics: {
            reach: Math.round(baseReach * 0.18),
            impressions: Math.round(baseReach * 0.28),
            clicks: Math.round(baseReach * 0.006),
            ctr: 2.09,
            sales: Math.max(1, Math.round(baseSales * 0.22)),
            spend: result.estimate.budget,
            roas: 2.1,
          },
          galiMessage:
            'El CTR está bien — promedio del sector es 1.8% y estás en 2.09%. Sin embargo, el ROAS está en el límite bajo. Te recomiendo probar el Banner 1 en paralelo.',
          recommendations: [
            { label: 'Activar Banner 1', primary: true },
            { label: 'Revisar más tarde' },
          ],
          read: false,
          timestamp: Date.now() + 8000,
        },
      },
      {
        delayMs: 16000,
        payload: {
          id: 'n-72h',
          time: '72h',
          title: 'Primera optimización sugerida',
          subtitle: 'Performance estabilizada',
          metrics: {
            reach: Math.round(baseReach * 0.42),
            impressions: Math.round(baseReach * 0.65),
            clicks: Math.round(baseReach * 0.014),
            ctr: 2.18,
            sales: Math.max(2, Math.round(baseSales * 0.45)),
            spend: result.estimate.budget * 3,
            roas: 2.4,
          },
          galiMessage:
            'Las primeras 72h muestran un ROAS de 2.4x. La audiencia Mamá 30-45 está respondiendo mejor que la Joven 18-26. Voy a redistribuir presupuesto hacia el segmento ganador.',
          recommendations: [
            { label: 'Aplicar redistribución', primary: true },
            { label: 'Ver detalle por segmento' },
          ],
          read: false,
          timestamp: Date.now() + 16000,
        },
      },
      {
        delayMs: 24000,
        payload: {
          id: 'n-opportunity',
          time: 'oportunidad',
          title: 'Producto en tendencia detectado',
          subtitle: 'Algo está explotando en México',
          metrics: {
            reach: 0, impressions: 0, clicks: 0, ctr: 0, sales: 0, spend: 0, roas: 0,
          },
          galiMessage:
            'El Aspiradora Robot Smart explotó +280% en México hoy. Funciona para tu mismo perfil. ¿Lo agregamos a tu catálogo como segunda misión?',
          recommendations: [
            { label: 'Crear misión nueva', primary: true },
            { label: 'No, gracias' },
          ],
          read: false,
          timestamp: Date.now() + 24000,
        },
      },
    ];

    events.forEach(e => {
      setTimeout(() => {
        this.notifEvents.next([e.payload, ...this.notifEvents.value]);
        this.avatarState.next('alert');
        setTimeout(() => this.avatarState.next('idle'), 1400);
      }, e.delayMs);
    });
  }

  // ============================================
  // FASE T1 — Trust Stage
  // ============================================

  setTrustStage(stage: TrustStage): void {
    this.trustStage.next(stage);
    sessionStorage.setItem('gali-trust-stage', String(stage));
  }

  toggleTrustStage(): void {
    this.setTrustStage(this.trustStage.value === 1 ? 2 : 1);
  }

  publishCampaign(): Observable<LaunchResult> {
    if (!this.launchData) {
      return new Observable(sub => sub.error('No data'));
    }
    return new Observable<LaunchResult>(sub => {
      this.processing = true;
      this.avatarState.next('thinking');

      const steps = this.launchData!.executionSteps['launch'];
      const execSteps: ExecutionStep[] = steps.map(s => ({
        label: s.label,
        duration: s.duration,
        status: 'pending',
      }));
      this.executionStream.next(execSteps);

      let cum = 200;
      steps.forEach((s, i) => {
        setTimeout(() => {
          const st = this.executionStream.value;
          if (!st) return;
          this.executionStream.next(
            st.map((step, idx) =>
              idx === i ? { ...step, status: 'running' as const } : step,
            ),
          );
        }, cum);
        cum += s.duration;
        setTimeout(() => {
          const st = this.executionStream.value;
          if (!st) return;
          this.executionStream.next(
            st.map((step, idx) =>
              idx === i
                ? { ...step, status: 'done' as const, elapsedMs: s.duration }
                : step,
            ),
          );
        }, cum);
      });

      setTimeout(() => {
        const result: LaunchResult = {
          campaignId: 'camp-' + Date.now(),
          publishedAt: Date.now(),
          estimate: this.roasEstimate.value!,
        };
        this.launchResult.next(result);
        this.avatarState.next('success');

        // Mission to 100%
        const current = this.mission.value;
        if (current) {
          this.mission.next({
            ...current,
            progressPct: 100,
            currentStep: 4,
            currentStepName: 'Completada',
            steps: current.steps.map(s => ({ ...s, status: 'done', pct: 100 })),
          });
        }

        if (this.launchData) {
          this.launchMessages.next([
            ...this.launchMessages.value,
            {
              id: 'launch-published',
              type: 'gali-text',
              text: this.launchData.messages.published,
              streaming: this.streamingEnabled.value,
              timestamp: Date.now(),
            },
          ]);
        }

        this.processing = false;
        // Schedule post-launch notifications
        this.scheduleMockNotifications(result);
        sub.next(result);
        sub.complete();
      }, cum + 200);
    });
  }

  // ============================================
  // SEED HELPERS — para que el usuario pueda navegar directo a cualquier pantalla
  // ============================================

  /** Si no hay producto seleccionado, asigna uno por default (Collar GPS). */
  ensureSelectedProduct(): Product {
    if (this.selectedProduct.value) return this.selectedProduct.value;
    const seed: Product = {
      id: 'p-001',
      name: 'Collar GPS Smart para mascotas',
      image: 'assets/images/products/smartwatch.jpg',
      category: 'mascotas',
      supplier: { name: 'DropiVerified Pet Co.', verified: true },
      cost: 26000,
      suggestedPrice: 89000,
      margin: 71,
      salesWeek: 340,
      trendPct: 23,
      badge: { icon: '🔥', label: 'Más vendido esta semana' },
      reasoning: {
        salesPercentile: 'top 5% Colombia',
        marginRationale: 'Margen 71% supera mínimo recomendado 50%',
        trendNote: '+23% últimas 4 semanas',
      },
      confidence: 91,
    };
    this.selectedProduct.next(seed);
    return seed;
  }

  /** Si no hay persona seleccionada, asigna una por default (Mamá emocional). */
  ensureSelectedPersona(): BuyerPersona {
    if (this.selectedPersona.value) return this.selectedPersona.value;
    const seed: BuyerPersona = {
      id: 'bp-m-001',
      title: 'Mamá preocupada por la seguridad de su mascota',
      age: '28-42',
      location: 'Colombia, ciudades principales',
      pain: 'Mi perro se me escapa y no sé dónde está',
      tone: 'Emocional',
      channel: 'Instagram',
      copyAngle: '¿Sabes dónde está tu perro en este momento?',
      salesShare: 38,
      confidence: 88,
      reasoning: 'Este perfil generó el 38% de ventas en productos similares (LATAM últimos 90 días)',
    };
    this.selectedPersona.next(seed);
    const product = this.ensureSelectedProduct();
    this.strategySummary.next({
      product,
      persona: seed,
      tone: seed.tone,
      channel: seed.channel,
      copyAngle: seed.copyAngle,
      conversionRangeMin: 2.8,
      conversionRangeMax: 4.1,
      basedOnCases: 34,
    });
    return seed;
  }

  /** Asegura que mission existe con un valor mínimo (para que el ribbon avance). */
  ensureMission(): void {
    if (this.mission.value) return;
    this.mission.next({
      id: 'm-001',
      title: 'Encontrar producto ganador',
      totalSteps: 4,
      currentStep: 1,
      currentStepName: 'Producto',
      progressPct: 20,
      steps: [
        { id: 's1', label: 'Producto', status: 'current', pct: 20 },
        { id: 's2', label: 'Estrategia', status: 'locked', pct: 0 },
        { id: 's3', label: 'Creación', status: 'locked', pct: 0 },
        { id: 's4', label: 'Lanzamiento', status: 'locked', pct: 0 },
      ],
      stats: { similarUsersCompleted: 247, avgDays: 2.4 },
    });
  }

  ngOnDestroy(): void {
    this.clearIdleTimer();
  }
}
