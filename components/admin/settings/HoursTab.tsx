import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { memo } from "react";

interface HoursTabProps {
  settings: any;
  onChange: (field: string, value: any) => void;
}

export const HoursTab = memo(({ settings, onChange }: HoursTabProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-[var(--color-foreground)] border-b border-[var(--color-border)] pb-4 mb-6">
        Horário de Funcionamento
      </h2>

      <div className="flex items-center justify-between p-4 bg-[var(--color-secondary)]/30 rounded-lg border border-[var(--color-border)]">
        <div>
          <h3 className="font-bold text-[var(--color-foreground)]">
            Status da Loja
          </h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {settings.isOpen
              ? "Sua loja está aberta para receber pedidos."
              : "Sua loja está fechada temporariamente."}
          </p>
        </div>
        <Switch
          checked={settings.isOpen}
          onCheckedChange={(val) => onChange("isOpen", val)}
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-bold text-[var(--color-muted-foreground)] uppercase tracking-wide">
          Horários Semanais
        </p>
        {/* Mock de dias */}
        {[
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
          "Domingo",
        ].map((day) => (
          <div
            key={day}
            className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
          >
            <span className="w-24 font-medium text-[var(--color-foreground)]">
              {day}
            </span>
            <div className="flex items-center gap-2">
              <Input
                className="w-24 h-8 text-center text-sm"
                placeholder="18:00"
                defaultValue="18:00"
              />
              <span className="text-[var(--color-muted-foreground)]">às</span>
              <Input
                className="w-24 h-8 text-center text-sm"
                placeholder="23:00"
                defaultValue="23:00"
              />
            </div>
            <Switch defaultChecked />
          </div>
        ))}
      </div>
    </div>
  );
});

HoursTab.displayName = "HoursTab";
