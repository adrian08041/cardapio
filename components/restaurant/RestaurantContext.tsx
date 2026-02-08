"use client";

import { createContext, useContext, ReactNode } from "react";
import { Restaurant } from "@/types/restaurant";

interface RestaurantContextType {
  restaurant: Restaurant;
  isLoading: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

interface RestaurantProviderProps {
  children: ReactNode;
  restaurant: Restaurant;
  isLoading?: boolean;
}

export function RestaurantProvider({
  children,
  restaurant,
  isLoading = false,
}: RestaurantProviderProps) {
  return (
    <RestaurantContext.Provider value={{ restaurant, isLoading }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant(): RestaurantContextType {
  const context = useContext(RestaurantContext);

  if (!context) {
    throw new Error(
      "useRestaurant deve ser usado dentro de RestaurantProvider",
    );
  }

  return context;
}

/**
 * Hook seguro que retorna null se não estiver dentro do provider
 * Útil para componentes que podem existir fora do contexto do restaurante
 */
export function useRestaurantSafe(): RestaurantContextType | null {
  return useContext(RestaurantContext);
}
