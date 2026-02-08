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
    <div className="w-full border-b border-[var(--color-border)] mb-6">
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-1 min-w-max">
        <button
          onClick={() => onSelectCategory("all")}
          className={cn(
            "relative pb-3 text-sm font-medium transition-colors border-b-2",
            activeCategory === "all"
              ? "text-[var(--color-primary)] border-[var(--color-primary)]"
              : "text-[var(--color-muted-foreground)] border-transparent hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]",
          )}
        >
          Todos
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2",
              activeCategory === category.id
                ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)] border-transparent hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]",
            )}
          >
            {/* Keeping category icon if available, but styling it subtly */}
            <span className="text-base opacity-80">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
