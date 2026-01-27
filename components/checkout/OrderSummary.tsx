"use client";

import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export function OrderSummary() {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { items, getCartTotal } = useCartStore();

  if (!isMounted) return null; // Avoid rendering mismatch on server

  const subtotal = getCartTotal();
  const deliveryFee = 5.0; // Mock fixo por enquanto
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sticky top-6 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--color-border)]">
        <ShoppingBag className="text-[var(--color-primary)]" size={20} />
        <h2 className="font-display font-bold text-lg">Resumo do Pedido</h2>
      </div>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start text-sm"
          >
            <div className="flex gap-2">
              <span className="font-bold text-[var(--color-primary)]">
                {item.quantity}x
              </span>
              <span className="text-gray-300">{item.name}</span>
            </div>
            <span className="font-medium">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-gray-500 py-4 italic">
            Seu carrinho está vazio.
          </p>
        )}
      </div>

      <div className="space-y-2 text-sm border-t border-[var(--color-border)] pt-4">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Taxa de Entrega</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-white pt-2 mt-2 border-t border-white/5">
          <span>Total</span>
          <span className="text-[var(--color-primary)] text-glow">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="mt-6 pt-4 border-t border-dashed border-gray-700">
        <div className="flex items-center justify-center gap-2 text-xs text-green-500 bg-green-900/10 py-2 rounded-md border border-green-900/30">
          <span>🔒</span> Checkout Seguro SSL
        </div>
      </div>
    </div>
  );
}
