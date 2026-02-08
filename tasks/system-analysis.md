# Análise Completa do Sistema - Cardápio Pro

## 1. Visão Geral da Arquitetura Atual

### Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables (Design Tokens)
- **State Management**: Zustand (persist)
- **Data Fetching**: TanStack Query (React Query)
- **Validação**: Zod + React Hook Form
- **Animações**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)
- **Backend API**: Java Spring Boot (externo)

### Estrutura de Diretórios Atual

```
app/
├── page.tsx              # Página principal (Cardápio + Hero)
├── layout.tsx            # Layout raiz
├── globals.css           # Estilos globais
├── providers.tsx         # React Query Provider
├── checkout/
│   └── page.tsx          # Página de checkout completa
├── login/
│   └── page.tsx          # Login de usuário
├── register/
│   └── page.tsx          # Cadastro de usuário
├── kds/
│   └── page.tsx          # Kitchen Display System
└── admin/
    ├── layout.tsx        # Layout do admin (protegido)
    ├── page.tsx          # Dashboard admin
    ├── products/         # CRUD de produtos
    ├── categories/       # CRUD de categorias
    ├── orders/           # Gestão de pedidos
    ├── settings/         # Configurações
    └── crm/
        ├── customers/    # Gestão de clientes
        └── coupons/      # Gestão de cupons

components/
├── ui/                   # Componentes base (shadcn/ui style)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   └── ...
├── menu/                 # Componentes do cardápio
│   ├── ProductCard.tsx
│   ├── ProductDetailsModal.tsx
│   ├── CategoryFilters.tsx
│   ├── CategorySidebar.tsx
│   └── AdvancedFiltersDrawer.tsx
├── cart/
│   └── CartDrawer.tsx    # Drawer do carrinho
├── checkout/
│   └── ...               # Componentes de checkout
├── kds/
│   ├── KDSCard.tsx
│   ├── KDSHeader.tsx
│   └── KDSSettingsModal.tsx
└── admin/
    ├── AdminSidebar.tsx
    ├── StatsCard.tsx
    ├── OrderCard.tsx
    ├── ProductForm.tsx
    └── settings/...

lib/
├── api/
│   ├── client.ts         # API Client (fetch wrapper)
│   ├── auth.ts           # Auth endpoints
│   ├── products.ts       # Products API
│   ├── categories.ts     # Categories API
│   ├── orders.ts         # Orders API
│   └── types.ts          # API response types
├── hooks/
│   ├── use-products.ts   # TanStack Query hook
│   └── use-categories.ts # TanStack Query hook
├── utils.ts              # Funções utilitárias
└── design-tokens/        # Tokens de design (NOVO)
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    ├── animations.ts
    ├── index.ts
    └── design-tokens.css

store/
├── cart.ts               # Zustand - Carrinho
└── auth.ts               # Zustand - Autenticação

types/
├── index.ts              # Tipos principais (Product, Category, Order, etc.)
└── order.ts              # Tipos de pedido específicos

hooks/
└── useProductSearch.ts   # Hook de busca de produtos
```

---

## 2. Funcionalidades Existentes

### 2.1 Módulo Cliente (Cardápio)

| Feature                                   | Status | Localização                                  |
| ----------------------------------------- | ------ | -------------------------------------------- |
| Hero Section com busca                    | ✅     | `app/page.tsx`                               |
| Listagem de produtos                      | ✅     | `app/page.tsx`                               |
| Filtro por categoria                      | ✅     | `CategoryFilters.tsx`, `CategorySidebar.tsx` |
| Busca de produtos                         | ✅     | `useProductSearch.ts`                        |
| Filtros avançados (preço, dietary, tempo) | ✅     | `AdvancedFiltersDrawer.tsx`                  |
| Detalhes do produto (modal)               | ✅     | `ProductDetailsModal.tsx`                    |
| Adicionar ao carrinho                     | ✅     | `ProductCard.tsx`                            |
| Carrinho (drawer)                         | ✅     | `CartDrawer.tsx`                             |
| Estado do carrinho persistido             | ✅     | `store/cart.ts`                              |
| Login/Logout no header                    | ✅     | `app/page.tsx`                               |
| Cupom de desconto                         | ✅     | `app/checkout/page.tsx`                      |

### 2.2 Módulo Checkout

