"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types";
import { FilterState } from "@/components/menu/AdvancedFiltersDrawer";

const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 100],
  dietary: [],
  availability: false,
  prepTime: "any",
};

export function useProductSearch(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [advancedFilters, setAdvancedFilters] =
    useState<FilterState>(INITIAL_FILTERS);
  const [isPending, setIsPending] = useState(false);

  // Debounce Logic
  useEffect(() => {
    setIsPending(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsPending(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Optimized Filter Logic with Memoization
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter
      if (activeCategory !== "all" && product.categoryId !== activeCategory) {
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

      // 3. Text Search Filter (Last for performance)
      if (!debouncedQuery) return true;

      const query = debouncedQuery.toLowerCase().trim();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description
        .toLowerCase()
        .includes(query);
      const matchesTags = product.tags?.some((tag) =>
        tag.toLowerCase().includes(query),
      );

      return matchesName || matchesDescription || matchesTags;
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
    isSearching: isPending,
    activeFilterCount,
    resetFilters: () => setAdvancedFilters(INITIAL_FILTERS),
  };
}
