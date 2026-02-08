"use client";

import { useState, useEffect, useMemo } from "react";
import { FilterState } from "@/components/menu/AdvancedFiltersDrawer";
import { useProducts } from "@/lib/hooks/use-products";
import { useCategories } from "@/lib/hooks/use-categories";
import { Product } from "@/types";

const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 100],
  dietary: [],
  availability: false,
  prepTime: "any",
};

export function useProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [advancedFilters, setAdvancedFilters] =
    useState<FilterState>(INITIAL_FILTERS);

  // Data Fetching
  const { data: products = [], isLoading: isLoadingProducts } = useProducts({
    q: debouncedQuery, // Backend search support
  });

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  // Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Client-side Filtering (Refined filters)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // 1. Category Filter
      // Se tiver category object, usa ID. Se não, tenta fallback ou ignora.
      const categoryId = product.category?.id;
      if (activeCategory !== "all" && categoryId !== activeCategory) {
        return false;
      }

      // 2. Advanced Filters
      // Price
      if (
        product.price < advancedFilters.priceRange[0] ||
        product.price > advancedFilters.priceRange[1]
      ) {
        return false;
      }

      // Availability
      if (advancedFilters.availability && !product.available) {
        return false;
      }

      // Dietary
      if (advancedFilters.dietary.length > 0) {
        const hasDietary = advancedFilters.dietary.every(
          (tag) =>
            product.dietaryInfo?.includes(tag as any) ||
            product.tags?.includes(tag),
        );
        if (!hasDietary) return false;
      }

      // Prep Time
      if (advancedFilters.prepTime !== "any") {
        const time = product.preparationTime || 0;
        if (advancedFilters.prepTime === "fast" && time >= 15) return false;
        if (advancedFilters.prepTime === "medium" && (time < 15 || time > 30))
          return false;
        if (advancedFilters.prepTime === "slow" && time <= 30) return false;
      }

      // Text Search Filter (Client-side backup if backend doesn't cover everything)
      // Como já passamos 'q' pro backend, isso é redundante mas seguro
      if (!debouncedQuery) return true;

      const query = debouncedQuery.toLowerCase().trim();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description
        ?.toLowerCase()
        .includes(query); // Adjusted for nullable description

      return matchesName || matchesDescription;
    });
  }, [products, activeCategory, debouncedQuery, advancedFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (
      advancedFilters.priceRange[0] > 0 ||
      advancedFilters.priceRange[1] < 100
    )
      count++;
    if (advancedFilters.dietary.length > 0) count++;
    if (advancedFilters.availability) count++;
    if (advancedFilters.prepTime !== "any") count++;
    return count;
  }, [advancedFilters]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    advancedFilters,
    setAdvancedFilters,
    filteredProducts,
    isSearching: isLoadingProducts || isLoadingCategories,
    categories, // Exposing categories to component
    activeFilterCount,
    resetFilters: () => setAdvancedFilters(INITIAL_FILTERS),
  };
}
