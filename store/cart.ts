import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode?: string;
  discountAmount: number;
  orderType?: OrderType;
  restaurantSlug?: string;
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (itemId: string, notes?: string) => void;
  updateQuantity: (itemId: string, quantity: number, notes?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setOrderType: (type: OrderType, slug?: string) => void;
  getCartTotal: () => number;
  getDiscountedTotal: () => number;
  getCartCount: () => number;
}

// Helper to generate unique key for cart items based on content
const generateCartKey = (itemId: string, notes?: string) => {
  return `${itemId}-${notes || ""}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      discountAmount: 0,
      couponCode: undefined,
      orderType: undefined,
      restaurantSlug: undefined,

      setOrderType: (type, slug) =>
        set({ orderType: type, restaurantSlug: slug }),

      addItem: (product, quantity = 1, notes = "") => {
        const items = get().items;
        // Check if same product with same notes exists
        const existingItemIndex = items.findIndex(
          (item) =>
            item.id === product.id && (item.notes || "") === (notes || ""),
        );

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems, isOpen: true });
        } else {
          // Add new item
          set({
            items: [...items, { ...product, quantity, notes }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId, notes = "") => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.id === productId && (item.notes || "") === (notes || "")),
          ),
        });
      },

      updateQuantity: (productId, quantity, notes = "") => {
        const items = get().items;
        if (quantity <= 0) {
          // Remove if quantity 0
          set({
            items: items.filter(
              (item) =>
                !(
                  item.id === productId && (item.notes || "") === (notes || "")
                ),
            ),
          });
        } else {
          set({
            items: items.map((item) =>
              item.id === productId && (item.notes || "") === (notes || "")
                ? { ...item, quantity }
                : item,
            ),
          });
        }
      },

      clearCart: () =>
        set({ items: [], couponCode: undefined, discountAmount: 0 }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      applyCoupon: (code, discount) =>
        set({ couponCode: code, discountAmount: discount }),

      removeCoupon: () => set({ couponCode: undefined, discountAmount: 0 }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getDiscountedTotal: () => {
        const total = get().getCartTotal();
        const discount = get().discountAmount;
        return Math.max(0, total - discount);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "food-delivery-cart",
    },
  ),
);
