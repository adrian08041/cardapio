"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ProductCard } from "@/components/menu/ProductCard";
import { CategoryFilters } from "@/components/menu/CategoryFilters";
import { CategorySidebar } from "@/components/menu/CategorySidebar";
import { useCartStore } from "@/store/cart";
import { useRestaurant } from "@/components/restaurant";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Search, Loader2, Filter, Sparkles } from "lucide-react";
import { Product } from "@/types";

// Dynamic imports para reduzir bundle inicial
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
  const { restaurant } = useRestaurant();
  const { addItem } = useCartStore();

  // Hook de busca e filtros
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

  // Modal States
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
      {/* Hero Section - Simplificado e Limpo */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background Decorativo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-10 w-60 h-60 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          {/* Título e Descrição */}
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/20 text-[var(--color-primary)] px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Sparkles size={14} />
              CARDÁPIO
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
              O que vai ser{" "}
              <span className="text-[var(--color-primary)]">hoje?</span> 🍔
            </h1>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {restaurant.description ||
                "Explore nosso cardápio e faça seu pedido!"}
            </p>
          </div>

          {/* Barra de Busca */}
          <div className="flex items-center gap-3 w-full max-w-2xl bg-white p-2 rounded-2xl shadow-lg shadow-black/5 border border-gray-100">
            <div className="pl-4 text-gray-400">
              {isSearching ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <Search size={22} />
              )}
            </div>

            <input
              type="text"
              placeholder="Buscar pratos, ingredientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-base py-3 focus:ring-0 placeholder:text-gray-400 text-gray-900 outline-none min-w-0"
            />

            <div className="hidden sm:block w-px h-8 bg-gray-200" />

            <button
              onClick={() => setIsFilterOpen(true)}
              className={`p-3 rounded-xl transition-all font-medium flex items-center gap-2 shrink-0 ${
                activeFilterCount > 0
                  ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline text-sm">Filtros</span>
              {activeFilterCount > 0 && (
                <span className="bg-white text-[var(--color-primary)] w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Sidebar Desktop */}
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <div className="flex-1 w-full">
            {/* Tabs Mobile */}
            <div className="mb-6 lg:hidden">
              <CategoryFilters
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="h-full cursor-pointer"
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

            {/* Estado Vazio */}
            {filteredProducts.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Nenhum item encontrado
                </p>
                <p className="text-sm text-gray-500 text-center max-w-xs">
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
                  className="mt-4 text-[var(--color-primary)] hover:underline text-sm font-medium"
                >
                  Limpar filtros e ver tudo
                </button>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-20">
                <Loader2
                  className="animate-spin text-[var(--color-primary)]"
                  size={32}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modais */}
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
