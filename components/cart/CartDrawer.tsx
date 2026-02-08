"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

export function CartDrawer() {
  const { isOpen, toggleCart, items, updateQuantity, getCartTotal } =
    useCartStore();
  const total = getCartTotal();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string | undefined;

  // Variants para animação do Drawer
  const drawerVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  const overlayVariants = {
    closed: { opacity: 0, pointerEvents: "none" as const },
    open: { opacity: 1, pointerEvents: "auto" as const },
  };

  const handleCheckout = () => {
    toggleCart();
    // Redireciona para a rota do restaurante se tiver slug, senão vai pra checkout global
    const checkoutPath = slug ? `/r/${slug}/cardapio/checkout` : "/checkout";
    router.push(checkoutPath);
  };

  return (
    <>
      {/* Overlay Escuro */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={overlayVariants}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={drawerVariants}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[var(--color-background)] border-l border-[var(--color-border)] z-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-card)]/50">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--color-primary)]/10 p-2 rounded-full">
              <ShoppingBag className="text-[var(--color-primary)]" size={20} />
            </div>
            <h2 className="text-xl font-bold font-display">Seu Pedido</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="rounded-full hover:bg-[var(--color-secondary)]"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag
                size={48}
                className="text-[var(--color-muted-foreground)]"
              />
              <p className="text-lg font-medium">Seu carrinho está vazio</p>
              <p className="text-sm text-[var(--color-muted-foreground)] max-w-xs">
                Adicione alguns itens deliciosos do nosso cardápio para começar.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.notes || ""}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 bg-[var(--color-card)] p-3 rounded-xl border border-[var(--color-border)] relative group"
                >
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-secondary)]/30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-h-[5rem]">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      {item.notes && (
                        <p className="text-xs text-[var(--color-muted-foreground)] italic mt-1 line-clamp-2">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[var(--color-primary)] font-bold text-sm">
                        {formatCurrency(item.price)}
                      </p>

                      <div className="flex items-center gap-3 bg-[var(--color-background)] w-fit rounded-lg px-2 py-1 border border-[var(--color-border)]">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.notes,
                            )
                          }
                          className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.notes,
                            )
                          }
                          className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer Totais e Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md">
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-[var(--color-muted-foreground)]">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted-foreground)]">
                <span>Entrega</span>
                <span className="text-[var(--color-primary)] font-medium">
                  Grátis
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-[var(--color-foreground)] pt-4 border-t border-[var(--color-border)]">
                <span>Total</span>
                <span className="text-[var(--color-primary)]">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleCheckout}
              className="w-full font-bold text-base h-12 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
            >
              Finalizar Pedido
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
}
