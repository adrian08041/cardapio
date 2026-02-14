"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  pixDiscount: number;
  finalTotal: number;
  couponCode?: string;
  isPixPayment: boolean;
  isProcessing: boolean;
  onPlaceOrder: () => void;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  discountAmount,
  pixDiscount,
  finalTotal,
  couponCode,
  isPixPayment,
  isProcessing,
  onPlaceOrder,
}: OrderSummaryProps) {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="text-[var(--color-primary)]" size={20} />
        Resumo do Pedido
      </h2>

      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={`${item.id}-${item.notes || ""}`} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <span className="font-medium text-sm line-clamp-1">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold text-sm whitespace-nowrap">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
              {item.notes && (
                <p className="text-xs text-gray-500 italic truncate mt-0.5">
                  "{item.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Taxa de Entrega</span>
          <span
            className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}
          >
            {deliveryFee === 0 ? "Grátis" : formatCurrency(deliveryFee)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Desconto {couponCode && `(${couponCode})`}</span>
            <span>- {formatCurrency(discountAmount)}</span>
          </div>
        )}

        {isPixPayment && pixDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Desconto Pix (5%)</span>
            <span>- {formatCurrency(pixDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-100">
          <span>Total</span>
          <span className="text-[var(--color-primary)]">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onPlaceOrder}
        disabled={isProcessing}
        className="w-full mt-6 h-14 text-base font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-lg shadow-[var(--color-primary)]/20 active:scale-[0.98] transition-transform"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          `Confirmar Pedido • ${formatCurrency(finalTotal)}`
        )}
      </Button>
    </section>
  );
}
