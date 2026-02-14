"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, X } from "lucide-react";

interface CouponInputProps {
  appliedCoupon?: string;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export function CouponInput({
  appliedCoupon,
  onApply,
  onRemove,
}: CouponInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleApply = () => {
    if (inputValue.trim()) {
      onApply(inputValue.trim().toUpperCase());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-sm font-bold mb-3 flex items-center gap-2 text-gray-500 uppercase">
        <Tag size={16} />
        Cupom de Desconto
      </h2>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-mono font-bold">
              {appliedCoupon}
            </span>
            <span className="text-xs text-green-600">aplicado!</span>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-green-600" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Digite seu código"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="uppercase font-mono h-12"
          />
          <Button
            onClick={handleApply}
            variant="outline"
            className="h-12 px-6 font-semibold"
          >
            Aplicar
          </Button>
        </div>
      )}
    </section>
  );
}
