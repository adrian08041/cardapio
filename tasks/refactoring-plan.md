# Plano de Refatoração: Cardápio Multi-Restaurante

## Decisões Finais

### 1. Autenticação do Cliente

**Login Opcional** - Botão discreto no header, cliente escolhe se quer ou não

### 2. Estrutura de URL

**Slug na URL** → `/r/[slug]/cardapio`

### 3. Header do Cardápio

- ✅ Logo do restaurante
- ✅ Status (Aberto/Fechado)
- ✅ Sacola
- ✅ Botão "Entrar" (discreto)

---

## Nova Estrutura de Rotas

```
app/
├── page.tsx                              # Landing page (redirect ou home)
├── layout.tsx                            # Layout raiz
├── globals.css                           # Estilos globais
├── providers.tsx                         # Providers
│
├── r/                                    # 🍔 RESTAURANTES (público)
│   └── [slug]/                           # Contexto do restaurante
│       ├── layout.tsx                    # Layout do restaurante (carrega dados)
│       ├── cardapio/
│       │   ├── page.tsx                  # Cardápio principal
│       │   ├── checkout/
│       │   │   └── page.tsx              # Checkout
│       │   └── pedido/
│       │       └── [orderId]/
│       │           └── page.tsx          # Tracking do pedido
│       └── not-found.tsx                 # Restaurante não encontrado
│
├── auth/                                 # 🔐 AUTENTICAÇÃO
│   ├── layout.tsx                        # Layout centralizado
│   ├── login/
│   │   └── page.tsx                      # Login
│   └── register/
│       └── page.tsx                      # Cadastro
│
├── admin/                                # 🛠️ ADMIN (protegido)
│   ├── layout.tsx                        # Layout admin + proteção
│   ├── page.tsx                          # Dashboard
│   ├── products/
│   ├── categories/
│   ├── orders/
│   ├── crm/
│   └── settings/
│
└── kds/                                  # 📺 KITCHEN DISPLAY
    └── page.tsx
```

---

## Componentes Novos/Refatorados

### Novos Componentes

```
components/
├── restaurant/
│   ├── RestaurantHeader.tsx              # Header do cardápio cliente
│   ├── RestaurantContext.tsx             # Context provider do restaurante
│   └── RestaurantNotFound.tsx            # Erro 404 personalizado
```

### Componentes Refatorados

```
components/
├── menu/
│   ├── ProductCard.tsx                   # (manter)
│   ├── ProductGrid.tsx                   # (novo - extrair grid)
│   ├── CategoryNav.tsx                   # (refatorar CategoryFilters)
│   ├── SearchBar.tsx                     # (extrair busca)
│   └── ProductDetailsModal.tsx           # (manter)
```

---

## Tarefas de Implementação

### Fase 1: Estrutura Base (AGORA)

- [x] Criar estrutura de pastas `/r/[slug]/cardapio`
- [x] Criar layout do restaurante com context
- [x] Criar RestaurantHeader.tsx
- [x] Mover página do cardápio para nova rota
- [x] Configurar redirect de `/` para `/r/demo/cardapio`

### Fase 2: Refatoração do Cardápio

- [ ] Remover lógica de auth do cardápio
- [ ] Simplificar Hero section
- [ ] Aplicar design tokens do Figma
- [ ] Criar ProductGrid.tsx
- [ ] Extrair SearchBar.tsx

### Fase 3: Checkout

- [ ] Mover para `/r/[slug]/cardapio/checkout`
- [ ] Ajustar context do restaurante
- [ ] Componentizar formulários

### Fase 4: Tracking

- [ ] Criar página de tracking `/r/[slug]/cardapio/pedido/[id]`
- [ ] Separar lógica de tracking do checkout

### Fase 5: Auth

- [ ] Mover login/register para `/auth`
- [ ] Adicionar redirect após login para voltar ao cardápio
- [ ] Salvar restaurante de origem no state

---

## Tipos Novos

```typescript
// types/restaurant.ts
interface Restaurant {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  isOpen: boolean;
  openingHours?: {
    day: number;
    open: string;
    close: string;
  }[];
  theme?: {
    primaryColor: string;
    accentColor: string;
  };
  settings?: {
    deliveryEnabled: boolean;
    pickupEnabled: boolean;
    tableEnabled: boolean;
    minOrderValue?: number;
    deliveryFee?: number;
  };
}
```

---

## Próximos Passos (Ordem de Execução)

1. ✅ Criar pasta `/r/[slug]/cardapio`
2. ✅ Criar RestaurantContext e Provider
3. ✅ Criar RestaurantHeader.tsx (logo, status, sacola, entrar)
4. ✅ Criar layout do restaurante
5. ✅ Mover código do cardápio para nova rota
6. ✅ Ajustar imports e referências
7. ✅ Testar funcionamento básico
8. 🔄 Refatorar visual com design tokens

---

## Estimativa de Tempo

| Fase                         | Tempo Estimado |
| ---------------------------- | -------------- |
| Fase 1: Estrutura Base       | 30 min         |
| Fase 2: Refatoração Cardápio | 1h             |
| Fase 3: Checkout             | 45 min         |
| Fase 4: Tracking             | 30 min         |
| Fase 5: Auth                 | 30 min         |
| **Total**                    | **~3h30**      |
