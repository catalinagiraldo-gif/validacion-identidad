import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export type HubProfile = 'dropshipper' | 'proveedor' | 'admin';

export interface ProfileOption {
  id: HubProfile;
  label: string;
  description: string;
  icon: string;
}

const SESSION_KEY = 'dropi_hub_profile';
const ARCH_KEY = 'dropi.selectedArch';

export const PROFILE_OPTIONS: ProfileOption[] = [
  {
    id: 'dropshipper',
    label: 'Dropshipper',
    description: 'Explora prototipos de catálogo, pedidos y herramientas de venta',
    icon: 'pi pi-shopping-cart',
  },
  {
    id: 'proveedor',
    label: 'Proveedor',
    description: 'Explora prototipos de gestión de pedidos y facturación',
    icon: 'pi pi-box',
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Explora prototipos de administración, CAS y configuración',
    icon: 'pi pi-cog',
  },
];

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private _currentProfile$ = new BehaviorSubject<HubProfile | null>(
    this.loadFromSession()
  );

  readonly currentProfile$: Observable<HubProfile | null> =
    this._currentProfile$.asObservable();

  get currentProfile(): HubProfile | null {
    return this._currentProfile$.value;
  }

  get hasProfile(): boolean {
    return this._currentProfile$.value !== null;
  }

  constructor(private router: Router) {}

  selectProfile(profile: HubProfile): void {
    sessionStorage.setItem(SESSION_KEY, profile);
    this._currentProfile$.next(profile);
    const arch = localStorage.getItem(ARCH_KEY) || 'old';
    this.router.navigate(['/' + arch + '/home']);
  }

  clearProfile(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this._currentProfile$.next(null);
    const arch = localStorage.getItem(ARCH_KEY) || 'old';
    this.router.navigate(['/' + arch + '/profile-select']);
  }

  getProfileLabel(): string {
    const p = this._currentProfile$.value;
    return PROFILE_OPTIONS.find((o) => o.id === p)?.label ?? '';
  }

  private loadFromSession(): HubProfile | null {
    const val = sessionStorage.getItem(SESSION_KEY);
    if (val && ['dropshipper', 'proveedor', 'admin'].includes(val)) {
      return val as HubProfile;
    }
    return null;
  }
}
