export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  promotionalPrice: number | null;
  imageUrl: string | null;
  preparationTime: number | null;
  serves: number | null;
  available: boolean;
  active: boolean;
  displayOrder: number;
  category: CategorySummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSummary extends Omit<
  Product,
  "description" | "category" | "createdAt" | "updatedAt"
> {}

// API Response Types
export type CategoryResponse = Category;
export type ProductResponse = Product;
export type ProductListResponse = Product[];
export type CategoryListResponse = Category[];
