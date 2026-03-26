import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private http = inject(HttpClient);

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>('/api/wallet');
  }
}
