"use client";

import { useForm } from "react-hook-form";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { categories } from "@/data/menu";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null; // null = new product
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  // Simulação de hook de form (em app real usaria Zod resolver)
  const { register, handleSubmit } = useForm({
    defaultValues: product || {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Saving product:", data);
    onOpenChange(false);
    // Aqui chamaria a mutation de API
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-display font-bold">
            {product ? "Editar Produto" : "Novo Produto"}
          </SheetTitle>
          <SheetDescription>
            Preencha os dados do prato. Clique em salvar quando terminar.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Prato</Label>
            <Input
              id="name"
              placeholder="Ex: X-Bacon Supremo"
              {...register("name")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                className="flex h-12 w-full rounded-[var(--radius-lg)] border border-[var(--color-input)] bg-[var(--color-card)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                {...register("categoryId")}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              rows={4}
              className="flex w-full rounded-[var(--radius-lg)] border border-[var(--color-input)] bg-[var(--color-card)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
              placeholder="Descreva os ingredientes e detalhes..."
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagem (URL)</Label>
            <Input placeholder="https://..." {...register("image")} />
            <p className="text-xs text-gray-500">
              Recomendado: 800x600px, JPG ou PNG.
            </p>
          </div>

          <SheetFooter className="mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="font-bold">
              {product ? "Salvar Alterações" : "Criar Produto"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
