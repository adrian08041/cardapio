# PRD Tecnico - Backend Cardapio Pro

**Versao:** 1.0.0  
**Data:** 2026-01-27  
**Status:** Draft  
**Classificacao:** Documento Tecnico Interno

---

## Sumario Executivo

Este documento define os requisitos tecnicos completos para o backend do sistema Cardapio Pro, uma plataforma enterprise de gestao operacional para food service. O backend sera construido com NestJS, PostgreSQL e Redis, seguindo principios de Clean Architecture e Domain-Driven Design.

---

## 1. ARQUITETURA E ESTRUTURA

### 1.1 Visao Geral da Arquitetura

O backend adota uma arquitetura em camadas baseada em Clean Architecture com influencias de DDD (Domain-Driven Design):

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Controllers, Gateways (WebSocket), Resolvers (GraphQL)     │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                         │
│  Use Cases, DTOs, Application Services, Event Handlers      │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                            │
│  Entities, Value Objects, Domain Services, Interfaces       │
├─────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                       │
│  Repositories, External Services, Database, Cache, Queue    │
└─────────────────────────────────────────────────────────────┘
```

**Principios Adotados:**

| Principio              | Descricao                                                     |
| ---------------------- | ------------------------------------------------------------- |
| Dependency Inversion   | Camadas superiores dependem de abstracoes, nao implementacoes |
| Single Responsibility  | Cada modulo tem uma unica razao para mudar                    |
| Interface Segregation  | Interfaces pequenas e especificas por contexto                |
| Separation of Concerns | Logica de negocio isolada de infraestrutura                   |

### 1.2 Estrutura de Pastas do Projeto

```
cardapio-backend/
├── src/
│   ├── main.ts                          # Bootstrap da aplicacao
│   ├── app.module.ts                    # Modulo raiz
│   │
│   ├── common/                          # Recursos compartilhados
│   │   ├── decorators/                  # Decorators customizados
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── api-paginated.decorator.ts
│   │   ├── filters/                     # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── prisma-exception.filter.ts
│   │   │   └── validation-exception.filter.ts
│   │   ├── guards/                      # Guards de autenticacao/autorizacao
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── permissions.guard.ts
│   │   │   └── ws-auth.guard.ts
│   │   ├── interceptors/                # Interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── timeout.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── cache.interceptor.ts
│   │   ├── pipes/                       # Validation pipes
│   │   │   ├── parse-uuid.pipe.ts
│   │   │   └── trim-strings.pipe.ts
│   │   ├── dto/                         # DTOs compartilhados
│   │   │   ├── pagination.dto.ts
│   │   │   ├── date-range.dto.ts
│   │   │   └── api-response.dto.ts
│   │   ├── interfaces/                  # Interfaces globais
│   │   │   ├── paginated-result.interface.ts
│   │   │   └── service-response.interface.ts
│   │   └── utils/                       # Utilitarios
│   │       ├── slug.util.ts
│   │       ├── hash.util.ts
│   │       └── date.util.ts
│   │
│   ├── config/                          # Configuracoes
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   ├── mail.config.ts
│   │   ├── storage.config.ts
│   │   └── queue.config.ts
│   │
│   ├── modules/                         # Modulos de dominio
│   │   ├── auth/
│   │   ├── users/
│   │   ├── restaurants/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── addons/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── payments/
│   │   ├── delivery/
│   │   ├── drivers/
│   │   ├── loyalty/
│   │   ├── coupons/
│   │   ├── campaigns/
│   │   ├── reviews/
│   │   ├── notifications/
│   │   ├── integrations/
│   │   ├── reports/
│   │   └── audit/
│   │
│   ├── database/                        # Prisma e migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── prisma.service.ts
│   │
│   ├── queue/                           # Bull queues
│   │   ├── queue.module.ts
│   │   ├── processors/
│   │   │   ├── notification.processor.ts
│   │   │   ├── report.processor.ts
│   │   │   ├── integration.processor.ts
│   │   │   └── image.processor.ts
│   │   └── jobs/
│   │
│   ├── cache/                           # Redis cache
│   │   ├── cache.module.ts
│   │   └── cache.service.ts
│   │
│   ├── websocket/                       # WebSocket gateways
│   │   ├── websocket.module.ts
│   │   ├── gateways/
│   │   │   ├── admin.gateway.ts
│   │   │   ├── kitchen.gateway.ts
│   │   │   ├── driver.gateway.ts
│   │   │   └── customer.gateway.ts
│   │   └── adapters/
│   │       └── redis.adapter.ts
│   │
│   └── health/                          # Health checks
│       ├── health.module.ts
│       └── health.controller.ts
│
├── test/                                # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker/                              # Docker configs
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── docker-compose.yml
│
├── prisma/                              # Prisma root
│   └── schema.prisma
│
├── .env.example
├── .env.development
├── .env.production
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

### 1.3 Lista de Modulos

O sistema e composto por 18 modulos principais:

| Modulo                  | Responsabilidade                              | Dependencias                                    | Exports                       |
| ----------------------- | --------------------------------------------- | ----------------------------------------------- | ----------------------------- |
| **AuthModule**          | Autenticacao JWT, refresh tokens, logout      | UsersModule, RedisModule                        | AuthService, JwtStrategy      |
| **UsersModule**         | Gestao de usuarios internos (admin, operador) | PrismaModule                                    | UsersService, UsersRepository |
| **RestaurantsModule**   | Configuracoes do restaurante, horarios, zonas | PrismaModule                                    | RestaurantsService            |
| **ProductsModule**      | CRUD de produtos, estoque, disponibilidade    | CategoriesModule, AddonsModule                  | ProductsService               |
| **CategoriesModule**    | Hierarquia de categorias, ordenacao           | PrismaModule                                    | CategoriesService             |
| **AddonsModule**        | Grupos de adicionais e itens                  | PrismaModule                                    | AddonsService                 |
| **OrdersModule**        | Ciclo de vida do pedido, status               | ProductsModule, CustomersModule, PaymentsModule | OrdersService, OrdersGateway  |
| **CustomersModule**     | Clientes, enderecos, preferencias             | PrismaModule                                    | CustomersService              |
| **PaymentsModule**      | Processamento de pagamentos, estornos         | IntegrationsModule                              | PaymentsService               |
| **DeliveryModule**      | Calculo de frete, areas de entrega            | DriversModule, RestaurantsModule                | DeliveryService               |
| **DriversModule**       | Gestao de entregadores, turnos, localizacao   | PrismaModule, WebSocketModule                   | DriversService                |
| **LoyaltyModule**       | Pontos, tiers, resgates                       | CustomersModule, OrdersModule                   | LoyaltyService                |
| **CouponsModule**       | Cupons de desconto, validacao                 | CustomersModule                                 | CouponsService                |
| **CampaignsModule**     | Campanhas de marketing, envios                | CustomersModule, NotificationsModule            | CampaignsService              |
| **ReviewsModule**       | Avaliacoes e respostas                        | OrdersModule, CustomersModule                   | ReviewsService                |
| **NotificationsModule** | Templates, filas, envio multicanal            | QueueModule, IntegrationsModule                 | NotificationsService          |
| **IntegrationsModule**  | APIs externas (iFood, Pago, WhatsApp)         | QueueModule                                     | IntegrationsService           |
| **ReportsModule**       | Relatorios, exports, analytics                | OrdersModule, CustomersModule                   | ReportsService                |
| **AuditModule**         | Logs de auditoria, rastreamento               | PrismaModule                                    | AuditService                  |

### 1.4 Estrutura Interna de um Modulo

Cada modulo segue a estrutura padrao:

```
modules/orders/
├── orders.module.ts                 # Definicao do modulo
├── orders.controller.ts             # Endpoints REST
├── orders.service.ts                # Logica de negocio
├── orders.repository.ts             # Acesso a dados
├── dto/
│   ├── create-order.dto.ts
│   ├── update-order-status.dto.ts
│   └── order-response.dto.ts
├── entities/
│   └── order.entity.ts
├── interfaces/
│   └── order.interface.ts
├── events/
│   ├── order-created.event.ts
│   └── order-status-changed.event.ts
└── __tests__/
    ├── orders.service.spec.ts
    └── orders.controller.spec.ts
```

---

## 2. MODELAGEM DE BANCO DE DADOS

### 2.1 Convencoes de Nomenclatura

| Elemento     | Convencao                 | Exemplo                       |
| ------------ | ------------------------- | ----------------------------- |
| Tabelas      | snake_case, plural        | `order_items`                 |
| Colunas      | snake_case                | `created_at`                  |
| Primary Keys | `id` (UUID)               | `id UUID PRIMARY KEY`         |
| Foreign Keys | `{tabela_singular}_id`    | `customer_id`                 |
| Indices      | `idx_{tabela}_{colunas}`  | `idx_orders_customer_id`      |
| Unique       | `unq_{tabela}_{colunas}`  | `unq_users_email`             |
| Check        | `chk_{tabela}_{condicao}` | `chk_products_price_positive` |

### 2.2 Tipos ENUM

```sql
-- Status e Estados
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'preparing', 'ready',
  'out_for_delivery', 'delivered', 'cancelled', 'refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'processing', 'approved', 'declined',
  'refunded', 'chargeback', 'expired'
);

CREATE TYPE payment_method AS ENUM (
  'credit_card', 'debit_card', 'pix', 'cash',
  'voucher', 'wallet', 'bank_slip'
);

CREATE TYPE delivery_type AS ENUM ('delivery', 'pickup', 'dine_in');

CREATE TYPE driver_status AS ENUM (
  'offline', 'available', 'busy', 'on_break'
);

CREATE TYPE notification_channel AS ENUM (
  'push', 'sms', 'email', 'whatsapp'
);

CREATE TYPE notification_status AS ENUM (
  'pending', 'sent', 'delivered', 'failed', 'read'
);

CREATE TYPE coupon_type AS ENUM (
  'percentage', 'fixed_amount', 'free_shipping', 'free_product'
);

CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

CREATE TYPE loyalty_transaction_type AS ENUM (
  'earn', 'redeem', 'expire', 'adjustment', 'bonus'
);

CREATE TYPE user_role AS ENUM (
  'super_admin', 'admin', 'manager', 'operator',
  'cashier', 'kitchen', 'driver'
);

CREATE TYPE address_type AS ENUM ('home', 'work', 'other');

CREATE TYPE availability_type AS ENUM (
  'always', 'specific_days', 'specific_hours'
);

CREATE TYPE campaign_status AS ENUM (
  'draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'
);

CREATE TYPE integration_type AS ENUM (
  'ifood', 'rappi', 'uber_eats', 'mercado_pago',
  'pagseguro', 'stripe', 'whatsapp', 'sendgrid'
);

CREATE TYPE webhook_status AS ENUM ('pending', 'success', 'failed', 'retrying');

CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout');
```

### 2.3 Schema Completo das Tabelas

#### 2.3.1 Dominio: Restaurante

```sql
-- Restaurante principal
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  logo_url VARCHAR(500),
  cover_url VARCHAR(500),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  document_number VARCHAR(20), -- CNPJ

  -- Endereco
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_complement VARCHAR(100),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state CHAR(2),
  address_zip_code VARCHAR(10),
  address_latitude DECIMAL(10, 8),
  address_longitude DECIMAL(11, 8),

  -- Configuracoes
  is_open BOOLEAN DEFAULT false,
  accepts_orders BOOLEAN DEFAULT true,
  min_order_value DECIMAL(10, 2) DEFAULT 0,
  avg_preparation_time INTEGER DEFAULT 30, -- minutos

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuracoes do restaurante (key-value)
CREATE TABLE restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, key)
);

-- Horarios de funcionamento
CREATE TABLE operating_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, day_of_week)
);

-- Zonas de entrega
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2) DEFAULT 0,
  estimated_time INTEGER, -- minutos

  -- Area geografica (GeoJSON polygon)
  polygon JSONB,
  -- Ou por CEP
  zip_code_start VARCHAR(10),
  zip_code_end VARCHAR(10),

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.2 Dominio: Produtos

```sql
-- Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  icon_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,

  -- Disponibilidade
  availability_type availability_type DEFAULT 'always',
  availability_days SMALLINT[], -- [0,1,2,3,4,5,6]
  availability_start_time TIME,
  availability_end_time TIME,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, slug)
);

-- Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  sku VARCHAR(50),

  -- Precos
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10, 2), -- para promocoes
  cost DECIMAL(10, 2), -- custo interno

  -- Imagens
  image_url VARCHAR(500),

  -- Detalhes
  preparation_time INTEGER, -- minutos
  serves INTEGER DEFAULT 1, -- porcoes
  weight DECIMAL(10, 3), -- kg

  -- Nutricional
  calories INTEGER,
  protein DECIMAL(5, 2),
  carbs DECIMAL(5, 2),
  fats DECIMAL(5, 2),
  fiber DECIMAL(5, 2),
  sodium DECIMAL(7, 2),

  -- Tags e restricoes
  tags TEXT[],
  dietary_info TEXT[], -- vegetarian, vegan, gluten-free
  allergens TEXT[],
  ingredients TEXT[],

  -- Estoque
  track_stock BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  stock_unit VARCHAR(10) DEFAULT 'un',
  low_stock_threshold INTEGER DEFAULT 5,

  -- Disponibilidade
  availability_type availability_type DEFAULT 'always',
  availability_days SMALLINT[],
  availability_start_time TIME,
  availability_end_time TIME,

  -- Ordenacao
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,

  -- Status
  is_available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, slug)
);

-- Imagens do produto
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grupos de adicionais
CREATE TABLE addon_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  selection_type VARCHAR(20) DEFAULT 'multiple' CHECK (selection_type IN ('single', 'multiple')),
  min_selections INTEGER DEFAULT 0,
  max_selections INTEGER DEFAULT 10,
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itens do grupo de adicionais
CREATE TABLE addon_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_group_id UUID NOT NULL REFERENCES addon_groups(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Associacao produto-addon_group
CREATE TABLE product_addon_groups (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  addon_group_id UUID NOT NULL REFERENCES addon_groups(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (product_id, addon_group_id)
);

-- Produtos relacionados
CREATE TABLE product_relations (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  relation_type VARCHAR(20) DEFAULT 'related', -- related, upsell, cross-sell
  PRIMARY KEY (product_id, related_product_id)
);
```

#### 2.3.3 Dominio: Clientes

```sql
-- Clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,

  -- Dados pessoais
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  cpf VARCHAR(14),
  birth_date DATE,

  -- Preferencias
  preferred_payment_method payment_method,
  marketing_opt_in BOOLEAN DEFAULT true,

  -- Fidelidade
  loyalty_tier loyalty_tier DEFAULT 'bronze',
  loyalty_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,

  -- Metadata
  tags TEXT[],
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked', 'lead')),
  last_order_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, phone)
);

-- Enderecos dos clientes
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

  label VARCHAR(50),
  address_type address_type DEFAULT 'home',

  street VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(100),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,

  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  reference TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favoritos do cliente
CREATE TABLE customer_favorites (
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id, product_id)
);

-- Preferencias do cliente
CREATE TABLE customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  UNIQUE(customer_id, key)
);
```

#### 2.3.4 Dominio: Pedidos

```sql
-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  customer_id UUID REFERENCES customers(id),
  driver_id UUID REFERENCES drivers(id),

  -- Numero do pedido (sequencial por restaurante)
  order_number INTEGER NOT NULL,

  -- Tipo e status
  delivery_type delivery_type NOT NULL,
  status order_status DEFAULT 'pending',

  -- Cliente (desnormalizado para historico)
  customer_name VARCHAR(200) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),

  -- Endereco de entrega
  delivery_address_street VARCHAR(255),
  delivery_address_number VARCHAR(20),
  delivery_address_complement VARCHAR(100),
  delivery_address_neighborhood VARCHAR(100),
  delivery_address_city VARCHAR(100),
  delivery_address_state CHAR(2),
  delivery_address_zip_code VARCHAR(10),
  delivery_address_latitude DECIMAL(10, 8),
  delivery_address_longitude DECIMAL(11, 8),
  delivery_address_reference TEXT,

  -- Mesa (para dine_in)
  table_number VARCHAR(20),

  -- Valores
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tip_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Cupom aplicado
  coupon_id UUID REFERENCES coupons(id),
  coupon_code VARCHAR(50),

  -- Pagamento
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  payment_change_for DECIMAL(10, 2), -- troco para

  -- Fidelidade
  loyalty_points_earned INTEGER DEFAULT 0,
  loyalty_points_used INTEGER DEFAULT 0,

  -- Tempos
  estimated_preparation_time INTEGER, -- minutos
  estimated_delivery_time TIMESTAMP,
  prepared_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP,

  -- Notas
  notes TEXT,
  cancellation_reason TEXT,

  -- Origem
  source VARCHAR(50) DEFAULT 'web', -- web, app, ifood, rappi, phone
  source_order_id VARCHAR(100), -- ID externo

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, order_number)
);

-- Itens do pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),

  -- Desnormalizado
  product_name VARCHAR(200) NOT NULL,
  product_sku VARCHAR(50),

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,

  -- Estacao de producao
  station VARCHAR(50), -- kitchen, bar, dessert

  notes TEXT,

  -- Status individual (para KDS)
  status VARCHAR(20) DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionais do item do pedido
CREATE TABLE order_item_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  addon_item_id UUID REFERENCES addon_items(id),

  -- Desnormalizado
  addon_group_name VARCHAR(100) NOT NULL,
  addon_item_name VARCHAR(100) NOT NULL,
  addon_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historico de status do pedido
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.5 Dominio: Pagamentos

```sql
-- Pagamentos
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),

  -- Metodo e status
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',

  -- Valores
  amount DECIMAL(10, 2) NOT NULL,
  fee DECIMAL(10, 2) DEFAULT 0, -- taxa do gateway
  net_amount DECIMAL(10, 2), -- valor liquido

  -- Gateway
  gateway VARCHAR(50), -- mercado_pago, pagseguro, stripe
  gateway_transaction_id VARCHAR(255),
  gateway_response JSONB,

  -- Cartao (dados parciais)
  card_brand VARCHAR(50),
  card_last_digits VARCHAR(4),

  -- PIX
  pix_qr_code TEXT,
  pix_qr_code_base64 TEXT,
  pix_expiration TIMESTAMP,

  -- Datas
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estornos
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id),

  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT,

  gateway_refund_id VARCHAR(255),
  gateway_response JSONB,

  status VARCHAR(20) DEFAULT 'pending',
  processed_at TIMESTAMP,
  created_by UUID REFERENCES users(id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.6 Dominio: Entregas e Entregadores

```sql
-- Entregadores
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),

  -- Dados pessoais
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  cpf VARCHAR(14),
  birth_date DATE,

  -- Documentos
  cnh_number VARCHAR(20),
  cnh_expiration DATE,
  cnh_category VARCHAR(5),

  -- Avatar
  avatar_url VARCHAR(500),

  -- Status
  status driver_status DEFAULT 'offline',
  is_active BOOLEAN DEFAULT true,

  -- Rating
  rating_average DECIMAL(3, 2) DEFAULT 5.00,
  rating_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, phone)
);

-- Veiculos dos entregadores
CREATE TABLE driver_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,

  type VARCHAR(50) NOT NULL, -- motorcycle, bicycle, car
  brand VARCHAR(50),
  model VARCHAR(50),
  color VARCHAR(50),
  plate VARCHAR(10),
  year INTEGER,

  is_primary BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Turnos dos entregadores
CREATE TABLE driver_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  actual_start_time TIMESTAMP,
  actual_end_time TIMESTAMP,

  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, active, completed, cancelled

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Localizacao em tempo real
CREATE TABLE driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,

  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(6, 2),
  heading DECIMAL(5, 2),
  speed DECIMAL(6, 2),

  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entregas (associacao driver-order)
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),

  -- Status
  status VARCHAR(30) DEFAULT 'assigned',
  -- assigned, picked_up, on_the_way, arrived, delivered, returned

  -- Tempos
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMP,
  delivered_at TIMESTAMP,

  -- Distancia e tempo
  distance_km DECIMAL(6, 2),
  estimated_time INTEGER, -- minutos
  actual_time INTEGER,

  -- Prova de entrega
  delivery_photo_url VARCHAR(500),
  recipient_name VARCHAR(200),
  signature_url VARCHAR(500),

  -- Comissao
  delivery_fee DECIMAL(10, 2),
  driver_commission DECIMAL(10, 2),

  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.7 Dominio: Fidelidade

```sql
-- Configuracao de tiers
CREATE TABLE loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),

  name VARCHAR(50) NOT NULL,
  tier loyalty_tier NOT NULL,
  min_points INTEGER NOT NULL, -- pontos para atingir

  -- Beneficios
  points_multiplier DECIMAL(3, 2) DEFAULT 1.00, -- 1.5 = 50% mais pontos
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  free_delivery BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,

  -- Visual
  color VARCHAR(20),
  badge_url VARCHAR(500),

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transacoes de pontos
CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),

  type loyalty_transaction_type NOT NULL,
  points INTEGER NOT NULL, -- positivo ou negativo
  balance_after INTEGER NOT NULL, -- saldo apos transacao

  description TEXT,
  expires_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recompensas disponiveis
CREATE TABLE loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),

  name VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),

  points_required INTEGER NOT NULL,

  reward_type VARCHAR(50) NOT NULL, -- product, discount, free_delivery, custom
  reward_value JSONB, -- { product_id, discount_percentage, etc }

  -- Limites
  max_redemptions INTEGER,
  redemptions_count INTEGER DEFAULT 0,
  min_tier loyalty_tier,

  valid_from TIMESTAMP,
  valid_until TIMESTAMP,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resgates realizados
CREATE TABLE loyalty_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  reward_id UUID NOT NULL REFERENCES loyalty_rewards(id),
  order_id UUID REFERENCES orders(id),

  points_used INTEGER NOT NULL,

  status VARCHAR(20) DEFAULT 'pending', -- pending, applied, cancelled

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  applied_at TIMESTAMP
);
```

#### 2.3.8 Dominio: Marketing

```sql
-- Cupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),

  code VARCHAR(50) NOT NULL,
  description TEXT,

  type coupon_type NOT NULL,
  value DECIMAL(10, 2) NOT NULL, -- % ou valor fixo

  -- Restricoes
  min_order_value DECIMAL(10, 2) DEFAULT 0,
  max_discount_value DECIMAL(10, 2),

  -- Validade
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP,

  -- Limites de uso
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  max_uses_per_customer INTEGER DEFAULT 1,

  -- Restricoes de aplicacao
  first_order_only BOOLEAN DEFAULT false,
  delivery_only BOOLEAN DEFAULT false,
  pickup_only BOOLEAN DEFAULT false,

  -- Produtos/categorias especificos
  applicable_product_ids UUID[],
  applicable_category_ids UUID[],

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Uso de cupons
CREATE TABLE coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  customer_id UUID REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),

  discount_applied DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campanhas de marketing
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),

  name VARCHAR(200) NOT NULL,
  description TEXT,

  type VARCHAR(50) NOT NULL, -- email, sms, push, whatsapp
  status campaign_status DEFAULT 'draft',

  -- Template
  subject VARCHAR(255),
  content TEXT,
  template_id UUID,

  -- Audiencia
  target_audience JSONB, -- filtros de clientes
  estimated_reach INTEGER,

  -- Agendamento
  scheduled_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,

  -- Cupon associado
  coupon_id UUID REFERENCES coupons(id),

  -- Metricas
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12, 2) DEFAULT 0,

  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Envios de campanha
CREATE TABLE campaign_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  customer_id UUID NOT NULL REFERENCES customers(id),

  channel notification_channel NOT NULL,
  destination VARCHAR(255) NOT NULL, -- email, phone, etc

  status notification_status DEFAULT 'pending',

  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,

  error_message TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.9 Dominio: Avaliacoes

```sql
-- Avaliacoes
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  customer_id UUID NOT NULL REFERENCES customers(id),

  -- Ratings (1-5)
  overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  food_rating SMALLINT CHECK (food_rating BETWEEN 1 AND 5),
  delivery_rating SMALLINT CHECK (delivery_rating BETWEEN 1 AND 5),
  service_rating SMALLINT CHECK (service_rating BETWEEN 1 AND 5),

  -- Comentario
  comment TEXT,

  -- Resposta do restaurante
  response TEXT,
  responded_at TIMESTAMP,
  responded_by UUID REFERENCES users(id),

  -- Moderacao
  is_visible BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT true, -- compra verificada

  -- Util
  helpful_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(order_id)
);

