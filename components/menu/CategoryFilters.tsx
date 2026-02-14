"use client";

import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryFilters({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFiltersProps) {
  return (
    <div className="w-full overflow-hidden -mx-4 px-4">
      {/* Scroll Container com safe area */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
        {/* Pill: Todos */}
        <button
          onClick={() => onSelectCategory("all")}
          className={cn(
            "flex-shrink-0 snap-start",
            "min-h-[44px] px-4 py-2.5 rounded-full",
            "text-sm font-semibold transition-all duration-200",
            "active:scale-95",
            activeCategory === "all"
              ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Todos
        </button>

        {/* Pills: Categorias */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "flex-shrink-0 snap-start",
              "min-h-[44px] px-4 py-2.5 rounded-full",
              "text-sm font-semibold transition-all duration-200",
              "flex items-center gap-2",
              "active:scale-95",
              activeCategory === category.id
                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {category.icon && (
              <span className="text-base">{category.icon}</span>
            )}
            <span className="whitespace-nowrap">{category.name}</span>
          </button>
        ))}

        {/* Spacer para garantir scroll até o último item */}
        <div className="flex-shrink-0 w-4" aria-hidden="true" />
      </div>
    </div>
  );
}
