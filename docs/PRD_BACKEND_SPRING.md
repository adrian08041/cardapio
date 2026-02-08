# PRD Técnico - Backend Cardápio Pro (Java/Spring Boot)

**Versão:** 1.0.0
**Data:** 2026-01-27
**Status:** Draft
**Framework:** Spring Boot 3.x (Java 21)

---

## 1. VISÃO GERAL E TECNOLOGIAS

Este documento define os requisitos técnicos para a implementação do backend em **Java com Spring Boot**, focado em definições funcionais, contratos de dados e arquitetura, sem incluir trechos de código de implementação.

### Stack Tecnológico

- **Linguagem:** Java 21 LTS
- **Framework Principal:** Spring Boot 3.2+
- **Gerenciamento de Dependências:** Maven ou Gradle
- **Banco de Dados:** PostgreSQL 16
- **ORM:** Hibernate / Spring Data JPA
- **Cache:** Redis (Spring Data Redis)
- **Migrações:** Flyway ou Liquibase
- **Segurança:** Spring Security + OAuth2 Resource Server (JWT)
- **Documentação:** SpringDoc OpenAPI (SwaggerUI)
- **Mapeamento:** MapStruct ou ModelMapper
- **Testes:** JUnit 5, Mockito, Testcontainers

---

## 2. ARQUITETURA

O sistema deve seguir uma arquitetura em camadas bem definidas, separando responsabilidades de exposição (Web), regras de negócio (Service) e persistência (Repository).

### 2.1 Estrutura de Pacotes Sugerida

- `com.cardapiopro.api`
  - `config` (Configurações do Spring, Security, Swagger, CORS)
  - `common` (Utilitários, Exception Handlers globais, Classes base)
  - `modules` (Divisão por domínio funcional - DDD pragmático)
    - `auth` (Autenticação, Tokens)
    - `users` (Gestão de usuários)
    - `restaurants` (Restaurantes, Configurações)
    - `orders` (Pedidos, Carrinho)
    - `products` (Catálogo, Produtos, Adicionais)
    - ... (demais domínios)
  - Cada pacote de módulo deve conter:
    - `controller` (Endpoints REST)
    - `service` (Regras de negócio)
    - `repository` (Interfaces JPA)
    - `entity` (Classes de persistência @Entity)
    - `dto` (Objetos de transferência de dados Request/Response)
    - `mapper` (Conversore Entity <-> DTO)

---

## 3. MODELAGEM DE DADOS (ENTIDADES)

Abaixo estão listadas as principais entidades e seus atributos. Assume-se o uso de UUID para chaves primárias e timestamps (created_at, updated_at) em todas as tabelas.

### 3.1 Domínio: Restaurantes

**Entidade: Restaurant**

- **id** (UUID, PK): Identificador único
- **name** (String): Nome comercial
- **slug** (String, Unique): Identificador para URL
- **description** (Text): Descrição
- **logoUrl** (String): URL da imagem
- **coverUrl** (String): URL da capa
- **phone** (String): Telefone contato
- **email** (String): Email contato
- **address...** (Campos de endereço)

**Entidade: OperatingHour**

- **restaurantId** (FK): Vínculo com restaurante
- **dayOfWeek** (Int 0-6): Dia da semana
- **openTime** (Time): Abertura
- **closeTime** (Time): Fechamento

### 3.2 Domínio: Produtos

**Entidade: Category**

- **restaurantId** (FK)
- **name** (String)
- **sortOrder** (Int): Ordem de exibição
- **isVisible** (Bool)

**Entidade: Product**

- **categoryId** (FK)
- **name** (String)
- **description** (Text)
- **price** (Decimal)
- **promotionalPrice** (Decimal, Opcional)
- **availability** (Enum): ALWAYS, SPECIFIC_HOURS
- **stock** (Int, Opcional): Controle de estoque

**Entidade: AddonGroup (Grupos de Adicionais)**

- **name** (String): Ex: "Escolha o molho"
- **minSelection** (Int): Mínimo obrigatório
- **maxSelection** (Int): Máximo permitido

**Entidade: AddonItem (Opções)**

- **groupId** (FK)
- **name** (String): Ex: "Maionese Verde"
- **price** (Decimal): Custo extra
- **isAvailable** (Bool)

### 3.3 Domínio: Pedidos (Orders)

**Entidade: Order**

- **restaurantId** (FK)
- **customerId** (FK)
- **driverId** (FK, Opcional)
- **status** (Enum): PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
- **type** (Enum): DELIVERY, PICKUP
- **subtotal** (Decimal): Soma dos itens
- **deliveryFee** (Decimal): Taxa de entrega
- **discount** (Decimal): Descontos aplicados
- **total** (Decimal): Valor final a pagar
- **paymentStatus** (Enum): PENDING, APPROVED, REJECTED
- **preparedAt** (DateTime)
- **deliveredAt** (DateTime)

