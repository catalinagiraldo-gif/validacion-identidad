import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/orders');
  }

  updateOrder(id: string, changes: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`/api/orders/${id}`, changes);
  }
}
