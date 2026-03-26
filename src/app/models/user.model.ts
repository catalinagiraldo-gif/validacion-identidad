export interface User {
  id: string;
  name: string;
  email: string;
  role: 'dropshipper' | 'supplier';
  storeName: string;
  storeSlug: string;
  plan: 'basic' | 'pro' | 'enterprise';
  totalOrders: number;
  totalRevenue: number;
  joinedAt: string;
  isActive: boolean;
}
