"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Store, Clock, Truck, CreditCard, Printer, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// --- Dynamic Imports for Code Splitting (Bundle Optimization) ---
// Loading components only when needed
const StoreTab = dynamic(
  () =>
    import("@/components/admin/settings/StoreTab").then((mod) => mod.StoreTab),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />
    ),
  },
);
const HoursTab = dynamic(
  () =>
    import("@/components/admin/settings/HoursTab").then((mod) => mod.HoursTab),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />
    ),
  },
);
const DeliveryTab = dynamic(
  () =>
    import("@/components/admin/settings/DeliveryTab").then(
      (mod) => mod.DeliveryTab,
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />
    ),
  },
);
const PaymentTab = dynamic(
  () =>
    import("@/components/admin/settings/PaymentTab").then(
      (mod) => mod.PaymentTab,
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />
    ),
  },
);
const PrinterTab = dynamic(
  () =>
    import("@/components/admin/settings/PrinterTab").then(
      (mod) => mod.PrinterTab,
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />
    ),
  },
);

// Mock Initial Data (In a real app, this would come from an API/Server Component)
const initialSettings = {
  storeName: "Hamburgueria Red & Gray",
  description: "O melhor hambúrguer artesanal da cidade, feito com paixão.",
  whatsapp: "(11) 99999-9999",
  address: "Rua das Flores, 123",
  logo: null,

  // Delivery
  deliveryEnabled: true,
  pickupEnabled: true,
  deliveryFee: 5.0,
  minOrderValue: 20.0,
  deliveryTimeMin: 40,
  deliveryTimeMax: 50,
  freeDeliveryThreshold: 100.0,

  // Pix
  pixKey: "12345678900",
  pixKeyType: "cpf",

  // Printer
  printerWidth: "80mm",
  autoPrintNewOrders: true,
  printKitchenReceipt: true,
  printCustomerReceipt: true,

  // Hours
  isOpen: true,
};

type TabType = "store" | "hours" | "delivery" | "payment" | "printer";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("store");
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API text-white
    setTimeout(() => {
      setIsSaving(false);
      alert("Configurações salvas com sucesso!");
    }, 1500);
  };

  // Memoized handler to prevent recreating function on every render
  const handleInputChange = useCallback((field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "store", label: "Loja", icon: Store },
    { id: "hours", label: "Horários", icon: Clock },
    { id: "delivery", label: "Entrega e Retirada", icon: Truck },
    { id: "payment", label: "Pagamentos", icon: CreditCard },
    { id: "printer", label: "Impressão", icon: Printer },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-foreground)]">
          Configurações
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          Gerencie as informações principais do seu negócio.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                  activeTab === tab.id
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-primary/20"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]",
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 lg:p-8 shadow-sm min-h-[500px]">
            {activeTab === "store" && (
              <StoreTab settings={settings} onChange={handleInputChange} />
            )}

            {activeTab === "hours" && (
              <HoursTab settings={settings} onChange={handleInputChange} />
            )}

            {activeTab === "delivery" && (
              <DeliveryTab settings={settings} onChange={handleInputChange} />
            )}

            {activeTab === "payment" && (
              <PaymentTab settings={settings} onChange={handleInputChange} />
            )}

            {activeTab === "printer" && (
              <PrinterTab settings={settings} onChange={handleInputChange} />
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[150px] font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">Salvando...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={18} /> Salvar Alterações
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
