"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  ChefHat,
  Timer,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getCartTotal,
    clearCart,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  // Customer Data
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Order Tracking State
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState<
    "received" | "preparing" | "ready" | "delivering" | "delivered"
  >("received");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
    if (!confirmedOrder && items.length === 0) {
      router.push("/"); // Only redirect if not tracking an order
    }

    // Auto fill user data
    if (user) {
      setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [items, router, confirmedOrder, user]);

  // Simulate Order Progress
  useEffect(() => {
    if (confirmedOrder) {
      const timers = [
        setTimeout(() => setOrderStatus("preparing"), 3000),
        setTimeout(() => setOrderStatus("ready"), 8000),
        setTimeout(() => setOrderStatus("delivering"), 12000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [confirmedOrder]);

  const subtotal = isMounted ? getCartTotal() : 0;
  const deliveryFee = deliveryType === "delivery" ? 5.0 : 0;

  // Calculate Totals
  const pixDiscount =
    paymentMethod === "pix"
      ? (subtotal + deliveryFee - discountAmount) * 0.05
      : 0;
  const finalTotal = Math.max(
    0,
    subtotal + deliveryFee - discountAmount - pixDiscount,
  );

  const handleApplyCoupon = () => {
    setCouponMessage(null);
    if (!couponInput.trim()) return;

    const code = couponInput.toUpperCase();
    if (code === "BEMVINDO10") {
      applyCoupon(code, subtotal * 0.1);
      toast.success("Cupom de 10% aplicado!");
    } else if (code === "FRETEGRATIS") {
      if (deliveryType !== "delivery") {
        toast.error("Válido apenas para entrega.");
        return;
      }
      applyCoupon(code, 5.0);
      toast.success("Frete Grátis aplicado!");
    } else if (code === "DESC15") {
      applyCoupon(code, 15.0);
      toast.success("Desconto de R$ 15,00 aplicado!");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput("");
    setCouponMessage(null);
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerPhone) {
      toast.warning("Por favor, preencha nome e telefone.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customerName,
        customerPhone,
        deliveryAddress:
          deliveryType === "delivery"
            ? `${address.street}, ${address.number} - ${address.neighborhood}`
            : undefined,
        deliveryComplement: address.complement,
        deliveryNeighborhood: address.neighborhood,
        orderType: deliveryType === "delivery" ? "DELIVERY" : "PICKUP",
        paymentMethod:
          paymentMethod === "credit"
            ? "CREDIT_CARD"
            : paymentMethod === "pix"
              ? "PIX"
              : "CASH",
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          notes: item.notes,
        })),
        deliveryFee,
        discount: discountAmount + pixDiscount,
        couponCode,
      };

      const { ordersApi } = await import("@/lib/api/orders");
      const order = await ordersApi.create(orderData as any);

      setConfirmedOrder({
        ...order,
        // Mapping backend order to UI expected format if needed, or using as is
        total: finalTotal, // Use local calc for safe display or use backend provided total
        items: [...items], // Keep items for display
      });

      toast.success("Pedido realizado com sucesso!");
      clearCart();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  if (confirmedOrder) {
    const steps = [
      { id: "received", label: "Recebido", icon: <CheckCircle2 size={20} /> },
      { id: "preparing", label: "Preparando", icon: <ChefHat size={20} /> },
      { id: "ready", label: "Pronto", icon: <ShoppingBag size={20} /> },
      {
        id: "delivering",
        label:
          deliveryType === "delivery"
            ? "Saiu pra Entrega"
            : "Pronto pra Retirada",
        icon: <Timer size={20} />,
      },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === orderStatus);

    return (
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        <div className="bg-green-600 text-white p-8 pb-32 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Pedido #{confirmedOrder.id} Confirmado!
          </h1>
          <p className="opacity-90">Previsão de entrega: 19:40 - 19:50</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-24">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            {/* TIMELINE */}
            <div className="p-8 border-b border-gray-100">
              <div className="relative flex justify-between">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0">
                  <div
                    className="h-full bg-green-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={step.id}
                      className="relative z-10 flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? "bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30" : "bg-gray-100 text-gray-400"}`}
                      >
                        {step.icon}
                      </div>
                      <span
                        className={`text-xs font-bold uppercase transition-colors ${isActive ? "text-green-600" : "text-gray-400"}`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="absolute -bottom-6 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full animate-bounce">
                          Agorinha
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 border-r border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Itens do Pedido
                </h3>
                <div className="space-y-4">
                  {confirmedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="relative w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {item.quantity}x {item.name}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-500 italic">
                            "{item.notes}"
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Resumo Financeiro
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(confirmedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Entrega</span>
                    <span>
                      {confirmedOrder.deliveryType === "delivery"
                        ? "R$ 5,00"
                        : "Grátis"}
                    </span>
                  </div>
                  {confirmedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Descontos</span>
                      <span>- {formatCurrency(confirmedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black text-gray-900 pt-4 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(confirmedOrder.total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-8 bg-black hover:bg-gray-800 text-white"
                  onClick={() => router.push("/")}
                >
                  Fazer Novo Pedido
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-[var(--color-secondary)] rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Finalizar Pedido</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              👤 Seus Dados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input
                  placeholder="Seu nome"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone / WhatsApp</Label>
                <Input
                  placeholder="(00) 00000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Delivery Type */}
          <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="text-[var(--color-primary)]" size={20} />
              Entrega
            </h2>

            <RadioGroup
              value={deliveryType}
              onValueChange={setDeliveryType}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              <div>
                <RadioGroupItem
                  value="delivery"
                  id="del"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="del"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-[var(--color-border)] bg-transparent p-4 hover:bg-[var(--color-secondary)]/50 peer-data-[state=checked]:border-[var(--color-primary)] peer-data-[state=checked]:bg-[var(--color-primary)]/5 cursor-pointer transition-all"
                >
                  <span className="mb-2 text-2xl">🛵</span>
                  <span className="font-semibold">Delivery</span>
                  <span className="text-xs text-[var(--color-muted-foreground)]">
                    30-45 min
                  </span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="takeout"
                  id="take"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="take"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-[var(--color-border)] bg-transparent p-4 hover:bg-[var(--color-secondary)]/50 peer-data-[state=checked]:border-[var(--color-primary)] peer-data-[state=checked]:bg-[var(--color-primary)]/5 cursor-pointer transition-all"
                >
                  <span className="mb-2 text-2xl">🛍️</span>
                  <span className="font-semibold">Retirada</span>
                  <span className="text-xs text-[var(--color-muted-foreground)]">
                    15-20 min
                  </span>
                </Label>
              </div>
            </RadioGroup>

            {deliveryType === "delivery" && (
              <div className="grid gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input
                      placeholder="00000-000"
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rua</Label>
                    <Input
                      placeholder="Av. Principal"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Número</Label>
                    <Input
                      placeholder="123"
                      value={address.number}
                      onChange={(e) =>
                        setAddress({ ...address, number: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input
                      placeholder="Apto 101"
                      value={address.complement}
                      onChange={(e) =>
                        setAddress({ ...address, complement: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Bairro</Label>
                    <Input
                      placeholder="Centro"
                      value={address.neighborhood}
                      onChange={(e) =>
                        setAddress({ ...address, neighborhood: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="text-[var(--color-primary)]" size={20} />
              Pagamento
            </h2>

            <div className="space-y-4">
              <div
                onClick={() => setPaymentMethod("credit")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "credit" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]"}`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard
                    size={24}
                    className="text-[var(--color-muted-foreground)]"
                  />
                  <span className="font-medium">Cartão de Crédito</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-4 bg-gray-600 rounded-sm" />
                  <div className="w-6 h-4 bg-gray-600 rounded-sm" />
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod("pix")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "pix" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">💠</span>
                  <span className="font-medium">Pix</span>
                </div>
                <span className="text-xs text-green-500 font-bold">
                  -5% OFF
                </span>
              </div>

              <div
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "cash" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]"}`}
              >
                <div className="flex items-center gap-3">
                  <Banknote
                    size={24}
                    className="text-[var(--color-muted-foreground)]"
                  />
                  <span className="font-medium">Dinheiro</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          {/* COUPON SECTION */}
          <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-[var(--color-muted-foreground)] uppercase">
              🏷️ Cupom de Desconto
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Digite seu código"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="uppercase font-mono"
                disabled={!!couponCode}
              />
              {couponCode ? (
                <Button
                  onClick={handleRemoveCoupon}
                  variant="destructive"
                  size="icon"
                >
                  <span className="text-lg">×</span>
                </Button>
              ) : (
                <Button onClick={handleApplyCoupon} variant="outline">
                  Aplicar
                </Button>
              )}
            </div>
            {couponMessage && (
              <p
                className={`text-xs mt-2 font-medium ${couponMessage.type === "success" ? "text-green-600" : "text-red-500"}`}
              >
                {couponMessage.text}
              </p>
            )}
            {couponCode && !couponMessage && (
              <p className="text-xs mt-2 font-medium text-green-600">
                Cupom <strong>{couponCode}</strong> aplicado!
              </p>
            )}
          </section>

          <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ShoppingBag className="text-[var(--color-primary)]" size={20} />
              Resumo
            </h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.notes || ""}`}
                  className="flex gap-3"
                >
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[var(--color-secondary)] flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-[var(--color-muted-foreground)] italic truncate max-w-[200px]">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
              <div className="flex justify-between text-[var(--color-muted-foreground)]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--color-muted-foreground)]">
                <span>Taxa de Entrega</span>
                <span
                  className={
                    deliveryFee === 0 ? "text-green-500 font-medium" : ""
                  }
                >
                  {deliveryFee === 0 ? "Grátis" : formatCurrency(deliveryFee)}
                </span>
              </div>

              {/* Discount Row */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Desconto ({couponCode})</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="flex justify-between text-green-500 font-medium">
                  <span>Desconto Pix (5%)</span>
                  <span>-{formatCurrency(pixDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-[var(--color-border)] text-[var(--color-foreground)]">
                <span>Total</span>
                <span className="text-[var(--color-primary)]">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full mt-8 h-12 text-base font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer"
            >
              {isProcessing ? "Processando..." : "Confirmar Pedido"}
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
