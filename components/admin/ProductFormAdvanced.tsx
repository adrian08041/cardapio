"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Product, Category, DietaryRestriction, Allergen } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { categories } from "@/data/menu";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Package,
  Tag,
  AlertTriangle,
  Utensils,
} from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave?: (product: Partial<Product>) => void;
}

type FormSection =
  | "basic"
  | "media"
  | "details"
  | "nutrition"
  | "availability"
  | "advanced";

const dietaryOptions: { value: DietaryRestriction; label: string }[] = [
  { value: "vegetarian", label: "Vegetariano" },
  { value: "vegan", label: "Vegano" },
  { value: "gluten-free", label: "Sem Glúten" },
  { value: "lactose-free", label: "Sem Lactose" },
];

const allergenOptions: { value: Allergen; label: string }[] = [
  { value: "gluten", label: "Glúten" },
  { value: "dairy", label: "Laticínios" },
  { value: "eggs", label: "Ovos" },
  { value: "peanuts", label: "Amendoim" },
  { value: "tree-nuts", label: "Castanhas" },
  { value: "soy", label: "Soja" },
  { value: "fish", label: "Peixe" },
  { value: "shellfish", label: "Frutos do Mar" },
  { value: "sesame", label: "Gergelim" },
];

const availabilityTypes = [
  { value: "always", label: "Sempre Disponível" },
  { value: "specific_days", label: "Dias Específicos" },
  { value: "specific_hours", label: "Horários Específicos" },
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function ProductFormAdvanced({
  open,
  onOpenChange,
  product,
  onSave,
}: ProductFormProps) {
  const [expandedSections, setExpandedSections] = useState<FormSection[]>([
    "basic",
  ]);
  const [ingredients, setIngredients] = useState<string[]>(
    product?.ingredients || [],
  );
  const [newIngredient, setNewIngredient] = useState("");
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<DietaryRestriction[]>(
    product?.dietaryInfo || [],
  );
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>(
    product?.allergens || [],
  );
  const [availabilityType, setAvailabilityType] = useState<
    "always" | "specific_days" | "specific_hours"
  >(product?.availability?.type || "always");
  const [selectedDays, setSelectedDays] = useState<number[]>(
    product?.availability?.days || [],
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      description: product?.description || "",
      categoryId: product?.categoryId || categories[0]?.id || "",
      sku: product?.sku || "",
      preparationTime: product?.preparationTime || 15,
      stockQuantity: product?.stock?.quantity || 0,
      stockUnit: product?.stock?.unit || "un",
      active: product?.active ?? true,
      available: product?.available ?? true,
      calories: product?.nutritionalInfo?.calories || 0,
      protein: product?.nutritionalInfo?.protein || 0,
      carbs: product?.nutritionalInfo?.carbs || 0,
      fats: product?.nutritionalInfo?.fats || 0,
      startTime: product?.availability?.startTime || "08:00",
      endTime: product?.availability?.endTime || "22:00",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId,
        sku: product.sku || "",
        preparationTime: product.preparationTime || 15,
        stockQuantity: product.stock?.quantity || 0,
        stockUnit: product.stock?.unit || "un",
        active: product.active,
        available: product.available,
        calories: product.nutritionalInfo?.calories || 0,
        protein: product.nutritionalInfo?.protein || 0,
        carbs: product.nutritionalInfo?.carbs || 0,
        fats: product.nutritionalInfo?.fats || 0,
        startTime: product.availability?.startTime || "08:00",
        endTime: product.availability?.endTime || "22:00",
      });
      setIngredients(product.ingredients || []);
      setTags(product.tags || []);
      setSelectedDietary(product.dietaryInfo || []);
      setSelectedAllergens(product.allergens || []);
      setAvailabilityType(product.availability?.type || "always");
      setSelectedDays(product.availability?.days || []);
      setImagePreview(product.image || null);
    }
  }, [product, reset]);

  const toggleSection = (section: FormSection) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    const productData: Partial<Product> = {
      ...data,
      price: parseFloat(data.price),
      ingredients,
      tags,
      dietaryInfo: selectedDietary,
      allergens: selectedAllergens,
      image: imagePreview || "",
      nutritionalInfo: {
        calories: parseInt(data.calories) || 0,
        protein: parseInt(data.protein) || 0,
        carbs: parseInt(data.carbs) || 0,
        fats: parseInt(data.fats) || 0,
      },
      stock: {
        quantity: parseInt(data.stockQuantity) || 0,
        unit: data.stockUnit,
      },
      availability: {
        type: availabilityType as any,
        days: selectedDays,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    };

    console.log("Saving product:", productData);
    onSave?.(productData);
    onOpenChange(false);
  };

  const SectionHeader = ({
    section,
    title,
    icon: Icon,
  }: {
    section: FormSection;
    title: string;
    icon: React.ElementType;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-secondary)] transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[var(--color-primary)]" />
        <span className="font-semibold">{title}</span>
      </div>
      {expandedSections.includes(section) ? (
        <ChevronUp size={18} />
      ) : (
        <ChevronDown size={18} />
      )}
    </button>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-display font-bold">
            {product ? "Editar Produto" : "Novo Produto"}
          </SheetTitle>
          <SheetDescription>
            Preencha os dados do produto. Campos com * são obrigatórios.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* BASIC INFO */}
          <div className="space-y-4">
            <SectionHeader
              section="basic"
              title="Informações Básicas"
              icon={Info}
            />
            {expandedSections.includes("basic") && (
              <div className="p-4 space-y-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: X-Bacon Supremo"
                    {...register("name", { required: true })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("price", { required: true, min: 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <select
                      id="category"
                      className="flex h-12 w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-card)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      {...register("categoryId", { required: true })}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <textarea
                    id="description"
                    rows={3}
                    className="flex w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-card)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                    placeholder="Descreva os ingredientes e detalhes..."
                    {...register("description")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="active"
                      checked={watch("active")}
                      onCheckedChange={(checked) =>
                        setValue("active", checked as boolean)
                      }
                    />
                    <Label htmlFor="active" className="cursor-pointer">
                      Produto Ativo
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="available"
                      checked={watch("available")}
                      onCheckedChange={(checked) =>
                        setValue("available", checked as boolean)
                      }
                    />
                    <Label htmlFor="available" className="cursor-pointer">
                      Disponível para Venda
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MEDIA */}
          <div className="space-y-4">
            <SectionHeader section="media" title="Imagem" icon={Upload} />
            {expandedSections.includes("media") && (
              <div className="p-4 space-y-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all",
                    isDragging
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
                  )}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload
                        className="mx-auto text-[var(--color-muted-foreground)]"
                        size={40}
                      />
                      <div>
                        <p className="font-medium">
                          Arraste uma imagem ou clique para selecionar
                        </p>
                        <p className="text-sm text-[var(--color-muted-foreground)]">
                          JPG, PNG ou WebP. Máximo 5MB.
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Selecionar Arquivo
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="space-y-4">
            <SectionHeader section="details" title="Detalhes" icon={Utensils} />
            {expandedSections.includes("details") && (
              <div className="p-4 space-y-6 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
                {/* Ingredients */}
                <div className="space-y-3">
                  <Label>Ingredientes</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      placeholder="Adicionar ingrediente..."
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddIngredient())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddIngredient}
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 px-3 py-1 bg-[var(--color-secondary)] rounded-full text-sm"
                      >
                        {ing}
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(i)}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dietary Info */}
                <div className="space-y-3">
                  <Label>Restrições Alimentares</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dietaryOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`dietary-${opt.value}`}
                          checked={selectedDietary.includes(opt.value)}
                          onCheckedChange={(checked) => {
                            if (checked)
                              setSelectedDietary([
                                ...selectedDietary,
                                opt.value,
                              ]);
                            else
                              setSelectedDietary(
                                selectedDietary.filter((d) => d !== opt.value),
                              );
                          }}
                        />
                        <Label
                          htmlFor={`dietary-${opt.value}`}
                          className="cursor-pointer text-sm"
                        >
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-500" />
                    Alérgenos
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {allergenOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`allergen-${opt.value}`}
                          checked={selectedAllergens.includes(opt.value)}
                          onCheckedChange={(checked) => {
                            if (checked)
                              setSelectedAllergens([
                                ...selectedAllergens,
                                opt.value,
                              ]);
                            else
                              setSelectedAllergens(
                                selectedAllergens.filter(
                                  (a) => a !== opt.value,
                                ),
                              );
                          }}
                        />
                        <Label
                          htmlFor={`allergen-${opt.value}`}
                          className="cursor-pointer text-sm"
                        >
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preparation Time */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock size={16} />
                    Tempo de Preparo (minutos)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    {...register("preparationTime")}
                    className="w-32"
                  />
                </div>
              </div>
            )}
          </div>

          {/* NUTRITION */}
          <div className="space-y-4">
            <SectionHeader
              section="nutrition"
              title="Informações Nutricionais"
              icon={Info}
            />
            {expandedSections.includes("nutrition") && (
              <div className="p-4 space-y-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Calorias (kcal)</Label>
                    <Input type="number" {...register("calories")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Proteínas (g)</Label>
                    <Input type="number" {...register("protein")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Carboidratos (g)</Label>
                    <Input type="number" {...register("carbs")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gorduras (g)</Label>
                    <Input type="number" {...register("fats")} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AVAILABILITY */}
          <div className="space-y-4">
            <SectionHeader
              section="availability"
              title="Disponibilidade"
              icon={Clock}
            />
            {expandedSections.includes("availability") && (
              <div className="p-4 space-y-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
                <div className="space-y-3">
                  <Label>Tipo de Disponibilidade</Label>
                  <div className="flex flex-wrap gap-2">
                    {availabilityTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setAvailabilityType(type.value)}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-all text-sm",
                          availabilityType === type.value
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]",
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {availabilityType === "specific_days" && (
                  <div className="space-y-3">
                    <Label>Dias Disponíveis</Label>
                    <div className="flex gap-2">
                      {weekDays.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (selectedDays.includes(index)) {
                              setSelectedDays(
                                selectedDays.filter((d) => d !== index),
                              );
                            } else {
                              setSelectedDays([...selectedDays, index]);
                            }
                          }}
                          className={cn(
                            "w-10 h-10 rounded-lg border text-sm font-medium transition-all",
                            selectedDays.includes(index)
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                              : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]",
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availabilityType === "specific_hours" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Horário Inicial</Label>
                      <Input type="time" {...register("startTime")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário Final</Label>
                      <Input type="time" {...register("endTime")} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ADVANCED */}
          <div className="space-y-4">
            <SectionHeader section="advanced" title="Avançado" icon={Package} />
            {expandedSections.includes("advanced") && (
              <div className="p-4 space-y-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input placeholder="Código único" {...register("sku")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estoque</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Qtd"
                        {...register("stockQuantity")}
                        className="flex-1"
                      />
                      <select
                        className="w-20 rounded-lg border border-[var(--color-input)] bg-[var(--color-card)] px-2 text-sm"
                        {...register("stockUnit")}
                      >
                        <option value="un">un</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">L</option>
                        <option value="ml">mL</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Tag size={16} />
                    Tags (para busca)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag..."
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="mt-8 pt-4 border-t border-[var(--color-border)]">
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
