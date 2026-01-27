"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingBag, label: "Pedidos", href: "/admin/orders" },
  { icon: UtensilsCrossed, label: "Produtos", href: "/admin/products" },
  { icon: Layers, label: "Categorias", href: "/admin/categories" },
  { icon: Settings, label: "Configurações", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[var(--color-card)] border-r border-[var(--color-border)] fixed left-0 top-0 hidden md:flex flex-col z-50">
      <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-2">
        <Store className="text-[var(--color-primary)]" />
        <span className="font-display font-bold text-xl tracking-tight">
          Admin<span className="text-[var(--color-primary)]">.</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] transition-all group",
                  isActive
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-bold"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]",
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]",
                  )}
                />
                <span className="font-medium text-sm">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeAdminNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)] rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-[var(--radius-lg)] text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
