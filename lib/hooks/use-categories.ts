import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["categories", slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
  });
}