**Entidade: OrderItem**

- **orderId** (FK)
- **productId** (FK)
- **quantity** (Int)
- **unitPrice** (Decimal): Preço no momento da compra
- **totalPrice** (Decimal): (unitPrice \* quantity) + addons
- **observation** (String)

### 3.4 Domínio: Clientes (Customers)

**Entidade: Customer**

- **userId** (FK, Opcional): Vínculo com usuário de login
- **name** (String)
- **phone** (String, Unique)
- **email** (String)
- **loyaltyPoints** (Int): Saldo de pontos
- **loyaltyTier** (Enum): BRONZE, SILVER, GOLD

**Entidade: CustomerAddress**

- **customerId** (FK)
- **street**, **number**, **complement**, **neighborhood**, **city**, **state**, **zipCode**
- **coordinates** (Lat/Lng): Para cálculo de frete

---

## 4. MAPEAMENTO DE ENDPOINTS (CONTROLLERS)

Todos os endpoints devem ser prefixados com `/api/v1`.

### 4.1 Autenticação (AuthController)

| Método | Rota                    | Papel (Role) | Payload Envio                  | Payload Retorno                                | Descrição                       |
| ------ | ----------------------- | ------------ | ------------------------------ | ---------------------------------------------- | ------------------------------- |
| POST   | `/auth/login`           | Público      | LoginRequest (email, password) | AuthResponse (accessToken, refreshToken, user) | Autenticação inicial            |
| POST   | `/auth/refresh`         | Público      | RefreshTokenRequest (token)    | TokenResponse (newAccessToken)                 | Renovar token expirado          |
| POST   | `/auth/logout`          | Autenticado  | -                              | Void                                           | Invalidar sessão                |
| POST   | `/auth/forgot-password` | Público      | EmailRequest                   | Void                                           | Iniciar fluxo de reset de senha |

### 4.2 Restaurante (RestaurantController)

| Método | Rota                   | Papel         | Payload Envio      | Descrição                                            |
| ------ | ---------------------- | ------------- | ------------------ | ---------------------------------------------------- |
| GET    | `/restaurant`          | Público       | -                  | Dados públicos do restaurante (nome, logo, horários) |
| GET    | `/restaurant/settings` | Admin/Manager | -                  | Configurações internas e sensíveis                   |
| PUT    | `/restaurant/settings` | Admin         | SettingsDTO        | Atualizar configurações globais                      |
| PUT    | `/restaurant/status`   | Admin/Manager | StatusDTO (isOpen) | Abrir ou fechar restaurante manualmente              |

### 4.3 Cardápio e Produtos (ProductController / CategoryController)

| Método | Rota                    | Papel         | Payload Envio              | Descrição                           |
| ------ | ----------------------- | ------------- | -------------------------- | ----------------------------------- |
| GET    | `/products`             | Público       | Filtros (categoria, busca) | Listagem de produtos ativos         |
| POST   | `/products`             | Admin/Manager | ProductCreateDTO           | Cadastrar novo produto              |
| PUT    | `/products/{id}`        | Admin/Manager | ProductUpdateDTO           | Editar dados do produto             |
| PATCH  | `/products/{id}/status` | Admin/Op      | StatusDTO (active)         | Ativar/Inativar produto rapidamente |
| POST   | `/categories`           | Admin/Manager | CategoryDTO                | Criar categoria                     |
| PATCH  | `/categories/reorder`   | Admin/Manager | ReorderDTO                 | Alterar ordem de exibição           |

### 4.4 Pedidos (OrderController)

| Método | Rota                  | Papel         | Payload Envio          | Descrição                                |
| ------ | --------------------- | ------------- | ---------------------- | ---------------------------------------- |
| POST   | `/orders`             | Cliente       | OrderCreateDTO         | Criação de novo pedido (Checkout)        |
| GET    | `/orders/{id}`        | Cliente/Admin | -                      | Detalhes completos do pedido             |
| GET    | `/orders`             | Admin/Kitchen | Filtros (status, data) | Painel de pedidos (Gestor/Cozinha)       |
| PATCH  | `/orders/{id}/status` | Admin/Kitchen | StatusUpdateDTO        | Avançar status (Confirmar, Pronto, Saiu) |
| POST   | `/orders/{id}/cancel` | Admin         | CancelReasonDTO        | Cancelamento e estorno                   |

### 4.5 Clientes (CustomerController)

| Método | Rota                        | Papel    | Descrição                           |
| ------ | --------------------------- | -------- | ----------------------------------- |
| GET    | `/customers/search`         | Admin/Op | Buscar cliente por telefone ou nome |
| GET    | `/customers/{id}/history`   | Admin/Op | Histórico de pedidos do cliente     |
| POST   | `/customers/{id}/addresses` | Admin/Op | Adicionar endereço manualmente      |

