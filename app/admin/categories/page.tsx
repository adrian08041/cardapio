"use client";

import { useState, useCallback } from "react";
import { categories as initialCategories } from "@/data/menu";
import { Category } from "@/types";
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
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DraggableCategoryProps {
  category: Category;
  index: number;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  isChild?: boolean;
  children?: Category[];
}

const DraggableCategory = ({
  category,
  index,
  moveCategory,
  onEdit,
  onDelete,
  onToggleActive,
  isChild = false,
  children = [],
}: DraggableCategoryProps) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "CATEGORY",
    item: { index, id: category.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CATEGORY",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCategory(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        preview(drop(node));
      }}
      className={cn(
        "group bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl transition-all",
        isDragging && "opacity-50 scale-95",
        isChild && "ml-8",
      )}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Drag Handle */}
        <div
          ref={(node) => {
            drag(node);
          }}
          className="cursor-grab text-gray-400 hover:text-[var(--color-foreground)] transition-colors"
        >
          <GripVertical size={20} />
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center text-2xl shrink-0">
          {category.icon || "📁"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--color-foreground)] truncate">
              {category.name}
            </h3>
            {!category.active && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                Inativo
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            /{category.slug}
          </p>
        </div>

        {/* Order Badge */}
        <span className="text-xs text-gray-500 font-mono bg-[var(--color-background)] px-2 py-1 rounded">
          #{category.order}
        </span>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8",
              category.active
                ? "hover:text-orange-400"
                : "hover:text-green-400",
            )}
            onClick={() => onToggleActive(category.id)}
            title={category.active ? "Desativar" : "Ativar"}
          >
            {category.active ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:text-blue-400"
            onClick={() => onEdit(category)}
            title="Editar"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:text-red-400"
            onClick={() => onDelete(category.id)}
            title="Excluir"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Children (subcategories) */}
      {children.length > 0 && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)]/30 rounded-b-xl">
          {children.map((child, i) => (
            <div
              key={child.id}
              className="flex items-center gap-4 p-3 pl-16 border-b border-[var(--color-border)] last:border-b-0"
            >
              <ChevronRight size={16} className="text-gray-600" />
              <span className="text-lg">{child.icon}</span>
              <span className="text-sm text-[var(--color-foreground)]">
                {child.name}
              </span>
              <div className="flex-1" />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => onEdit(child)}
              >
                <Edit2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Category Form Sheet
interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
  onSave: (category: Partial<Category>) => void;
}

function CategoryForm({
  open,
  onOpenChange,
  category,
  categories,
  onSave,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [icon, setIcon] = useState(category?.icon || "📁");
  const [parentId, setParentId] = useState<string | null>(
    category?.parentId || null,
  );
  const [active, setActive] = useState(category?.active ?? true);

  const handleSave = () => {
    onSave({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      icon,
      parentId,
      active,
      order: category?.order || categories.length + 1,
    });
    onOpenChange(false);
  };

  // Reset form when category changes
  useState(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setIcon(category.icon || "📁");
      setParentId(category.parentId || null);
      setActive(category.active);
    } else {
      setName("");
      setSlug("");
      setIcon("📁");
      setParentId(null);
      setActive(true);
    }
  });

  const parentCategories = categories.filter(
    (c) => !c.parentId && c.id !== category?.id,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold">
            {category ? "Editar Categoria" : "Nova Categoria"}
          </SheetTitle>
          <SheetDescription>
            Configure os detalhes da categoria.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="flex gap-2">
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-20 text-center text-2xl"
                maxLength={2}
              />
              <div className="flex-1 grid grid-cols-6 gap-1">
                {[
                  "🍔",
                  "🍕",
                  "🥤",
                  "🍰",
                  "🍱",
                  "🍣",
                  "🌮",
                  "🥗",
                  "🍗",
                  "☕",
                  "🍦",
                  "🥪",
                ].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={cn(
                      "p-2 rounded-lg text-lg hover:bg-[var(--color-secondary)] transition-colors",
                      icon === emoji &&
                        "bg-[var(--color-primary)]/20 ring-1 ring-[var(--color-primary)]",
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Hambúrgueres"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug (URL)</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="hamburgueres"
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Será usado na URL: /categoria/{slug || "nome"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Categoria Pai (opcional)</Label>
            <select
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full h-12 px-3 rounded-lg border border-[var(--color-input)] bg-[var(--color-card)] text-sm"
            >
              <option value="">Nenhuma (categoria raiz)</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Categoria Ativa
            </Label>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="gap-2"
          >
            <Save size={18} />
            {category ? "Salvar" : "Criar"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories.map((c, i) => ({
      ...c,
      order: c.order || i + 1,
      active: c.active ?? true,
    })),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const moveCategory = useCallback((dragIndex: number, hoverIndex: number) => {
    setCategories((prevCategories) => {
      const updated = [...prevCategories];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      // Update order numbers
      return updated.map((cat, index) => ({ ...cat, order: index + 1 }));
    });
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Excluir esta categoria? Os produtos associados ficarão sem categoria.",
      )
    ) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  };

  const handleSave = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...c, ...categoryData } : c,
        ),
      );
    } else {
      const newCategory: Category = {
        ...(categoryData as Category),
        id: `cat-${Date.now()}`,
        order: categories.length + 1,
      };
      setCategories([...categories, newCategory]);
    }
  };

  // Separate root and child categories
  const rootCategories = categories
    .filter((c) => !c.parentId)
    .sort((a, b) => a.order - b.order);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--color-foreground)]">
              Categorias
            </h1>
            <p className="text-[var(--color-muted-foreground)]">
              Organize as categorias do cardápio. Arraste para reordenar.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="gap-2 font-bold shadow-lg shadow-black/5"
          >
            <Plus size={20} />
            Nova Categoria
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <GripVertical className="text-blue-600" size={20} />
          <p className="text-sm text-blue-700">
            <strong>Dica:</strong> Arraste as categorias pela alça para alterar
            a ordem de exibição no cardápio.
          </p>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {rootCategories.map((category, index) => {
            const childCategories = categories.filter(
              (c) => c.parentId === category.id,
            );
            return (
              <DraggableCategory
                key={category.id}
                category={category}
                index={index}
                moveCategory={moveCategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                children={childCategories}
              />
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhuma categoria cadastrada.</p>
            <Button variant="outline" onClick={handleCreate} className="mt-4">
              Criar primeira categoria
            </Button>
          </div>
        )}

        <CategoryForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          category={editingCategory}
          categories={categories}
          onSave={handleSave}
        />
      </div>
    </DndProvider>
  );
}
