"use client";

import { memo } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

// Using React.memo to prevent unnecessary re-renders in lists
function ProductCardComponent({ product, onAdd }: ProductCardProps) {
  return (
    // Using CSS animation instead of framer-motion for better performance
    <div className="group flex flex-col h-full enterprise-card rounded-xl overflow-hidden cursor-pointer animate-fade-in-up">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-[var(--color-secondary)]/20 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Chips - Clean & Minimal */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.rating && (
            <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-white border border-white/10 shadow-sm">
              ★ {product.rating}
            </span>
          )}
        </div>

        {/* Time Chip - Bottom Right */}
        {product.preparationTime && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-black shadow-sm">
            <Clock size={10} /> {product.preparationTime} min
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-[var(--color-foreground)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)] line-clamp-2 h-8">
            {product.description}
          </p>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[var(--color-border)]/50">
          <span className="text-sm font-bold text-[var(--color-foreground)]">
            {formatCurrency(product.price)}
          </span>

          <Button
            size="sm"
            className="h-8 px-3 text-xs bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-md transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onAdd(product);
            }}
          >
            <Plus size={14} className="mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent re-renders when parent updates but props don't change
export const ProductCard = memo(ProductCardComponent);
