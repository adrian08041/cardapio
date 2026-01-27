export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  type: "delivery" | "pickup";
  total: number;
  items: OrderItem[];
  createdAt: Date;
  address?: string;
}
