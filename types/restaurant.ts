/**
 * 🏪 Restaurant Types
 * Tipos para suporte multi-restaurante
 */

export interface RestaurantOpeningHours {
  day: number; // 0=Dom, 1=Seg, etc.
  open: string; // "08:00"
  close: string; // "22:00"
}

export interface RestaurantTheme {
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface RestaurantSettings {
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  tableEnabled: boolean;
  minOrderValue?: number;
  deliveryFee?: number;
  deliveryRadius?: number; // km
  estimatedDeliveryTime?: number; // minutos
  estimatedPickupTime?: number; // minutos
}

export interface RestaurantAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;

  address?: RestaurantAddress;
  openingHours?: RestaurantOpeningHours[];
  theme?: RestaurantTheme;
  settings?: RestaurantSettings;

  isOpen: boolean;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Verifica se o restaurante está aberto no momento
 */
export function isRestaurantOpen(restaurant: Restaurant): boolean {
  if (!restaurant.openingHours || restaurant.openingHours.length === 0) {
    return restaurant.isOpen; // Usa flag manual
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const todayHours = restaurant.openingHours.find((h) => h.day === currentDay);

  if (!todayHours) {
    return false; // Fechado hoje
  }

  return currentTime >= todayHours.open && currentTime <= todayHours.close;
}

/**
 * Retorna horário de funcionamento formatado para hoje
 */
export function getTodayHours(restaurant: Restaurant): string | null {
  if (!restaurant.openingHours || restaurant.openingHours.length === 0) {
    return null;
  }

  const currentDay = new Date().getDay();
  const todayHours = restaurant.openingHours.find((h) => h.day === currentDay);

  if (!todayHours) {
    return "Fechado hoje";
  }

  return `${todayHours.open} - ${todayHours.close}`;
}
