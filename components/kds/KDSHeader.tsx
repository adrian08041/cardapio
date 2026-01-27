"use client";

import { MessageSquare, Settings, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

interface KDSHeaderProps {
  activeCount: number;
}

export function KDSHeader({ activeCount }: KDSHeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between shadow-sm z-10">
      {/* Esquerda: Identidade e Contador */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter text-[var(--color-foreground)]">
            COZINHA
            <span className="text-[var(--color-primary)]">.</span>
          </h1>
        </div>

        <div className="h-8 w-px bg-[var(--color-border)]" />

        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)]/50 rounded-md border border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-muted-foreground)] uppercase font-bold">
            Ativos
          </span>
          <span className="text-lg font-mono font-bold text-[var(--color-primary)]">
            {activeCount}
          </span>
        </div>
      </div>

      {/* Centro: Relógio Grande */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
        <span className="text-4xl font-mono font-bold text-[var(--color-foreground)] tracking-widest bg-[var(--color-secondary)]/30 px-6 py-1 rounded-xl border border-[var(--color-border)]">
          {time}
        </span>
      </div>

      {/* Direita: Status e Ações */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wide bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <Wifi size={14} />
          <span>Online</span>
        </div>

        <button className="p-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-secondary)]/50 rounded-full transition-colors cursor-pointer">
          <MessageSquare size={20} />
        </button>

        <button className="p-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-secondary)]/50 rounded-full transition-colors cursor-pointer">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
