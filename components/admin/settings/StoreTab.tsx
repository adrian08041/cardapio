import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image as ImageIcon } from "lucide-react";
import { memo } from "react";

interface StoreTabProps {
  settings: any;
  onChange: (field: string, value: any) => void;
}

export const StoreTab = memo(({ settings, onChange }: StoreTabProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-[var(--color-foreground)] border-b border-[var(--color-border)] pb-4 mb-6">
        Informações da Loja
      </h2>

      <div className="grid gap-6">
        {/* Logo Upload Mock */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[var(--color-secondary)] flex items-center justify-center border-2 border-dashed border-[var(--color-border)] text-[var(--color-muted-foreground)]">
            <ImageIcon size={32} />
          </div>
          <div>
            <Button variant="outline" className="gap-2">
              <Upload size={16} /> Alterar Logo
            </Button>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
              Recomendado: 500x500px (PNG ou JPG)
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="storeName">Nome da Loja</Label>
          <Input
            id="storeName"
            value={settings.storeName}
            onChange={(e) => onChange("storeName", e.target.value)}
            className="input-premium"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descrição Curta</Label>
          <Textarea
            id="description"
            value={settings.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="resize-none h-24 input-premium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp / Telefone</Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={(e) => onChange("whatsapp", e.target.value)}
              className="input-premium"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => onChange("address", e.target.value)}
              className="input-premium"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

StoreTab.displayName = "StoreTab";
