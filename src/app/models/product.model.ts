export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  stock: number;
  category: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
  dropshipperMargin: number;
}
