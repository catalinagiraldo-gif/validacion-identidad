export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'alert' | 'success';

export type LayoutState = 'hero' | 'workspace';

export type GaliMessageType =
  | 'user'
  | 'gali-text'
  | 'execution'
  | 'reasoning'
  | 'nudge';

export interface GaliMessage {
  id: string;
  type: GaliMessageType;
  text?: string;
  confidence?: number;
  confidenceDetails?: string[];
  streaming?: boolean;
  instant?: boolean;
  timestamp: number;
}

export interface ExecutionStep {
  label: string;
  duration: number;
  status: 'pending' | 'running' | 'done';
  elapsedMs?: number;
}

export interface Learning {
  key: string;
  icon: string;
  label: string;
  detectedBy: string;
  counter?: number;
  timestamp: number;
}

export interface MissionStep {
  id: string;
  label: string;
  status: 'current' | 'done' | 'locked';
  pct: number;
}

export interface Mission {
  id: string;
  title: string;
  totalSteps: number;
  currentStep: number;
  currentStepName: string;
  progressPct: number;
  steps: MissionStep[];
  stats: { similarUsersCompleted: number; avgDays: number };
}

export interface ProductSupplier {
  name: string;
  verified: boolean;
}

export interface ProductReasoning {
  salesPercentile: string;
  marginRationale: string;
  trendNote: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  supplier: ProductSupplier;
  cost: number;
  suggestedPrice: number;
  margin: number;
  salesWeek: number;
  trendPct: number;
  badge: { icon: string; label: string } | null;
  reasoning?: ProductReasoning;
  confidence: number;
}

export interface GaliResponseTemplate {
  message: string;
  confidence: number;
  productIds: string[];
  reasoning: string;
  learning: { icon: string; label: string; key: string } | null;
}

export interface GaliDiscoveryData {
  user: { id: string; name: string; level: string; joinedDays: number; salesCount: number };
  mission: Mission;
  products: Product[];
  responses: Record<string, GaliResponseTemplate>;
  suggestions: {
    hero: string[];
    workspace_default: string[];
    workspace_idle_nudge: string[];
    post_select: string[];
  };
  executionSteps: Record<string, { label: string; duration: number }[]>;
}

// ============================================
// Fase 1 — Modo Estrategia
// ============================================

export type AppMode =
  | 'descubrimiento'
  | 'estrategia'
  | 'creacion'
  | 'lanzamiento'
  | 'dashboard'
  | 'onboarding';

export type PersonaTone = 'Emocional' | 'Racional' | 'Urgente' | 'Aspiracional' | 'Educativo';
export type PersonaChannel = 'Instagram' | 'TikTok' | 'Facebook' | 'WhatsApp';

export interface BuyerPersona {
  id: string;
  title: string;
  age: string;
  location: string;
  pain: string;
  tone: PersonaTone;
  channel: PersonaChannel;
  copyAngle: string;
  salesShare: number;
  confidence: number;
  reasoning: string;
  modified?: boolean;
}

export interface StrategySummary {
  product: Product;
  persona: BuyerPersona;
  tone: PersonaTone;
  channel: PersonaChannel;
  copyAngle: string;
  conversionRangeMin: number;
  conversionRangeMax: number;
  basedOnCases: number;
}

export interface GaliStrategyData {
  personasByCategory: Record<string, BuyerPersona[]>;
  executionSteps: Record<string, { label: string; duration: number }[]>;
  approvalCopy: string;
  approvalConfidenceRanges?: Record<
    string,
    { min: number; max: number; cases: number; confidence: number }
  >;
  messages?: {
    intro?: string;
    personaSelected?: string;
    personaModified?: string;
    approvalReady?: string;
    confirmed?: string;
  };
}

// ============================================
// Fase 2 — Modo Creación
// ============================================

export interface LandingTemplate {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    heroLine?: string;
  };
  benefits: { icon: string; title: string; desc: string }[];
  testimonials: { stars: number; text: string; author: string }[];
  ctaFinal: {
    urgencyText: string;
    price: number;
    priceStruck: number;
    ctaText: string;
  };
  tone: string;
  angle: string;
}

export type CreativeType = 'video' | 'banner' | 'carousel';
export type CreativeRatio = '9:16' | '1:1' | '16:9' | '4:5';

export interface Creative {
  id: string;
  type: CreativeType;
  ratio: CreativeRatio;
  platform: string;
  label: string;
  duration?: string;
  gradient: string[];
  thumbnailEmoji: string;
  isPlus: boolean;
  recommended: boolean;
}

