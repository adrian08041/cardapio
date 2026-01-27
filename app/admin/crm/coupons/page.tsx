"use client";

import { useState } from "react";
import { Coupon, CouponType } from "@/types";
import {
  Search,
  Plus,
  Tag,
  Ticket,
  Filter,
  Copy,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock Coupons
const MOCK_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "BEMVINDO10",
    type: "percentage",
    value: 10,
    minOrderValue: 50,
    startDate: "2023-01-01",
    maxUses: 1000,
    isActive: true,
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    code: "FRETEGRATIS",
    type: "free_shipping",
    value: 0,
    minOrderValue: 100,
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    isActive: true,
    createdAt: "2023-06-01",
  },
  {
    id: "3",
    code: "BURGERDAY",
    type: "fixed_amount",
    value: 15,
    minOrderValue: 40,
    startDate: "2023-05-28",
    endDate: "2023-05-29",
    maxUses: 50,
    isActive: false, // Expired
    createdAt: "2023-05-20",
  },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [isCreating, setIsCreating] = useState(false);

  // Stats
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const expiredCoupons = coupons.filter((c) => !c.isActive).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="text-blue-600" /> Gestão de Cupons
          </h1>
          <p className="text-gray-500 mt-1">
            Crie códigos promocionais para engajar seus clientes.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
        >
          <Plus size={20} /> Novo Cupom
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Cupons Ativos"
          value={activeCoupons}
          icon={<CheckCircle size={20} className="text-green-600" />}
          bg="bg-green-50"
          border="border-green-100"
        />
        <StatsCard
          title="Expirados / Inativos"
          value={expiredCoupons}
          icon={<AlertTriangle size={20} className="text-orange-600" />}
          bg="bg-orange-50"
          border="border-orange-100"
        />
        <StatsCard
          title="Total de Campanhas"
          value={coupons.length}
          icon={<Tag size={20} className="text-blue-600" />}
          bg="bg-blue-50"
          border="border-blue-100"
        />
      </div>

      {/* LISTA DE CUPONS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar código..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
            <Filter size={18} /> Filtros
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Código
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Desconto
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Regras
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Validade
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                      {coupon.code}
                    </span>
                    <button
                      className="text-gray-400 hover:text-blue-600"
                      title="Copiar"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <BadgeType type={coupon.type} value={coupon.value} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {coupon.minOrderValue
                      ? `Mínimo: ${formatCurrency(coupon.minOrderValue)}`
                      : "Sem mínimo"}
                  </div>
                  {coupon.maxUses && (
                    <div className="text-xs text-gray-400">
                      Limite: {coupon.maxUses} usos
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span>
                      {new Date(coupon.startDate).toLocaleDateString()}
                      {coupon.endDate &&
                        ` até ${new Date(coupon.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      coupon.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {coupon.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 font-bold text-sm hover:underline">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL (Mocked visual) */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Novo Cupom</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Código do Cupom
                </label>
                <input
                  type="text"
                  placeholder="EX: VERAO2025"
                  className="w-full p-3 border border-gray-300 rounded-lg font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  O código que o cliente digita no checkout.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Tipo de Desconto
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                    <option value="shipping">Frete Grátis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
                <p className="font-bold mb-1">💡 Dica de Fidelidade:</p>
                <p>
                  Cupons de "Primeira Compra" com validade de 30 dias aumentam a
                  conversão de novos clientes em 15%.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-colors"
              >
                Criar Cupom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, icon, bg, border }: any) {
  return (
    <div
      className={`p-4 rounded-xl border ${bg} ${border} flex items-center gap-4`}
    >
      <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function BadgeType({ type, value }: { type: CouponType; value: number }) {
  if (type === "percentage") {
    return (
      <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-sm">
        {value}% OFF
      </span>
    );
  }
  if (type === "fixed_amount") {
    return (
      <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm">
        - {formatCurrency(value)}
      </span>
    );
  }
  if (type === "free_shipping") {
    return (
      <span className="text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded text-sm">
        Entrega Grátis
      </span>
    );
  }
  return <span>{value}</span>;
}
