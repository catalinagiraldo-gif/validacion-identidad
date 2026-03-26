import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { UserRole } from '../config/sidebar-nav.config';

const STORAGE_KEY = 'dropi_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(this.loadFromStorage());

  get user$(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUser$.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUser$.value !== null;
  }

  get userRole(): UserRole | null {
    return (this.currentUser$.value?.role as UserRole) ?? null;
  }

  login(email: string, _password: string, users: User[]): Observable<User | null> {
    const user = users.find(u => u.email === email && u.isActive);
    if (user) {
      this.setUser(user);
      return of(user);
    }
    return of(null);
  }

  loginAs(role: UserRole, users: User[]): Observable<User | null> {
    const user = users.find(u => u.role === role && u.isActive);
    if (user) {
      this.setUser(user);
      return of(user);
    }
    return of(null);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser$.next(null);
  }

  private setUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  private loadFromStorage(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as User;
      } catch {
        return null;
      }
    }
    return null;
  }
}
