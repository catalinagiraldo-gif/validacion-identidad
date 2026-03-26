export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingCompany: string | null;
  trackingNumber: string | null;
}
