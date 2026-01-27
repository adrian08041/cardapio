import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface DeliveryTabProps {
  settings: any;
  onChange: (field: string, value: any) => void;
}

export const DeliveryTab = memo(({ settings, onChange }: DeliveryTabProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-[var(--color-foreground)] border-b border-[var(--color-border)] pb-4 mb-6">
        Logística
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Habilitar Delivery</Label>
            <Switch
              checked={settings.deliveryEnabled}
              onCheckedChange={(val) => onChange("deliveryEnabled", val)}
            />
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Se desativado, a opção de entrega sumirá do checkout.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Habilitar Retirada</Label>
            <Switch
              checked={settings.pickupEnabled}
              onCheckedChange={(val) => onChange("pickupEnabled", val)}
            />
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Permitir que o cliente busque o pedido na loja.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-4">
        <div className="grid gap-2">
          <Label>Taxa de Entrega Fixa (R$)</Label>
          <Input
            type="number"
            value={settings.deliveryFee}
            onChange={(e) =>
              onChange("deliveryFee", parseFloat(e.target.value))
            }
            className="input-premium"
          />
        </div>
        <div className="grid gap-2">
          <Label>Pedido Mínimo (R$)</Label>
          <Input
            type="number"
            value={settings.minOrderValue}
            onChange={(e) =>
              onChange("minOrderValue", parseFloat(e.target.value))
            }
            className="input-premium"
          />
        </div>
        <div className="grid gap-2">
          <Label>Tempo Mínimo (min)</Label>
          <Input
            type="number"
            value={settings.deliveryTimeMin}
            onChange={(e) =>
              onChange("deliveryTimeMin", parseInt(e.target.value))
            }
            className="input-premium"
          />
        </div>
        <div className="grid gap-2">
          <Label>Tempo Máximo (min)</Label>
          <Input
            type="number"
            value={settings.deliveryTimeMax}
            onChange={(e) =>
              onChange("deliveryTimeMax", parseInt(e.target.value))
            }
            className="input-premium"
          />
        </div>
      </div>
    </div>
  );
});

DeliveryTab.displayName = "DeliveryTab";
