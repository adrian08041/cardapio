"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin } from "lucide-react";

export interface DeliveryAddress {
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
}

interface DeliveryTypeSelectorProps {
  deliveryType: "delivery" | "takeout";
  onDeliveryTypeChange: (value: "delivery" | "takeout") => void;
  address: DeliveryAddress;
  onAddressChange: (address: DeliveryAddress) => void;
  deliveryEnabled?: boolean;
  pickupEnabled?: boolean;
  estimatedDeliveryTime?: number;
  estimatedPickupTime?: number;
}

export function DeliveryTypeSelector({
  deliveryType,
  onDeliveryTypeChange,
  address,
  onAddressChange,
  deliveryEnabled = true,
  pickupEnabled = true,
  estimatedDeliveryTime = 40,
  estimatedPickupTime = 20,
}: DeliveryTypeSelectorProps) {
  const updateAddress = (field: keyof DeliveryAddress, value: string) => {
    onAddressChange({ ...address, [field]: value });
  };

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <MapPin className="text-[var(--color-primary)]" size={20} />
        Entrega
      </h2>

      <RadioGroup
        value={deliveryType}
        onValueChange={(v) => onDeliveryTypeChange(v as "delivery" | "takeout")}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {deliveryEnabled && (
          <div>
            <RadioGroupItem
              value="delivery"
              id="del"
              className="peer sr-only"
            />
            <Label
              htmlFor="del"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-4 min-h-[100px] hover:bg-gray-50 peer-data-[state=checked]:border-[var(--color-primary)] peer-data-[state=checked]:bg-[var(--color-primary)]/5 cursor-pointer transition-all active:scale-95"
            >
              <span className="mb-2 text-3xl">🛵</span>
              <span className="font-bold">Delivery</span>
              <span className="text-xs text-gray-500 mt-1">
                ~{estimatedDeliveryTime} min
              </span>
            </Label>
          </div>
        )}

        {pickupEnabled && (
          <div>
            <RadioGroupItem
              value="takeout"
              id="take"
              className="peer sr-only"
            />
            <Label
              htmlFor="take"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-4 min-h-[100px] hover:bg-gray-50 peer-data-[state=checked]:border-[var(--color-primary)] peer-data-[state=checked]:bg-[var(--color-primary)]/5 cursor-pointer transition-all active:scale-95"
            >
              <span className="mb-2 text-3xl">🛍️</span>
              <span className="font-bold">Retirada</span>
              <span className="text-xs text-gray-500 mt-1">
                ~{estimatedPickupTime} min
              </span>
            </Label>
          </div>
        )}
      </RadioGroup>

      {/* Address Form - Only for Delivery */}
      {deliveryType === "delivery" && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipcode">CEP</Label>
              <Input
                id="zipcode"
                placeholder="00000-000"
                value={address.zipCode}
                onChange={(e) => updateAddress("zipCode", e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                placeholder="Av. Principal"
                value={address.street}
                onChange={(e) => updateAddress("street", e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                placeholder="123"
                value={address.number}
                onChange={(e) => updateAddress("number", e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto 101"
                value={address.complement}
                onChange={(e) => updateAddress("complement", e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              placeholder="Centro"
              value={address.neighborhood}
              onChange={(e) => updateAddress("neighborhood", e.target.value)}
              className="h-12"
            />
          </div>
        </div>
      )}
    </section>
  );
}
