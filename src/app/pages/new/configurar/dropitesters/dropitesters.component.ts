import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  rating: number;
  quote: string;
  photo: string;
  photoPosition: string;
  position: 'top-left' | 'mid-left' | 'bottom-left' | 'top-right' | 'mid-right' | 'bottom-right';
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-dropitesters-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dropitesters.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configurar</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Dropi Testers</span>
      </nav>

      <h1 class="page-title">Dropi Testers</h1>

      <div class="hero-card">
        <div class="hero-grid-bg"></div>

        <div class="polaroid-grid">
          <div
            class="polaroid"
            *ngFor="let t of testimonials"
            [ngClass]="'polaroid--' + t.position"
          >
            <div class="polaroid-photo" [style.background-image]="'url(' + t.photo + ')'" [style.background-position]="t.photoPosition"></div>
            <div class="polaroid-caption">
              <span class="polaroid-name">{{ t.name }}</span>
              <span class="polaroid-stars">
                <i class="pi pi-star-fill" *ngFor="let s of starsArray(t.rating)"></i>
                <i class="pi pi-star" *ngFor="let s of emptyStarsArray(t.rating)"></i>
              </span>
              <p class="polaroid-quote">{{ t.quote }}</p>
            </div>
          </div>
        </div>

        <div class="hero-content">
          <img src="/assets/images/configurar/mascot-avatar.svg" alt="" class="hero-mascot" />
          <h2 class="hero-title">
            Únete a <span class="hero-title-accent">DropiTesters</span>
          </h2>
          <p class="hero-subtitle">
            Conviértete en la voz de nuestra comunidad y <strong>prueba herramientas exclusivas antes de su lanzamiento.</strong>
          </p>
          <div class="hero-actions">
            <button class="btn-primary">
              Conviértete en tester
              <i class="pi pi-arrow-right"></i>
            </button>
            <button class="btn-secondary">
              <i class="pi pi-play-circle"></i>
              Ver cómo funciona
            </button>
          </div>
        </div>

        <div class="benefits-row">
          <div class="benefit-card" *ngFor="let b of benefits">
            <span class="benefit-icon">
              <i [class]="b.icon"></i>
            </span>
            <div class="benefit-text">
              <span class="benefit-title">{{ b.title }}</span>
              <span class="benefit-description">{{ b.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DropitestersNewComponent {
  testimonials: Testimonial[] = [
    {
      name: 'David M',
      rating: 4,
      quote: 'Probar el nuevo Caos me ayuda a ver que mis esfuerzos son un aporte real.',
      photo: '/assets/images/configurar/dropitesters/tester-6.png',
      photoPosition: '0% 0%',
      position: 'top-left',
    },
    {
      name: 'Laura G.',
      rating: 4,
      quote: 'Testear la huella digital me hace sentir que protejo el éxito de todos.',
      photo: '/assets/images/configurar/dropitesters/tester-5.png',
      photoPosition: '50% 0%',
      position: 'mid-left',
    },
    {
      name: 'Carolina F.',
      rating: 5,
      quote: 'Probar las betas en exclusiva me ayuda a liderar e impulsar mi tienda.',
      photo: '/assets/images/configurar/dropitesters/tester-5.png',
      photoPosition: '50% 50%',
      position: 'bottom-left',
    },
    {
      name: 'Felipe T.',
      rating: 4,
      quote: 'Gracias a nuestras pruebas, la plataforma es más ágil. Dropi es nuestro mejor aliado.',
      photo: '/assets/images/configurar/dropitesters/tester-5.png',
      photoPosition: '100% 0%',
      position: 'top-right',
    },
    {
      name: 'Diego J.',
      rating: 5,
      quote: 'Aquí conecto con los líderes. Juntos somos la guía que perfecciona la logística.',
      photo: '/assets/images/configurar/dropitesters/tester-6.png',
      photoPosition: '100% 50%',
      position: 'mid-right',
    },
    {
      name: 'Mateo C.',
      rating: 5,
      quote: 'Ser Tester es tener el mapa en las manos y trazar la ruta del éxito.',
      photo: '/assets/images/configurar/dropitesters/tester-7.png',
      photoPosition: '50% 50%',
      position: 'bottom-right',
    },
  ];

  benefits: Benefit[] = [
    {
      icon: 'pi pi-credit-card',
      title: 'Accede primero',
      description: 'Prueba nuestras nuevas herramientas antes que nadie.',
    },
    {
      icon: 'pi pi-pencil',
      title: 'Construyamos juntos',
      description: 'Comparte tu experiencia y co-crea con nosotros Dropi.',
    },
    {
      icon: 'pi pi-star',
      title: 'Sé un referente',
      description: 'Destaca en la comunidad y conviértete en un Top Tester.',
    },
  ];

  starsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  emptyStarsArray(rating: number): number[] {
    return Array(Math.max(0, 5 - rating)).fill(0);
  }
}
