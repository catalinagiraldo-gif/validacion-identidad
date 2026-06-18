import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Provider {
  name: string;
  avatar: string;
  badge: 'verified' | 'star';
}

interface QuickAction {
  label: string;
  icon: string;
}

interface CountryChip {
  code: string;
  label: string;
  special: boolean;
}

interface StatChip {
  value: string;
  label: string;
}

interface ProjectCard {
  name: string;
  subtitle: string;
  description: string;
  dateCreated: string;
  status: string;
  countries: CountryChip[];
  keyDifferences: string[];
  stats: StatChip[];
  folderQuery: string;
}

@Component({
  selector: 'app-home-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./home.component.scss'],
  template: `
    <div class="page-wrapper">
      <h1 class="greeting">{{ greeting }}</h1>

      <div class="home-layout">
        <!-- LEFT COLUMN (765px) -->
        <div class="home-main">

          <!-- RPP Active Projects -->
          <section class="rpp-projects">
            <h2 class="section-label">Proyecto activo</h2>
            <a
              *ngFor="let p of activeProjects; let i = index"
              class="project-card"
              [routerLink]="['/gallery']"
              [queryParams]="{ folder: p.folderQuery }"
              [style.animation-delay]="(i * 80 + 120) + 'ms'"
            >
              <div class="project-card__header">
                <span class="project-card__status-badge">{{ p.status }}</span>
                <span class="project-card__type-tag">KYC · KYB · KYT</span>
              </div>

              <div class="project-card__title-row">
                <span class="project-card__icon">🪪</span>
                <div>
                  <h3 class="project-card__name">{{ p.name }}</h3>
                  <p class="project-card__subtitle">{{ p.subtitle }}</p>
                </div>
              </div>

              <p class="project-card__desc">{{ p.description }}</p>

              <div class="project-card__countries">
                <span
                  *ngFor="let c of p.countries"
                  class="country-chip"
                  [class.country-chip--special]="c.special"
                  [title]="c.special ? 'Colombia: flujo mixto Truora + Sumsub' : 'Sumsub puro'"
                >{{ c.code }}</span>
              </div>

              <div class="project-card__diff-alert">
                <i class="pi pi-info-circle"></i>
                <div class="diff-lines">
                  <span *ngFor="let d of p.keyDifferences">{{ d }}</span>
                </div>
              </div>

              <div class="project-card__stats">
                <div class="stat-chip" *ngFor="let s of p.stats">
                  <span class="stat-chip__value">{{ s.value }}</span>
                  <span class="stat-chip__label">{{ s.label }}</span>
                </div>
              </div>

              <div class="project-card__footer">
                <span class="project-card__date">
                  <i class="pi pi-calendar"></i> {{ p.dateCreated }}
                </span>
                <span class="project-card__cta">
                  Ver prototipos <i class="pi pi-arrow-right"></i>
                </span>
              </div>
            </a>
          </section>

          <!-- Alert banner (765x68) -->
          <div class="alert-banner">
            <div class="alert-icon">
              <img
                src="assets/images/home/icon-megaphone.svg"
                alt="Megaphone"
                width="24"
                height="24"
              />
            </div>
            <p class="alert-text">{{ alertMessage }}</p>
          </div>

          <!-- Quick actions (765x102) — 4 buttons -->
          <div class="quick-actions">
            <div
              class="quick-action"
              *ngFor="let action of quickActions"
            >
              <img
                class="quick-action-icon"
                [src]="'assets/images/home/' + action.icon"
                [alt]="action.label"
              />
              <span class="quick-action-label">{{ action.label }}</span>
            </div>
          </div>

          <!-- Two-column section (765x406) -->
          <div class="two-columns">
            <!-- Proveedores destacados (366.5x406) -->
            <div class="providers-section">
              <h2 class="section-title">Proveedores destacados de la semana</h2>
              <div class="providers-card">
                <div
                  class="provider-row"
                  *ngFor="let provider of providers; let last = last"
                  [class.provider-row--last]="last"
                >
                  <div class="provider-info">
                    <div class="provider-avatar-wrapper">
                      <img
                        class="provider-avatar"
                        [src]="'assets/images/home/' + provider.avatar"
                        [alt]="provider.name"
                      />
                      <img
                        class="provider-badge"
                        [src]="'assets/images/home/badge-' + provider.badge + '.png'"
                        [alt]="provider.badge"
                      />
                    </div>
                    <span class="provider-name">{{ provider.name }}</span>
                  </div>
                  <button class="btn-contact">Contactar</button>
                </div>
              </div>
            </div>

            <!-- Nueva actualizacion (366.5x406) -->
            <div class="update-section">
              <h2 class="section-title">Nueva actualizacion</h2>
              <div class="update-card">
                <img
                  class="update-banner"
                  src="assets/images/home/banner-tiendanube.png"
                  alt="Tienda Nube"
                />
                <div class="update-content">
                  <h3 class="update-title">Tienda Nube</h3>
                  <p class="update-description">
                    Descubre la nueva integracion con Tienda Nube. Ahora puedes
                    sincronizar tus productos, gestionar inventario y
                    procesar pedidos directamente desde Dropi.
                  </p>
                  <button class="btn-manual">Ver manual</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDEBAR BANNER (363x624) -->
        <aside class="sidebar-banner">
          <img
            class="sidebar-banner-img"
            src="assets/images/home/slide-colombia.png"
            alt="Bienvenidos a Dropi Colombia"
          />
        </aside>
      </div>
    </div>
  `,
})
export class HomeNewComponent {
  greeting = '¡Hola, Alejandra!';

