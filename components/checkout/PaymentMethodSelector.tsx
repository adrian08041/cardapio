"use client";

import { CreditCard, Banknote } from "lucide-react";

export type PaymentMethod = "credit" | "pix" | "cash";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const paymentOptions = [
  {
    id: "credit" as const,
    label: "Cartão de Crédito",
    icon: <CreditCard size={22} className="text-gray-500" />,
    badge: null,
  },
  {
    id: "pix" as const,
    label: "Pix",
    icon: <span className="text-xl">💠</span>,
    badge: "-5% OFF",
  },
  {
    id: "cash" as const,
    label: "Dinheiro",
    icon: <Banknote size={22} className="text-gray-500" />,
    badge: null,
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <CreditCard className="text-[var(--color-primary)]" size={20} />
        Pagamento
      </h2>

      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onMethodChange(option.id)}
              className={`w-full flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {option.icon}
                <span className="font-medium">{option.label}</span>
              </div>
              {option.badge && (
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                  {option.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
