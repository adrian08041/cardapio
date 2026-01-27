"use client";

import { useState, useEffect, useMemo } from "react";
import { KDSCard } from "@/components/kds/KDSCard";
import { KDSHeader } from "@/components/kds/KDSHeader";
import {
  KDSSettingsModal,
  KDSSettings,
} from "@/components/kds/KDSSettingsModal";
import { Order, OrderItem } from "@/types";

// Mock Data Refined for Sectors
const MOCK_ORDERS: Order[] = [
  {
    id: "101",
    customerName: "Mesa 05",
    items: [
      {
        id: "1",
        name: "Hambúrguer Clássico",
        quantity: 2,
        price: 25,
        station: "kitchen",
        notes: "Sem cebola",
      },
      {
        id: "2",
        name: "Batata Frita",
        quantity: 1,
        price: 12,
        station: "kitchen",
      },
      { id: "3", name: "Cola Zero", quantity: 2, price: 6, station: "bar" },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 min ago
    total: 62,
  },
  {
    id: "102",
    customerName: "Delivery (João)",
    items: [
      {
        id: "4",
        name: "Pizza Calabresa",
        quantity: 1,
        price: 45,
        station: "kitchen",
      },
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago (Warning)
    total: 45,
  },
  {
    id: "103",
    customerName: "Bar Balcão",
    items: [
      { id: "5", name: "Gin Tônica", quantity: 2, price: 25, station: "bar" },
      { id: "6", name: "Água Mineral", quantity: 1, price: 5, station: "bar" },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    total: 55,
  },
  {
    id: "104",
    customerName: "Mesa 12",
    items: [
      {
        id: "7",
        name: "Petit Gateau",
        quantity: 1,
        price: 22,
        station: "dessert",
      },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 min ago (Critical)
    total: 22,
  },
];

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<KDSSettings>({
    station: "all",
    soundEnabled: true,
    autoPrint: false,
    columns: 3,
  });

  // Auto-refresh timer for elapsed time calculation across all children
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // Filter Logic based on Station
  const filteredOrders = useMemo(() => {
    return orders
      .map((order) => {
        // 1. If viewing ALL, show everything
        if (settings.station === "all") return order;

        // 2. Filter items relevant to this station
        const relevantItems = order.items.filter(
          (item) => item.station === settings.station || !item.station, // Show undefined station items just in case
        );

        // 3. If no items for this station, return null (filter out later)
        if (relevantItems.length === 0) return null;

        // 4. Return new order object with ONLY relevant items displayed
        return {
          ...order,
          items: relevantItems,
        };
      })
      .filter(Boolean) as Order[];
  }, [orders, settings.station]);

  const pendingOrders = filteredOrders.filter((o) => o.status === "pending");
  const preparingOrders = filteredOrders.filter(
    (o) => o.status === "preparing",
  );
  const readyOrders = filteredOrders.filter((o) => o.status === "ready");

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === "pending") return { ...o, status: "preparing" };
        if (o.status === "preparing") return { ...o, status: "ready" };
        return o; // Ready stays ready or moves to archive (not implemented)
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden flex flex-col font-mono">
      {/* Header with Settings Trigger */}
      <div className="relative">
        <KDSHeader activeCount={filteredOrders.length} />
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-0 right-0 h-full w-16 opacity-0 hover:opacity-10 cursor-alias"
        >
          {/* Secret settings button overlay on top-right */}
        </button>
      </div>

      <div
        className={`flex-1 grid grid-cols-${settings.columns} gap-4 p-4 h-full bg-[var(--color-background)]`}
      >
        {/* Coluna 1: Novos */}
        <KDSColumn
          title="Novos Pedidos"
          count={pendingOrders.length}
          orders={pendingOrders}
          color="blue"
          onAdvance={advanceStatus}
        />

        {/* Coluna 2: Em Preparo */}
        <KDSColumn
          title="Em Preparo"
          count={preparingOrders.length}
          orders={preparingOrders}
          color="yellow"
          onAdvance={advanceStatus}
        />

        {/* Coluna 3: Prontos (Opcional, se configurar 3 colunas) */}
        {settings.columns >= 3 && (
          <KDSColumn
            title="Prontos / Retirada"
            count={readyOrders.length}
            orders={readyOrders}
            color="green"
            onAdvance={advanceStatus}
          />
        )}
      </div>

      <div className="bg-[var(--color-foreground)] px-4 py-1 text-[10px] text-[var(--color-background)] flex justify-between uppercase font-bold tracking-widest">
        <span>
          KDS v2.0 • Estação:{" "}
          {settings.station === "all" ? "MASTER" : settings.station}
        </span>
        <span>Pressione F11 para Tela Cheia</span>
      </div>

      <KDSSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={settings}
        onSave={setSettings}
      />
    </div>
  );
}

// Subcomponente de Coluna para limpar o layout
function KDSColumn({ title, count, orders, color, onAdvance }: any) {
  // Cores adaptadas para Light Mode
  const headerStyles = {
    blue: "border-blue-200 bg-blue-50",
    yellow: "border-orange-200 bg-orange-50", // Usei orange para yellow ficar mais legível no light
    green: "border-emerald-200 bg-emerald-50",
  };

  const titleColors = {
    blue: "text-blue-700",
    yellow: "text-orange-700",
    green: "text-emerald-700",
  };

  const badgeColors = {
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-orange-100 text-orange-800",
    green: "bg-emerald-100 text-emerald-800",
  };

  const bgStyles = headerStyles[color as keyof typeof headerStyles];

  return (
    <div className="flex flex-col bg-[var(--color-secondary)]/30 rounded-xl border border-[var(--color-border)] overflow-hidden h-full shadow-sm">
      <div
        className={`p-3 flex justify-between items-center border-b-2 ${headerStyles[color as keyof typeof headerStyles]}`}
      >
        <h2
          className={`text-xl font-black uppercase tracking-widest ${titleColors[color as keyof typeof titleColors]}`}
        >
          {title}
        </h2>
        <span
          className={`text-lg px-3 py-1 rounded-lg font-bold border border-current/10 ${badgeColors[color as keyof typeof badgeColors]}`}
        >
          {count}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar bg-gray-50/50">
        {orders.map((order: Order) => (
          <div key={order.id} className="h-auto">
            <KDSCard order={order} onAdvanceStatus={onAdvance} />
          </div>
        ))}
        {orders.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <span className="text-2xl font-bold text-[var(--color-muted-foreground)]">
              SEM PEDIDOS
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
