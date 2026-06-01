import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Course {
  title: string;
  lessons: number;
  duration: string;
  progress: number;
  level: string;
  color: string;
}

@Component({
  selector: 'app-academy-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./academy.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-link">Home</span>
        <span class="breadcrumb-sep">&gt;</span>
        <span class="breadcrumb-current">Academy</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Academy</h1>

      <!-- Hero banner -->
      <div class="hero-banner">
        <div class="hero-content">
          <h2 class="hero-title">Aprende con Dropi Academy</h2>
          <p class="hero-subtitle">
            Cursos, tutoriales y recursos para dominar el dropshipping
          </p>
          <button class="hero-btn">Explorar cursos</button>
        </div>
        <div class="hero-decoration">
          <div class="hero-circle hero-circle--1"></div>
          <div class="hero-circle hero-circle--2"></div>
        </div>
      </div>

      <!-- Main layout: courses + sidebar -->
      <div class="academy-layout">
        <!-- Course grid -->
        <div class="courses-section">
          <h2 class="section-title">Cursos disponibles</h2>
          <div class="course-grid">
            <div class="course-card" *ngFor="let course of courses">
              <div
                class="course-thumbnail"
                [style.background]="
                  'linear-gradient(135deg, ' +
                  course.color +
                  ' 0%, ' +
                  course.color +
                  'CC 100%)'
                "
              >
                <span class="course-level-badge">{{ course.level }}</span>
              </div>
              <div class="course-body">
                <h3 class="course-title">{{ course.title }}</h3>
                <span class="course-meta">
                  {{ course.lessons }} lecciones &bull; {{ course.duration }}
                </span>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    [style.width.%]="course.progress"
                  ></div>
                </div>
                <div class="course-footer">
                  <span class="progress-text">{{ course.progress }}%</span>
                  <a class="course-action" href="javascript:void(0)">
                    {{ course.progress > 0 ? 'Continuar' : 'Comenzar' }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories sidebar -->
        <aside class="categories-sidebar">
          <h3 class="sidebar-title">Categorias</h3>
          <div class="category-tags">
            <span
              class="category-tag"
              *ngFor="let cat of categories; let i = index"
              [class.category-tag--active]="i === 0"
            >
              {{ cat }}
            </span>
          </div>

          <h3 class="sidebar-title sidebar-title--spaced">Tu progreso</h3>
          <div class="progress-summary">
            <div class="progress-stat">
              <span class="stat-value">2</span>
              <span class="stat-label">En progreso</span>
            </div>
            <div class="progress-stat">
              <span class="stat-value">1</span>
              <span class="stat-label">Completado</span>
            </div>
            <div class="progress-stat">
              <span class="stat-value">3</span>
              <span class="stat-label">Por iniciar</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
})
export class AcademyNewComponent {
  categories = [
    'Principiante',
    'Intermedio',
    'Avanzado',
    'Marketing',
    'Logistica',
    'Productos',
  ];

  courses: Course[] = [
    {
      title: 'Introduccion al Dropshipping',
      lessons: 12,
      duration: '2h 30min',
      progress: 75,
      level: 'Principiante',
      color: '#FF6102',
    },
    {
      title: 'Gestion de Pedidos Avanzada',
      lessons: 8,
      duration: '1h 45min',
      progress: 30,
      level: 'Intermedio',
      color: '#008DBF',
    },
    {
      title: 'Marketing Digital para Dropi',
      lessons: 15,
      duration: '3h 00min',
      progress: 0,
      level: 'Avanzado',
      color: '#0ABB87',
    },
    {
      title: 'Logistica y Transportadoras',
      lessons: 10,
      duration: '2h 00min',
      progress: 100,
      level: 'Intermedio',
      color: '#F1B44C',
    },
    {
      title: 'Optimizacion de Catalogo',
      lessons: 6,
      duration: '1h 15min',
      progress: 50,
      level: 'Principiante',
      color: '#50A5F1',
    },
    {
      title: 'Estrategias de Venta',
      lessons: 9,
      duration: '1h 50min',
      progress: 0,
      level: 'Avanzado',
      color: '#F46A6B',
    },
  ];
}
