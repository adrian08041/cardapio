"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export function CustomerForm({
  name,
  phone,
  onNameChange,
  onPhoneChange,
}: CustomerFormProps) {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        👤 Seus Dados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer-name">Nome Completo</Label>
          <Input
            id="customer-name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-phone">Telefone / WhatsApp</Label>
          <Input
            id="customer-phone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            type="tel"
            className="h-12"
          />
        </div>
      </div>
    </section>
  );
}
