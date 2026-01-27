"use client";

import { useState } from "react";
import { Customer } from "@/types";
import { Search, Users, Plus, Star, Filter } from "lucide-react";

// Mock Customers
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Ana Silva",
    phone: "(11) 99999-1234",
    address: [], // Simplificado para listagem
    metrics: {
      totalOrders: 15,
      totalSpent: 1250,
      averageTicket: 83.33,
      lastOrderDate: "2023-10-25",
    },
    loyalty: {
      currentPoints: 1250,
      lifetimePoints: 1250,
      tier: "platinum",
      transactions: [],
    },
    status: "active",
    tags: ["vip", "lunch-lover"],
    metrics: { totalOrders: 15, totalSpent: 1250, averageTicket: 83.33 },
    addresses: [],
    createdAt: "2023-01-10",
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    phone: "(11) 98888-5678",
    addresses: [],
    metrics: {
      totalOrders: 2,
      totalSpent: 150,
      averageTicket: 75,
      lastOrderDate: "2023-09-10",
      daysSinceLastOrder: 45,
    },
    loyalty: {
      currentPoints: 150,
      lifetimePoints: 150,
      tier: "bronze",
      transactions: [],
    },
    status: "active",
    tags: ["new"],
    createdAt: "2023-09-01",
  },
  {
    id: "3",
    name: "Mariana Costa",
    phone: "(11) 97777-4321",
    addresses: [],
    metrics: {
      totalOrders: 8,
      totalSpent: 600,
      averageTicket: 75,
      lastOrderDate: "2023-07-15",
      daysSinceLastOrder: 100,
    },
    loyalty: {
      currentPoints: 600,
      lifetimePoints: 900,
      tier: "silver",
      transactions: [],
    },
    status: "inactive", // Risco de churn
    tags: ["churn-risk"],
    createdAt: "2023-02-15",
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
            Ativo
          </span>
        );
      case "inactive":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">
            Inativo
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "platinum":
        return <Star className="text-purple-600 fill-purple-600" size={14} />;
      case "gold":
        return <Star className="text-yellow-500 fill-yellow-500" size={14} />;
      case "silver":
        return <Star className="text-gray-400 fill-gray-400" size={14} />;
      default:
        return <Star className="text-amber-700" size={14} />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Clientes
          </h1>
          <p className="text-gray-500 mt-1">Gerencie sua base e fidelidade.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={20} /> Novo Cliente
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou CPF..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
          <Filter size={20} /> Filtros
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Cliente
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Fidelidade
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Total Gasto
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Último Pedido
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(customer.status)}
                  {customer.tags.includes("churn-risk") && (
                    <span className="ml-2 text-xs text-red-600 font-bold">
                      ⚠️ Risco
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getTierIcon(customer.loyalty.tier)}
                    <span className="font-medium capitalize text-gray-700">
                      {customer.loyalty.tier}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {customer.loyalty.currentPoints} pts
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    R$ {customer.metrics.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {customer.metrics.totalOrders} pedidos
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">
                    {customer.metrics.lastOrderDate || "Nunca"}
                  </div>
                  {customer.metrics.daysSinceLastOrder &&
                    customer.metrics.daysSinceLastOrder > 30 && (
                      <div className="text-xs text-orange-500 font-medium">
                        {customer.metrics.daysSinceLastOrder} dias atrás
                      </div>
                    )}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
