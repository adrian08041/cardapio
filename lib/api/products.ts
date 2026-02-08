import { api } from "./client";
import { Product } from "@/types";

// Helper para mapear resposta do backend para interface do frontend
const mapProduct = (p: any): Product => ({
  ...p,
  // Backend envia imageUrl, frontend usa image (conforme types/index.ts atualizado)
  // Fallback image se vier null
  image:
    p.imageUrl ||
    p.image ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  description: p.description || "",
  // Mapear categoria se existir
  category: p.category
    ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
        icon: p.category.icon || "🍔",
      }
    : undefined,
});

export const productsApi = {
  getAll: async (params?: { q?: string }): Promise<Product[]> => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.append("q", params.q);

    const queryString = searchParams.toString()
      ? `?${searchParams.toString()}`
      : "";

    const data = await api.get<any[]>(`/products${queryString}`);
    return data.map(mapProduct);
  },

  getById: async (id: string): Promise<Product> => {
    const data = await api.get<any>(`/products/${id}`);
    return mapProduct(data);
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const data = await api.get<any>(`/products/slug/${slug}`);
    return mapProduct(data);
  },

  getByCategorySlug: async (categorySlug: string): Promise<Product[]> => {
    const data = await api.get<any[]>(
      `/products/category/slug/${categorySlug}`,
    );
    return data.map(mapProduct);
  },
  create: async (data: any): Promise<Product> => {
    // data deve conter categoryId
    const res = await api.post<any>("/products", data);
    return mapProduct(res);
  },

  update: async (id: string, data: any): Promise<Product> => {
    const res = await api.put<any>(`/products/${id}`, data);
    return mapProduct(res);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/products/${id}`);
  },

  toggleAvailability: async (id: string): Promise<void> => {
    return api.patch<void>(`/products/${id}/availability`);
  },
};
