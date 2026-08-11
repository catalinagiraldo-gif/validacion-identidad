import { Injectable, signal } from '@angular/core';

export type OrigenModal = 'pedidos' | 'home' | 'wallet' | 'retiro' | 'dropicard' | 'facturacion' | 'cuenta';
export type StartScreen = 'screen0' | 'screen2' | 'screen3';

export interface ModalConfig {
  origen: OrigenModal;
  startScreen: StartScreen;
}

@Injectable({ providedIn: 'root' })
export class IdentityModalService {
  private readonly _open   = signal(false);
  private readonly _config = signal<ModalConfig>({ origen: 'home', startScreen: 'screen0' });

  /**
   * Aviso "¿Sigues ahí?" (Truora 2.3, abandono por inactividad). Vive aquí y no dentro del
   * modal porque `IdentityFase15StateSwitcherComponent` — que necesita dispararlo para la demo —
   * es un componente hermano del modal: este servicio es su único canal de comunicación.
   */
  private readonly _avisoAbandono = signal(false);

  readonly isOpen  = this._open.asReadonly();
  readonly config  = this._config.asReadonly();
  readonly avisoAbandono = this._avisoAbandono.asReadonly();

  open(origen: OrigenModal, startScreen: StartScreen = 'screen0'): void {
    this._config.set({ origen, startScreen });
    this._avisoAbandono.set(false);
    this._open.set(true);
  }

  close(): void {
    this._avisoAbandono.set(false);
    this._open.set(false);
  }

  /**
   * El reset del flag vive en `open()`/`close()` a propósito: así el switcher puede encadenar
   * `open(...)` + `mostrarAvisoAbandono()` de forma síncrona y determinista, sin que el effect
   * de reset del modal — que corre después — le borre el flag.
   */
  mostrarAvisoAbandono(): void { this._avisoAbandono.set(true); }
  ocultarAvisoAbandono(): void { this._avisoAbandono.set(false); }
}
