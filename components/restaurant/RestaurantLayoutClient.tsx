"use client";

import { RestaurantProvider, RestaurantHeader } from "@/components/restaurant";
import { Restaurant } from "@/types/restaurant";
import dynamic from "next/dynamic";

// Dynamic import do CartDrawer para não carregar até precisar
const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false },
);

interface RestaurantLayoutClientProps {
  children: React.ReactNode;
  restaurant: Restaurant;
}

export function RestaurantLayoutClient({
  children,
  restaurant,
}: RestaurantLayoutClientProps) {
  return (
    <RestaurantProvider restaurant={restaurant}>
      <div
        className="min-h-screen bg-[var(--color-background)]"
        style={
          {
            // Aplica tema do restaurante via CSS variables
            "--color-primary": restaurant.theme?.primaryColor || "#D90007",
            "--color-accent": restaurant.theme?.accentColor || "#FFC72C",
          } as React.CSSProperties
        }
      >
        <RestaurantHeader />
        <main>{children}</main>
        <CartDrawer />
      </div>
    </RestaurantProvider>
  );
}
