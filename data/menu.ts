import { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Hambúrgueres",
    slug: "burgers",
    icon: "🍔",
    order: 1,
    active: true,
  },
  {
    id: "2",
    name: "Pizzas",
    slug: "pizzas",
    icon: "🍕",
    order: 2,
    active: true,
  },
  {
    id: "3",
    name: "Bebidas",
    slug: "drinks",
    icon: "🥤",
    order: 3,
    active: true,
  },
  {
    id: "4",
    name: "Sobremesas",
    slug: "desserts",
    icon: "🍰",
    order: 4,
    active: true,
  },
  {
    id: "5",
    name: "Combos",
    slug: "combos",
    icon: "🍱",
    order: 5,
    active: true,
  },
];

export const products: Product[] = [
  {
    id: "101",
    name: "X-Monstro Supremo",
    description:
      "Dois hambúrgueres artesanais de 180g, cheddar duplo, bacon crocante, cebola set.",
    price: 38.9,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    categoryId: "1",
    rating: 4.8,
    preparationTime: 20,
    tags: ["popular", "meat-lover"],
    available: true,
    active: true,
    order: 1,
  },
  {
    id: "102",
    name: "Smash Classic",
    description:
      "Um smash de 100g, queijo prato derretido, alface, tomate e molho da casa.",
    price: 24.5,
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80",
    categoryId: "1",
    rating: 4.5,
    preparationTime: 15,
    available: true,
    active: true,
    order: 2,
  },
  {
    id: "103",
    name: "Veggie Burger",
    description:
      "Hambúrguer de grão de bico com especiarias, alface, tomate e maionese vegana.",
    price: 28.0,
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80",
    categoryId: "1",
    rating: 4.3,
    preparationTime: 18,
    dietaryInfo: ["vegetarian", "vegan"],
    available: true,
    active: true,
    order: 3,
  },
  {
    id: "201",
    name: "Pizza Margherita",
    description:
      "Molho de tomate italiano, mozzarella de búfala, manjericão fresco e azeite.",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80",
    categoryId: "2",
    rating: 4.6,
    preparationTime: 25,
    dietaryInfo: ["vegetarian"],
    nutritionalInfo: { calories: 800, protein: 35, carbs: 90, fats: 40 },
    ingredients: [
      "Farinha Italiana",
      "Mozzarella de Búfala",
      "Molho de Tomate",
      "Manjericão",
    ],
    tags: ["vegetariano"],
    available: true,
    active: true,
    order: 1,
  },
  {
    id: "301",
    name: "Coca-Cola Latinha",
    description: "350ml gelada.",
    price: 6.0,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
    categoryId: "3",
    available: true,
    active: true,
    order: 1,
  },
  {
    id: "401",
    name: "Brownie com Sorvete",
    description:
      "Brownie de chocolate meio amargo com uma bola de sorvete de creme.",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&q=80",
    categoryId: "4",
    rating: 4.9,
    dietaryInfo: ["vegetarian"],
    ingredients: [
      "Chocolate 70%",
      "Açúcar Mascavo",
      "Nozes",
      "Sorvete de Baunilha",
    ],
    available: true,
    active: true,
    order: 1,
  },
];