export interface GaliCreationData {
  landingTemplates: Record<string, LandingTemplate>;
  creatives: Creative[];
  executionSteps: Record<string, { label: string; duration: number }[]>;
  messages: {
    intro: string;
    elementEdited: string;
    creativesIntro: string;
    creativeSelected: string;
    ctaProceed: string;
  };
  plusBlock: {
    title: string;
    body: string;
    cta: string;
  };
}

export type LandingElementId =
  | 'hero.headline'
  | 'hero.subheadline'
  | 'hero.ctaText'
  | 'ctaFinal.urgencyText'
  | 'ctaFinal.ctaText';

export type CanvasTab = 'landing' | 'creatives';

// ============================================
// Fase 3 — Modo Lanzamiento
// ============================================

export interface Platform {
  id: string;
  label: string;
  icon: string;
  isDefault: boolean;
}

export interface CampaignAudience {
  country: string;
  age: string;
  interests: string[];
}

export interface CampaignDefaults {
  platforms: Platform[];
  audience: CampaignAudience;
  preFilledValues: { platform: string; budget: number; duration: number };
  budgetRange: { min: number; max: number; step: number };
  durationOptions: number[];
}

export interface RoasPoint {
  budget: number;
  minSales: number;
  maxSales: number;
  minRoas: number;
  maxRoas: number;
  minReach: number;
  maxReach: number;
}

export interface CampaignNotification {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export interface GaliLaunchData {
  campaign: CampaignDefaults;
  roasCurve: RoasPoint[];
  notifications: CampaignNotification[];
  messages: {
    intro: string;
    budgetChanged: string;
    confirmReady: string;
    published: string;
    nextMission: string;
  };
  executionSteps: Record<string, { label: string; duration: number }[]>;
}

export interface RoasEstimate {
  budget: number;
  duration: number;
  totalSpend: number;
  reach: { min: number; max: number };
  sales: { min: number; max: number };
  roas: { min: number; max: number };
}

export interface LaunchResult {
  campaignId: string;
  publishedAt: number;
  estimate: RoasEstimate;
}

// ============================================
// Fase 4 — Dashboard + Onboarding
// ============================================

export interface OnboardingQuestion {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface OnboardingRecommendation {
  missionId: string;
  title: string;
  subtitle: string;
  stats: { completedBy: number; avgDays: number; successRate: number };
  rationale: string;
}

export interface OnboardingData {
  questions: OnboardingQuestion[];
  recommendation: OnboardingRecommendation;
  messages: {
    welcome: string;
    thinking: string;
    recommendationReady: string;
  };
  executionSteps: { label: string; duration: number }[];
}

export interface DashboardCta {
  label: string;
  primary?: boolean;
  route?: string | null;
}

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  icon: string;
  title: string;
  body: string;
  ctas: DashboardCta[];
}

export interface DashboardMission {
  id: string;
  title: string;
  subtitle?: string;
  priority?: string;
  completedBy: number;
  avgDays: number;
  status: 'active' | 'available' | 'completed' | 'locked-plus';
  icon: string;
  progressPct?: number;
  currentStep?: number;
  currentStepName?: string;
  totalSteps?: number;
  nextActionLabel?: string;
  nextActionRoute?: string;
}

export interface DashboardQuickAction {
  label: string;
  icon: string;
  route: string | null;
}

export interface DashboardSnapshot {
  greeting: string;
  subtitle: string;
  activeMission: DashboardMission;
  alerts: DashboardAlert[];
  availableMissions: DashboardMission[];
  quickActions: DashboardQuickAction[];
}

export interface GaliDashboardData {
  user: { id: string; name: string; level: string; joinedDays: number; salesCount: number };
  onboarding: OnboardingData;
  dashboard: DashboardSnapshot;
}

// ============================================
// Fase 5 — Notifications + post-launch tracking
// ============================================

export interface PostLaunchMetrics {
  reach: number;
  impressions: number;
  clicks: number;
  ctr: number;
  sales: number;
  spend: number;
  roas: number;
}

export interface CampaignNotificationEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  metrics: PostLaunchMetrics;
  galiMessage: string;
  recommendations: { label: string; primary?: boolean }[];
  read: boolean;
  timestamp: number;
}

// ============================================
// Fase T1 — Trust Stage
// ============================================

export type TrustStage = 1 | 2;
