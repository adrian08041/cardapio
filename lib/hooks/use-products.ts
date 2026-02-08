import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products";

export function useProducts(params?: { q?: string }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getAll(params),
  });
}

export function useProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ["products", "category", categorySlug],
    queryFn: () => productsApi.getByCategorySlug(categorySlug),
    enabled: !!categorySlug,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });
}
