"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, User, LogOut, Clock, ChevronDown } from "lucide-react";
import { useRestaurant } from "./RestaurantContext";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { isRestaurantOpen, getTodayHours } from "@/types/restaurant";
import { cn } from "@/lib/utils";

export function RestaurantHeader() {
  const { restaurant } = useRestaurant();
  const router = useRouter();
  const pathname = usePathname();
  const { toggleCart, getCartCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [isMounted, setIsMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if we are on the home page (menu page)
  const isMenuPage = pathname?.endsWith("/cardapio");

  // Handle scroll for transparent header effect
  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = isMounted ? getCartCount() : 0;
  const isOpen = isRestaurantOpen(restaurant);
  const todayHours = getTodayHours(restaurant);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // If on menu page and not scrolled, show reduced header
  const isTransparent = isMenuPage && !isScrolled;

  return (
    <header
      className={cn(
        "z-50 transition-all duration-300 safe-area-top w-full",
        isMenuPage ? "fixed top-0" : "sticky top-0",
        isTransparent
          ? "bg-transparent pointer-events-none border-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm",
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nome (Hide on top of menu page because cover already shows it) */}
          <div
            className={cn(
              "flex items-center gap-3 flex-1 min-w-0 transition-opacity duration-300",
              isTransparent ? "opacity-0 invisible" : "opacity-100 visible",
            )}
          >
            {/* Logo */}
            {restaurant.logo ? (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {restaurant.name.charAt(0)}
              </div>
            )}

            {/* Nome e Status */}
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight truncate max-w-[150px] sm:max-w-xs">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-2 text-xs hidden sm:flex">
                <span
                  className={`inline-flex items-center gap-1 ${isOpen ? "text-green-600" : "text-red-500"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-400"}`}
                  />
                  {isOpen ? "Aberto" : "Fechado"}
                </span>
                {todayHours && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {todayHours}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Ações: Login + Sacola (Hidden when transparent, visible on scroll) */}
          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              isTransparent
                ? "opacity-0 invisible pointer-events-none"
                : "opacity-100 visible pointer-events-auto",
            )}
          >
            {/* Auth Button */}
            {isMounted && isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={cn(
                    "min-h-[44px] min-w-[44px] flex items-center gap-2 px-3 rounded-xl transition-colors active:scale-95",
                    isTransparent
                      ? "bg-white/90 text-gray-900 shadow-md backdrop-blur-sm hover:bg-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 hidden sm:block"
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden text-left">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full min-h-[44px] flex items-center gap-3 px-4 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        Sair da conta
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() =>
                  router.push(
                    `/auth/login?redirect=/r/${restaurant.slug}/cardapio`,
                  )
                }
                className={cn(
                  "min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-3 rounded-xl transition-colors active:scale-95",
                  isTransparent
                    ? "bg-white/90 text-gray-900 shadow-md backdrop-blur-sm hover:bg-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <User size={20} />
                <span className="hidden sm:inline text-sm font-medium">
                  Entrar
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className={cn(
                "relative min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-4 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg",
                isTransparent
                  ? "bg-[var(--color-primary)] text-white shadow-black/20"
                  : "bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/25 hover:opacity-90",
              )}
            >
              <ShoppingBag size={20} />
              <span className="hidden sm:inline">Sacola</span>

              {/* Cart Count Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[var(--color-primary)] text-[11px] font-bold min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center border-2 border-[var(--color-primary)] shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
