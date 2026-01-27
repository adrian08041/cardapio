"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Minus, Plus, ShoppingBag, Clock, Info } from "lucide-react";
import { motion } from "framer-motion";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, notes?: string) => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [showNutritional, setShowNutritional] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, notes);
    onClose();
    // Reset state after closing
    setTimeout(() => {
      setQuantity(1);
      setNotes("");
      setShowNutritional(false);
    }, 300);
  };

  const totalPrice = product.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-[var(--color-card)] border-[var(--color-border)] rounded-xl">
        <div className="flex flex-col md:flex-row h-[85vh] md:h-auto">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-[var(--color-secondary)]/20">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />

            {/* Mobile Close Button (Visual only since Dialog handles click outside) */}
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto max-h-[calc(85vh-250px)] md:max-h-[600px] no-scrollbar">
            <DialogHeader className="mb-4 text-left">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold">
                    {product.name}
                  </DialogTitle>
                  {product.preparationTime && (
                    <div className="flex items-center text-xs text-[var(--color-muted-foreground)]">
                      <Clock size={12} className="mr-1" />
                      Preparo: {product.preparationTime} min
                    </div>
                  )}
                </div>
                {product.rating && (
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold">
                    ★ {product.rating}
                  </div>
                )}
              </div>
            </DialogHeader>

            <DialogDescription className="text-sm text-[var(--color-muted-foreground)] mb-6">
              {product.description}
            </DialogDescription>

            {/* Tags & Diet */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.dietaryInfo?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] capitalize border-green-500/30 text-green-500"
                >
                  {tag}
                </Badge>
              ))}
              {product.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">
                  Ingredientes
                </h4>
                <ul className="text-sm text-[var(--color-foreground)] list-disc pl-4 space-y-1">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutritional Info Toggle */}
            {product.nutritionalInfo && (
              <div className="mb-6 border rounded-lg overflow-hidden border-[var(--color-border)]">
                <button
                  onClick={() => setShowNutritional(!showNutritional)}
                  className="w-full flex items-center justify-between p-3 bg-[var(--color-secondary)]/30 hover:bg-[var(--color-secondary)]/50 transition-colors text-xs font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Info size={14} /> Informação Nutricional
                  </span>
                  <span>{showNutritional ? "−" : "+"}</span>
                </button>
                {showNutritional && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="grid grid-cols-4 gap-2 p-3 bg-[var(--color-background)]"
                  >
                    <div className="text-center">
                      <span className="block text-xs font-bold">
                        {product.nutritionalInfo.calories}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">
                        Kcal
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-bold">
                        {product.nutritionalInfo.protein}g
                      </span>
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">
                        Prot
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-bold">
                        {product.nutritionalInfo.carbs}g
                      </span>
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">
                        Carb
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-bold">
                        {product.nutritionalInfo.fats}g
                      </span>
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">
                        Gord
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2 block">
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
                placeholder="Retirar cebola, ponto da carne, etc..."
                className="w-full h-20 p-3 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-sm resize-none transition-all"
              />
              <div className="text-right text-[10px] text-[var(--color-muted-foreground)] mt-1">
                {notes.length}/200
              </div>
            </div>

            {/* Footer Actions (Sticky Bottom in Mobile if needed, but here inline) */}
            <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center gap-3 bg-[var(--color-secondary)]/50 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[var(--color-card)] rounded-md transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-bold w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-[var(--color-card)] rounded-md transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add Button */}
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 text-sm font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
              >
                <span className="mr-auto">Adicionar</span>
                <span>{formatCurrency(totalPrice)}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
