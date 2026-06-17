export interface HubUser {
  uid: string;
  email: string;
  displayName: string;
  name?: string;
  photoURL: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'dropshipper' | 'proveedor' | 'admin';
  storeName: string;
  storeSlug: string;
  plan: 'basic' | 'pro' | 'enterprise';
  totalOrders: number;
  totalRevenue: number;
  joinedAt: string;
  isActive: boolean;
}

export interface Allowlist {
  emails: string[];
  domains: string[];
}
