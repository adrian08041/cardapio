"use client";

import { useDrag, useDrop } from "react-dnd";
import { Order, OrderStatus } from "@/types/order";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, ShoppingBag, User } from "lucide-react";

interface OrderCardProps {
  order: any;
  index: number;
  onAction?: (action: string, orderId: string) => void;
}

// Em um app real, usaríamos react-dnd, mas para simplificar e garantir
// que funcione sem setup complexo de Providers agora, faremos visualização em card simples.
// Se o usuário quiser Drag & Drop real, implementamos em seguida.

export function OrderCard({ order, onAction }: OrderCardProps) {
  const statusColors: any = {
    PENDING: "border-l-4 border-l-yellow-500",
    PREPARING: "border-l-4 border-l-orange-500",
    READY: "border-l-4 border-l-green-500",
    DELIVERED: "border-l-4 border-l-gray-500 opacity-60",
    CANCELLED: "border-l-4 border-l-red-500 opacity-60",
  };

  return (
    <div
      className={cn(
        "bg-[var(--color-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer",
        statusColors[order.status],
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-lg">#{order.id.slice(0, 4)}</h4>
        <span className="text-xs font-mono text-gray-500">
          {new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3 text-sm text-[var(--color-muted-foreground)]">
        <User size={14} className="text-[var(--color-primary)]" />
        <span className="font-medium truncate">{order.customerName}</span>
      </div>

      <div className="space-y-2 mb-4 border-y border-[var(--color-border)]/50 py-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-2 text-sm">
            <span className="font-bold text-[var(--color-primary)] w-4">
              {item.quantity}x
            </span>
            <span className="text-[var(--color-foreground)] line-clamp-1">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-2">
        <Badge
          variant={order.type === "delivery" ? "secondary" : "outline"}
          className="text-xs"
        >
          {order.type === "delivery" ? "🛵 Delivery" : "🏪 Retirada"}
        </Badge>
        <span className="font-bold text-[var(--color-primary)]">
          {formatCurrency(order.total)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex gap-2 justify-end">
        {order.status === "PENDING" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction?.("prepare", order.id);
            }}
            className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded hover:bg-orange-700 w-full"
          >
            Iniciar Preparo
          </button>
        )}
        {order.status === "PREPARING" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction?.("ready", order.id);
            }}
            className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 w-full"
          >
            Marcar Pronto
          </button>
        )}
        {order.status === "READY" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction?.("deliver", order.id);
            }}
            className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 w-full"
          >
            Entregar
          </button>
        )}
      </div>
    </div>
  );
}
