"use client";

import { useState, useEffect } from "react";
import { categories, products } from "@/data/menu";
import { ProductCard } from "@/components/menu/ProductCard";
import { CategoryFilters } from "@/components/menu/CategoryFilters";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Search } from "lucide-react";

import { CategorySidebar } from "@/components/menu/CategorySidebar";

// ... (imports remain the same)

import { useProductSearch } from "@/hooks/useProductSearch";
import { Loader2, Filter } from "lucide-react";
import { ProductDetailsModal } from "@/components/menu/ProductDetailsModal";
import { AdvancedFiltersDrawer } from "@/components/menu/AdvancedFiltersDrawer";
import { Product } from "@/types";

// ... (previous imports)

export default function Home() {
  // Using Custom Hook for Logic
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
  } = useProductSearch(products);

  // Modal State
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
    // Adding quantity items to cart loop
    for (let i = 0; i < quantity; i++) {
      useCartStore.getState().addItem(product);
    }
  };

  // Hydration fix for persisted store
  const [isMounted, setIsMounted] = useState(false);
  const { addItem, toggleCart, getCartCount } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = isMounted ? getCartCount() : 0;

  return (
    <main className="min-h-screen relative bg-[var(--color-background)]">
      {/* 
        --- MODERN HERO SECTION --- 
        Design limpo, profissional e com foco na ação (Busca).
      */}
      <div className="relative bg-gradient-to-b from-[var(--color-secondary)]/50 to-[var(--color-background)] overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-32 md:pb-20 relative z-10">
          {/* Top Header Row (Flexbox instead of Absolute to fix layout bugs) */}
          <div className="flex items-start justify-between mb-8 w-full">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-full border border-green-500/20 backdrop-blur-sm self-start">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Aberto Agora
              </span>
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] rounded-full shadow-lg shadow-black/5 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all active:scale-95 group"
            >
              <ShoppingBag size={18} />
              <span className="font-semibold text-sm hidden sm:inline">
                Sacola
              </span>
              {cartCount > 0 && (
                <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-4">
            {/* Left Content: Welcome & Search */}
            <div className="flex-1 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--color-foreground)] leading-tight mb-4">
                O que vai ser <br className="hidden md:block" />
                <span className="text-[var(--color-primary)]">hoje?</span> 🍔
              </h1>
              <p className="text-lg text-[var(--color-muted-foreground)] mb-8 max-w-lg leading-relaxed">
                Explore nosso cardápio de hambúrgueres artesanais,
                acompanhamentos crocantes e bebidas geladas.
              </p>

              {/* Enhanced Search Bar */}
              <div className="flex items-center gap-3 w-full bg-[var(--color-card)] p-2 rounded-2xl shadow-xl shadow-black/5 border border-[var(--color-border)] relative z-20">
                <div className="pl-4 text-[var(--color-muted-foreground)]">
                  {isSearching ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Search size={24} />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Pesquise por Pratos, Ingredientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-lg py-3 focus:ring-0 placeholder:text-[var(--color-muted-foreground)]/50 text-[var(--color-foreground)] outline-none min-w-0"
                />
                <div className="hidden sm:block w-px h-8 bg-[var(--color-border)] mx-2" />
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className={`p-3 rounded-xl transition-all font-medium flex items-center gap-2 shrink-0 ${
                    activeFilterCount > 0
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-primary/20"
                      : "bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  <Filter size={20} />
                  <span className="hidden sm:inline">Filtros</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-[var(--color-primary)] w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Right Content: Promo Banner */}
            <div className="hidden md:flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-100 pb-2">
              {/* Promo Card 1 */}
              <div className="bg-[var(--color-card)] p-4 rounded-2xl shadow-lg border border-[var(--color-border)] w-72 transform rotate-2 hover:rotate-0 transition-all cursor-default relative overflow-hidden group hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">
                  NOVO
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl shadow-inner">
                    🛵
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-foreground)] text-sm">
                      Frete Grátis
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                      Pedidos +
                      <span className="font-semibold text-[var(--color-foreground)]">
                        R$ 100
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Promo Card 2 */}
              <div className="bg-[var(--color-card)] p-4 rounded-2xl shadow-lg border border-[var(--color-border)] w-72 transform -rotate-1 hover:rotate-0 transition-all cursor-default translate-x-4 hover:translate-x-0 hover:translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl shadow-inner">
                    ⭐
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-foreground)] text-sm">
                      Programa Fidelidade
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                      Ganhe cashback hoje
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col lg:flex-row lg:items-start">
          {/* Desktop Sidebar (Left) */}
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <div className="flex-1 w-full">
            {/* Mobile Tabs (Top) - Hidden on Large Screens */}
            <div className="mb-8 lg:hidden">
              <CategoryFilters
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => handleProductClick(product)} // Opened modal on Add click
                  // Or ideally we change prop name to onClick in ProductCard to be clearer
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-[var(--color-muted-foreground)] opacity-70">
                <Search
                  size={48}
                  className="mb-4 text-[var(--color-muted)]/50"
                />
                <p className="text-lg font-medium">Nenhum item encontrado.</p>
                <div className="mt-2 text-center">
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Não achamos "{searchQuery}" nesta categoria.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 text-[var(--color-primary)] hover:underline text-sm font-medium"
                  >
                    Limpar filtros e ver tudo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartDrawer />

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
    </main>
  );
}

