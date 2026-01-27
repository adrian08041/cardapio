import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface PrinterTabProps {
  settings: any;
  onChange: (field: string, value: any) => void;
}

export const PrinterTab = memo(({ settings, onChange }: PrinterTabProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-[var(--color-foreground)] border-b border-[var(--color-border)] pb-4 mb-6">
        Automação de Impressão
      </h2>

      <div className="grid gap-6">
        <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg">
          <div>
            <p className="font-medium text-[var(--color-foreground)]">
              Impressão Automática
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Imprimir assim que um pedido chegar no KDS
            </p>
          </div>
          <Switch
            checked={settings.autoPrintNewOrders}
            onCheckedChange={(val) => onChange("autoPrintNewOrders", val)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Largura do Papel</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onChange("printerWidth", "58mm")}
              className={cn(
                "flex flex-col items-center justify-center p-4 border rounded-lg transition-all",
                settings.printerWidth === "58mm"
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold"
                  : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]",
              )}
            >
              <Printer size={24} className="mb-2" />
              58mm
            </button>
            <button
              onClick={() => onChange("printerWidth", "80mm")}
              className={cn(
                "flex flex-col items-center justify-center p-4 border rounded-lg transition-all",
                settings.printerWidth === "80mm"
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold"
                  : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]",
              )}
            >
              <Printer size={32} className="mb-2" />
              80mm (Padrão)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PrinterTab.displayName = "PrinterTab";