  alertMessage =
    '🚨¡Nueva actualizacion Dropify - Tienda Nube! Ahora puedes configurar tus pagos';

  activeProjects: ProjectCard[] = [
    {
      name: 'Flujo de Validación · v5',
      subtitle: 'KYC · KYB · 15 vistas · 2026-06-18',
      description:
        'Prototipo completo basado en spec Plan1.md: flujo end-to-end de 15 vistas — entrada, datos readonly, solicitud de actualización (MFA), formulario 2 pasos, confirmación pre-Sumsub, WebSDK mock, 6 estados y apelación.',
      dateCreated: '18 de junio, 2026',
      status: 'Nuevo',
      folderQuery: 'verificacion-identidad',
      countries: [
        { code: 'CO', label: 'Colombia', special: true },
        { code: 'CL', label: 'Chile', special: false },
        { code: 'EC', label: 'Ecuador', special: false },
        { code: 'MX', label: 'México', special: false },
        { code: 'AR', label: 'Argentina', special: false },
      ],
      keyDifferences: [
        'Vista 7 nueva: confirmación antes de disparar Sumsub (prevención de errores críticos)',
        'Vista 3 nueva: solicitud de actualización en autoservicio (reemplaza Intercom)',
        'Vista 10: motivo de rechazo categorizado + contador de intentos',
      ],
      stats: [
        { value: '15', label: 'vistas' },
        { value: '5', label: 'países' },
        { value: '6', label: 'estados' },
        { value: '2', label: 'pasos form' },
      ],
    },
    {
      name: 'Migración Sumsub',
      subtitle: 'Validación KYC / KYB',
      description:
        'Migrar la validación de identidad de Truora a Sumsub para obtener cobertura global (240+ países), flujos KYC/KYB/KYT unificados y reducción de la validación manual del 40% actual en Colombia.',
      dateCreated: '13 de enero, 2026',
      status: 'En revisión',
      folderQuery: 'verificacion-identidad',
      countries: [
        { code: 'CO', label: 'Colombia', special: true },
        { code: 'CL', label: 'Chile', special: false },
        { code: 'EC', label: 'Ecuador', special: false },
        { code: 'MX', label: 'México', special: false },
        { code: 'AR', label: 'Argentina', special: false },
      ],
      keyDifferences: [
        'Colombia: Truora (KYC natural) + Sumsub (KYB) — único país con flujo mixto',
        'Resto de países: Sumsub puro (KYC + KYB)',
        'Info tributaria: solo CO (régimen + responsabilidad), MX (régimen fiscal) y AR (IVA)',
      ],
      stats: [
        { value: '4', label: 'prototipos' },
        { value: '3', label: 'flujos' },
        { value: '14', label: 'campos comunes' },
        { value: '5', label: 'países' },
      ],
    },
  ];

  quickActions: QuickAction[] = [
    { label: 'Encuentra productos', icon: 'action-encuentra.png' },
    { label: 'Gestionar ordenes', icon: 'action-gestionar.png' },
    { label: 'Metrica de ventas', icon: 'action-metrica.png' },
    { label: 'Aprende con Academy', icon: 'action-academy.png' },
  ];

  providers: Provider[] = [
    { name: 'Prendas Control', avatar: 'avatar-prendas.png', badge: 'verified' },
    { name: 'Faka Store', avatar: 'avatar-faka.png', badge: 'star' },
    { name: 'D&S GROUP COLOMBIA', avatar: 'avatar-dsg.png', badge: 'verified' },
    { name: 'Perfumeria Glow', avatar: 'avatar-cachy.png', badge: 'star' },
  ];
}