| Feature                           | Status | Localização             |
| --------------------------------- | ------ | ----------------------- |
| Dados do cliente (nome, telefone) | ✅     | `app/checkout/page.tsx` |
| Seleção Delivery/Retirada         | ✅     | `app/checkout/page.tsx` |
| Formulário de endereço            | ✅     | `app/checkout/page.tsx` |
| Seleção de pagamento              | ✅     | `app/checkout/page.tsx` |
| Desconto PIX (5%)                 | ✅     | `app/checkout/page.tsx` |
| Cupom de desconto                 | ✅     | `app/checkout/page.tsx` |
| Resumo do pedido                  | ✅     | `app/checkout/page.tsx` |
| Criação de pedido (API)           | ✅     | `lib/api/orders.ts`     |
| Tela de confirmação               | ✅     | `app/checkout/page.tsx` |
| Tracking do pedido (simulado)     | ✅     | `app/checkout/page.tsx` |

### 2.3 Módulo Autenticação

| Feature                 | Status | Localização             |
| ----------------------- | ------ | ----------------------- |
| Login                   | ✅     | `app/login/page.tsx`    |
| Registro                | ✅     | `app/register/page.tsx` |
| Estado persistido       | ✅     | `store/auth.ts`         |
| Proteção de rotas admin | ✅     | `app/admin/layout.tsx`  |
| Logout                  | ✅     | `store/auth.ts`         |

### 2.4 Módulo Admin

| Feature              | Status | Localização                |
| -------------------- | ------ | -------------------------- |
| Dashboard com KPIs   | ✅     | `app/admin/page.tsx`       |
| Sidebar de navegação | ✅     | `AdminSidebar.tsx`         |
| CRUD de produtos     | ✅     | `app/admin/products/`      |
| CRUD de categorias   | ✅     | `app/admin/categories/`    |
| Gestão de pedidos    | ✅     | `app/admin/orders/`        |
| Configurações        | ✅     | `app/admin/settings/`      |
| CRM - Clientes       | ✅     | `app/admin/crm/customers/` |
| CRM - Cupons         | ✅     | `app/admin/crm/coupons/`   |
| Proteção por role    | ✅     | `app/admin/layout.tsx`     |

### 2.5 Módulo KDS (Kitchen Display)

| Feature                    | Status | Localização            |
| -------------------------- | ------ | ---------------------- |
| Visualização Kanban        | ✅     | `app/kds/page.tsx`     |
| Colunas por status         | ✅     | `app/kds/page.tsx`     |
| Filtro por estação         | ✅     | `KDSSettingsModal.tsx` |
| Cards de pedido            | ✅     | `KDSCard.tsx`          |
| Avançar status             | ✅     | `app/kds/page.tsx`     |
| Dados Mock (não integrado) | ⚠️     | `app/kds/page.tsx`     |

---

## 3. Problemas Identificados

### 3.1 Arquitetura

1. **Mistura de responsabilidades** - A página inicial (`/`) mistura cardápio do cliente com funcionalidades de gestão (login, acesso admin)
2. **Sem separação cliente/admin** - O acesso ao admin está implícito, não há rotas claramente separadas
3. **KDS não integrado** - Usa dados mock, não conectado à API real
4. **Sem contexto de restaurante** - Sistema não suporta múltiplos restaurantes

### 3.2 UX/UI

1. **Header misturado** - Login/logout aparece na página do cardápio cliente
2. **Navegação confusa** - Cliente pode ver botões de gestão
3. **Checkout requer scroll** - Muita informação numa única página

### 3.3 Técnicos

1. **Tokens de design não integrados** - Design tokens criados mas não aplicados nos componentes
2. **Sem loading states globais** - Carregamento não é consistente
3. **Sem error boundaries** - Erros não são tratados globalmente

---

## 4. Proposta de Nova Arquitetura

### 4.1 Estrutura de Rotas Proposta

```
/                           # Landing page (opcional) ou redirect
/menu                       # 🍔 CARDÁPIO DO CLIENTE (público)
  /menu                     # Listagem de produtos
  /menu/[productSlug]       # Detalhes do produto (opcional, SEO)
  /menu/checkout            # Checkout
  /menu/order/[orderId]     # Tracking do pedido

/auth                       # 🔐 AUTENTICAÇÃO
  /auth/login               # Login
  /auth/register            # Registro
  /auth/forgot-password     # Recuperar senha

/admin                      # 🛠️ PAINEL ADMINISTRATIVO (protegido)
  /admin                    # Dashboard
  /admin/products           # Produtos
  /admin/categories         # Categorias
  /admin/orders             # Pedidos
  /admin/crm/customers      # Clientes
  /admin/crm/coupons        # Cupons
  /admin/settings           # Configurações

/kds                        # 📺 KITCHEN DISPLAY (protegido/público)
  /kds                      # Tela da cozinha
```

