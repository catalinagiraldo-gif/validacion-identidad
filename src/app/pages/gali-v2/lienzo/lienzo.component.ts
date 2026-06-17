import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GaliMarkComponent } from '../../../components/gali-v2/gali-mark/gali-mark.component';
import { GaliHeaderInputComponent } from '../../../components/gali-v2/gali-header-input/gali-header-input.component';
import { GaliResponseOverlayComponent } from '../../../components/gali-v2/gali-response-overlay/gali-response-overlay.component';
import { MaestriaService, MaestriaNivel } from '../../../services/gali-v2/maestria.service';
import { MemoriaService } from '../../../services/gali-v2/memoria.service';
import { SenalesService } from '../../../services/gali-v2/senales.service';
import { PerfilService } from '../../../services/gali-v2/perfil.service';

@Component({
  selector: 'app-lienzo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe,
    GaliMarkComponent,
    GaliHeaderInputComponent,
    GaliResponseOverlayComponent,
  ],
  templateUrl: './lienzo.component.html',
  styleUrls: ['./lienzo.component.scss'],
})
export class LienzoComponent {
  private maestria = inject(MaestriaService);
  private memoria = inject(MemoriaService);
  private senalesSvc = inject(SenalesService);
  private perfilSvc = inject(PerfilService);

  readonly nivel$ = this.maestria.nivel$;
  readonly persona$ = this.maestria.persona$;
  readonly niveles: MaestriaNivel[] = ['aprendiz', 'operador', 'estratega'];
  readonly proyectos$ = this.memoria.projects$;
  readonly senales$ = this.senalesSvc.senales$;
  readonly perfil$ = this.perfilSvc.perfil$;

  setNivel(n: MaestriaNivel) {
    this.maestria.setNivel(n);
  }

  tituloFoco(nivel: MaestriaNivel | null): { intro: string; em: string } {
    switch (nivel) {
      case 'estratega':
        return { intro: 'Buen día.', em: '¿Qué movemos?' };
      case 'operador':
        return { intro: 'Hola.', em: '¿Qué movemos hoy?' };
      default:
        return { intro: 'Hola.', em: '¿Por dónde\nempezamos hoy?' };
    }
  }
}
