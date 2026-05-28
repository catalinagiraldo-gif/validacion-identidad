import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import ordersData from '../../../../mocks/orders.json';
import pedidosData from '../../../../mocks/pedidos.json';
import productsData from '../../../../mocks/products.json';
import usersData from '../../../../mocks/users.json';
import walletData from '../../../../mocks/wallet.json';
import analyticsData from '../../../../mocks/analytics.json';
import casData from '../../../../mocks/cas.json';
import academyData from '../../../../mocks/academy.json';
import cazaProductosData from '../../../../mocks/caza-productos.json';
import proveedoresData from '../../../../mocks/proveedores.json';
import historialCarteraData from '../../../../mocks/historial-cartera.json';
import dropicardData from '../../../../mocks/dropicard.json';
import ordersProviderData from '../../../../mocks/orders-provider.json';
import billingDropshippersData from '../../../../mocks/billing-dropshippers.json';
import carriersData from '../../../../mocks/carriers.json';
import carriersMvpData from '../../../../mocks/carriers-mvp.json';
import auditLogData from '../../../../mocks/audit-log.json';

// Mutable in-memory copies (reset on page refresh)
let orders = [...ordersData];
let products = [...productsData];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // POST /api/auth/login
  if (req.url.includes('/api/auth/login') && req.method === 'POST') {
    const { email } = req.body as { email: string };
    const user = usersData.find((u: any) => u.email === email);
    if (user) {
      return of(new HttpResponse({ status: 200, body: user }));
    }
    return of(new HttpResponse({ status: 401, body: { error: 'Invalid credentials' } }));
  }

  // GET /api/pedidos
  if (req.url.includes('/api/pedidos') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: pedidosData }));
  }

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

  // GET /api/caza-productos
  if (req.url.includes('/api/caza-productos') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: cazaProductosData }));
  }

  // GET /api/proveedores
  if (req.url.includes('/api/proveedores') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: proveedoresData }));
  }

  // GET /api/historial-cartera
  if (req.url.includes('/api/historial-cartera') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: historialCarteraData }));
  }

  // GET /api/dropicard
  if (req.url.includes('/api/dropicard') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: dropicardData }));
  }

  // GET /api/cas
  if (req.url.includes('/api/cas') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: casData }));
  }

  // GET /api/academy
  if (req.url.includes('/api/academy') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: academyData }));
  }

  // GET /api/orders-provider
  if (req.url.includes('/api/orders-provider') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: ordersProviderData }));
  }

  // GET /api/billing-dropshippers
  if (req.url.includes('/api/billing-dropshippers') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: billingDropshippersData }));
  }

  // GET /api/carriers-mvp (must come before /api/carriers)
  if (req.url.includes('/api/carriers-mvp') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: carriersMvpData }));
  }

  // GET /api/carriers
  if (req.url.includes('/api/carriers') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: carriersData }));
  }

  // GET /api/audit-log
  if (req.url.includes('/api/audit-log') && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: auditLogData }));
  }

  return next(req);
};
