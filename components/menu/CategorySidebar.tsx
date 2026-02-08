"use client";

import { memo } from "react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

// Pure CSS indicator instead of framer-motion layoutId
function CategorySidebarComponent({
  categories,
  activeCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block pr-6 border-r border-[var(--color-border)] mr-8 py-2">
      <div className="sticky top-32 space-y-1">
        <h3 className="mb-4 px-3 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
          Categorias
        </h3>

        <button
          onClick={() => onSelectCategory("all")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 relative group cursor-pointer",
            activeCategory === "all"
              ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5"
              : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]",
          )}
        >
          {/* CSS-based active indicator instead of framer-motion */}
          <div
            className={cn(
              "absolute left-0 w-1 h-6 bg-[var(--color-primary)] rounded-r-full transition-all duration-200",
              activeCategory === "all"
                ? "opacity-100 scale-y-100"
                : "opacity-0 scale-y-0",
            )}
          />
          <span>Todos</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 relative group cursor-pointer",
              activeCategory === category.id
                ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]",
            )}
          >
            {/* CSS-based active indicator */}
            <div
              className={cn(
                "absolute left-0 w-1 h-6 bg-[var(--color-primary)] rounded-r-full transition-all duration-200",
                activeCategory === category.id
                  ? "opacity-100 scale-y-100"
                  : "opacity-0 scale-y-0",
              )}
            />
            <span className="text-base opacity-80 group-hover:opacity-100 transition-opacity">
              {category.icon}
            </span>
            <span className="truncate">{category.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export const CategorySidebar = memo(CategorySidebarComponent);
