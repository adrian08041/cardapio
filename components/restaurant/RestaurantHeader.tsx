"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, User, LogOut, Clock, ChevronDown } from "lucide-react";
import { useRestaurant } from "./RestaurantContext";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { isRestaurantOpen, getTodayHours } from "@/types/restaurant";
import { Button } from "@/components/ui/button";

export function RestaurantHeader() {
  const { restaurant } = useRestaurant();
  const router = useRouter();
  const { toggleCart, getCartCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [isMounted, setIsMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = isMounted ? getCartCount() : 0;
  const isOpen = isRestaurantOpen(restaurant);
  const todayHours = getTodayHours(restaurant);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nome do Restaurante */}
          <div className="flex items-center gap-3">
            {restaurant.logo ? (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-lg">
                {restaurant.name.charAt(0)}
              </div>
            )}

            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900 text-lg leading-tight">
                {restaurant.name}
              </h1>

              {/* Status + Horário */}
              <div className="flex items-center gap-2 text-xs">
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

          {/* Mobile: Status Badge */}
          <div className="sm:hidden flex items-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                isOpen
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500" : "bg-red-400"}`}
              />
              {isOpen ? "Aberto" : "Fechado"}
            </span>
          </div>

          {/* Ações: Entrar + Sacola */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auth Button */}
            {isMounted && isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() =>
                  router.push(
                    `/auth/login?redirect=/r/${restaurant.slug}/cardapio`,
                  )
                }
              >
                <User size={18} className="sm:mr-2" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            )}

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full font-medium text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[var(--color-primary)]/20"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Sacola</span>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[var(--color-primary)] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--color-primary)] shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