-- Avaliacoes de itens especificos
CREATE TABLE review_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),

  product_name VARCHAR(200) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.10 Dominio: Usuarios e Autenticacao

```sql
-- Usuarios (admin, operadores)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),

  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  phone VARCHAR(20),
  avatar_url VARCHAR(500),

  role user_role DEFAULT 'operator',

  -- Seguranca
  is_active BOOLEAN DEFAULT true,
  email_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,

  -- MFA
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissoes
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Associacao role-permission
CREATE TABLE role_permissions (
  role user_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id),
  PRIMARY KEY (role, permission_id)
);

-- Tokens de refresh
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  token_hash VARCHAR(255) NOT NULL,

  ip_address INET,
  user_agent TEXT,

  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tokens de recuperacao de senha
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  token_hash VARCHAR(255) NOT NULL,

  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.11 Dominio: Notificacoes

```sql
-- Templates de notificacao
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),

  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,

  channel notification_channel NOT NULL,

  subject VARCHAR(255),
  content TEXT NOT NULL,

  -- Variaveis disponiveis
  variables TEXT[], -- {{customer_name}}, {{order_number}}

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fila de notificacoes
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),

  recipient_type VARCHAR(20) NOT NULL, -- customer, driver, user
  recipient_id UUID NOT NULL,

  channel notification_channel NOT NULL,
  destination VARCHAR(255) NOT NULL,

  template_id UUID REFERENCES notification_templates(id),

  subject VARCHAR(255),
  content TEXT NOT NULL,

  data JSONB, -- dados extras

  status notification_status DEFAULT 'pending',
  priority SMALLINT DEFAULT 5, -- 1 = mais alta

  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,

  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log de entregas de notificacao
CREATE TABLE notification_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notification_queue(id),

  status notification_status NOT NULL,

  provider VARCHAR(50), -- sendgrid, twilio, firebase
  provider_message_id VARCHAR(255),
  provider_response JSONB,

  error_code VARCHAR(50),
  error_message TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.12 Dominio: Integracoes

```sql
-- Configuracoes de integracao
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),

  type integration_type NOT NULL,
  name VARCHAR(100) NOT NULL,

  -- Credenciais (criptografadas)
  credentials JSONB,

  -- Configuracoes
  settings JSONB,

  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(restaurant_id, type)
);

-- Pedidos de marketplaces
CREATE TABLE marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  order_id UUID REFERENCES orders(id),

  platform integration_type NOT NULL,
  external_order_id VARCHAR(100) NOT NULL,

  external_status VARCHAR(50),
  external_data JSONB,

  synced_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(platform, external_order_id)
);

-- Mapeamento de produtos
CREATE TABLE product_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  product_id UUID NOT NULL REFERENCES products(id),

  platform integration_type NOT NULL,
  external_product_id VARCHAR(100) NOT NULL,

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, platform)
);

-- Webhooks recebidos
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),

  source integration_type NOT NULL,
  event_type VARCHAR(100),

  headers JSONB,
  payload JSONB,

  status webhook_status DEFAULT 'pending',
  processed_at TIMESTAMP,
  error_message TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.13 Dominio: Auditoria

```sql
-- Log de auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),

  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255),

  action audit_action NOT NULL,

  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  entity_name VARCHAR(255),

  old_values JSONB,
  new_values JSONB,

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log de requisicoes API
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  user_id UUID REFERENCES users(id),

  method VARCHAR(10) NOT NULL,
  path VARCHAR(500) NOT NULL,
  query_params JSONB,

  request_headers JSONB,
  request_body JSONB,

  response_status INTEGER,
  response_time_ms INTEGER,

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Particoes para api_logs (criar mensalmente)
CREATE TABLE api_logs_2026_01 PARTITION OF api_logs
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE api_logs_2026_02 PARTITION OF api_logs
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### 2.4 Indices Estrategicos

```sql
-- Indices para buscas frequentes
CREATE INDEX idx_products_restaurant_category ON products(restaurant_id, category_id);
CREATE INDEX idx_products_restaurant_active ON products(restaurant_id) WHERE is_active = true;
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(description, '')));

CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);
CREATE INDEX idx_orders_restaurant_date ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_driver ON orders(driver_id) WHERE driver_id IS NOT NULL;

CREATE INDEX idx_customers_restaurant_phone ON customers(restaurant_id, phone);
CREATE INDEX idx_customers_restaurant_email ON customers(restaurant_id, email) WHERE email IS NOT NULL;
CREATE INDEX idx_customers_search ON customers USING gin(to_tsvector('portuguese', name || ' ' || phone));

CREATE INDEX idx_drivers_restaurant_status ON drivers(restaurant_id, status);
CREATE INDEX idx_driver_locations_driver_time ON driver_locations(driver_id, recorded_at DESC);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_restaurant_date ON audit_logs(restaurant_id, created_at DESC);

CREATE INDEX idx_notification_queue_status ON notification_queue(status, scheduled_at) WHERE status = 'pending';

CREATE INDEX idx_loyalty_transactions_customer ON loyalty_transactions(customer_id, created_at DESC);

CREATE INDEX idx_coupons_code ON coupons(restaurant_id, code) WHERE is_active = true;
```

### 2.5 Views Materializadas para Analytics

```sql
-- Resumo diario de vendas
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT
  restaurant_id,
  DATE(created_at) as date,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered_orders,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
  SUM(total) FILTER (WHERE status = 'delivered') as gross_revenue,
  SUM(discount_amount) FILTER (WHERE status = 'delivered') as total_discounts,
  SUM(delivery_fee) FILTER (WHERE status = 'delivered') as total_delivery_fees,
  AVG(total) FILTER (WHERE status = 'delivered') as avg_ticket,
  COUNT(DISTINCT customer_id) as unique_customers
FROM orders
GROUP BY restaurant_id, DATE(created_at);

CREATE UNIQUE INDEX ON mv_daily_sales(restaurant_id, date);

-- Ranking de produtos
CREATE MATERIALIZED VIEW mv_product_ranking AS
SELECT
  p.restaurant_id,
  p.id as product_id,
  p.name as product_name,
  p.category_id,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.total_price) as total_revenue,
  AVG(ri.rating) as avg_rating
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'delivered'
LEFT JOIN review_items ri ON ri.product_id = p.id
GROUP BY p.restaurant_id, p.id, p.name, p.category_id;

CREATE UNIQUE INDEX ON mv_product_ranking(restaurant_id, product_id);

-- Metricas de clientes
CREATE MATERIALIZED VIEW mv_customer_metrics AS
SELECT
  c.id as customer_id,
  c.restaurant_id,
  COUNT(o.id) as total_orders,
  SUM(o.total) as total_spent,
  AVG(o.total) as avg_ticket,
  MIN(o.created_at) as first_order_at,
  MAX(o.created_at) as last_order_at,
  EXTRACT(DAY FROM NOW() - MAX(o.created_at)) as days_since_last_order,
  c.loyalty_points,
  c.loyalty_tier
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'
GROUP BY c.id, c.restaurant_id, c.loyalty_points, c.loyalty_tier;

CREATE UNIQUE INDEX ON mv_customer_metrics(customer_id);

-- Refresh (agendar via cron)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_product_ranking;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_metrics;
```

---

## 3. ENTIDADES E DTOs

### 3.1 Exemplo de Entidade Prisma

```prisma
// prisma/schema.prisma (parcial)

model Product {
  id                  String   @id @default(uuid())
  restaurantId        String   @map("restaurant_id")
  categoryId          String   @map("category_id")

  name                String   @db.VarChar(200)
  slug                String   @db.VarChar(200)
  description         String?  @db.Text
  shortDescription    String?  @map("short_description") @db.VarChar(500)
  sku                 String?  @db.VarChar(50)

  price               Decimal  @db.Decimal(10, 2)
  originalPrice       Decimal? @map("original_price") @db.Decimal(10, 2)
  cost                Decimal? @db.Decimal(10, 2)

  imageUrl            String?  @map("image_url") @db.VarChar(500)
  preparationTime     Int?     @map("preparation_time")
  serves              Int      @default(1)

  calories            Int?
  protein             Decimal? @db.Decimal(5, 2)
  carbs               Decimal? @db.Decimal(5, 2)
  fats                Decimal? @db.Decimal(5, 2)

  tags                String[]
  dietaryInfo         String[] @map("dietary_info")
  allergens           String[]
  ingredients         String[]

  trackStock          Boolean  @default(false) @map("track_stock")
  stockQuantity       Int      @default(0) @map("stock_quantity")
  stockUnit           String   @default("un") @map("stock_unit") @db.VarChar(10)
  lowStockThreshold   Int      @default(5) @map("low_stock_threshold")

  availabilityType    AvailabilityType @default(ALWAYS) @map("availability_type")
  availabilityDays    Int[]    @map("availability_days")
  availabilityStartTime String? @map("availability_start_time") @db.Time
  availabilityEndTime String?  @map("availability_end_time") @db.Time

  sortOrder           Int      @default(0) @map("sort_order")
  isFeatured          Boolean  @default(false) @map("is_featured")
  isAvailable         Boolean  @default(true) @map("is_available")
  isActive            Boolean  @default(true) @map("is_active")

  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  // Relations
  restaurant          Restaurant @relation(fields: [restaurantId], references: [id])
  category            Category   @relation(fields: [categoryId], references: [id])
  images              ProductImage[]
  addonGroups         ProductAddonGroup[]
  orderItems          OrderItem[]

  @@unique([restaurantId, slug])
  @@index([restaurantId, categoryId])
  @@index([restaurantId, isActive])
  @@map("products")
}
```

### 3.2 DTOs de Produto

```typescript
// modules/products/dto/create-product.dto.ts

import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsUUID,
  Min,
  Max,
  MaxLength,
  IsUrl,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AvailabilityType } from "@prisma/client";

export class CreateProductDto {
  @ApiProperty({ example: "X-Bacon Especial" })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ example: 29.9 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 39.9 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  originalPrice?: number;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(180)
  preparationTime?: number;

  @ApiPropertyOptional({ example: ["artesanal", "mais-vendido"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: ["gluten-free"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryInfo?: string[];

  @ApiPropertyOptional({ example: ["dairy", "eggs"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  trackStock?: boolean;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ enum: AvailabilityType })
  @IsOptional()
  @IsEnum(AvailabilityType)
  availabilityType?: AvailabilityType;

  @ApiPropertyOptional({ example: [1, 2, 3, 4, 5] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  availabilityDays?: number[];

  @ApiPropertyOptional({ example: ["uuid1", "uuid2"] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  addonGroupIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
```

```typescript
// modules/products/dto/product-response.dto.ts

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

class CategorySummaryDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() slug: string;
}

class ProductImageDto {
  @Expose() id: string;
  @Expose() url: string;
  @Expose() altText: string;
  @Expose() isPrimary: boolean;
}

@Exclude()
export class ProductResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiPropertyOptional()
  originalPrice?: number;

  @Expose()
  @ApiPropertyOptional()
  imageUrl?: string;

  @Expose()
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @Expose()
  @Type(() => CategorySummaryDto)
  category: CategorySummaryDto;

  @Expose()
  preparationTime?: number;

  @Expose()
  tags: string[];

  @Expose()
  dietaryInfo: string[];

  @Expose()
  allergens: string[];

  @Expose()
  isAvailable: boolean;

  @Expose()
  isFeatured: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
```

