"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useRestaurant } from "@/components/restaurant";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  CustomerForm,
  DeliveryTypeSelector,
  PaymentMethodSelector,
  CouponInput,
  OrderSummary,
  type DeliveryAddress,
  type PaymentMethod,
} from "@/components/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { restaurant } = useRestaurant();

  const {
    items,
    getCartTotal,
    clearCart,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const { user } = useAuthStore();

  // Mount state
  const [isMounted, setIsMounted] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "takeout">(
    "delivery",
  );
  const [address, setAddress] = useState<DeliveryAddress>({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize
  useEffect(() => {
    setIsMounted(true);
    if (items.length === 0) {
      router.push(`/r/${slug}/cardapio`);
    }
    if (user) {
      setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [items, router, user, slug]);

  // Calculations
  const subtotal = isMounted ? getCartTotal() : 0;
  const deliveryFee =
    deliveryType === "delivery" ? restaurant.settings?.deliveryFee || 5.0 : 0;
  const pixDiscount =
    paymentMethod === "pix"
      ? (subtotal + deliveryFee - discountAmount) * 0.05
      : 0;
  const finalTotal = Math.max(
    0,
    subtotal + deliveryFee - discountAmount - pixDiscount,
  );

  // Coupon handlers
  const handleApplyCoupon = (code: string) => {
    if (code === "BEMVINDO10") {
      applyCoupon(code, subtotal * 0.1);
      toast.success("Cupom de 10% aplicado!");
    } else if (code === "FRETEGRATIS") {
      if (deliveryType !== "delivery") {
        toast.error("Válido apenas para entrega.");
        return;
      }
      applyCoupon(code, deliveryFee);
      toast.success("Frete Grátis aplicado!");
    } else if (code === "DESC15") {
      applyCoupon(code, 15.0);
      toast.success("Desconto de R$ 15,00 aplicado!");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!customerName || !customerPhone) {
      toast.warning("Por favor, preencha nome e telefone.");
      return;
    }

    if (deliveryType === "delivery" && (!address.street || !address.number)) {
      toast.warning("Por favor, preencha o endereço de entrega.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customerName,
        customerPhone,
        restaurantId: restaurant.id,
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

      toast.success("Pedido realizado com sucesso!");
      clearCart();

      // Redirect to order tracking page
      router.push(`/r/${slug}/cardapio/pedido/${order.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Finalizar Pedido</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerForm
            name={customerName}
            phone={customerPhone}
            onNameChange={setCustomerName}
            onPhoneChange={setCustomerPhone}
          />

          <DeliveryTypeSelector
            deliveryType={deliveryType}
            onDeliveryTypeChange={setDeliveryType}
            address={address}
            onAddressChange={setAddress}
            deliveryEnabled={restaurant.settings?.deliveryEnabled !== false}
            pickupEnabled={restaurant.settings?.pickupEnabled !== false}
            estimatedDeliveryTime={
              restaurant.settings?.estimatedDeliveryTime || 40
            }
            estimatedPickupTime={restaurant.settings?.estimatedPickupTime || 20}
          />

          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
          <CouponInput
            appliedCoupon={couponCode}
            onApply={handleApplyCoupon}
            onRemove={removeCoupon}
          />

          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discountAmount={discountAmount}
            pixDiscount={pixDiscount}
            finalTotal={finalTotal}
            couponCode={couponCode}
            isPixPayment={paymentMethod === "pix"}
            isProcessing={isProcessing}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </main>
    </div>
  );
}
