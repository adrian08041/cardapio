"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, cn } from "@/lib/utils";

// Mock Data for Recent Orders
const recentOrders = [
  {
    id: "#1234",
    customer: "João Silva",
    total: 85.5,
    status: "Preparando",
    time: "10 min",
  },
  {
    id: "#1233",
    customer: "Maria Oliveira",
    total: 42.0,
    status: "Pronto",
    time: "25 min",
  },
  {
    id: "#1232",
    customer: "Carlos Souza",
    total: 120.9,
    status: "Entregue",
    time: "50 min",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-foreground)]">
            Dashboard
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Visão geral do seu restaurante hoje.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] bg-[var(--color-card)] px-4 py-2 rounded-full border border-[var(--color-border)] shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Aberto agora
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Vendas Hoje"
          value={formatCurrency(1250.0)}
          change="+12%"
          trend="up"
          icon={DollarSign}
          color="secondary"
        />
        <StatsCard
          title="Pedidos"
          value="45"
          change="+5%"
          trend="up"
          icon={ShoppingBag}
          color="primary"
        />
        <StatsCard
          title="Ticket Médio"
          value={formatCurrency(27.8)}
          change="-2%"
          trend="down"
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Novos Clientes"
          value="12"
          change="Automático"
          trend="neutral"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Content Grid (Recent Orders + Kitchen View Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
            <h2 className="font-bold text-lg text-[var(--color-foreground)]">
              Pedidos Recentes
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 hover:bg-[var(--color-primary)]/5"
            >
              Ver todos <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>

          <div className="p-0">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-secondary)]/50 text-xs uppercase text-[var(--color-muted-foreground)] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--color-secondary)]/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-[var(--color-muted-foreground)]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--color-foreground)]">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-1 rounded-full border",
                          order.status === "Preparando"
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : order.status === "Pronto"
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-gray-50 text-gray-600 border-gray-200",
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium text-[var(--color-foreground)]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-[var(--color-muted-foreground)]"
                      >
                        <ArrowRight size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Kitchen Status */}
        <div className="space-y-6">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-[var(--color-foreground)]">
              <Clock size={20} className="text-[var(--color-primary)]" />
              Status da Cozinha
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-muted-foreground)]">
                  Tempo de Espera
                </span>
                <span className="font-bold text-[var(--color-foreground)]">
                  25-35 min
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-muted-foreground)]">
                  Pedidos na Fila
                </span>
                <span className="font-bold text-orange-600">8</span>
              </div>
              <div className="w-full bg-[var(--color-secondary)] h-2 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-orange-500 w-[60%]" />
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)] pt-1 text-center">
                Cozinha operando com alta demanda
              </p>
            </div>

            <Button className="w-full mt-6" variant="outline">
              Gerenciar Fila
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