---

## 4. ROTAS E CONTROLLERS

### 4.1 Mapeamento Completo de Endpoints

#### 4.1.1 Autenticacao (AuthModule)

| Metodo | Rota                         | Auth | Roles | Descricao                | Rate Limit |
| ------ | ---------------------------- | ---- | ----- | ------------------------ | ---------- |
| POST   | /api/v1/auth/login           | Nao  | -     | Login com email/senha    | 5/min      |
| POST   | /api/v1/auth/refresh         | Nao  | -     | Renovar access token     | 10/min     |
| POST   | /api/v1/auth/logout          | Sim  | \*    | Revogar refresh token    | 10/min     |
| POST   | /api/v1/auth/forgot-password | Nao  | -     | Solicitar reset de senha | 3/min      |
| POST   | /api/v1/auth/reset-password  | Nao  | -     | Resetar senha com token  | 3/min      |
| POST   | /api/v1/auth/change-password | Sim  | \*    | Alterar senha atual      | 5/min      |
| GET    | /api/v1/auth/me              | Sim  | \*    | Dados do usuario logado  | 60/min     |
| POST   | /api/v1/auth/mfa/enable      | Sim  | \*    | Habilitar MFA            | 5/min      |
| POST   | /api/v1/auth/mfa/verify      | Sim  | \*    | Verificar codigo MFA     | 10/min     |
| POST   | /api/v1/auth/mfa/disable     | Sim  | \*    | Desabilitar MFA          | 5/min      |

#### 4.1.2 Usuarios (UsersModule)

| Metodo | Rota                     | Auth | Roles          | Descricao         | Rate Limit |
| ------ | ------------------------ | ---- | -------------- | ----------------- | ---------- |
| GET    | /api/v1/users            | Sim  | admin, manager | Listar usuarios   | 60/min     |
| POST   | /api/v1/users            | Sim  | admin          | Criar usuario     | 30/min     |
| GET    | /api/v1/users/:id        | Sim  | admin, manager | Buscar usuario    | 60/min     |
| PATCH  | /api/v1/users/:id        | Sim  | admin          | Atualizar usuario | 30/min     |
| DELETE | /api/v1/users/:id        | Sim  | super_admin    | Remover usuario   | 10/min     |
| PATCH  | /api/v1/users/:id/role   | Sim  | super_admin    | Alterar role      | 10/min     |
| PATCH  | /api/v1/users/:id/status | Sim  | admin          | Ativar/desativar  | 30/min     |

#### 4.1.3 Restaurante (RestaurantsModule)

| Metodo | Rota                                  | Auth | Roles                    | Descricao                 | Rate Limit |
| ------ | ------------------------------------- | ---- | ------------------------ | ------------------------- | ---------- |
| GET    | /api/v1/restaurant                    | Sim  | \*                       | Dados do restaurante      | 120/min    |
| PATCH  | /api/v1/restaurant                    | Sim  | admin, manager           | Atualizar dados           | 30/min     |
| PATCH  | /api/v1/restaurant/logo               | Sim  | admin                    | Upload logo               | 10/min     |
| PATCH  | /api/v1/restaurant/cover              | Sim  | admin                    | Upload capa               | 10/min     |
| GET    | /api/v1/restaurant/settings           | Sim  | admin, manager           | Listar configuracoes      | 60/min     |
| PUT    | /api/v1/restaurant/settings/:key      | Sim  | admin                    | Atualizar configuracao    | 30/min     |
| GET    | /api/v1/restaurant/operating-hours    | Sim  | \*                       | Horarios de funcionamento | 60/min     |
| PUT    | /api/v1/restaurant/operating-hours    | Sim  | admin, manager           | Atualizar horarios        | 30/min     |
| GET    | /api/v1/restaurant/delivery-zones     | Sim  | \*                       | Zonas de entrega          | 60/min     |
| POST   | /api/v1/restaurant/delivery-zones     | Sim  | admin, manager           | Criar zona                | 30/min     |
| PATCH  | /api/v1/restaurant/delivery-zones/:id | Sim  | admin, manager           | Atualizar zona            | 30/min     |
| DELETE | /api/v1/restaurant/delivery-zones/:id | Sim  | admin                    | Remover zona              | 10/min     |
| POST   | /api/v1/restaurant/toggle-open        | Sim  | admin, manager, operator | Abrir/fechar              | 60/min     |

#### 4.1.4 Categorias (CategoriesModule)

| Metodo | Rota                       | Auth | Roles          | Descricao                   | Rate Limit |
| ------ | -------------------------- | ---- | -------------- | --------------------------- | ---------- |
| GET    | /api/v1/categories         | Nao  | -              | Listar categorias (publico) | 120/min    |
| GET    | /api/v1/categories/tree    | Nao  | -              | Arvore de categorias        | 120/min    |
| GET    | /api/v1/categories/:id     | Nao  | -              | Buscar categoria            | 120/min    |
| POST   | /api/v1/categories         | Sim  | admin, manager | Criar categoria             | 30/min     |
| PATCH  | /api/v1/categories/:id     | Sim  | admin, manager | Atualizar categoria         | 30/min     |
| DELETE | /api/v1/categories/:id     | Sim  | admin          | Remover categoria           | 10/min     |
| PATCH  | /api/v1/categories/reorder | Sim  | admin, manager | Reordenar categorias        | 30/min     |

#### 4.1.5 Produtos (ProductsModule)

| Metodo | Rota                                 | Auth | Roles                    | Descricao                 | Rate Limit |
| ------ | ------------------------------------ | ---- | ------------------------ | ------------------------- | ---------- |
| GET    | /api/v1/products                     | Nao  | -                        | Listar produtos (publico) | 120/min    |
| GET    | /api/v1/products/search              | Nao  | -                        | Buscar produtos           | 120/min    |
| GET    | /api/v1/products/featured            | Nao  | -                        | Produtos em destaque      | 120/min    |
| GET    | /api/v1/products/:id                 | Nao  | -                        | Buscar produto            | 120/min    |
| GET    | /api/v1/products/slug/:slug          | Nao  | -                        | Buscar por slug           | 120/min    |
| POST   | /api/v1/products                     | Sim  | admin, manager           | Criar produto             | 30/min     |
| PATCH  | /api/v1/products/:id                 | Sim  | admin, manager           | Atualizar produto         | 30/min     |
| DELETE | /api/v1/products/:id                 | Sim  | admin                    | Remover produto           | 10/min     |
| POST   | /api/v1/products/:id/images          | Sim  | admin, manager           | Upload imagem             | 20/min     |
| DELETE | /api/v1/products/:id/images/:imageId | Sim  | admin, manager           | Remover imagem            | 30/min     |
| PATCH  | /api/v1/products/:id/availability    | Sim  | admin, manager, operator | Atualizar disponibilidade | 60/min     |
| PATCH  | /api/v1/products/:id/stock           | Sim  | admin, manager, operator | Atualizar estoque         | 60/min     |
| PATCH  | /api/v1/products/reorder             | Sim  | admin, manager           | Reordenar produtos        | 30/min     |
| POST   | /api/v1/products/bulk-update         | Sim  | admin                    | Atualizacao em lote       | 10/min     |

#### 4.1.6 Adicionais (AddonsModule)

| Metodo | Rota                                   | Auth | Roles          | Descricao       | Rate Limit |
| ------ | -------------------------------------- | ---- | -------------- | --------------- | ---------- |
| GET    | /api/v1/addon-groups                   | Sim  | \*             | Listar grupos   | 60/min     |
| POST   | /api/v1/addon-groups                   | Sim  | admin, manager | Criar grupo     | 30/min     |
| GET    | /api/v1/addon-groups/:id               | Sim  | \*             | Buscar grupo    | 60/min     |
| PATCH  | /api/v1/addon-groups/:id               | Sim  | admin, manager | Atualizar grupo | 30/min     |
| DELETE | /api/v1/addon-groups/:id               | Sim  | admin          | Remover grupo   | 10/min     |
| POST   | /api/v1/addon-groups/:id/items         | Sim  | admin, manager | Adicionar item  | 30/min     |
| PATCH  | /api/v1/addon-groups/:id/items/:itemId | Sim  | admin, manager | Atualizar item  | 30/min     |
| DELETE | /api/v1/addon-groups/:id/items/:itemId | Sim  | admin, manager | Remover item    | 30/min     |

#### 4.1.7 Pedidos (OrdersModule)

| Metodo | Rota                                   | Auth | Roles                             | Descricao               | Rate Limit |
| ------ | -------------------------------------- | ---- | --------------------------------- | ----------------------- | ---------- |
| GET    | /api/v1/orders                         | Sim  | admin, manager, operator, kitchen | Listar pedidos          | 120/min    |
| GET    | /api/v1/orders/active                  | Sim  | admin, manager, operator, kitchen | Pedidos ativos          | 120/min    |
| GET    | /api/v1/orders/:id                     | Sim  | \*                                | Buscar pedido           | 120/min    |
| POST   | /api/v1/orders                         | Nao  | -                                 | Criar pedido (cliente)  | 10/min     |
| PATCH  | /api/v1/orders/:id/status              | Sim  | admin, manager, operator, kitchen | Atualizar status        | 120/min    |
| PATCH  | /api/v1/orders/:id/cancel              | Sim  | admin, manager, operator          | Cancelar pedido         | 30/min     |
| PATCH  | /api/v1/orders/:id/assign-driver       | Sim  | admin, manager, operator          | Atribuir entregador     | 60/min     |
| GET    | /api/v1/orders/:id/timeline            | Sim  | \*                                | Timeline do pedido      | 60/min     |
| POST   | /api/v1/orders/:id/resend-notification | Sim  | admin, manager, operator          | Reenviar notificacao    | 10/min     |
| GET    | /api/v1/orders/export                  | Sim  | admin, manager                    | Exportar para CSV/Excel | 5/min      |

#### 4.1.8 Clientes (CustomersModule)

| Metodo | Rota                                       | Auth | Roles                    | Descricao           | Rate Limit |
| ------ | ------------------------------------------ | ---- | ------------------------ | ------------------- | ---------- |
| GET    | /api/v1/customers                          | Sim  | admin, manager, operator | Listar clientes     | 60/min     |
| GET    | /api/v1/customers/search                   | Sim  | admin, manager, operator | Buscar clientes     | 120/min    |
| GET    | /api/v1/customers/:id                      | Sim  | admin, manager, operator | Buscar cliente      | 60/min     |
| POST   | /api/v1/customers                          | Sim  | admin, manager, operator | Criar cliente       | 30/min     |
| PATCH  | /api/v1/customers/:id                      | Sim  | admin, manager, operator | Atualizar cliente   | 30/min     |
| DELETE | /api/v1/customers/:id                      | Sim  | admin                    | Remover cliente     | 10/min     |
| GET    | /api/v1/customers/:id/orders               | Sim  | admin, manager, operator | Pedidos do cliente  | 60/min     |
| GET    | /api/v1/customers/:id/loyalty              | Sim  | admin, manager, operator | Dados de fidelidade | 60/min     |
| POST   | /api/v1/customers/:id/addresses            | Sim  | admin, manager, operator | Adicionar endereco  | 30/min     |
| PATCH  | /api/v1/customers/:id/addresses/:addressId | Sim  | admin, manager, operator | Atualizar endereco  | 30/min     |
| DELETE | /api/v1/customers/:id/addresses/:addressId | Sim  | admin, manager, operator | Remover endereco    | 30/min     |
| POST   | /api/v1/customers/:id/tags                 | Sim  | admin, manager           | Adicionar tags      | 30/min     |
| POST   | /api/v1/customers/:id/notes                | Sim  | admin, manager, operator | Adicionar nota      | 30/min     |
| GET    | /api/v1/customers/export                   | Sim  | admin, manager           | Exportar clientes   | 5/min      |

