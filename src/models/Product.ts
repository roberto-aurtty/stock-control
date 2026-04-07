export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  sku: string;
  category?: string;
  stock?: number;
  created_at?: string;
}

export interface ProductFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}
