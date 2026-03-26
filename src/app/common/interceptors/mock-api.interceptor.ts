import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import ordersData from '../../../../mocks/orders.json';
import productsData from '../../../../mocks/products.json';
import usersData from '../../../../mocks/users.json';
import walletData from '../../../../mocks/wallet.json';
import analyticsData from '../../../../mocks/analytics.json';

// Mutable in-memory copies (reset on page refresh)
let orders = [...ordersData];
let products = [...productsData];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // GET /api/orders
  if (req.url.includes('/api/orders') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: orders }));
  }

  // PATCH /api/orders/:id
  if (req.url.match(/\/api\/orders\/\w+/) && req.method === 'PATCH') {
    const id = req.url.split('/').pop();
    const order = orders.find((o) => o.id === id);
    if (order) {
      Object.assign(order, req.body);
      return of(new HttpResponse({ status: 200, body: order }));
    }
    return of(new HttpResponse({ status: 404, body: { error: 'Order not found' } }));
  }

  // GET /api/products
  if (req.url.includes('/api/products') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: products }));
  }

  // GET /api/users
  if (req.url.includes('/api/users') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: usersData }));
  }

  // GET /api/wallet
  if (req.url.includes('/api/wallet') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: walletData }));
  }

  // GET /api/analytics
  if (req.url.includes('/api/analytics') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: analyticsData }));
  }

  return next(req);
};
