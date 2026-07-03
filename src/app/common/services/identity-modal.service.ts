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

  readonly isOpen  = this._open.asReadonly();
  readonly config  = this._config.asReadonly();

  open(origen: OrigenModal, startScreen: StartScreen = 'screen0'): void {
    this._config.set({ origen, startScreen });
    this._open.set(true);
  }

  close(): void {
    this._open.set(false);
  }
}
