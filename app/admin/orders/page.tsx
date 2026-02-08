"use client";

import { useState, useEffect } from "react";
import { ordersApi } from "@/lib/api/orders";
import { OrderCard } from "@/components/admin/OrderCard";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data removed
const mockOrders: any[] = [];

const columns: { id: string; label: string; color: string }[] = [
  { id: "PENDING", label: "Pendente", color: "bg-yellow-500" },
  { id: "PREPARING", label: "Em Preparo", color: "bg-orange-500" },
  { id: "READY", label: "Pronto", color: "bg-green-500" },
];

export default function KitchenOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const refresh = async () => {
    try {
      const data = await ordersApi.getToday();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action: any, orderId: string) => {
    try {
      await ordersApi.updateStatusHelper(orderId, action);
      refresh();
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar status");
    }
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
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      onAction={handleAction}
                    />
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
