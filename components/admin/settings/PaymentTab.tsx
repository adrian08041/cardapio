import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface PaymentTabProps {
  settings: any;
  onChange: (field: string, value: any) => void;
}

export const PaymentTab = memo(({ settings, onChange }: PaymentTabProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-[var(--color-foreground)] border-b border-[var(--color-border)] pb-4 mb-6">
        Meios de Pagamento
      </h2>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <span className="font-bold text-xs">PIX</span>
          </div>
          <div>
            <h3 className="font-bold text-emerald-900">Configuração PIX</h3>
            <p className="text-xs text-emerald-700">
              Chave para geração de QR Code
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Tipo de Chave</Label>
            <select
              className="h-10 rounded-md border border-[var(--color-input)] bg-white px-3 text-sm"
              value={settings.pixKeyType}
              onChange={(e) => onChange("pixKeyType", e.target.value)}
            >
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
              <option value="email">E-mail</option>
              <option value="phone">Celular</option>
              <option value="random">Chave Aleatória</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Chave Pix</Label>
            <Input
              value={settings.pixKey}
              onChange={(e) => onChange("pixKey", e.target.value)}
              className="bg-white border-emerald-200 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PaymentTab.displayName = "PaymentTab";
