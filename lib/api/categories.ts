import { api } from "./client";
import { Category } from "@/types";

const mapCategory = (c: any): Category => ({
  ...c,
  icon: c.icon || "📁",
});

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const data = await api.get<any[]>("/categories");
    return data.map(mapCategory);
  },

  getById: async (id: string): Promise<Category> => {
    const data = await api.get<any>(`/categories/${id}`);
    return mapCategory(data);
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const data = await api.get<any>(`/categories/slug/${slug}`);
    return mapCategory(data);
  },
};
