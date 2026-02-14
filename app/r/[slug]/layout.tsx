import { notFound } from "next/navigation";
import { Restaurant } from "@/types/restaurant";
import { RestaurantLayoutClient } from "@/components/restaurant/RestaurantLayoutClient";

// TODO: Substituir por chamada real à API quando backend estiver pronto
// Por enquanto, usando dados mock para desenvolvimento
const MOCK_RESTAURANTS: Record<string, Restaurant> = {
  demo: {
    id: "1",
    slug: "demo",
    name: "FSW Donald's",
    description:
      "Hambúrgueres artesanais, acompanhamentos crocantes e bebidas geladas.",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    banner:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    phone: "(11) 99999-9999",
    whatsapp: "5511999999999",
    isOpen: true,
    isActive: true,
    openingHours: [
      { day: 0, open: "11:00", close: "22:00" }, // Domingo
      { day: 1, open: "11:00", close: "23:00" }, // Segunda
      { day: 2, open: "11:00", close: "23:00" }, // Terça
      { day: 3, open: "11:00", close: "23:00" }, // Quarta
      { day: 4, open: "11:00", close: "23:00" }, // Quinta
      { day: 5, open: "11:00", close: "00:00" }, // Sexta
      { day: 6, open: "11:00", close: "00:00" }, // Sábado
    ],
    settings: {
      deliveryEnabled: true,
      pickupEnabled: true,
      tableEnabled: false,
      deliveryFee: 5.0,
      minOrderValue: 20.0,
      estimatedDeliveryTime: 40,
      estimatedPickupTime: 20,
    },
    theme: {
      primaryColor: "#D90007",
      accentColor: "#FFC72C",
    },
  },
  "pizzaria-bella": {
    id: "2",
    slug: "pizzaria-bella",
    name: "Pizzaria Bella Napoli",
    description: "As melhores pizzas artesanais da cidade.",
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
    isOpen: true,
    isActive: true,
    settings: {
      deliveryEnabled: true,
      pickupEnabled: true,
      tableEnabled: false,
      deliveryFee: 8.0,
    },
    theme: {
      primaryColor: "#16a34a",
      accentColor: "#fbbf24",
    },
  },
};

async function getRestaurant(slug: string): Promise<Restaurant | null> {
  // TODO: Implementar chamada real à API
  // const response = await fetch(`${process.env.API_URL}/api/v1/restaurants/slug/${slug}`);
  // if (!response.ok) return null;
  // return response.json();

  // Mock para desenvolvimento
  return MOCK_RESTAURANTS[slug] || null;
}

interface RestaurantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function RestaurantLayout({
  children,
  params,
}: RestaurantLayoutProps) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantLayoutClient restaurant={restaurant}>
      {children}
    </RestaurantLayoutClient>
  );
}
