"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

export interface FilterState {
  priceRange: [number, number];
  dietary: string[];
  availability: boolean;
  prepTime: "any" | "fast" | "medium" | "slow";
}

interface AdvancedFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export function AdvancedFiltersDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}: AdvancedFiltersDrawerProps) {
  // Local state for applying only on "Apply" click
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleDietaryChange = (tag: string) => {
    setLocalFilters((prev) => {
      const exists = prev.dietary.includes(tag);
      return {
        ...prev,
        dietary: exists
          ? prev.dietary.filter((t) => t !== tag)
          : [...prev.dietary, tag],
      };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] flex flex-col h-full bg-[var(--color-card)] border-l border-[var(--color-border)]"
      >
        <SheetHeader className="pb-4 border-b border-[var(--color-border)]">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <Filter size={18} /> Filtros Avançados
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-8 pr-2">
          {/* Price Range */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Faixa de Preço
            </h4>
            <Slider
              defaultValue={[
                localFilters.priceRange[0],
                localFilters.priceRange[1],
              ]}
              max={100}
              step={1}
              min={0}
              onValueChange={(val) =>
                setLocalFilters({
                  ...localFilters,
                  priceRange: [val[0], val[1]],
                })
              }
              className="py-4"
            />
            <div className="flex justify-between text-sm font-medium">
              <span>R$ {localFilters.priceRange[0]}</span>
              <span>R$ {localFilters.priceRange[1]}</span>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Restrições Alimentares
            </h4>
            <div className="space-y-3">
              {["vegetarian", "vegan", "gluten-free", "lactose-free"].map(
                (tag) => (
                  <div key={tag} className="flex items-center space-x-3">
                    <Checkbox
                      id={tag}
                      checked={localFilters.dietary.includes(tag)}
                      onCheckedChange={() => handleDietaryChange(tag)}
                    />
                    <label
                      htmlFor={tag}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                    >
                      {tag.replace("-", " ")}
                    </label>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Prep Time */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Tempo de Preparo
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "any", label: "Qualquer" },
                { id: "fast", label: "< 15min" },
                { id: "medium", label: "15-30min" },
                { id: "slow", label: "> 30min" },
              ].map((opt) => (
                <Badge
                  key={opt.id}
                  variant={
                    localFilters.prepTime === opt.id ? "default" : "outline"
                  }
                  className={`cursor-pointer h-8 px-3 ${localFilters.prepTime === opt.id ? "bg-[var(--color-primary)]" : "hover:bg-[var(--color-secondary)]"}`}
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      prepTime: opt.id as any,
                    })
                  }
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <label
              htmlFor="avail"
              className="text-sm font-medium cursor-pointer"
            >
              Apenas produtos disponíveis
            </label>
            <Checkbox
              id="avail"
              checked={localFilters.availability}
              onCheckedChange={(c) =>
                setLocalFilters({ ...localFilters, availability: c as boolean })
              }
            />
          </div>
        </div>

        <SheetFooter className="pt-4 border-t border-[var(--color-border)] mt-auto flex-row gap-3 sm:justify-between">
          <Button variant="outline" onClick={onClearFilters} className="flex-1">
            Limpar
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
          >
            Aplicar Filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