#### 4.1.9 Pagamentos (PaymentsModule)

| Metodo | Rota                                 | Auth | Roles          | Descricao            | Rate Limit |
| ------ | ------------------------------------ | ---- | -------------- | -------------------- | ---------- |
| GET    | /api/v1/payments                     | Sim  | admin, manager | Listar pagamentos    | 60/min     |
| GET    | /api/v1/payments/:id                 | Sim  | admin, manager | Buscar pagamento     | 60/min     |
| POST   | /api/v1/payments/process             | Nao  | -              | Processar pagamento  | 10/min     |
| POST   | /api/v1/payments/:id/refund          | Sim  | admin          | Solicitar estorno    | 10/min     |
| POST   | /api/v1/payments/pix/generate        | Nao  | -              | Gerar QR Code PIX    | 10/min     |
| POST   | /api/v1/payments/webhook/mercadopago | Nao  | -              | Webhook Mercado Pago | 100/min    |
| POST   | /api/v1/payments/webhook/pagseguro   | Nao  | -              | Webhook PagSeguro    | 100/min    |

#### 4.1.10 Entrega e Entregadores (DeliveryModule, DriversModule)

| Metodo | Rota                           | Auth | Roles                    | Descricao                | Rate Limit |
| ------ | ------------------------------ | ---- | ------------------------ | ------------------------ | ---------- |
| POST   | /api/v1/delivery/calculate     | Nao  | -                        | Calcular frete           | 60/min     |
| GET    | /api/v1/delivery/zones         | Nao  | -                        | Zonas disponiveis        | 60/min     |
| GET    | /api/v1/drivers                | Sim  | admin, manager           | Listar entregadores      | 60/min     |
| POST   | /api/v1/drivers                | Sim  | admin, manager           | Criar entregador         | 30/min     |
| GET    | /api/v1/drivers/:id            | Sim  | admin, manager           | Buscar entregador        | 60/min     |
| PATCH  | /api/v1/drivers/:id            | Sim  | admin, manager           | Atualizar entregador     | 30/min     |
| DELETE | /api/v1/drivers/:id            | Sim  | admin                    | Remover entregador       | 10/min     |
| GET    | /api/v1/drivers/available      | Sim  | admin, manager, operator | Entregadores disponiveis | 120/min    |
| PATCH  | /api/v1/drivers/:id/status     | Sim  | admin, manager, driver   | Alterar status           | 60/min     |
| POST   | /api/v1/drivers/:id/location   | Sim  | driver                   | Atualizar localizacao    | 600/min    |
| GET    | /api/v1/drivers/:id/deliveries | Sim  | admin, manager, driver   | Entregas do entregador   | 60/min     |
| GET    | /api/v1/drivers/:id/shifts     | Sim  | admin, manager, driver   | Turnos do entregador     | 60/min     |
| POST   | /api/v1/drivers/:id/shifts     | Sim  | admin, manager           | Criar turno              | 30/min     |

#### 4.1.11 Fidelidade (LoyaltyModule)

| Metodo | Rota                                              | Auth | Roles                    | Descricao                   | Rate Limit |
| ------ | ------------------------------------------------- | ---- | ------------------------ | --------------------------- | ---------- |
| GET    | /api/v1/loyalty/config                            | Sim  | admin, manager           | Configuracoes de fidelidade | 60/min     |
| PUT    | /api/v1/loyalty/config                            | Sim  | admin                    | Atualizar configuracoes     | 10/min     |
| GET    | /api/v1/loyalty/tiers                             | Sim  | \*                       | Listar tiers                | 60/min     |
| GET    | /api/v1/loyalty/rewards                           | Nao  | -                        | Recompensas disponiveis     | 120/min    |
| POST   | /api/v1/loyalty/rewards                           | Sim  | admin, manager           | Criar recompensa            | 30/min     |
| PATCH  | /api/v1/loyalty/rewards/:id                       | Sim  | admin, manager           | Atualizar recompensa        | 30/min     |
| DELETE | /api/v1/loyalty/rewards/:id                       | Sim  | admin                    | Remover recompensa          | 10/min     |
| POST   | /api/v1/loyalty/redeem                            | Sim  | admin, manager, operator | Resgatar recompensa         | 30/min     |
| POST   | /api/v1/loyalty/adjust                            | Sim  | admin                    | Ajuste manual de pontos     | 10/min     |
| GET    | /api/v1/loyalty/customer/:customerId              | Sim  | \*                       | Pontos do cliente           | 60/min     |
| GET    | /api/v1/loyalty/customer/:customerId/transactions | Sim  | \*                       | Transacoes do cliente       | 60/min     |

#### 4.1.12 Cupons (CouponsModule)

| Metodo | Rota                      | Auth | Roles          | Descricao        | Rate Limit |
| ------ | ------------------------- | ---- | -------------- | ---------------- | ---------- |
| GET    | /api/v1/coupons           | Sim  | admin, manager | Listar cupons    | 60/min     |
| POST   | /api/v1/coupons           | Sim  | admin, manager | Criar cupom      | 30/min     |
| GET    | /api/v1/coupons/:id       | Sim  | admin, manager | Buscar cupom     | 60/min     |
| PATCH  | /api/v1/coupons/:id       | Sim  | admin, manager | Atualizar cupom  | 30/min     |
| DELETE | /api/v1/coupons/:id       | Sim  | admin          | Remover cupom    | 10/min     |
| POST   | /api/v1/coupons/validate  | Nao  | -              | Validar cupom    | 30/min     |
| GET    | /api/v1/coupons/:id/usage | Sim  | admin, manager | Historico de uso | 60/min     |

#### 4.1.13 Campanhas (CampaignsModule)

| Metodo | Rota                          | Auth | Roles          | Descricao            | Rate Limit |
| ------ | ----------------------------- | ---- | -------------- | -------------------- | ---------- |
| GET    | /api/v1/campaigns             | Sim  | admin, manager | Listar campanhas     | 60/min     |
| POST   | /api/v1/campaigns             | Sim  | admin, manager | Criar campanha       | 30/min     |
| GET    | /api/v1/campaigns/:id         | Sim  | admin, manager | Buscar campanha      | 60/min     |
| PATCH  | /api/v1/campaigns/:id         | Sim  | admin, manager | Atualizar campanha   | 30/min     |
| DELETE | /api/v1/campaigns/:id         | Sim  | admin          | Remover campanha     | 10/min     |
| POST   | /api/v1/campaigns/:id/start   | Sim  | admin, manager | Iniciar campanha     | 10/min     |
| POST   | /api/v1/campaigns/:id/pause   | Sim  | admin, manager | Pausar campanha      | 30/min     |
| POST   | /api/v1/campaigns/:id/cancel  | Sim  | admin          | Cancelar campanha    | 10/min     |
| GET    | /api/v1/campaigns/:id/metrics | Sim  | admin, manager | Metricas da campanha | 60/min     |
| POST   | /api/v1/campaigns/:id/test    | Sim  | admin, manager | Enviar teste         | 10/min     |

#### 4.1.14 Avaliacoes (ReviewsModule)

| Metodo | Rota                           | Auth | Roles          | Descricao                  | Rate Limit |
| ------ | ------------------------------ | ---- | -------------- | -------------------------- | ---------- |
| GET    | /api/v1/reviews                | Sim  | admin, manager | Listar avaliacoes          | 60/min     |
| GET    | /api/v1/reviews/pending        | Sim  | admin, manager | Avaliacoes pendentes       | 60/min     |
| GET    | /api/v1/reviews/:id            | Sim  | admin, manager | Buscar avaliacao           | 60/min     |
| POST   | /api/v1/reviews                | Nao  | -              | Criar avaliacao (cliente)  | 5/min      |
| POST   | /api/v1/reviews/:id/respond    | Sim  | admin, manager | Responder avaliacao        | 30/min     |
| PATCH  | /api/v1/reviews/:id/visibility | Sim  | admin          | Alterar visibilidade       | 30/min     |
| GET    | /api/v1/reviews/stats          | Sim  | admin, manager | Estatisticas de avaliacoes | 60/min     |

#### 4.1.15 Notificacoes (NotificationsModule)

| Metodo | Rota                                | Auth | Roles          | Descricao                 | Rate Limit |
| ------ | ----------------------------------- | ---- | -------------- | ------------------------- | ---------- |
| GET    | /api/v1/notifications/templates     | Sim  | admin, manager | Listar templates          | 60/min     |
| POST   | /api/v1/notifications/templates     | Sim  | admin          | Criar template            | 30/min     |
| PATCH  | /api/v1/notifications/templates/:id | Sim  | admin          | Atualizar template        | 30/min     |
| DELETE | /api/v1/notifications/templates/:id | Sim  | admin          | Remover template          | 10/min     |
| POST   | /api/v1/notifications/send          | Sim  | admin, manager | Enviar notificacao manual | 30/min     |
| GET    | /api/v1/notifications/queue         | Sim  | admin          | Fila de notificacoes      | 60/min     |
| GET    | /api/v1/notifications/logs          | Sim  | admin          | Logs de envio             | 60/min     |

#### 4.1.16 Integracoes (IntegrationsModule)

| Metodo | Rota                                  | Auth | Roles | Descricao               | Rate Limit |
| ------ | ------------------------------------- | ---- | ----- | ----------------------- | ---------- |
| GET    | /api/v1/integrations                  | Sim  | admin | Listar integracoes      | 60/min     |
| POST   | /api/v1/integrations                  | Sim  | admin | Configurar integracao   | 10/min     |
| GET    | /api/v1/integrations/:type            | Sim  | admin | Buscar integracao       | 60/min     |
| PATCH  | /api/v1/integrations/:type            | Sim  | admin | Atualizar integracao    | 10/min     |
| DELETE | /api/v1/integrations/:type            | Sim  | admin | Remover integracao      | 10/min     |
| POST   | /api/v1/integrations/:type/test       | Sim  | admin | Testar conexao          | 10/min     |
| POST   | /api/v1/integrations/:type/sync       | Sim  | admin | Sincronizar dados       | 5/min      |
| POST   | /api/v1/integrations/webhook/ifood    | Nao  | -     | Webhook iFood           | 100/min    |
| POST   | /api/v1/integrations/webhook/rappi    | Nao  | -     | Webhook Rappi           | 100/min    |
| GET    | /api/v1/integrations/product-mappings | Sim  | admin | Mapeamentos de produtos | 60/min     |
| POST   | /api/v1/integrations/product-mappings | Sim  | admin | Criar mapeamento        | 30/min     |

#### 4.1.17 Relatorios (ReportsModule)

| Metodo | Rota                       | Auth | Roles          | Descricao                   | Rate Limit |
| ------ | -------------------------- | ---- | -------------- | --------------------------- | ---------- |
| GET    | /api/v1/reports/dashboard  | Sim  | admin, manager | Dashboard KPIs              | 60/min     |
| GET    | /api/v1/reports/sales      | Sim  | admin, manager | Relatorio de vendas         | 30/min     |
| GET    | /api/v1/reports/products   | Sim  | admin, manager | Relatorio de produtos       | 30/min     |
| GET    | /api/v1/reports/customers  | Sim  | admin, manager | Relatorio de clientes       | 30/min     |
| GET    | /api/v1/reports/drivers    | Sim  | admin, manager | Relatorio de entregadores   | 30/min     |
| GET    | /api/v1/reports/payments   | Sim  | admin, manager | Relatorio de pagamentos     | 30/min     |
| GET    | /api/v1/reports/loyalty    | Sim  | admin, manager | Relatorio de fidelidade     | 30/min     |
| POST   | /api/v1/reports/generate   | Sim  | admin, manager | Gerar relatorio customizado | 10/min     |
| GET    | /api/v1/reports/export/:id | Sim  | admin, manager | Download relatorio          | 10/min     |

#### 4.1.18 Auditoria (AuditModule)

