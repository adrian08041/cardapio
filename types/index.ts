// ============= CATEGORY =============
export interface CategoryAvailability {
  type: "always" | "specific_days" | "specific_hours";
  days?: number[]; // 0=Sun, 1=Mon, etc.
  startTime?: string; // "HH:mm"
  endTime?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string; // emoji or icon name
  iconUrl?: string; // custom uploaded SVG/image
  parentId?: string | null; // for hierarchy (max 2 levels)
  order: number; // display order
  availability?: CategoryAvailability;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============= PRODUCT =============
export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export type DietaryRestriction =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "lactose-free";

export type Allergen =
  | "gluten"
  | "dairy"
  | "eggs"
  | "peanuts"
  | "tree-nuts"
  | "soy"
  | "fish"
  | "shellfish"
  | "sesame";

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodium?: number;
}

export interface ProductStock {
  quantity: number;
  unit: "un" | "kg" | "g" | "l" | "ml";
  lowStockThreshold?: number;
}

export interface ProductAvailability {
  type: "always" | "specific_days" | "specific_hours";
  days?: number[];
  startTime?: string;
  endTime?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // multiple images
  categoryId: string;
  rating?: number;
  preparationTime?: number; // em minutos
  tags?: string[];
  dietaryInfo?: DietaryRestriction[];
  allergens?: Allergen[];
  nutritionalInfo?: NutritionalInfo;
  ingredients?: string[];
  available: boolean;
  options?: ProductOption[];
  // New fields for admin
  sku?: string;
  stock?: ProductStock;
  order?: number; // display order
  relatedProductIds?: string[];
  addonGroupIds?: string[];
  availability?: ProductAvailability;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============= ADDONS =============
export interface AddonItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  order: number;
}

export interface AddonGroup {
  id: string;
  name: string;
  type: "single" | "multiple"; // radio vs checkbox
  minSelections: number;
  maxSelections: number;
  items: AddonItem[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============= CART =============
export interface CartItem extends Omit<
  Product,
  "active" | "createdAt" | "updatedAt"
> {
  quantity: number;
  selectedOptions?: string[];
  selectedAddons?: { groupId: string; itemIds: string[] }[];
  notes?: string;
}

// ============= AUDIT LOG =============
export interface AuditLogEntry {
  id: string;
  entityType: "product" | "category" | "addon_group";
  entityId: string;
  action: "create" | "update" | "delete";
  changes: Record<string, { old: unknown; new: unknown }>;
  userId?: string;
  timestamp: string;
}

// ============= ORDERS (KDS & POS) =============
export interface OrderItem {
  id: string; // pode ser SKU ou ID unico da linha
  name: string;
  quantity: number;
  price: number;
  station?: "kitchen" | "bar" | "dessert"; // Setor de produção
  notes?: string;
  addons?: string[];
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  tableNumber?: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

// ============= CRM & FIDELITY =============

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: "earn" | "redeem" | "expire" | "adjustment";
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  birthDate?: string;

  // Endereços
  addresses: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
    type: "home" | "work" | "other";
  }[];

  // Métricas Calculadas
  metrics: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    firstOrderDate?: string;
    averageTicket: number;
    daysSinceLastOrder?: number;
  };

  // Fidelidade
  loyalty: {
    currentPoints: number;
    lifetimePoints: number;
    tier: "bronze" | "silver" | "gold" | "platinum";
    transactions: LoyaltyTransaction[];
  };

  tags: string[];
  status: "active" | "inactive" | "blocked" | "lead";
  notes?: string;
  createdAt: string;
}

export type CouponType =
  | "percentage"
  | "fixed_amount"
  | "free_shipping"
  | "free_product";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // % ou valor fixo
  minOrderValue?: number;
  maxDiscountValue?: number;

  // Validação
  startDate: string;
  endDate?: string;
  maxUses?: number; // Global limit
  maxUsesPerUser?: number;

  isActive: boolean;
  createdAt: string;
}
