"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  ChefHat,
  ShoppingBag,
  Timer,
  Truck,
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

// Simulated order data - in production, fetch from API
const mockOrder = {
  id: "12345",
  status: "preparing" as const,
  customerName: "João Silva",
  customerPhone: "(11) 99999-9999",
  deliveryType: "delivery" as const,
  deliveryAddress: "Rua das Flores, 123 - Centro",
  items: [
    {
      id: 1,
      name: "X-Burger Especial",
      quantity: 2,
      price: 32.9,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100",
    },
    {
      id: 2,
      name: "Batata Frita Grande",
      quantity: 1,
      price: 18.9,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100",
    },
  ],
  subtotal: 84.7,
  deliveryFee: 5.0,
  discount: 0,
  total: 89.7,
  estimatedTime: 40,
  createdAt: new Date().toISOString(),
};

type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered";

const statusSteps = [
  { id: "received" as const, label: "Recebido", icon: CheckCircle2 },
  { id: "preparing" as const, label: "Preparando", icon: ChefHat },
  { id: "ready" as const, label: "Pronto", icon: ShoppingBag },
  { id: "delivering" as const, label: "A caminho", icon: Truck },
];

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const orderId = params?.id as string;

  const [order] = useState(mockOrder);
  const [status, setStatus] = useState<OrderStatus>("received");

  // Simulate status progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setStatus("preparing"), 2000),
      setTimeout(() => setStatus("ready"), 6000),
      setTimeout(() => setStatus("delivering"), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const currentStepIndex = statusSteps.findIndex((s) => s.id === status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <header className="bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Pedido #{orderId} Confirmado!
          </h1>
          <p className="text-white/90 flex items-center justify-center gap-2">
            <Clock size={16} />
            Previsão: {order.estimatedTime} minutos
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-6 pb-24">
        {/* Status Timeline Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-6 sm:p-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
              Acompanhe seu pedido
            </h2>

            {/* Timeline */}
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-100">
                <div
                  className="h-full bg-green-500 transition-all duration-1000 ease-out"
                  style={{
                    width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Steps */}
              {statusSteps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? "bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      className={`mt-3 text-xs font-bold uppercase transition-colors text-center ${
                        isActive ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="absolute -bottom-6 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full animate-pulse">
                        Agora
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              Itens do Pedido
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {item.quantity}x {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} cada
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Entrega</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Desconto</span>
                  <span>- {formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              Informações da Entrega
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium text-gray-900">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium text-gray-900">
                    {order.customerPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Timer size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Previsão</p>
                  <p className="font-medium text-gray-900">
                    {order.estimatedTime} minutos
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => router.push(`/r/${slug}/cardapio`)}
              >
                <ArrowLeft size={18} className="mr-2" />
                Voltar ao Cardápio
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