| Metodo | Rota                           | Auth | Roles | Descricao             | Rate Limit |
| ------ | ------------------------------ | ---- | ----- | --------------------- | ---------- |
| GET    | /api/v1/audit/logs             | Sim  | admin | Logs de auditoria     | 60/min     |
| GET    | /api/v1/audit/logs/:id         | Sim  | admin | Detalhe do log        | 60/min     |
| GET    | /api/v1/audit/entity/:type/:id | Sim  | admin | Historico de entidade | 60/min     |
| GET    | /api/v1/audit/user/:userId     | Sim  | admin | Acoes do usuario      | 60/min     |

#### 4.1.19 Health e Status

| Metodo | Rota                 | Auth | Roles | Descricao       | Rate Limit |
| ------ | -------------------- | ---- | ----- | --------------- | ---------- |
| GET    | /api/v1/health       | Nao  | -     | Health check    | 120/min    |
| GET    | /api/v1/health/ready | Nao  | -     | Readiness check | 120/min    |
| GET    | /api/v1/health/live  | Nao  | -     | Liveness check  | 120/min    |

---

## 5. SERVICES E REGRAS DE NEGOCIO

### 5.1 OrdersService - Regras Principais

```typescript
// Fluxo de status do pedido
const ORDER_STATUS_FLOW = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["out_for_delivery", "delivered", "cancelled"], // delivered para pickup
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [], // estado final
  cancelled: [], // estado final
  refunded: [], // estado final
};

// Validacoes de transicao de status
class OrdersService {
  async updateStatus(orderId: string, newStatus: OrderStatus, userId: string) {
    const order = await this.findById(orderId);

    // Validar transicao permitida
    const allowedStatuses = ORDER_STATUS_FLOW[order.status];
    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Transicao de ${order.status} para ${newStatus} nao permitida`,
      );
    }

    // Validacoes especificas
    if (newStatus === "out_for_delivery" && !order.driverId) {
      throw new BadRequestException("Entregador deve ser atribuido antes");
    }

    // Atualizar timestamps
    const updates: Partial<Order> = { status: newStatus };
    if (newStatus === "ready") updates.preparedAt = new Date();
    if (newStatus === "delivered") updates.deliveredAt = new Date();
    if (newStatus === "cancelled") updates.cancelledAt = new Date();

    // Persistir
    const updated = await this.repository.update(orderId, updates);

    // Registrar historico
    await this.statusHistoryRepository.create({
      orderId,
      status: newStatus,
      changedBy: userId,
    });

    // Emitir eventos
    this.eventEmitter.emit("order.status.changed", {
      order: updated,
      previousStatus: order.status,
      newStatus,
    });

    return updated;
  }
}
```

### 5.2 Calculo de Totais do Pedido

```typescript
interface OrderCalculation {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tip: number;
  total: number;
  loyaltyPointsEarned: number;
}

class OrderCalculatorService {
  calculate(
    items: OrderItemInput[],
    deliveryZone: DeliveryZone | null,
    coupon: Coupon | null,
    loyaltyPointsToUse: number,
    customerTier: LoyaltyTier,
    tip: number = 0,
  ): OrderCalculation {
    // 1. Calcular subtotal (produtos + adicionais)
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const addonsTotal =
        item.addons?.reduce((s, a) => s + a.price * a.quantity, 0) || 0;
      return sum + itemTotal + addonsTotal;
    }, 0);

    // 2. Taxa de entrega
    const deliveryFee = deliveryZone?.deliveryFee || 0;

    // 3. Calcular desconto do cupom
    let discount = 0;
    if (coupon && subtotal >= (coupon.minOrderValue || 0)) {
      if (coupon.type === "percentage") {
        discount = subtotal * (coupon.value / 100);
        if (coupon.maxDiscountValue) {
          discount = Math.min(discount, coupon.maxDiscountValue);
        }
      } else if (coupon.type === "fixed_amount") {
        discount = coupon.value;
      } else if (coupon.type === "free_shipping") {
        discount = deliveryFee;
      }
    }

    // 4. Desconto por pontos de fidelidade
    const pointsDiscount = loyaltyPointsToUse * 0.01; // 1 ponto = R$ 0.01
    discount += pointsDiscount;

    // 5. Total final
    const total = Math.max(0, subtotal + deliveryFee - discount + tip);

    // 6. Pontos a ganhar (1 ponto por real gasto, com multiplicador do tier)
    const basePoints = Math.floor(subtotal);
    const loyaltyPointsEarned = Math.floor(
      basePoints * (customerTier?.pointsMultiplier || 1),
    );

    return {
      subtotal: this.round(subtotal),
      deliveryFee: this.round(deliveryFee),
      discount: this.round(discount),
      tip: this.round(tip),
      total: this.round(total),
      loyaltyPointsEarned,
    };
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
```

### 5.3 CouponsService - Validacao

```typescript
class CouponsService {
  async validate(
    code: string,
    customerId: string | null,
    orderTotal: number,
    deliveryType: DeliveryType,
    productIds: string[],
  ): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
    const coupon = await this.repository.findByCode(code);

    if (!coupon || !coupon.isActive) {
      return { valid: false, error: "COUPON_NOT_FOUND" };
    }

    const now = new Date();

    // Validade temporal
    if (coupon.validFrom > now) {
      return { valid: false, error: "COUPON_NOT_STARTED" };
    }
    if (coupon.validUntil && coupon.validUntil < now) {
      return { valid: false, error: "COUPON_EXPIRED" };
    }

    // Limite global de uso
    if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
      return { valid: false, error: "COUPON_MAX_USES_REACHED" };
    }

    // Limite por cliente
    if (customerId && coupon.maxUsesPerCustomer) {
      const customerUsage = await this.usageRepository.countByCustomer(
        coupon.id,
        customerId,
      );
      if (customerUsage >= coupon.maxUsesPerCustomer) {
        return { valid: false, error: "COUPON_ALREADY_USED" };
      }
    }

    // Primeiro pedido apenas
    if (coupon.firstOrderOnly && customerId) {
      const hasOrders =
        await this.ordersRepository.existsByCustomer(customerId);
      if (hasOrders) {
        return { valid: false, error: "COUPON_FIRST_ORDER_ONLY" };
      }
    }

    // Valor minimo
    if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
      return {
        valid: false,
        error: "COUPON_MIN_ORDER_NOT_MET",
        minValue: coupon.minOrderValue,
      };
    }

    // Tipo de entrega
    if (coupon.deliveryOnly && deliveryType !== "delivery") {
      return { valid: false, error: "COUPON_DELIVERY_ONLY" };
    }
    if (coupon.pickupOnly && deliveryType !== "pickup") {
      return { valid: false, error: "COUPON_PICKUP_ONLY" };
    }

    // Produtos aplicaveis
    if (coupon.applicableProductIds?.length > 0) {
      const hasApplicable = productIds.some((id) =>
        coupon.applicableProductIds.includes(id),
      );
      if (!hasApplicable) {
        return { valid: false, error: "COUPON_PRODUCTS_NOT_APPLICABLE" };
      }
    }

    return { valid: true, coupon };
  }
}
```

### 5.4 LoyaltyService - Calculo de Tier

```typescript
class LoyaltyService {
  async recalculateTier(customerId: string): Promise<LoyaltyTier> {
    const customer = await this.customersRepository.findById(customerId);
    const tiers = await this.tiersRepository.findAllActive();

    // Ordenar tiers por pontos minimos (decrescente)
    tiers.sort((a, b) => b.minPoints - a.minPoints);

    // Encontrar tier adequado baseado em lifetime points
    const newTier =
      tiers.find((tier) => customer.lifetimePoints >= tier.minPoints) ||
      tiers[tiers.length - 1]; // Default: menor tier

    // Atualizar se mudou
    if (customer.loyaltyTier !== newTier.tier) {
      await this.customersRepository.update(customerId, {
        loyaltyTier: newTier.tier,
      });

      // Emitir evento de upgrade/downgrade
      this.eventEmitter.emit("loyalty.tier.changed", {
        customerId,
        previousTier: customer.loyaltyTier,
        newTier: newTier.tier,
        isUpgrade: this.isUpgrade(customer.loyaltyTier, newTier.tier),
      });
    }

    return newTier;
  }

  async earnPoints(
    customerId: string,
    orderId: string,
    orderTotal: number,
  ): Promise<LoyaltyTransaction> {
    const customer = await this.customersRepository.findById(customerId);
    const tier = await this.tiersRepository.findByTier(customer.loyaltyTier);

    // Calcular pontos com multiplicador do tier
    const basePoints = Math.floor(orderTotal);
    const multiplier = tier?.pointsMultiplier || 1;
    const pointsEarned = Math.floor(basePoints * multiplier);

    // Criar transacao
    const transaction = await this.transactionsRepository.create({
      customerId,
      orderId,
      type: "earn",
      points: pointsEarned,
      balanceAfter: customer.loyaltyPoints + pointsEarned,
      description: `Pedido #${orderId}`,
      expiresAt: this.calculateExpiration(),
    });

    // Atualizar saldo do cliente
    await this.customersRepository.update(customerId, {
      loyaltyPoints: customer.loyaltyPoints + pointsEarned,
      lifetimePoints: customer.lifetimePoints + pointsEarned,
    });

    // Recalcular tier
    await this.recalculateTier(customerId);

    return transaction;
  }
}
```

---

## 6. AUTENTICACAO E AUTORIZACAO

### 6.1 Estrategia JWT

O sistema utiliza tokens JWT com estrategia de access + refresh token:

| Token         | Duracao    | Uso                         | Armazenamento       |
| ------------- | ---------- | --------------------------- | ------------------- |
| Access Token  | 15 minutos | Autenticacao de requisicoes | Memory/LocalStorage |
| Refresh Token | 7 dias     | Renovar access token        | httpOnly Cookie     |

**Payload do Access Token:**

```typescript
interface JwtPayload {
  sub: string; // user.id
  email: string;
  role: UserRole;
  restaurantId: string;
  permissions: string[];
  iat: number;
  exp: number;
}
```

### 6.2 Guards

```typescript
// guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verificar se rota e publica
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Token invalido ou expirado");
    }
    return user;
  }
}

// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// guards/permissions.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.every((perm) => user.permissions.includes(perm));
  }
}
```

### 6.3 Decorators Customizados

```typescript
// decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// decorators/roles.decorator.ts
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// decorators/permissions.decorator.ts
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// decorators/public.decorator.ts
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### 6.4 Sistema RBAC - Matriz de Permissoes

```typescript
const PERMISSIONS_BY_ROLE: Record<UserRole, string[]> = {
  super_admin: ["*"], // Todas as permissoes

  admin: [
    "users:read",
    "users:write",
    "users:delete",
    "restaurant:read",
    "restaurant:write",
    "products:read",
    "products:write",
    "products:delete",
    "categories:read",
    "categories:write",
    "categories:delete",
    "orders:read",
    "orders:write",
    "orders:cancel",
    "customers:read",
    "customers:write",
    "customers:delete",
    "payments:read",
    "payments:refund",
    "drivers:read",
    "drivers:write",
    "drivers:delete",
    "loyalty:read",
    "loyalty:write",
    "loyalty:adjust",
    "coupons:read",
    "coupons:write",
    "coupons:delete",
    "campaigns:read",
    "campaigns:write",
    "campaigns:delete",
    "reviews:read",
    "reviews:respond",
    "reviews:moderate",
    "notifications:read",
    "notifications:write",
    "integrations:read",
    "integrations:write",
    "reports:read",
    "reports:export",
    "audit:read",
  ],

  manager: [
    "restaurant:read",
    "restaurant:write",
    "products:read",
    "products:write",
    "categories:read",
    "categories:write",
    "orders:read",
    "orders:write",
    "orders:cancel",
    "customers:read",
    "customers:write",
    "payments:read",
    "drivers:read",
    "drivers:write",
    "loyalty:read",
    "loyalty:write",
    "coupons:read",
    "coupons:write",
    "campaigns:read",
    "campaigns:write",
    "reviews:read",
    "reviews:respond",
    "notifications:read",
    "reports:read",
    "reports:export",
  ],

  operator: [
    "restaurant:read",
    "products:read",
    "products:availability",
    "categories:read",
    "orders:read",
    "orders:write",
    "orders:cancel",
    "customers:read",
    "customers:write",
    "drivers:read",
    "loyalty:read",
    "loyalty:redeem",
    "coupons:read",
    "coupons:validate",
    "reviews:read",
  ],

  cashier: [
    "products:read",
    "orders:read",
    "orders:write",
    "customers:read",
    "payments:read",
    "coupons:validate",
    "loyalty:read",
    "loyalty:redeem",
  ],

  kitchen: ["orders:read", "orders:status", "products:read"],

  driver: ["orders:read:assigned", "deliveries:read", "deliveries:update"],
};
```

