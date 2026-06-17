import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

interface Landing {
  id: string;
  nombre: string;
  producto: string;
  estado: 'live' | 'borrador' | 'pausada';
  visitas: number;
  conversion: number;
  ventas: number;
  actualizada: string;
  thumb: string;
}

const SEED: Landing[] = [
  { id: 'l1', nombre: 'Collar GPS — mamá segura',     producto: 'Collar GPS para mascota', estado: 'live',     visitas: 2840, conversion: 3.2, ventas: 41, actualizada: '2026-05-22', thumb: '🐾' },
  { id: 'l2', nombre: 'Silla ergonómica — home office', producto: 'Silla ergonómica',        estado: 'live',     visitas: 1120, conversion: 1.4, ventas: 8,  actualizada: '2026-05-19', thumb: '💼' },
  { id: 'l3', nombre: 'Lámpara solar — verano',          producto: 'Lámpara solar plegable',  estado: 'borrador', visitas: 0,    conversion: 0,   ventas: 0,  actualizada: '2026-05-25', thumb: '☀️' },
  { id: 'l4', nombre: 'Aire frío — Caribe',              producto: 'Aire frío portátil',      estado: 'pausada',  visitas: 480,  conversion: 0.8, ventas: 1,  actualizada: '2026-05-10', thumb: '❄️' },
];

@Component({
  selector: 'app-gali-v3-landings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landings.component.html',
  styleUrls: ['./landings.component.scss'],
})
export class GaliV3LandingsComponent {
  landings = signal<Landing[]>(SEED);

  promptAbierto = signal(false);
  prompt = signal('');
  productoSugerido = signal('Collar GPS para mascota');
  generando = signal(false);
  previewVisible = signal(false);

  abrirPrompt() {
    this.promptAbierto.set(true);
    this.prompt.set('');
    this.previewVisible.set(false);
  }
  cerrarPrompt() {
    this.promptAbierto.set(false);
    this.generando.set(false);
    this.previewVisible.set(false);
  }

  generar() {
    if (!this.prompt().trim()) return;
    this.generando.set(true);
    setTimeout(() => {
      this.generando.set(false);
      this.previewVisible.set(true);
    }, 1100);
  }

  publicar() {
    const nueva: Landing = {
      id: 'l' + (this.landings().length + 1),
      nombre: this.prompt().slice(0, 48) || 'Landing nueva',
      producto: this.productoSugerido(),
      estado: 'live',
      visitas: 0,
      conversion: 0,
      ventas: 0,
      actualizada: '2026-05-26',
      thumb: '✦',
    };
    this.landings.update(list => [nueva, ...list]);
    this.cerrarPrompt();
  }

  formatoNum(n: number): string {
    return new Intl.NumberFormat('es-CO').format(n);
  }

  labelEstado(e: Landing['estado']): string {
    return e === 'live' ? 'LIVE' : e === 'borrador' ? 'DRAFT' : 'PAUSADA';
  }
}
