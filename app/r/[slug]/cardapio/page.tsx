"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ProductCard } from "@/components/menu/ProductCard";
import { CategoryFilters } from "@/components/menu/CategoryFilters";
import { CategorySidebar } from "@/components/menu/CategorySidebar";
import { useCartStore } from "@/store/cart";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { Product } from "@/types";
import { RestaurantProfileHeader } from "@/components/restaurant/RestaurantProfileHeader";

// Dynamic imports
const ProductDetailsModal = dynamic(
  () =>
    import("@/components/menu/ProductDetailsModal").then(
      (mod) => mod.ProductDetailsModal,
    ),
  { ssr: false },
);

const AdvancedFiltersDrawer = dynamic(
  () =>
    import("@/components/menu/AdvancedFiltersDrawer").then(
      (mod) => mod.AdvancedFiltersDrawer,
    ),
  { ssr: false },
);

export default function CardapioPage() {
  const { addItem } = useCartStore();

  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filteredProducts,
    isSearching,
    advancedFilters,
    setAdvancedFilters,
    resetFilters,
    activeFilterCount,
    categories,
  } = useProductSearch();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCartFromModal = (
    product: Product,
    quantity: number,
    notes?: string,
  ) => {
    useCartStore.getState().addItem(product, quantity, notes);
    toast.success(`${quantity}x ${product.name} adicionado!`);
    setSelectedProduct(null);
  };

  return (
    <>
      {/* 
        NOVO HEADER: Imagem de Capa + Informações do Restaurante 
        Inspirado no design do iFood/McDonald's
      */}
      <RestaurantProfileHeader />

      {/* Search & Filters Section (Sticky) */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm transition-shadow">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-xl px-4 h-12 hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 focus-within:bg-white">
              {isSearching ? (
                <Loader2 className="animate-spin text-gray-400" size={20} />
              ) : (
                <Search size={20} className="text-gray-400 flex-shrink-0" />
              )}
              <input
                type="text"
                placeholder="Buscar no cardápio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-base py-3 focus:ring-0 placeholder:text-gray-400 text-gray-900 outline-none min-w-0"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`relative min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl transition-all active:scale-95 ${
                activeFilterCount > 0
                  ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <SlidersHorizontal size={20} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[var(--color-primary)] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Pills (Mobile Only) */}
          <div className="mt-3 lg:hidden">
            <CategoryFilters
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Sidebar - Desktop Only */}
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {/* Results Header */}
            {(searchQuery || activeCategory !== "all") && (
              <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm text-gray-500">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "item encontrado"
                    : "itens encontrados"}
                </p>
                {(searchQuery || activeFilterCount > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                      resetFilters();
                    }}
                    className="text-sm text-[var(--color-primary)] font-medium hover:underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="h-full"
                >
                  <ProductCard
                    product={product}
                    onAdd={(p) => {
                      addItem(p);
                      toast.success(`${p.name} adicionado à sacola!`);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Nenhum item encontrado
                </h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  {searchQuery
                    ? `Não encontramos resultados para "${searchQuery}"`
                    : "Tente selecionar outra categoria ou ajustar os filtros."}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                    resetFilters();
                  }}
                  className="h-12 px-8 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl active:scale-95 transition-transform shadow-lg shadow-[var(--color-primary)]/20"
                >
                  Ver todos os itens
                </button>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-24">
                <Loader2
                  className="animate-spin text-[var(--color-primary)]"
                  size={40}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartFromModal}
      />

      <AdvancedFiltersDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={advancedFilters}
        onApplyFilters={setAdvancedFilters}
        onClearFilters={resetFilters}
      />
    </>
  );
}
