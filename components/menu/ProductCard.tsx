"use client";

import { memo } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Clock } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function ProductCardComponent({ product, onAdd }: ProductCardProps) {
  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Image Section - Responsive height */}
      <div className="relative h-36 sm:h-44 w-full bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-white">
              ★ {product.rating}
            </span>
          </div>
        )}

        {/* Preparation Time Badge */}
        {product.preparationTime && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            <Clock size={12} />
            {product.preparationTime} min
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title & Description */}
        <div className="flex-grow">
          <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {product.description}
          </p>
        </div>

        {/* Footer - Price & Add Button */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Price */}
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>

          {/* Add Button - Touch-friendly (min 44px) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="min-h-[44px] min-w-[44px] px-4 flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
