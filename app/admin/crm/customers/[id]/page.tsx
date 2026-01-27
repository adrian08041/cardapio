"use client";

import { useState } from "react";
// import { useParams } from "next/navigation"; // Not using yet as we are mocking
import { Customer, Order } from "@/types";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Star,
  Gift,
  MessageCircle,
  MoreVertical,
} from "lucide-react";

// Mock Data for a Specific Customer
const MOCK_CUSTOMER: Customer = {
  id: "1",
  name: "Ana Silva",
  phone: "(11) 99999-1234",
  email: "ana.silva@email.com",
  cpf: "123.456.789-00",
  birthDate: "1990-05-15",
  addresses: [
    {
      id: "1",
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01000-000",
      isDefault: true,
      type: "home",
    },
    {
      id: "2",
      street: "Av. Paulista",
      number: "1000",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      isDefault: false,
      type: "work",
    },
  ],
  metrics: {
    totalOrders: 15,
    totalSpent: 1250.5,
    averageTicket: 83.36,
    lastOrderDate: "2023-10-25",
    firstOrderDate: "2023-01-10",
    daysSinceLastOrder: 5,
  },
  loyalty: {
    currentPoints: 1250,
    lifetimePoints: 1250,
    tier: "platinum",
    transactions: [
      {
        id: "1",
        customerId: "1",
        type: "earn",
        points: 85,
        description: "Pedido #1234",
        createdAt: "2023-10-25",
      },
      {
        id: "2",
        customerId: "1",
        type: "redeem",
        points: -100,
        description: "Resgate Cupom R$10",
        createdAt: "2023-09-20",
      },
    ],
  },
  status: "active",
  tags: ["vip", "lunch-lover", "vegan"],
  notes: "Prefere entrega sem contato. Alérgica a amendoim.",
  createdAt: "2023-01-10",
};

const MOCK_ORDERS: Partial<Order>[] = [
  {
    id: "1234",
    status: "delivered",
    total: 85.0,
    createdAt: "2023-10-25T12:30:00",
    items: [],
  },
  {
    id: "1220",
    status: "delivered",
    total: 62.5,
    createdAt: "2023-10-15T19:00:00",
    items: [],
  },
  {
    id: "1150",
    status: "cancelled",
    total: 45.0,
    createdAt: "2023-09-20T20:15:00",
    items: [],
  },
];

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // const { id } = params;
  const [customer] = useState<Customer>(MOCK_CUSTOMER);
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "loyalty"
  >("overview");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER PROFILE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-lg">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {customer.name}
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                {customer.status}
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-2 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} /> <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} /> <span>{customer.email}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {customer.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
            <MessageCircle size={18} /> WhatsApp
          </button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<ShoppingBag className="text-blue-600" size={24} />}
          label="Total de Pedidos"
          value={customer.metrics.totalOrders}
          subtext={`Primeiro: ${new Date(customer.metrics.firstOrderDate!).toLocaleDateString()}`}
        />
        <MetricCard
          icon={<DollarSign className="text-green-600" size={24} />}
          label="LTV (Total Gasto)"
          value={`R$ ${customer.metrics.totalSpent.toFixed(2)}`}
          subtext="Lifetime Value"
        />
        <MetricCard
          icon={<Star className="text-yellow-500" size={24} />}
          label="Pontos Fidelidade"
          value={customer.loyalty.currentPoints}
          subtext={`${customer.loyalty.tier.toUpperCase()} Tier`}
        />
        <MetricCard
          icon={<Calendar className="text-purple-500" size={24} />}
          label="Última Compra"
          value={`${customer.metrics.daysSinceLastOrder} dias atrás`}
          subtext={new Date(
            customer.metrics.lastOrderDate!,
          ).toLocaleDateString()}
        />
      </div>

      {/* MAIN CONTENT TABS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
        <div className="flex border-b border-gray-100 px-6">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Visão Geral
          </TabButton>
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          >
            Histórico de Pedidos
          </TabButton>
          <TabButton
            active={activeTab === "loyalty"}
            onClick={() => setActiveTab("loyalty")}
          >
            Extrato de Pontos
          </TabButton>
        </div>

        <div className="p-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Addresses */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-gray-400" /> Endereços
                  Salvos
                </h3>
                <div className="space-y-3">
                  {customer.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors bg-gray-50/50"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="text-xs text-blue-600 font-bold">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-800">
                        {addr.street}, {addr.number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {addr.neighborhood} - {addr.city}/{addr.state}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {addr.zipCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Preferences */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-gray-400" /> Preferências &
                  Notas
                </h3>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-yellow-800 text-sm mb-6">
                  <p className="font-bold mb-1">⚠️ Observações Importantes:</p>
                  <p>{customer.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      R$ {customer.metrics.averageTicket.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 uppercase font-bold mt-1">
                      Ticket Médio
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-gray-900">4.8</div>
                    <div className="text-xs text-gray-500 uppercase font-bold mt-1">
                      Nota Média Dada
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {MOCK_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${order.status === "delivered" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {order.status === "delivered" ? "OK" : "X"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Pedido #{order.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt!).toLocaleDateString()} às{" "}
                        {new Date(order.createdAt!).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      R$ {order.total?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 uppercase">
                      {order.items?.length || 2} itens
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "loyalty" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl text-white">
                <div>
                  <p className="text-sm opacity-70 uppercase tracking-widest font-bold">
                    Saldo Atual
                  </p>
                  <p className="text-4xl font-black mt-1">
                    {customer.loyalty.currentPoints} pts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-70 uppercase tracking-widest font-bold">
                    Nível VIP
                  </p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <Star className="text-purple-400 fill-purple-400" />
                    <span className="text-2xl font-bold capitalize">
                      {customer.loyalty.tier}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-500 uppercase">
                  Extrato de Movimentação
                </h4>
                {customer.loyalty.transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${t.type === "earn" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                      >
                        <Gift size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {t.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold ${t.type === "earn" ? "text-green-600" : "text-red-600"}`}
                    >
                      {t.type === "earn" ? "+" : ""}
                      {t.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function MetricCard({ icon, label, value, subtext }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
}

function TabButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${active ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    >
      {children}
    </button>
  );
}
