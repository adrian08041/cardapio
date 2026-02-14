"use client";

import Image from "next/image";
import { Star, Clock, Info } from "lucide-react";
import { useRestaurant } from "./RestaurantContext";
import { isRestaurantOpen } from "@/types/restaurant";

export function RestaurantProfileHeader() {
  const { restaurant } = useRestaurant();
  const isOpen = isRestaurantOpen(restaurant);

  if (!restaurant.banner) return null;

  return (
    <div className="relative w-full bg-white mb-6">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 w-full">
        <Image
          src={restaurant.banner}
          alt="Capa do restaurante"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
      </div>

      {/* Restaurant Info Card (Desktop & Mobile Unified) */}
      <div className="max-w-7xl mx-auto px-4 relative -mt-16 sm:-mt-20 z-10 pb-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border border-gray-100">
          {/* Logo */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 -mt-12 sm:-mt-10 rounded-xl overflow-hidden bg-white shadow-md border-4 border-white flex-shrink-0">
            {restaurant.logo ? (
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-bold">
                {restaurant.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info Text */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {restaurant.name}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  5.0
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                    isOpen
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-400"}`}
                  />
                  {isOpen ? "Aberto" : "Fechado"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                Fast Food • Lanches
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {restaurant.settings?.estimatedDeliveryTime || "30-40"} min
              </span>
            </div>

            {restaurant.description && (
              <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl mx-auto sm:mx-0">
                {restaurant.description}
              </p>
            )}
          </div>

          {/* Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 self-start mt-2">
            <button className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