### 4.6 Fidelidade (LoyaltyController)

| Método | Rota               | Papel   | Descrição                               |
| ------ | ------------------ | ------- | --------------------------------------- |
| GET    | `/loyalty/balance` | Cliente | Consultar saldo de pontos               |
| GET    | `/loyalty/rewards` | Cliente | Listar prêmios disponíveis para resgate |
| POST   | `/loyalty/redeem`  | Cliente | Trocar pontos por prêmio/cupom          |

---

## 5. DEFINIÇÃO DE PAYLOADS (DTOS)

Estruturas de dados JSON esperadas nas requisições e respostas.

### 5.1 LoginRequest

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

### 5.2 OrderCreateDTO (Input)

```json
{
  "customerId": "uuid...",
  "deliveryType": "DELIVERY",
  "addressId": "uuid...",
  "paymentMethod": "CREDIT_CARD",
  "items": [
    {
      "productId": "uuid...",
      "quantity": 2,
      "observation": "Sem cebola",
      "addons": [{ "addonItemId": "uuid...", "quantity": 1 }]
    }
  ],
  "couponCode": "BEMVINDO10"
}
```

### 5.3 OrderResponseDTO (Output)

```json
{
  "id": "uuid...",
  "number": 1234,
  "status": "CONFIRMED",
  "createdAt": "2026-01-27T10:00:00Z",
  "customer": { "name": "João", "phone": "..." },
  "total": 54.90,
  "items": [...]
}
```

---

## 6. REGRAS DE NEGÓCIO (SERVICES)

### 6.1 Fluxo de Pedidos

- **Validação de Estoque:** Ao criar pedido, verificar se produtos e adicionais têm estoque disponível.
- **Validação de Área:** Se entrega, verificar se endereço está dentro do polígono/raio das zonas de entrega ativas.
- **Cálculo:** (Soma dos Itens + Adicionais) - Descontos + Taxa de Entrega = Total.
- **Transição de Estados:**
  - `PENDING` -> `CONFIRMED` (Válido apenas se pagamento aprovado ou pagamento na entrega).
  - `READY` -> `OUT_FOR_DELIVERY` (Exige atribuição de entregador).

### 6.2 Fidelidade

- Pontos são calculados sobre o valor dos produtos (excluindo taxas).
- Expiração de pontos deve ocorrer em X dias (configurável) se não utilizados.
- Upgrade de Tier (Bronze -> Prata) automático baseado no total gasto nos últimos 365 dias.

### 6.3 Cupons

- Validar: Data de validade, Valor mínimo, Limite de usos global, Limite por cliente.
- Cupom de "Primeira Compra" deve verificar histórico do CPF/Telefone.

---

## 7. SEGURANÇA E AUTORIZAÇÃO

### 7.1 Autenticação

- Utilizar **Stateless JWT**.
- Token deve conter `sub` (userId), `roles` (lista), `iss` (emissor).
- Refresh Token rotation para maior segurança.

### 7.2 Níveis de Acesso (RBAC)

O sistema deve implementar Filtros de Segurança para validar as Roles:

- `ROLE_ADMIN`: Acesso total.
- `ROLE_MANAGER`: Gestão de cardápio, pedidos e clientes (sem acesso a configs sensíveis).
- `ROLE_OPERATOR`: Abertura de caixa, aceitar pedidos.
- `ROLE_KITCHEN`: Apenas visualização de fila de pedidos (KDS).
- `ROLE_DRIVER`: App de entregador (ver entregas atribuídas).
- `ROLE_CUSTOMER`: Cliente final (apenas seus próprios dados).

---

## 8. INFRAESTRUTURA E DEPLOY

### 8.1 Docker Compose

Serviços necessários:

1.  **Backend API** (Spring Boot) - Porta 8080
2.  **Database** (PostgreSQL) - Porta 5432
3.  **Cache** (Redis) - Porta 6379
4.  **Admin DB** (PgAdmin) - Opcional

### 8.2 Variáveis de Ambiente

Configurações sensíveis devem ser injetadas via ENV VARS (`application.properties` deve ler dessas variáveis):

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `REDIS_HOST`
- `JWT_SECRET_KEY`
- `AWS_ACCESS_KEY` (Para upload S3)
- `PAYMENT_BEARER_TOKEN` (Gateway de pagamento)

### 8.3 Logs e Monitoramento

- Logs em formato JSON para ingestão (ELK/Datadog).
- Health Checks via Spring Boot Actuator (`/actuator/health`).
- Métricas via Prometheus (`/actuator/prometheus`).

---

**Fim do Documento**
Este PRD serve como guia estrito para a implementação das "entities", "controllers" e "services" no ecossistema Java.
