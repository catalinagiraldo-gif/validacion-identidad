import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HubUser } from '../models/user.model';
import allowlistData from '../../../allowed-emails.json';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  Auth,
  onAuthStateChanged,
  UserCredential,
} from 'firebase/auth';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'dropi_hub_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firebaseApp: FirebaseApp;
  private auth: Auth;
  private provider = new GoogleAuthProvider();
  private currentUser$ = new BehaviorSubject<HubUser | null>(this.loadFromStorage());
  private _authError$ = new BehaviorSubject<string | null>(null);

  readonly user$: Observable<HubUser | null> = this.currentUser$.asObservable();
  readonly authError$: Observable<string | null> = this._authError$.asObservable();

  get currentUser(): HubUser | null {
    return this.currentUser$.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUser$.value !== null;
  }

  ensureGuestAccess(): void {
    if (this.currentUser$.value) {
      return;
    }

    this.setUser({
      uid: 'guest-prototype',
      email: 'prototipo@dropi.co',
      displayName: 'Prototipo',
      name: 'Prototipo',
      photoURL: null,
      createdAt: new Date().toISOString(),
    });
  }

  constructor() {
    this.firebaseApp = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.firebaseApp);
    this.ensureGuestAccess();

    onAuthStateChanged(this.auth, (fbUser) => {
      if (fbUser && !this.currentUser$.value) {
        const hubUser: HubUser = {
          uid: fbUser.uid,
          email: fbUser.email ?? '',
          displayName: fbUser.displayName ?? '',
          name: fbUser.displayName ?? '',
          photoURL: fbUser.photoURL,
          createdAt: new Date().toISOString(),
        };
        this.setUser(hubUser);
      }
    });
  }

  async loginWithGoogle(): Promise<HubUser> {
    this._authError$.next(null);

    try {
      const result: UserCredential = await signInWithPopup(this.auth, this.provider);
      const email = result.user.email ?? '';

      const allowed = this.isEmailAllowed(email);
      if (!allowed) {
        await signOut(this.auth);
        const errorMsg = 'Acceso no autorizado — contacta a producto@dropi.co';
        this._authError$.next(errorMsg);
        throw new Error(errorMsg);
      }

      const hubUser: HubUser = {
        uid: result.user.uid,
        email,
        displayName: result.user.displayName ?? '',
        name: result.user.displayName ?? '',
        photoURL: result.user.photoURL,
        createdAt: new Date().toISOString(),
      };

      this.setUser(hubUser);
      return hubUser;
    } catch (err: any) {
      if (err?.message?.includes('Acceso no autorizado')) {
        throw err;
      }
      const errorMsg = 'Error al iniciar sesión con Google. Inténtalo de nuevo.';
      this._authError$.next(errorMsg);
      throw new Error(errorMsg);
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    await signOut(this.auth);
    this.currentUser$.next(null);
    this._authError$.next(null);
  }

  private isEmailAllowed(email: string): boolean {
    const emailLower = email.toLowerCase();
    const domain = emailLower.split('@')[1];

    if (allowlistData.domains?.some((d: string) => d.toLowerCase() === domain)) {
      return true;
    }
    if (allowlistData.emails?.some((e: string) => e.toLowerCase() === emailLower)) {
      return true;
    }
    return false;
  }

  private setUser(user: HubUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  private loadFromStorage(): HubUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as HubUser;
      } catch {
        return null;
      }
    }
    return null;
  }
}
