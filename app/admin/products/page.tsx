"use client";

import { useState, useMemo } from "react";
import { products as initialProducts, categories } from "@/data/menu";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductFormAdvanced } from "@/components/admin/ProductFormAdvanced";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Copy,
  Power,
  Download,
  Upload,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import Image from "next/image";

type SortField = "name" | "price" | "category" | "status";
type SortOrder = "asc" | "desc";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((p) => p.categoryId === filterCategory);
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "active") {
        result = result.filter((p) => p.active && p.available);
      } else if (filterStatus === "inactive") {
        result = result.filter((p) => !p.active);
      } else if (filterStatus === "unavailable") {
        result = result.filter((p) => p.active && !p.available);
      }
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "category":
          comparison = a.categoryId.localeCompare(b.categoryId);
          break;
        case "status":
          comparison = (a.available ? 1 : 0) - (b.available ? 1 : 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [products, search, filterCategory, filterStatus, sortField, sortOrder]);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter((p) => p.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const handleDuplicate = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now()}`,
      name: `${product.name} (Cópia)`,
      active: false,
    };
    setProducts([...products, newProduct]);
  };

  const handleToggleStatus = (id: string) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, available: !p.available } : p,
      ),
    );
  };

  const handleBulkToggle = (active: boolean) => {
    setProducts(
      products.map((p) =>
        selectedIds.includes(p.id) ? { ...p, active, available: active } : p,
      ),
    );
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Excluir ${selectedIds.length} produtos selecionados?`)) {
      setProducts(products.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Sem categoria";
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nome", "Preço", "Categoria", "Status", "SKU"];
    const rows = products.map((p) => [
      p.id,
      p.name,
      p.price.toString(),
      getCategoryName(p.categoryId),
      p.available ? "Disponível" : "Indisponível",
      p.sku || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "produtos.csv";
    link.click();
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...productData, updatedAt: new Date().toISOString() }
            : p,
        ),
      );
    } else {
      // Create
      const newProduct: Product = {
        ...(productData as Product),
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
    >
      {children}
      <ArrowUpDown
        size={14}
        className={cn(sortField === field && "text-[var(--color-primary)]")}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-foreground)]">
            Produtos
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            {products.length} produtos • {filteredProducts.length} exibidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download size={18} />
            Exportar
          </Button>
          <Button
            onClick={handleCreate}
            className="gap-2 font-bold shadow-lg shadow-black/5"
          >
            <Plus size={20} />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--color-card)] p-4 rounded-xl border border-[var(--color-border)] space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
              size={18}
            />
            <Input
              placeholder="Buscar por nome, descrição ou SKU..."
              className="pl-10 bg-[var(--color-background)] border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "gap-2",
              showFilters &&
                "bg-[var(--color-primary)]/10 border-[var(--color-primary)]",
            )}
          >
            <Filter size={18} />
            Filtros
            {(filterCategory !== "all" || filterStatus !== "all") && (
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
            )}
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1">
              <label className="text-xs text-[var(--color-muted-foreground)] uppercase font-medium">
                Categoria
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm"
              >
                <option value="all">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[var(--color-muted-foreground)] uppercase font-medium">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="unavailable">Indisponíveis</option>
              </select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterCategory("all");
                setFilterStatus("all");
              }}
              className="self-end text-[var(--color-muted-foreground)]"
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border)] animate-in fade-in">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {selectedIds.length} selecionado(s)
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkToggle(true)}
              className="gap-1"
            >
              <Eye size={16} /> Ativar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkToggle(false)}
              className="gap-1"
            >
              <EyeOff size={16} /> Desativar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDelete}
              className="gap-1 text-red-500 hover:text-red-400"
            >
              <Trash2 size={16} /> Excluir
            </Button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--color-background)]/50 text-xs uppercase text-[var(--color-muted-foreground)] font-medium">
            <tr>
              <th className="p-4 pl-6 w-12">
                <Checkbox
                  checked={
                    selectedIds.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-4">
                <SortButton field="name">Produto</SortButton>
              </th>
              <th className="p-4">
                <SortButton field="category">Categoria</SortButton>
              </th>
              <th className="p-4">
                <SortButton field="price">Preço</SortButton>
              </th>
              <th className="p-4">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="p-4 text-right pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={cn(
                  "group hover:bg-[var(--color-secondary)] transition-colors",
                  selectedIds.includes(product.id) &&
                    "bg-[var(--color-primary)]/5",
                )}
              >
                <td className="p-4 pl-6">
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => handleSelectOne(product.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-secondary)] flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[var(--color-foreground)] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-1">
                        {product.description}
                      </p>
                      {product.sku && (
                        <p className="text-[10px] text-[var(--color-muted-foreground)] font-mono">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-[var(--color-foreground)]">
                    {getCategoryName(product.categoryId)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm font-medium">
                    {formatCurrency(product.price)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "text-[10px] uppercase font-bold px-2 py-1 rounded-full border w-fit",
                        product.available
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20",
                      )}
                    >
                      {product.available ? "Disponível" : "Esgotado"}
                    </span>
                    {!product.active && (
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full border bg-gray-500/10 text-gray-500 border-gray-500/20 w-fit">
                        Inativo
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right pr-6">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:text-blue-400"
                      onClick={() => handleEdit(product)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:text-yellow-400"
                      onClick={() => handleDuplicate(product)}
                      title="Duplicar"
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "h-8 w-8",
                        product.available
                          ? "hover:text-orange-400"
                          : "hover:text-green-400",
                      )}
                      onClick={() => handleToggleStatus(product.id)}
                      title={product.available ? "Desativar" : "Ativar"}
                    >
                      <Power size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:text-red-400"
                      onClick={() => handleDelete(product.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p>Nenhum produto encontrado.</p>
          </div>
        )}
      </div>

      <ProductFormAdvanced
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
