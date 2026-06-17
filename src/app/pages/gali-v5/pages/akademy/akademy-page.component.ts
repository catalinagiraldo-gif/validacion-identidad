import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GaliStateService } from '../../services/gali-state.service';
import { inject } from '@angular/core';

interface Course {
  id: string;
  title: string;
  desc: string;
  duration: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  agent?: string;
  agentRec?: boolean;
  completed?: boolean;
  progress?: number;
  category: string;
  instructor: string;
}

const AKADEMY_PROGRESS_KEY = 'gali_akademy_progress';

@Component({
  selector: 'app-akademy-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './akademy-page.component.html',
  styleUrl: './akademy-page.component.scss',
})
export class AkademyPageComponent implements OnInit {
  private gali = inject(GaliStateService);

  readonly activeTab = signal<'para-ti' | 'todos' | 'mis-cursos'>('para-ti');
  readonly progressMap = signal<Record<string, number>>({});

  readonly galiRec: Course = {
    id: 'pl-real-meta',
    title: 'Optimización de P&L real en Meta Ads',
    desc: 'Aprende a calcular el margen real después de novedades, flete y devoluciones — y usa esa cifra para decidir cuándo escalar o pausar.',
    duration: '38 min',
    level: 'Avanzado',
    agent: 'Gali',
    agentRec: true,
    category: 'Finanzas',
    instructor: 'Andrés Ospina',
  };

  readonly courses: Course[] = [
    {
      id: 'roas-real',
      title: 'ROAS real vs ROAS declarado',
      desc: 'Entiende por qué Meta miente y cómo cruzar datos con Dropi para ver el ROAS real.',
      duration: '24 min',
      level: 'Intermedio',
      category: 'Performance',
      instructor: 'Laura Medina',
      agentRec: false,
    },
    {
      id: 'novedad-manejo',
      title: 'Manejo de novedades: estrategia logística',
      desc: 'Cómo reducir el costo de novedad con routing inteligente y contratos con transportadoras.',
      duration: '31 min',
      level: 'Intermedio',
      agent: 'Vigilante',
      agentRec: true,
      category: 'Logística',
      instructor: 'Carlos Vega',
    },
    {
      id: 'whatsapp-confirmacion',
      title: 'Confirmaciones en WhatsApp: guion de oro',
      desc: 'El guion exacto para confirmar pedidos y solicitar anticipos sin fricción.',
      duration: '19 min',
      level: 'Básico',
      agent: 'Chatea Pro',
      agentRec: true,
      category: 'Ventas',
      instructor: 'Camila Torres',
    },
    {
      id: 'escalar-meta',
      title: 'Escalar campañas en Meta sin quemarse',
      desc: 'Cuándo subir presupuesto, cuándo pausar y cómo usar los skills de Roax para hacerlo automático.',
      duration: '42 min',
      level: 'Avanzado',
      agent: 'Roax',
      agentRec: true,
      category: 'Marketing',
      instructor: 'Andrés Ospina',
    },
    {
      id: 'producto-ganador',
      title: 'Cómo encontrar tu primer producto ganador',
      desc: 'El framework de ADA Spy para identificar productos con ventana abierta y margen real.',
      duration: '28 min',
      level: 'Básico',
      agent: 'ADA Spy',
      agentRec: false,
      category: 'Productos',
      instructor: 'Sofía Ramírez',
    },
    {
      id: 'skills-intro',
      title: 'Introducción a Skills de Gali',
      desc: 'Crea tu primera skill en 10 minutos: trigger, condición y acción. Sin código.',
      duration: '15 min',
      level: 'Básico',
      category: 'Automatización',
      instructor: 'Equipo Dropi',
      progress: 80,
    },
    {
      id: 'creativo-ugc',
      title: 'Creativos UGC que convierten',
      desc: 'Estructura el brief perfecto para que tu UGC tenga CTR por encima del 1.5%.',
      duration: '22 min',
      level: 'Intermedio',
      category: 'Marketing',
      instructor: 'Laura Medina',
    },
    {
      id: 'proveedor-negociacion',
      title: 'Negociación con proveedores',
      desc: 'Cómo conseguir exclusividad, mejores precios y stock garantizado.',
      duration: '35 min',
      level: 'Avanzado',
      category: 'Productos',
      instructor: 'Carlos Vega',
    },
  ];

  readonly myCourses: Course[] = [
    { ...this.courses[5], progress: 80, completed: false },
    { ...this.courses[0], progress: 100, completed: true },
  ];

  readonly levelColors: Record<string, string> = {
    'Básico': '#16a34a',
    'Intermedio': '#f59e0b',
    'Avanzado': '#ef4444',
  };

  readonly agentColors: Record<string, string> = {
    'Roax': '#f97316',
    'Vigilante': '#fbbf24',
    'Chatea Pro': '#34d399',
    'ADA Spy': '#9ca3af',
    'Gali': '#ff6102',
  };

  askGali(): void {
    this.gali.togglePanel();
    setTimeout(() => this.gali.sendMessage('¿Qué debo aprender en Akademy?'), 300);
  }

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem(AKADEMY_PROGRESS_KEY);
      if (raw) this.progressMap.set(JSON.parse(raw));
    } catch { /* ignore */ }
  }

  courseProgress(course: Course): number {
    return this.progressMap()[course.id] ?? course.progress ?? 0;
  }

  startCourse(course: Course): void {
    const next = Math.min(100, (this.courseProgress(course) || 0) + 12);
    this.progressMap.update(m => {
      const updated = { ...m, [course.id]: next };
      localStorage.setItem(AKADEMY_PROGRESS_KEY, JSON.stringify(updated));
      return updated;
    });
    this.gali.togglePanel();
    setTimeout(() => this.gali.sendMessage(`Empiezo el curso: ${course.title} (${next}% completado)`), 300);
  }
}