---

## 7. WEBSOCKETS E TEMPO REAL

### 7.1 Namespaces

| Namespace   | Proposito                      | Autenticacao            | Clientes           |
| ----------- | ------------------------------ | ----------------------- | ------------------ |
| `/admin`    | Atualizacoes do painel admin   | JWT (user)              | Dashboard web      |
| `/kitchen`  | Atualizacoes do KDS            | JWT (user role:kitchen) | Telas de cozinha   |
| `/driver`   | Atualizacoes para entregadores | JWT (driver)            | App do entregador  |
| `/customer` | Atualizacoes para clientes     | Token temporario        | App/Web do cliente |

### 7.2 Eventos por Namespace

**Namespace `/admin`:**

| Evento                    | Direcao          | Payload                | Descricao                 |
| ------------------------- | ---------------- | ---------------------- | ------------------------- |
| `order:created`           | Server -> Client | Order                  | Novo pedido recebido      |
| `order:updated`           | Server -> Client | Order                  | Pedido atualizado         |
| `order:status:changed`    | Server -> Client | { orderId, status }    | Status alterado           |
| `driver:location:updated` | Server -> Client | { driverId, lat, lng } | Localizacao do entregador |
| `stats:updated`           | Server -> Client | DashboardStats         | Metricas atualizadas      |

**Namespace `/kitchen`:**

| Evento                | Direcao          | Payload     | Descricao                 |
| --------------------- | ---------------- | ----------- | ------------------------- |
| `order:new`           | Server -> Client | Order       | Novo pedido para preparar |
| `order:cancelled`     | Server -> Client | { orderId } | Pedido cancelado          |
| `order:item:start`    | Client -> Server | { itemId }  | Iniciar preparo do item   |
| `order:item:complete` | Client -> Server | { itemId }  | Item finalizado           |
| `order:ready`         | Client -> Server | { orderId } | Pedido pronto             |

**Namespace `/driver`:**

| Evento               | Direcao          | Payload                | Descricao              |
| -------------------- | ---------------- | ---------------------- | ---------------------- |
| `delivery:assigned`  | Server -> Client | Delivery               | Nova entrega atribuida |
| `delivery:cancelled` | Server -> Client | { deliveryId }         | Entrega cancelada      |
| `location:update`    | Client -> Server | { lat, lng, accuracy } | Atualizar localizacao  |
| `status:update`      | Client -> Server | { status }             | Alterar status         |
| `delivery:picked`    | Client -> Server | { deliveryId }         | Saiu para entrega      |
| `delivery:completed` | Client -> Server | { deliveryId, photo? } | Entrega concluida      |

**Namespace `/customer`:**

| Evento            | Direcao          | Payload             | Descricao                 |
| ----------------- | ---------------- | ------------------- | ------------------------- |
| `order:status`    | Server -> Client | { orderId, status } | Status do pedido          |
| `order:eta`       | Server -> Client | { orderId, eta }    | Tempo estimado atualizado |
| `driver:location` | Server -> Client | { lat, lng }        | Localizacao do entregador |
| `driver:arriving` | Server -> Client | { orderId }         | Entregador chegando       |

### 7.3 Gateway de Exemplo

```typescript
// websocket/gateways/kitchen.gateway.ts
@WebSocketGateway({
  namespace: "/kitchen",
  cors: { origin: "*" },
})
export class KitchenGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly ordersService: OrdersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const user = await this.authService.validateToken(token);

      if (!["kitchen", "admin", "manager"].includes(user.role)) {
        client.disconnect();
        return;
      }

      client.data.user = user;
      client.join(`restaurant:${user.restaurantId}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Cleanup
  }

  @SubscribeMessage("order:item:start")
  async handleItemStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { itemId: string },
  ) {
    const { restaurantId } = client.data.user;
    await this.ordersService.startItemPreparation(data.itemId);

    this.server
      .to(`restaurant:${restaurantId}`)
      .emit("order:item:started", { itemId: data.itemId });
  }

  @SubscribeMessage("order:ready")
  async handleOrderReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    const { restaurantId, id: userId } = client.data.user;
    const order = await this.ordersService.updateStatus(
      data.orderId,
      "ready",
      userId,
    );

    this.server
      .to(`restaurant:${restaurantId}`)
      .emit("order:status:changed", { orderId: data.orderId, status: "ready" });
  }
}
```

---

## 8. EVENTOS E FILAS

### 8.1 Event Emitter - Eventos Sincronos

```typescript
// Eventos internos do sistema
const INTERNAL_EVENTS = {
  // Pedidos
  "order.created": OrderCreatedEvent,
  "order.status.changed": OrderStatusChangedEvent,
  "order.cancelled": OrderCancelledEvent,
  "order.delivered": OrderDeliveredEvent,

  // Pagamentos
  "payment.approved": PaymentApprovedEvent,
  "payment.declined": PaymentDeclinedEvent,
  "payment.refunded": PaymentRefundedEvent,

  // Fidelidade
  "loyalty.points.earned": LoyaltyPointsEarnedEvent,
  "loyalty.points.redeemed": LoyaltyPointsRedeemedEvent,
  "loyalty.tier.changed": LoyaltyTierChangedEvent,

  // Avaliacoes
  "review.created": ReviewCreatedEvent,

  // Usuarios
  "user.created": UserCreatedEvent,
  "user.password.reset": UserPasswordResetEvent,
};
```

### 8.2 Bull Queues - Jobs Assincronos

| Fila            | Processador           | Jobs                                                | Concorrencia |
| --------------- | --------------------- | --------------------------------------------------- | ------------ |
| `notifications` | NotificationProcessor | SendEmail, SendSMS, SendPush, SendWhatsApp          | 10           |
| `reports`       | ReportProcessor       | GenerateSalesReport, GenerateCustomerReport, Export | 2            |
| `integrations`  | IntegrationProcessor  | SyncIfood, SyncProducts, ProcessWebhook             | 5            |
| `images`        | ImageProcessor        | ResizeImage, OptimizeImage, UploadToS3              | 3            |
| `cleanup`       | CleanupProcessor      | PurgeOldLogs, ExpireSessions, ArchiveOrders         | 1            |

### 8.3 Exemplo de Processador

```typescript
// queue/processors/notification.processor.ts
@Processor("notifications")
export class NotificationProcessor {
  constructor(
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly pushService: PushService,
    private readonly whatsappService: WhatsappService,
  ) {}

  @Process("send-email")
  async handleSendEmail(job: Job<SendEmailPayload>) {
    const { to, subject, template, data } = job.data;

    await this.mailService.send({
      to,
      subject,
      template,
      context: data,
    });

    await this.updateNotificationStatus(job.data.notificationId, "sent");
  }

  @Process("send-whatsapp")
  async handleSendWhatsApp(job: Job<SendWhatsAppPayload>) {
    const { phone, template, data } = job.data;

    const result = await this.whatsappService.sendTemplate({
      to: phone,
      template,
      parameters: data,
    });

    await this.updateNotificationStatus(
      job.data.notificationId,
      result.success ? "sent" : "failed",
      result.error,
    );
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: Error) {
    await this.updateNotificationStatus(
      job.data.notificationId,
      "failed",
      error.message,
    );
  }
}
```

---

## 9. CACHE E REDIS

### 9.1 Estrategia de Cache

| Dado                             | Chave                             | TTL      | Invalidacao                 |
| -------------------------------- | --------------------------------- | -------- | --------------------------- |
| Cardapio (produtos + categorias) | `menu:{restaurantId}`             | 5 min    | Ao editar produto/categoria |
| Produto individual               | `product:{id}`                    | 10 min   | Ao editar produto           |
| Configuracoes restaurante        | `settings:{restaurantId}`         | 15 min   | Ao editar configuracao      |
| Horarios funcionamento           | `hours:{restaurantId}`            | 30 min   | Ao editar horarios          |
| Zonas de entrega                 | `zones:{restaurantId}`            | 30 min   | Ao editar zonas             |
| Cliente por telefone             | `customer:{restaurantId}:{phone}` | 5 min    | Ao editar cliente           |
| Sessao usuario                   | `session:{userId}`                | 24 horas | Ao logout                   |
| Rate limit                       | `rate:{ip}:{endpoint}`            | 1 min    | Auto-expira                 |

### 9.2 Implementacao do CacheService

```typescript
// cache/cache.service.ts
@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttlSeconds * 1000);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const redis = (this.cacheManager as any).store.getClient();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  // Cache-aside pattern
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  // Invalidacao de cache do menu
  async invalidateMenu(restaurantId: string): Promise<void> {
    await this.delPattern(`menu:${restaurantId}*`);
    await this.delPattern(`product:*`);
  }
}
```

---

## 10. DOCKER E AMBIENTE

### 10.1 Dockerfile (Multi-stage)

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### 10.2 Docker Compose

```yaml
# docker/docker-compose.yml
version: "3.8"

services:
  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: cardapio-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/cardapio
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - cardapio-network
    volumes:
      - ../uploads:/app/uploads

  db:
    image: postgres:16-alpine
    container_name: cardapio-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: cardapio
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - cardapio-network

  redis:
    image: redis:7-alpine
    container_name: cardapio-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - cardapio-network

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: cardapio-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@cardapio.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - db
    networks:
      - cardapio-network

volumes:
  postgres-data:
  redis-data:

networks:
  cardapio-network:
    driver: bridge
```

### 10.3 Variaveis de Ambiente

```bash
# .env.example

# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cardapio

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Storage
STORAGE_DRIVER=local # local | s3
STORAGE_LOCAL_PATH=./uploads
AWS_S3_BUCKET=
AWS_S3_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Email (SendGrid)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@cardapio.com
SENDGRID_FROM_NAME=Cardapio Pro

# SMS/WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_WHATSAPP_NUMBER=

# Payment (Mercado Pago)
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=

# iFood Integration
IFOOD_CLIENT_ID=
IFOOD_CLIENT_SECRET=
IFOOD_MERCHANT_ID=

# Google Maps
GOOGLE_MAPS_API_KEY=

# Logging
LOG_LEVEL=debug # debug | info | warn | error
LOG_FORMAT=json # json | pretty

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

---

## 11. MIGRATIONS E SEEDS

### 11.1 Estrategia de Migrations

O projeto utiliza Prisma Migrate para gerenciamento de schema:

```bash
# Criar nova migration
npx prisma migrate dev --name add_loyalty_system

# Aplicar migrations em producao
npx prisma migrate deploy

# Reset do banco (desenvolvimento)
npx prisma migrate reset
```

