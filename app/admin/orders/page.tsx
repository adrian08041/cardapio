"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import { OrderCard } from "@/components/admin/OrderCard";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data with fixed dates to avoid Hydration Mismatch
const mockOrders: Order[] = [
  {
    id: "102030",
    customerName: "Fernanda Costa",
    status: "pending",
    type: "delivery",
    total: 89.9,
    createdAt: new Date("2024-01-27T10:30:00"),
    items: [
      { id: "1", name: "X-Monstro Supremo", quantity: 2, price: 38.9 },
      { id: "2", name: "Coca-Cola", quantity: 2, price: 6.0 },
    ],
  },
  {
    id: "102031",
    customerName: "Bruno Lima",
    status: "preparing",
    type: "pickup",
    total: 45.0,
    createdAt: new Date("2024-01-27T11:15:00"),
    items: [{ id: "3", name: "Pizza Calabresa", quantity: 1, price: 42.0 }],
  },
  {
    id: "102032",
    customerName: "Ana Silva",
    status: "ready",
    type: "delivery",
    total: 24.5,
    createdAt: new Date("2024-01-27T11:45:00"),
    items: [{ id: "4", name: "Smash Classic", quantity: 1, price: 24.5 }],
  },
];

const columns: { id: OrderStatus; label: string; color: string }[] = [
  { id: "pending", label: "Pendente", color: "bg-yellow-500" },
  { id: "preparing", label: "Em Preparo", color: "bg-orange-500" },
  { id: "ready", label: "Pronto", color: "bg-green-500" },
];

export default function KitchenOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Simulating real-time refresh
  const refresh = () => {
    // In real app, this would refetch SWR/React Query
    console.log("Refreshed!");
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-foreground)]">
            Pedidos da Cozinha
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Gerencie o fluxo de produção em tempo real.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} className="gap-2">
          <RefreshCcw size={16} />
          Atualizar
        </Button>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map((column) => {
          const columnOrders = orders.filter((o) => o.status === column.id);

          return (
            <div
              key={column.id}
              className="flex flex-col bg-[var(--color-secondary)]/30 border border-[var(--color-border)] rounded-[var(--radius-xl)] h-full overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-card)]">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", column.color)} />
                  <h3 className="font-bold text-[var(--color-foreground)]">
                    {column.label}
                  </h3>
                </div>
                <span className="bg-[var(--color-background)] px-2 py-1 rounded text-xs font-bold border border-[var(--color-border)]">
                  {columnOrders.length}
                </span>
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {columnOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                    <p className="text-sm">Sem pedidos</p>
                  </div>
                ) : (
                  columnOrders.map((order, index) => (
                    <OrderCard key={order.id} order={order} index={index} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