### 4.2 Layout Groups Propostos

```
app/
├── (public)/               # Layout público (sem auth)
│   ├── layout.tsx          # Layout limpo para cliente
│   └── menu/
│       ├── page.tsx        # Cardápio principal
│       ├── checkout/
│       │   └── page.tsx    # Checkout
│       └── order/
│           └── [id]/
│               └── page.tsx # Tracking
│
├── (auth)/                 # Layout de autenticação
│   ├── layout.tsx          # Layout centralizado
│   ├── login/
│   └── register/
│
├── (admin)/                # Layout administrativo
│   ├── layout.tsx          # Sidebar + proteção
│   └── admin/
│       └── ...
│
└── (kds)/                  # Layout fullscreen
    └── kds/
        └── page.tsx
```

### 4.3 Componentes por Módulo

```
components/
├── shared/                 # Componentes compartilhados
│   ├── Logo.tsx
│   ├── LoadingScreen.tsx
│   └── ErrorBoundary.tsx
│
├── menu/                   # Componentes do cardápio (cliente)
│   ├── MenuHeader.tsx      # Header limpo (logo + sacola)
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CategoryNav.tsx
│   ├── SearchBar.tsx
│   ├── FilterDrawer.tsx
│   └── ProductModal.tsx
│
├── cart/                   # Carrinho
│   ├── CartDrawer.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   └── CartButton.tsx
│
├── checkout/               # Checkout
│   ├── CustomerForm.tsx
│   ├── DeliverySelector.tsx
│   ├── AddressForm.tsx
│   ├── PaymentSelector.tsx
│   ├── CouponInput.tsx
│   ├── OrderSummary.tsx
│   └── OrderTracking.tsx
│
├── admin/                  # Componentes admin
│   └── ...
│
└── kds/                    # Componentes KDS
    └── ...
```

---

## 5. Plano de Refatoração

### Fase 1: Reorganização de Rotas (Alta Prioridade)

- [ ] Criar estrutura de route groups
- [ ] Mover `/` para `/menu`
- [ ] Criar layout público para cliente
- [ ] Separar `/auth` para login/register
- [ ] Ajustar redirects

### Fase 2: Criação do Header do Cliente

- [ ] Criar `MenuHeader.tsx` limpo (sem login)
- [ ] Mostrar apenas: Logo, Status, Sacola
- [ ] Adicionar info do restaurante (opcional)

### Fase 3: Refatorar Página do Cardápio

- [ ] Simplificar `page.tsx` do menu
- [ ] Remover toda lógica de auth do cardápio
- [ ] Aplicar design tokens extraídos do Figma
- [ ] Otimizar performance (lazy loading)

### Fase 4: Refatorar Checkout

- [ ] Criar componentes menores
- [ ] Separar steps em componentes
- [ ] Melhorar validação (Zod)
- [ ] Adicionar loading states

### Fase 5: Integrar KDS

- [ ] Conectar à API real de pedidos
- [ ] Adicionar WebSocket para tempo real
- [ ] Implementar notificações sonoras

### Fase 6: Aplicar Design System

- [ ] Integrar tokens CSS no globals.css
- [ ] Atualizar componentes UI
- [ ] Criar variantes de componentes
- [ ] Documentar uso

---

## 6. Métricas de Sucesso

| Métrica                  | Antes     | Meta                   |
| ------------------------ | --------- | ---------------------- |
| Lighthouse Performance   | ?         | > 90                   |
| First Contentful Paint   | ?         | < 1.5s                 |
| Separação de código      | Misturado | Cliente/Admin isolados |
| Cobertura de testes      | 0%        | > 60%                  |
| Componentes documentados | 0         | Design system completo |

---

## 7. Próximos Passos Recomendados

1. **Confirmar arquitetura** - Validar proposta com usuário
2. **Criar route groups** - Reorganizar estrutura base
3. **Desenvolver MenuHeader** - Componente limpo para cliente
4. **Refatorar cardápio** - Página focada no cliente
5. **Aplicar design tokens** - Usar cores e tipografia do Figma
6. **Testes** - Adicionar testes unitários e E2E
