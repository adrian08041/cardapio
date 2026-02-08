import { api } from "./client";
import { Order } from "@/types";

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  deliveryAddress?: string;
  deliveryComplement?: string;
  deliveryNeighborhood?: string;

  orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "PIX";
  changeFor?: number;
  deliveryFee?: number;

  couponCode?: string;
  discount?: number;

  notes?: string;

  items: {
    productId: string;
    quantity: number;
    notes?: string;
    addons?: { addonId: string; quantity: number }[];
  }[];
}

const mapOrder = (o: any): Order => ({
  ...o,
  items: o.items
    ? o.items.map((i: any) => ({
        ...i,
        name: i.productName || i.name,
        price: i.unitPrice || i.price,
      }))
    : [],
});

export const ordersApi = {
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const res = await api.post<any>("/orders", data);
    return mapOrder(res);
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get<any>(`/orders/${id}`);
    return mapOrder(res);
  },

  getAll: async (): Promise<Order[]> => {
    const res = await api.get<any[]>("/orders");
    return res.map(mapOrder);
  },

  getToday: async (): Promise<Order[]> => {
    const res = await api.get<any[]>("/orders/today");
    return res.map(mapOrder);
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const res = await api.patch<any>(`/orders/${id}/status`, { status });
    return mapOrder(res);
  },

  updateStatusHelper: async (
    id: string,
    action: "confirm" | "prepare" | "ready" | "deliver" | "cancel",
  ): Promise<Order> => {
    // Usa os endpoints específicos do controller
    let res;
    if (action === "cancel") {
      res = await api.patch<any>(`/orders/${id}/cancel`, {
        reason: "Cancelado pelo Admin",
      });
    } else {
      res = await api.patch<any>(`/orders/${id}/${action}`);
    }
    return mapOrder(res);
  },
};
