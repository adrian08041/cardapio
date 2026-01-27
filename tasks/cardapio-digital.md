---
slug: cardapio-digital
title: Sistema de Cardápio Digital com Delivery
status: in_progress
priority: high
owner: user
---

# Plano de Implementação: Cardápio Digital com Delivery

Este documento rastreia o progresso do desenvolvimento do sistema de cardápio digital.

## Fases do Projeto

### Fase 1: Fundação e Cardápio (Frontend) ✅ CONCLUÍDO

- [x] Configuração do Ambiente e Tipos Base
  - [x] Instalar dependências (framer-motion, zustand, lucide-react, etc.)
  - [x] Configurar sistema de design (Tailwind v4 Colors & Typography)
  - [x] Criar tipos TypeScript (Product, Category, CartItem)
- [x] Componentes de UI Base (Design System)
  - [x] Button, Input, Badge, Card (estilo premium/glass)
  - [x] Feedback visual (Skeleton loading, Toasts)
- [x] Visualização do Cardápio
  - [x] Sidebar/Header de Categorias (navegação suave)
  - [x] ProductCard (Imagem, info, preço, modal de detalhes)
  - [x] Grid de Produtos com animações de entrada
  - [x] Filtros e Busca

### Fase 2: Carrinho e Gestão de Estado ✅ CONCLUÍDO

- [x] Store (Zustand)
  - [x] Adicionar/Remover itens
  - [x] Calcular totais e contadores
- [x] Componente Carrinho (Drawer/Modal)
  - [x] Lista de itens
  - [x] Ajuste de quantidade
  - [x] Input de observações

### Fase 3: Checkout e Pedidos ✅ CONCLUÍDO

- [x] Fluxo de Checkout
  - [x] Seleção Delivery/Retirada
  - [x] Formulário de Endereço (Design base)
  - [x] Seleção de Pagamento
- [x] Confirmação
  - [x] Tela de "Pedido Recebido"
  - [x] Simulação de Status (Track Order)

### Fase 4: Painel Administrativo (Básico) ✅ CONCLUÍDO

- [x] Dashboard View (KPIs e Gráficos)
- [x] Lista de Pedidos (Kanban de Cozinha)
- [x] Edição de Produtos (CRUD visual com Sheet)

## Próximos Passos (Sugestão de Deploy)

- [ ] Configuração de Banco de Dados (Supabase/Postgres)
- [ ] Autenticação (NextAuth.js)
- [ ] Integração de Pagamento Real (Stripe/Mercado Pago)
- [ ] Deploy na Vercel

## Dependências Necessárias

O usuário deve executar o seguinte comando para instalar as bibliotecas base:

```bash
npm install lucide-react clsx tailwind-merge framer-motion zustand react-hook-form zod date-fns
```
