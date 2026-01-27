import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: "primary" | "secondary" | "blue" | "orange";
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "primary",
}: StatsCardProps) {
  const colorStyles = {
    primary: "bg-orange-50 text-orange-600 border-orange-100",
    secondary: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-card)] border border-[var(--color-border)] p-6 group hover:border-[var(--color-primary)]/30 transition-all shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-xl border transition-colors",
            colorStyles[color],
          )}
        >
          <Icon size={24} />
        </div>
        {change && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              trend === "up"
                ? "bg-green-50 text-green-600"
                : trend === "down"
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-500",
            )}
          >
            {change}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-[var(--color-muted-foreground)] text-sm font-medium">
          {title}
        </h3>
        <p className="text-2xl font-display font-bold text-[var(--color-foreground)]">
          {value}
        </p>
      </div>

      {/* Decorative Glow */}
      <div
        className={cn(
          "absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-40",
          color === "primary"
            ? "bg-orange-500"
            : color === "secondary"
              ? "bg-emerald-500"
              : color === "blue"
                ? "bg-blue-500"
                : "bg-amber-500",
        )}
      />
    </div>
  );
}
