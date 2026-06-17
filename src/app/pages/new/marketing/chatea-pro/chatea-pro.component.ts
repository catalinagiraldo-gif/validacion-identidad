import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselSlide {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

interface StatCard {
  value: string;
  label: string;
  desc: string;
}

@Component({
  selector: 'app-chatea-pro-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./chatea-pro.component.scss'],
  template: `
    <div class="page-wrapper">

      <!-- ── Breadcrumb ── -->
      <nav class="breadcrumb" aria-label="breadcrumb">
        <span class="bc-item">Marketing</span>
        <span class="bc-sep">›</span>
        <span class="bc-item bc-item--active">SMS y Correo - Chatea Pro</span>
      </nav>

      <!-- ── Page header ── -->
      <div class="page-header">
        <h1 class="page-title">Chatea Pro</h1>
      </div>

      <!-- ── Hero Banner ── -->
      <section class="banner" (mouseenter)="pauseCarousel()" (mouseleave)="resumeCarousel()">

        <!-- dark gradient overlay (left) -->
        <div class="banner__overlay"></div>

        <!-- Copy: title + subtitle + CTAs -->
        <div class="banner__copy">
          <h2 class="banner__heading">
            Automatiza tu operación con expertos virtuales y vuélvete más rentable con Chatea Pro.
          </h2>
          <p class="banner__subtitle">
            Confirma órdenes, recupera carritos y vende 24/7 por WhatsApp. Aumenta tu rentabilidad con el único sistema automatizado diseñado para la logística de tu e-commerce.
          </p>
          <div class="banner__ctas">
            <a href="https://chateapro.com/" target="_blank" rel="noopener noreferrer" class="btn-start">
              Comienza ahora
              <img src="assets/images/chatea-pro/icons/external-link.svg" alt="" class="btn-icon" />
            </a>
            <a href="https://www.youtube.com/watch?v=0g3GvH9rf-8" target="_blank" rel="noopener noreferrer" class="btn-watch">
              Ver como funciona
              <img src="assets/images/chatea-pro/icons/play.svg" alt="" class="btn-icon" />
            </a>
          </div>
        </div>

        <!-- Carousel: benefit cards (absolute, bottom-left of banner) -->
        <div class="carousel">
          <div class="carousel__track">
            <div
              *ngFor="let slide of slides; let i = index"
              class="carousel__slide"
              [class.carousel__slide--active]="i === currentSlide"
              [class.carousel__slide--prev]="i === prevIndex"
            >
              <div class="carousel__icon-wrap">
                <img [src]="'assets/images/chatea-pro/icons/' + slide.icon + '.svg'" alt="" class="carousel__icon" />
              </div>
              <div class="carousel__text">
                <div class="carousel__title-row">
                  <span class="carousel__title">{{ slide.title }}</span>
                  <span *ngIf="slide.tag" class="carousel__tag">{{ slide.tag }}</span>
                </div>
                <p class="carousel__desc">{{ slide.description }}</p>
              </div>
            </div>
          </div>

          <!-- Dots -->
          <div class="carousel__dots">
            <button
              *ngFor="let slide of slides; let i = index"
              class="carousel__dot"
              [class.carousel__dot--active]="i === currentSlide"
              (click)="goTo(i)"
              [attr.aria-label]="'Ir a ' + slide.title"
            ></button>
          </div>

          <!-- Navigation arrows -->
          <div class="carousel__nav">
            <button class="carousel__arrow" (click)="prevSlide()" aria-label="Anterior">
              <img src="assets/images/chatea-pro/icons/arrow-left.svg" alt="" />
            </button>
            <button class="carousel__arrow" (click)="nextSlide()" aria-label="Siguiente">
              <img src="assets/images/chatea-pro/icons/arrow-right.svg" alt="" />
            </button>
          </div>
        </div>

        <!-- Phone mockup (right side) -->
        <div class="banner__phone">
          <div class="phone-screen">
            <img
              src="assets/images/chatea-pro/chat-bg.png"
              alt=""
              class="phone-chat-bg"
            />
          </div>
          <img
            src="assets/images/chatea-pro/phone-mockup.png"
            alt="Chatea Pro en acción"
            class="phone-frame"
          />
          <img
            src="assets/images/chatea-pro/coin.png"
            alt=""
            class="coin"
          />
        </div>

      </section>

      <!-- ── Stats cards ── -->
      <section class="stats-section">
        <h3 class="stats-title">¡Lleva tu ecosistema a otro nivel con Chatea Pro!</h3>
        <div class="stats-grid">
          <div
            class="stat-card"
            *ngFor="let stat of stats; let i = index"
            [style.animation-delay]="(i * 80) + 'ms'"
          >
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
            <p class="stat-desc">{{ stat.desc }}</p>
          </div>
        </div>
      </section>

    </div>
  `,
})
export class ChateaProNewComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  prevIndex = -1;
  private autoTimer: ReturnType<typeof setInterval> | null = null;
  private paused = false;

  slides: CarouselSlide[] = [
    {
      icon: 'callcenter',
      title: 'Asistente Logístico',
      description:
        'Aumenta tus entregas confirmando pedidos de alta probabilidad, rastrea envíos, avisa al cliente sobre el estado del pedido y soluciona novedades fácilmente.',
    },
    {
      icon: 'cart-check',
      title: 'Recuperador de Carritos',
      description:
        'Rescata todas esas ventas que estaban a punto de perderse porque el cliente inició la compra pero no la completó.',
    },
    {
      icon: 'comments',
      title: 'Gestor de Comentarios',
      description:
        'Mantiene un ecosistema sano: elimina los malos comentarios que encarecen tu pauta publicitaria y vende respondiendo automáticamente a los clientes interesados en tus redes sociales.',
    },
    {
      icon: 'whatsapp',
      title: 'Vendedor por WhatsApp',
      description:
        'Lanza campañas más económicas y fáciles de configurar que una landing page. Aumenta la confianza del cliente y logra tasas de conversión de hasta un 10% con embudos optimizados.',
    },
    {
      icon: 'target',
      title: 'Remarketing',
      description:
        'Contacta a tu base de datos de compradores para ofrecerles nuevos productos. Sé rentable sin depender de invertir constantemente en pauta publicitaria.',
      tag: 'Próximamente',
    },
  ];

  stats: StatCard[] = [
    {
      value: '+2,000',
      label: 'tiendas activas',
      desc: 'Automatiza tus ventas por WhatsApp. Recupera carritos y vende 24/7 con agentes virtuales.',
    },
    {
      value: '+80%',
      label: 'pedidos confirmados',
      desc: 'Confirma pedidos automáticamente con mensajes personalizados y aumenta tu tasa de éxito.',
    },
    {
      value: '+30%',
      label: 'carritos recuperados',
      desc: 'Recupera carritos abandonados con recordatorios automáticos y convierte más ventas perdidas.',
    },
    {
      value: '+10%',
      label: 'conversión',
      desc: 'Aumenta tu rentabilidad con embudos de venta optimizados y campañas de WhatsApp.',
    },
  ];

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private startAutoPlay(): void {
    this.autoTimer = setInterval(() => {
      if (!this.paused) {
        this.advance();
      }
    }, 2000);
  }

  private stopAutoPlay(): void {
    if (this.autoTimer !== null) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  private advance(): void {
    this.prevIndex = this.currentSlide;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  nextSlide(): void {
    this.prevIndex = this.currentSlide;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.prevIndex = this.currentSlide;
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goTo(index: number): void {
    this.prevIndex = this.currentSlide;
    this.currentSlide = index;
  }

  pauseCarousel(): void {
    this.paused = true;
  }

  resumeCarousel(): void {
    this.paused = false;
  }
}
