import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GaliMarkComponent } from '../gali-mark/gali-mark.component';
import { MaestriaService, MaestriaNivel } from '../../../services/gali-v2/maestria.service';
import { MemoriaService } from '../../../services/gali-v2/memoria.service';
import { SenalesService } from '../../../services/gali-v2/senales.service';
import { PerfilService } from '../../../services/gali-v2/perfil.service';

interface DockItem {
  ruta: string;
  label: string;
  hint: string;
  kbd?: string;
  glyph: 'lienzo' | 'proyectos' | 'novedades' | 'playground' | 'onboarding';
}

@Component({
  selector: 'gali-dock',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, GaliMarkComponent],
  templateUrl: './gali-dock.component.html',
  styleUrls: ['./gali-dock.component.scss'],
})
export class GaliDockComponent {
  private maestria = inject(MaestriaService);
  private memoria = inject(MemoriaService);
  private senales = inject(SenalesService);
  private perfil = inject(PerfilService);
  private router = inject(Router);

  readonly nivel = toSignal(this.maestria.nivel$, { initialValue: this.maestria.nivel });
  readonly proyectos = toSignal(this.memoria.projects$, { initialValue: this.memoria.projects });
  readonly senalesVal = toSignal(this.senales.senales$, { initialValue: this.senales.senales });
  readonly perfilVal = toSignal(this.perfil.perfil$, { initialValue: this.perfil.perfil });

  readonly items: DockItem[] = [
    { ruta: '/gali-v2',                     label: 'Lienzo',     hint: 'Tu punto de partida',                       kbd: 'G L', glyph: 'lienzo' },
    { ruta: '/gali-v2/proyectos',           label: 'Proyectos',  hint: 'Lo que Gali recuerda contigo',              kbd: 'G P', glyph: 'proyectos' },
    { ruta: '/gali-v2/novedades',           label: 'Novedades',  hint: 'Triage en 3 zonas',                          kbd: 'G N', glyph: 'novedades' },
    { ruta: '/gali-v2/playground-maestria', label: 'Maestría',   hint: 'La voz adaptativa lado a lado',             kbd: 'G M', glyph: 'playground' },
    { ruta: '/gali-v2/onboarding',          label: 'Conóceme',   hint: 'Onboarding · 3 preguntas',                  kbd: 'G O', glyph: 'onboarding' },
  ];

  readonly niveles: MaestriaNivel[] = ['aprendiz', 'operador', 'estratega'];

  setNivel(n: MaestriaNivel) { this.maestria.setNivel(n); }

  // Badge counts visibles en el dock
  badge(glyph: DockItem['glyph']): number | null {
    if (glyph === 'novedades') {
      // mock: el número de "pendientes" es 3 según el seed JSON
      return 3;
    }
    if (glyph === 'proyectos') {
      const act = this.proyectos().filter(p => p.status === 'activo').length;
      return act > 0 ? act : null;
    }
    if (glyph === 'onboarding' && !this.perfilVal()) return 1;
    return null;
  }

  trackByRuta(_i: number, it: DockItem) { return it.ruta; }

  // --- Atajos de teclado: G seguido de inicial (estilo Linear/GitHub) ---
  private gPressedAt = 0;

  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    // Ignorar si está escribiendo en input/textarea
    const target = ev.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    const k = ev.key.toLowerCase();
    if (k === 'g') {
      this.gPressedAt = Date.now();
      return;
    }
    if (Date.now() - this.gPressedAt < 1200) {
      const map: Record<string, string> = {
        l: '/gali-v2',
        p: '/gali-v2/proyectos',
        n: '/gali-v2/novedades',
        m: '/gali-v2/playground-maestria',
        o: '/gali-v2/onboarding',
      };
      if (map[k]) {
        ev.preventDefault();
        this.router.navigateByUrl(map[k]);
        this.gPressedAt = 0;
      }
    }
  }
}
