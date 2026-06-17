import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MaestriaService, MaestriaNivel } from './maestria.service';

export type PerfilEstado = 'empezando' | 'producto-ganador' | 'multiproducto' | 'diversificar';
export type Antiguedad = 'nuevo' | 'meses' | 'anio' | 'proveedor';
export type DolorPrincipal = 'no-se-que-vender' | 'roas-bajo' | 'novedades-overwhelm' | 'finanzas' | 'otro';

export interface PerfilDropshipper {
  estado: PerfilEstado;
  antiguedad: Antiguedad;
  dolor: DolorPrincipal;
  dolorOtro?: string;
  nombre?: string;
  completadoEn: number;
}

export interface MisionInicial {
  titulo: string;
  descripcion: string;
  cta: string;
}

const KEY_PERFIL = 'gali_v2_perfil';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private maestria = inject(MaestriaService);

  private perfilSubject = new BehaviorSubject<PerfilDropshipper | null>(this.load());
  readonly perfil$ = this.perfilSubject.asObservable();

  get perfil(): PerfilDropshipper | null { return this.perfilSubject.value; }
  get yaCompletoOnboarding(): boolean { return this.perfil !== null; }

  guardar(p: PerfilDropshipper) {
    this.perfilSubject.next(p);
    try { localStorage.setItem(KEY_PERFIL, JSON.stringify(p)); } catch {}
    this.maestria.setNivel(this.inferirNivel(p));
  }

  resetear() {
    this.perfilSubject.next(null);
    try { localStorage.removeItem(KEY_PERFIL); } catch {}
  }

  inferirNivel(p: PerfilDropshipper): MaestriaNivel {
    if (p.antiguedad === 'nuevo') return 'aprendiz';
    if (p.antiguedad === 'anio') return 'estratega';
    if (p.estado === 'multiproducto') return 'estratega';
    return 'operador';
  }

  generarMision(p: PerfilDropshipper): MisionInicial {
    if (p.dolor === 'roas-bajo') {
      return {
        titulo: 'Optimiza tu campaña actual',
        descripcion:
          'Hay 3 cosas específicas que los dropshippers con tu perfil hacen diferente. Vamos a revisar la tuya juntos.',
        cta: 'Revisar mi campaña',
      };
    }
    if (p.dolor === 'no-se-que-vender') {
      return {
        titulo: 'Encuentra tu primer producto',
        descripcion:
          'Voy a mostrarte 3 productos en curva de entrada, filtrados para tu perfil. No los productos populares — los productos para ti.',
        cta: 'Ver mis 3 productos',
      };
    }
    if (p.dolor === 'novedades-overwhelm') {
      return {
        titulo: 'Triage de novedades',
        descripcion:
          'Voy a clasificar tus novedades en tres zonas: las que necesitan tu decisión, las que estoy manejando, y las ya resueltas.',
        cta: 'Ver mis novedades',
      };
    }
    if (p.dolor === 'finanzas') {
      return {
        titulo: 'Mira tu proyección',
        descripcion:
          'Estimo tu liquidez a 30 días con el ritmo actual de ventas y te muestro la mejor fecha de retiro.',
        cta: 'Ver mi wallet',
      };
    }
    return {
      titulo: 'Explora tu nuevo Dropi',
      descripcion:
        'Tu primer paso: revisa tu lienzo. Yo estaré ahí, escuchando, lista para cuando me necesites.',
      cta: 'Ir al lienzo',
    };
  }

  // Genera el "ya te conozco" personalizado para el momento wow.
  pintarReflejo(p: PerfilDropshipper): { titulo: string; resumen: string } {
    const persona = this.maestria.persona;
    let resumen = '';
    if (p.antiguedad === 'nuevo') resumen += 'Eres nueva en Dropi. ';
    else if (p.antiguedad === 'meses') resumen += 'Llevas algunos meses ya. ';
    else if (p.antiguedad === 'anio') resumen += 'Tienes más de un año de oficio. ';
    else resumen += 'Vienes del lado proveedor — buen ángulo para entender el todo. ';

    if (p.estado === 'empezando') resumen += 'Estás buscando tu primer producto ganador. ';
    else if (p.estado === 'producto-ganador') resumen += 'Ya tienes un producto que vende y quieres escalarlo. ';
    else if (p.estado === 'multiproducto') resumen += 'Llevas varios productos activos y necesitas orden. ';
    else resumen += 'Buscas un nicho nuevo para diversificar. ';

    if (p.dolor === 'roas-bajo') resumen += 'Tu mayor bloqueo son las campañas que no están dando el ROAS que esperas.';
    else if (p.dolor === 'no-se-que-vender') resumen += 'Te cuesta decidir qué producto vender — el miedo a elegir mal.';
    else if (p.dolor === 'novedades-overwhelm') resumen += 'Te abruman las novedades y no encuentras tiempo para lo importante.';
    else if (p.dolor === 'finanzas') resumen += 'Tu flujo de caja no es claro y eso te quita tranquilidad.';
    else resumen += 'Tu dolor: ' + (p.dolorOtro ?? 'algo específico de tu operación') + '.';

    const tituloBase = p.nombre ? `Ya te conozco, ${p.nombre}.` : 'Ya te conozco.';

    if (persona.nivel === 'estratega') {
      return { titulo: tituloBase, resumen: resumen.replace(/\. /g, '. ').trim() };
    }
    return { titulo: tituloBase, resumen };
  }

  private load(): PerfilDropshipper | null {
    try {
      const raw = localStorage.getItem(KEY_PERFIL);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }
}
