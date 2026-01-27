"use client";

import { Order } from "@/types";
import { Clock, AlertTriangle, Utensils, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";

interface KDSCardProps {
  order: Order;
  onAdvanceStatus?: (orderId: string) => void;
}

export function KDSCard({ order, onAdvanceStatus }: KDSCardProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(order.createdAt).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000 / 60);
      setElapsedMinutes(diff);
    };
    calculateTime();
    const timer = setInterval(calculateTime, 30000);
    return () => clearInterval(timer);
  }, [order.createdAt]);

  // Lógica Semáforo (Configurável futuramente)
  let statusColor = "bg-emerald-600 border-emerald-500"; // Verde (Padrão)
  let headerColor = "bg-emerald-700";

  // Níveis de Urgência
  if (elapsedMinutes >= 10) {
    statusColor = "bg-yellow-600 border-yellow-500"; // Atenção
    headerColor = "bg-yellow-700";
  }
  if (elapsedMinutes >= 20) {
    statusColor = "bg-red-600 border-red-500 animate-pulse-slow"; // Crítico
    headerColor = "bg-red-700";
  }
  if (order.status === "ready") {
    statusColor = "bg-gray-700 border-gray-600";
    headerColor = "bg-gray-800";
  }

  return (
    <div
      onClick={() => onAdvanceStatus?.(order.id)}
      className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden cursor-pointer active:scale-[0.98] transition-transform select-none h-full border-l-8 border-l-transparent"
      style={{
        borderLeftColor:
          elapsedMinutes >= 20
            ? "#DC2626"
            : elapsedMinutes >= 10
              ? "#D97706"
              : "#059669",
      }}
    >
      {/* HEADER DE ALTO CONTRASTE */}
      <div
        className={`${headerColor} text-white p-3 flex justify-between items-center`}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black tracking-tighter shadow-black drop-shadow-md">
            #{order.id.slice(-3)}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium opacity-80 uppercase">
              {order.tableNumber
                ? `MESA ${order.tableNumber}`
                : order.customerName}
            </span>
            <span className="text-[10px] opacity-70">
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* TIMER BOX */}
        <div className="flex flex-col items-end">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 font-mono font-bold text-lg leading-none`}
          >
            <Clock size={16} />
            <span>{elapsedMinutes}'</span>
          </div>
        </div>
      </div>

      {/* CORPO DO TICKET */}
      <div className="p-3 bg-gray-50 flex-1 flex flex-col gap-3">
        <ul className="space-y-3">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex flex-col border-b border-gray-200 pb-2 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <span className="bg-gray-900 text-white font-black text-lg w-8 h-8 flex items-center justify-center rounded-md shrink-0">
                  {item.quantity}
                </span>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-bold text-lg leading-tight uppercase">
                    {item.name}
                  </span>

                  {/* Customizações/Adicionais */}
                  {item.addons && item.addons.length > 0 && (
                    <div className="text-gray-600 text-sm mt-0.5">
                      {item.addons.map((addon) => `+ ${addon}`).join(", ")}
                    </div>
                  )}

                  {/* Observações - DESTAQUE MÁXIMO */}
                  {item.notes && (
                    <div className="mt-1 flex items-start gap-1 text-red-700 font-bold text-sm bg-red-50 p-1.5 rounded border border-red-100 uppercase">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Observações Gerais do Pedido */}
        {order.notes && (
          <div className="mt-auto bg-yellow-50 border border-yellow-200 p-2 rounded text-yellow-800 text-sm font-bold flex items-start gap-2">
            <span className="uppercase">⚠️ Nota do Pedido: {order.notes}</span>
          </div>
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="bg-[var(--color-secondary)] p-2 border-t border-[var(--color-border)] text-center">
        <span className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest">
          {order.status === "pending"
            ? "Toque para Iniciar"
            : order.status === "preparing"
              ? "Toque para Finalizar"
              : "Pronto"}
        </span>
      </div>
    </div>
  );
}