### 11.2 Seeds Iniciais

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Criar restaurante padrao
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "cardapio-demo" },
    update: {},
    create: {
      name: "Cardapio Demo",
      slug: "cardapio-demo",
      phone: "11999999999",
      email: "contato@cardapio.com",
      isOpen: true,
      acceptsOrders: true,
    },
  });

  // 2. Criar usuario admin
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@cardapio.com" },
    update: {},
    create: {
      restaurantId: restaurant.id,
      name: "Administrador",
      email: "admin@cardapio.com",
      passwordHash,
      role: "admin",
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  // 3. Criar permissoes
  const permissions = [
    { name: "users:read", module: "users" },
    { name: "users:write", module: "users" },
    { name: "users:delete", module: "users" },
    { name: "products:read", module: "products" },
    { name: "products:write", module: "products" },
    { name: "products:delete", module: "products" },
    { name: "orders:read", module: "orders" },
    { name: "orders:write", module: "orders" },
    { name: "orders:cancel", module: "orders" },
    // ... demais permissoes
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // 4. Criar tiers de fidelidade
  const tiers = [
    { name: "Bronze", tier: "bronze", minPoints: 0, pointsMultiplier: 1.0 },
    { name: "Prata", tier: "silver", minPoints: 500, pointsMultiplier: 1.25 },
    { name: "Ouro", tier: "gold", minPoints: 2000, pointsMultiplier: 1.5 },
    {
      name: "Platina",
      tier: "platinum",
      minPoints: 5000,
      pointsMultiplier: 2.0,
    },
  ];

  for (const tier of tiers) {
    await prisma.loyaltyTier.upsert({
      where: {
        restaurantId_tier: { restaurantId: restaurant.id, tier: tier.tier },
      },
      update: {},
      create: { ...tier, restaurantId: restaurant.id },
    });
  }

  // 5. Criar configuracoes padrao
  const settings = [
    { key: "loyalty_enabled", value: { enabled: true } },
    { key: "points_per_real", value: { points: 1 } },
    { key: "order_min_value", value: { amount: 20 } },
    { key: "delivery_enabled", value: { enabled: true } },
    { key: "pickup_enabled", value: { enabled: true } },
  ];

  for (const setting of settings) {
    await prisma.restaurantSetting.upsert({
      where: {
        restaurantId_key: { restaurantId: restaurant.id, key: setting.key },
      },
      update: {},
      create: { ...setting, restaurantId: restaurant.id },
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 12. TESTES

### 12.1 Estrutura de Testes

```
test/
├── unit/                      # Testes unitarios
│   ├── services/
│   │   ├── orders.service.spec.ts
│   │   ├── coupons.service.spec.ts
│   │   └── loyalty.service.spec.ts
│   └── utils/
│       └── calculator.spec.ts
├── integration/               # Testes de integracao
│   ├── orders.integration.spec.ts
│   ├── auth.integration.spec.ts
│   └── database.integration.spec.ts
├── e2e/                       # Testes end-to-end
│   ├── auth.e2e-spec.ts
│   ├── orders.e2e-spec.ts
│   └── products.e2e-spec.ts
├── fixtures/                  # Dados de teste
│   ├── products.fixture.ts
│   ├── orders.fixture.ts
│   └── customers.fixture.ts
└── mocks/                     # Mocks
    ├── prisma.mock.ts
    ├── redis.mock.ts
    └── services.mock.ts
```

### 12.2 Cobertura Minima Esperada

| Tipo        | Cobertura Minima | Foco                  |
| ----------- | ---------------- | --------------------- |
| Unit        | 80%              | Services, Utils       |
| Integration | 60%              | Repositories, Modules |
| E2E         | 40%              | Fluxos criticos       |

---

## 13. SEGURANCA

### 13.1 Checklist de Seguranca

| Item              | Implementacao                            |
| ----------------- | ---------------------------------------- |
| SQL Injection     | Prisma ORM (queries parametrizadas)      |
| XSS               | Helmet middleware, sanitizacao de inputs |
| CSRF              | Tokens CSRF para forms, SameSite cookies |
| Authentication    | JWT + httpOnly cookies                   |
| Authorization     | RBAC com Guards                          |
| Rate Limiting     | ThrottlerGuard (100 req/min default)     |
| Password Hashing  | bcrypt (salt rounds: 12)                 |
| Data Encryption   | AES-256 para dados sensiveis             |
| HTTPS             | Enforced em producao                     |
| CORS              | Whitelist de origens                     |
| Input Validation  | class-validator em todos DTOs            |
| Logs Sanitization | Remocao de dados sensiveis               |

### 13.2 Middlewares de Seguranca

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet - Headers de seguranca
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001"],
    credentials: true,
  });

  // Rate limiting global
  app.useGlobalGuards(new ThrottlerGuard());

  // Validacao global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos nao declarados
      forbidNonWhitelisted: true, // Rejeita campos extras
      transform: true, // Transforma tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Compressao
  app.use(compression());

  await app.listen(process.env.PORT || 3000);
}
```

---

## 14. INTEGRACOES EXTERNAS

### 14.1 Modulos de Integracao

| Integracao       | Modulo              | Funcionalidades                       |
| ---------------- | ------------------- | ------------------------------------- |
| Mercado Pago     | `MercadoPagoModule` | Pagamentos, PIX, Webhooks             |
| PagSeguro        | `PagSeguroModule`   | Pagamentos alternativos               |
| iFood            | `IfoodModule`       | Receber pedidos, sincronizar cardapio |
| Rappi            | `RappiModule`       | Receber pedidos                       |
| SendGrid         | `MailModule`        | Envio de emails transacionais         |
| Twilio           | `SmsModule`         | SMS e WhatsApp                        |
| Firebase         | `PushModule`        | Push notifications                    |
| Google Maps      | `MapsModule`        | Geocoding, distancia, rotas           |
| S3/Cloudflare R2 | `StorageModule`     | Upload de imagens                     |

### 14.2 Tratamento de Webhooks

```typescript
// Padrao de processamento de webhook
@Controller("integrations/webhook")
export class WebhookController {
  constructor(
    private readonly webhookLogRepository: WebhookLogRepository,
    private readonly integrationQueue: Queue,
  ) {}

  @Post("mercadopago")
  @HttpCode(200)
  async handleMercadoPago(
    @Headers() headers: Record<string, string>,
    @Body() payload: any,
  ) {
    // 1. Registrar webhook recebido
    const log = await this.webhookLogRepository.create({
      source: "mercado_pago",
      eventType: payload.type,
      headers,
      payload,
      status: "pending",
    });

    // 2. Adicionar a fila para processamento assincrono
    await this.integrationQueue.add("process-webhook", {
      logId: log.id,
      source: "mercado_pago",
      payload,
    });

    // 3. Retornar 200 imediatamente
    return { received: true };
  }
}
```

---

## 15. LOGGING E MONITORAMENTO

### 15.1 Estrategia de Logs

```typescript
// Configuracao do logger
const logger = WinstonModule.forRoot({
  transports: [
    // Console (desenvolvimento)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        }),
      ),
    }),
    // JSON (producao - para agregadores)
    new winston.transports.File({
      filename: "logs/app.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
```

### 15.2 Health Checks

```typescript
// health/health.controller.ts
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck("database"),
      () => this.redis.pingCheck("redis"),
    ]);
  }

  @Get("ready")
  readiness() {
    return { status: "ready" };
  }

  @Get("live")
  liveness() {
    return { status: "alive" };
  }
}
```

---

## 16. DOCUMENTACAO SWAGGER

### 16.1 Configuracao OpenAPI

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle("Cardapio Pro API")
  .setDescription("API do sistema de gestao de restaurantes")
  .setVersion("1.0.0")
  .addBearerAuth(
    { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    "JWT-auth",
  )
  .addTag("Auth", "Autenticacao e autorizacao")
  .addTag("Products", "Gestao de produtos")
  .addTag("Orders", "Gestao de pedidos")
  .addTag("Customers", "Gestao de clientes")
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup("docs", app, document);
```

---

## 17. PERFORMANCE E ESCALABILIDADE

### 17.1 Otimizacoes de Queries

| Tecnica         | Aplicacao                                 |
| --------------- | ----------------------------------------- |
| Eager Loading   | Incluir relacoes necessarias em uma query |
| Pagination      | Cursor-based para listas grandes          |
| Indexacao       | Indices em colunas de filtro/ordenacao    |
| Select Fields   | Selecionar apenas campos necessarios      |
| Connection Pool | Pool de 20 conexoes (min 5)               |

### 17.2 Estrategias de Paginacao

```typescript
// Cursor-based pagination
interface CursorPaginationParams {
  cursor?: string;
  limit: number;
  direction: 'forward' | 'backward';
}

async findManyWithCursor(params: CursorPaginationParams) {
  const { cursor, limit, direction } = params;

  const items = await this.prisma.order.findMany({
    take: limit + 1, // Extra para saber se tem mais
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // Pular o cursor atual
    }),
    orderBy: { createdAt: direction === 'forward' ? 'desc' : 'asc' },
  });

  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;

  return {
    data,
    nextCursor: hasMore ? data[data.length - 1].id : null,
    hasMore,
  };
}
```

---

## 18. DEPLOYMENT

### 18.1 Checklist de Producao

| Item                                      | Status      |
| ----------------------------------------- | ----------- |
| Variaveis de ambiente configuradas        | Obrigatorio |
| DATABASE_URL apontando para RDS/Cloud SQL | Obrigatorio |
| REDIS_URL apontando para Redis gerenciado | Obrigatorio |
| JWT_SECRET com pelo menos 32 caracteres   | Obrigatorio |
| NODE_ENV=production                       | Obrigatorio |
| Migrations aplicadas                      | Obrigatorio |
| Seeds executados                          | Obrigatorio |
| SSL/TLS habilitado                        | Obrigatorio |
| Logs configurados para agregador          | Recomendado |
| Health checks configurados                | Recomendado |
| Rate limiting ajustado                    | Recomendado |
| Backup automatico do banco                | Obrigatorio |

### 18.2 CI/CD Basico (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t cardapio-api:${{ github.sha }} .
      - name: Push to registry
        run: |
          docker tag cardapio-api:${{ github.sha }} ${{ secrets.REGISTRY }}/cardapio-api:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/cardapio-api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy via kubectl, docker-compose, ou cloud provider CLI
          echo "Deploying version ${{ github.sha }}"
```

### 18.3 Backup e Disaster Recovery

| Componente | Estrategia           | Frequencia | Retencao   |
| ---------- | -------------------- | ---------- | ---------- |
| PostgreSQL | pg_dump automatizado | Diario     | 30 dias    |
| PostgreSQL | Snapshot             | Semanal    | 90 dias    |
| Redis      | RDB + AOF            | Continuo   | 7 dias     |
| Uploads    | Sync para S3         | Diario     | Indefinido |

---

## ANEXO: RESUMO DE ENDPOINTS (100+)

**Total de endpoints mapeados:** 127

| Modulo           | Quantidade |
| ---------------- | ---------- |
| Auth             | 10         |
| Users            | 7          |
| Restaurant       | 13         |
| Categories       | 7          |
| Products         | 14         |
| Addons           | 8          |
| Orders           | 10         |
| Customers        | 14         |
| Payments         | 7          |
| Delivery/Drivers | 14         |
| Loyalty          | 11         |
| Coupons          | 7          |
| Campaigns        | 10         |
| Reviews          | 7          |
| Notifications    | 7          |
| Integrations     | 11         |
| Reports          | 9          |
| Audit            | 4          |
| Health           | 3          |

---

## ANEXO: RESUMO DE TABELAS (45)

1. restaurants
2. restaurant_settings
3. operating_hours
4. delivery_zones
5. categories
6. products
7. product_images
8. addon_groups
9. addon_items
10. product_addon_groups
11. product_relations
12. customers
13. customer_addresses
14. customer_favorites
15. customer_preferences
16. orders
17. order_items
18. order_item_addons
19. order_status_history
20. payments
21. refunds
22. drivers
23. driver_vehicles
24. driver_shifts
25. driver_locations
26. deliveries
27. loyalty_tiers
28. loyalty_transactions
29. loyalty_rewards
30. loyalty_redemptions
31. coupons
32. coupon_usages
33. campaigns
34. campaign_sends
35. reviews
36. review_items
37. users
38. permissions
39. role_permissions
40. refresh_tokens
41. password_reset_tokens
42. notification_templates
43. notification_queue
44. notification_delivery_log
45. integrations
46. marketplace_orders
47. product_mappings
48. webhook_logs
49. audit_logs
50. api_logs

---

**Documento gerado em:** 2026-01-27  
**Versao:** 1.0.0  
**Autor:** Sistema Automatizado  
**Revisao:** Pendente
