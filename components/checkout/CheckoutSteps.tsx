"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Truck,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "delivery" | "payment" | "confirm";

export function CheckoutSteps() {
  const [step, setStep] = useState<Step>("delivery");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "money">(
    "pix",
  );

  // React Hook Form mock setup (would be more complex in real app)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleNext = () => {
    if (step === "delivery") setStep("payment");
    else if (step === "payment") setStep("confirm");
  };

  const handleBack = () => {
    if (step === "payment") setStep("delivery");
    else if (step === "confirm") setStep("payment");
  };

  const onSubmit = (data: any) => {
    console.log(data);
    handleNext(); // In real app, this would validate before moving
  };

  return (
    <div className="w-full">
      {/* Progress Timeline */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-[2px] bg-[var(--color-border)] -z-0" />

        {(["delivery", "payment", "confirm"] as Step[]).map((s, index) => {
          const isActive = step === s;
          const isCompleted =
            (s === "delivery" && (step === "payment" || step === "confirm")) ||
            (s === "payment" && step === "confirm");

          return (
            <div
              key={s}
              className="relative z-10 flex flex-col items-center bg-[var(--color-background)] px-2"
            >
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                  isActive
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : isCompleted
                      ? "border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white"
                      : "border-[var(--color-muted)] bg-[var(--color-card)] text-gray-500",
                )}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium uppercase tracking-wider",
                  isActive ? "text-[var(--color-primary)]" : "text-gray-500",
                )}
              >
                {s === "delivery"
                  ? "Entrega"
                  : s === "payment"
                    ? "Pagamento"
                    : "Fim"}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: ENTREGA */}
        {step === "delivery" && (
          <motion.div
            key="delivery"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType("delivery")}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3",
                  deliveryType === "delivery"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-gray-600",
                )}
              >
                <Truck
                  size={32}
                  className={
                    deliveryType === "delivery"
                      ? "text-[var(--color-primary)]"
                      : "text-gray-400"
                  }
                />
                <span className="font-bold">Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType("pickup")}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3",
                  deliveryType === "pickup"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-gray-600",
                )}
              >
                <Store
                  size={32}
                  className={
                    deliveryType === "pickup"
                      ? "text-[var(--color-primary)]"
                      : "text-gray-400"
                  }
                />
                <span className="font-bold">Retirada</span>
              </button>
            </div>

            {deliveryType === "delivery" ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input placeholder="00000-000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bairro</Label>
                    <Input placeholder="Seu bairro" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Endereço Completo</Label>
                  <Input placeholder="Rua, Número, Complemento" />
                </div>
                <div className="space-y-2">
                  <Label>Ponto de Referência</Label>
                  <Input placeholder="Próximo a..." />
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] flex items-center gap-4 animate-in fade-in zoom-in-95">
                <div className="bg-orange-500/20 p-3 rounded-full text-orange-500">
                  <MapPin />
                </div>
                <div>
                  <h4 className="font-bold">Nossa Loja</h4>
                  <p className="text-gray-400 text-sm">
                    Av. Paulista, 1000 - São Paulo, SP
                  </p>
                  <p className="text-green-500 text-xs mt-1 font-bold">
                    Aberto agora • 20-30 min para retirada
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={handleNext}
                className="w-full h-12 text-lg font-bold"
              >
                Ir para Pagamento
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PAGAMENTO */}
        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <RadioGroup
              defaultValue="pix"
              onValueChange={(val: any) => setPaymentMethod(val)}
              className="grid grid-cols-1 gap-4"
            >
              <div
                className={cn(
                  "flex items-center space-x-4 border-2 p-4 rounded-xl cursor-pointer transition-all",
                  paymentMethod === "pix"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-card)]",
                )}
              >
                <RadioGroupItem value="pix" id="pix" />
                <Label
                  htmlFor="pix"
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-xl">💠</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-base">
                      PIX (Instantâneo)
                    </span>
                    <span className="text-xs text-green-500 font-bold">
                      Aprovação imediata + 5% OFF
                    </span>
                  </div>
                </Label>
              </div>

              <div
                className={cn(
                  "flex items-center space-x-4 border-2 p-4 rounded-xl cursor-pointer transition-all",
                  paymentMethod === "card"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-card)]",
                )}
              >
                <RadioGroupItem value="card" id="card" />
                <Label
                  htmlFor="card"
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                >
                  <CreditCard className="text-gray-400" />
                  <div className="flex flex-col">
                    <span className="font-bold text-base">
                      Cartão de Crédito/Débito
                    </span>
                    <span className="text-xs text-gray-400">
                      Entrega da maquininha
                    </span>
                  </div>
                </Label>
              </div>

              <div
                className={cn(
                  "flex items-center space-x-4 border-2 p-4 rounded-xl cursor-pointer transition-all",
                  paymentMethod === "money"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-card)]",
                )}
              >
                <RadioGroupItem value="money" id="money" />
                <Label
                  htmlFor="money"
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-xl">💵</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-base">Dinheiro</span>
                    <span className="text-xs text-gray-400">
                      Solicitar troco
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "money" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <Label>Precisa de troco para quanto?</Label>
                <Input placeholder="R$ 50,00" />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-1/3 h-12"
              >
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                className="w-2/3 h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
              >
                Finalizar Pedido
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CONFIRMADO */}
        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              Pedido Confirmado!
            </h2>
            <p className="text-gray-400 mb-8">
              Seu pedido #1234 está sendo preparado.
            </p>

            <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)] text-left mb-8 max-w-sm mx-auto">
              <div className="flex items-center gap-3 mb-4 text-orange-500">
                <Clock className="animate-pulse" />
                <span className="font-bold">Tempo estimado: 30-40 min</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[20%] animate-pulse" />
              </div>
            </div>

            <Button className="w-full max-w-xs mx-auto" variant="secondary">
              Acompanhar Pedido
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
