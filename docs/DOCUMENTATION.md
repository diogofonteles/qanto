# 🛒 qanto - Documentação Completa do Sistema

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Prompt Mestre para IA](#2-prompt-mestre-para-ia)
3. [Documento de Requisitos Funcionais](#3-documento-de-requisitos-funcionais)
4. [Documento de Requisitos Não-Funcionais](#4-documento-de-requisitos-não-funcionais)
5. [Arquitetura do Sistema](#5-arquitetura-do-sistema)
6. [Modelagem do Banco de Dados](#6-modelagem-do-banco-de-dados)
7. [Fluxo do Sistema](#7-fluxo-do-sistema)
8. [Plano de Desenvolvimento em Fases](#8-plano-de-desenvolvimento-em-fases)
9. [Prompts por Fase](#9-prompts-por-fase)
10. [Infraestrutura AWS](#10-infraestrutura-aws)
11. [Uso de IA para Otimização](#11-uso-de-ia-para-otimização)
12. [Checklists por Fase](#12-checklists-por-fase)
13. [Métricas e KPIs](#13-métricas-e-kpis)
14. [Considerações de Segurança](#14-considerações-de-segurança)
15. [Glossário](#15-glossário)

---

## 1. Visão Geral do Projeto

### 1.1 Descrição
O **qanto** é uma plataforma web responsiva para comparação de preços de produtos de supermercados. O sistema conecta supermercados que desejam divulgar seus produtos e preços com consumidores que buscam economizar em suas compras.

### 1.2 Proposta de Valor

**Para Supermercados:**
- Visibilidade para seus produtos e promoções
- Analytics sobre comportamento de consumidores
- Ferramenta de marketing baseada em dados
- Diferentes níveis de exposição conforme plano contratado

**Para Consumidores:**
- Comparação inteligente de preços
- Criação de listas de compras otimizadas
- Alertas de preços
- Histórico de variação de preços
- Recomendações personalizadas

### 1.3 Modelo de Negócio

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODELO DE RECEITA                            │
├─────────────────────────────────────────────────────────────────┤
│ SUPERMERCADOS (B2B)                                             │
│ ├── Plano Básico: Cadastro de produtos + relatórios simples    │
│ ├── Plano Profissional: + Destaques + Analytics avançado       │
│ └── Plano Enterprise: + API + Integração + Suporte dedicado    │
├─────────────────────────────────────────────────────────────────┤
│ CONSUMIDORES (B2C)                                              │
│ ├── Gratuito: Comparação entre 2 supermercados                 │
│ ├── Simples: Comparação entre até 5 supermercados              │
│ └── Premium: Comparação ilimitada + recursos exclusivos        │
├─────────────────────────────────────────────────────────────────┤
│ DADOS (B2B)                                                     │
│ └── Venda de insights e relatórios agregados para indústria    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Prompt Mestre para IA

Este é o prompt principal que deve ser usado como base para todas as fases de desenvolvimento:

```
# CONTEXTO DO PROJETO

Você é um arquiteto de software sênior e desenvolvedor full-stack especializado
em aplicações web modernas, escaláveis e de alto desempenho. Você está construindo
o "qanto", uma plataforma de comparação de preços de supermercados.

## STACK TECNOLÓGICO RECOMENDADO

### Frontend
- Framework: Next.js 14+ (App Router) com TypeScript
- Styling: Tailwind CSS + shadcn/ui
- State Management: Zustand ou React Query para cache
- Maps: Leaflet ou Google Maps API
- Charts: Recharts ou Chart.js

### Backend
- Runtime: Node.js com TypeScript
- Framework: NestJS (estrutura modular e escalável)
- ORM: Prisma
- Validação: class-validator + class-transformer
- Documentação: Swagger/OpenAPI

### Banco de Dados
- Principal: PostgreSQL (dados relacionais)
- Cache: Redis (sessões, cache de consultas frequentes)
- Search: Elasticsearch ou PostgreSQL Full-Text (busca de produtos)

### Infraestrutura
- Cloud: AWS (serverless-first approach)
- Containers: Docker
- CI/CD: GitHub Actions
- Monitoramento: CloudWatch + Sentry

### Autenticação
- NextAuth.js ou Clerk
- OAuth: Google, Apple
- JWT para API

## PRINCÍPIOS DE DESENVOLVIMENTO

1. **Mobile-First**: Design responsivo começando por mobile
2. **Performance**: Core Web Vitals otimizados
3. **Acessibilidade**: WCAG 2.1 AA compliance
4. **Segurança**: OWASP Top 10 considerado
5. **Escalabilidade**: Arquitetura que suporte crescimento
6. **Manutenibilidade**: Código limpo, documentado e testado
7. **Observabilidade**: Logs, métricas e traces
8. **Custo**: Otimização de recursos cloud

## PADRÕES DE CÓDIGO

- Clean Architecture
- Repository Pattern para acesso a dados
- DTOs para transferência de dados
- Validação em camadas (frontend + backend)
- Error handling centralizado
- Logging estruturado

## ESTRUTURA DE ARQUIVOS RECOMENDADA

### Frontend (Next.js)
```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Rotas de autenticação
│   ├── (consumer)/        # Área do consumidor
│   ├── (supermarket)/     # Área do supermercado
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Componentes base (shadcn)
│   ├── features/          # Componentes de features
│   └── layouts/           # Layouts reutilizáveis
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários e configurações
├── services/              # Serviços de API
├── stores/                # Estado global
└── types/                 # TypeScript types
```

### Backend (NestJS)
```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── supermarkets/
│   ├── products/
│   ├── lists/
│   ├── comparisons/
│   ├── alerts/
│   └── analytics/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
└── database/
    ├── migrations/
    └── seeds/
```

## CONVENÇÕES

- Commits: Conventional Commits
- Branches: GitFlow
- Nomenclatura: camelCase (variáveis), PascalCase (classes/componentes)
- API: RESTful com versionamento (/api/v1/)
- Datas: ISO 8601, sempre em UTC no backend
- Moeda: Centavos como integer (evitar floating point)
```

---

## 3. Documento de Requisitos Funcionais

### 3.1 Módulo de Autenticação e Usuários

#### RF-AUTH-001: Cadastro de Usuário Consumidor
- **Descrição**: O sistema deve permitir o cadastro de usuários consumidores
- **Dados obrigatórios**: Nome, email, senha, endereço com CEP
- **Dados opcionais**: Telefone, data de nascimento
- **Validações**:
  - Email único
  - CEP válido (integração com API de CEP)
  - Senha: mínimo 8 caracteres, 1 maiúscula, 1 número
- **Prioridade**: Alta (MVP)

#### RF-AUTH-002: Cadastro de Supermercado
- **Descrição**: O sistema deve permitir o cadastro de supermercados
- **Dados obrigatórios**: Razão social, CNPJ, email, endereço completo com CEP, coordenadas geográficas
- **Dados opcionais**: Logo, descrição, horário de funcionamento
- **Validações**:
  - CNPJ único e válido
  - Endereço geocodificado para coordenadas
- **Prioridade**: Alta (MVP)

#### RF-AUTH-003: Login Social
- **Descrição**: Usuários consumidores podem fazer login via Google ou Apple
- **Comportamento**: Criar conta automaticamente se não existir
- **Prioridade**: Média (Fase 2)

#### RF-AUTH-004: Recuperação de Senha
- **Descrição**: Envio de email com link para redefinição de senha
- **Expiração**: Link válido por 1 hora
- **Prioridade**: Alta (MVP)

### 3.2 Módulo de Produtos (Supermercado)

#### RF-PROD-001: CRUD de Produtos
- **Descrição**: Supermercados podem cadastrar, editar, visualizar e excluir produtos
- **Dados do produto**:
  - Nome, descrição, categoria, subcategoria
  - Código de barras (EAN)
  - Preço, preço promocional, data início/fim promoção
  - Imagem, marca, unidade de medida, quantidade
  - Status (ativo/inativo)
- **Prioridade**: Alta (MVP)

#### RF-PROD-002: Upload de CSV
- **Descrição**: Importação em massa de produtos via arquivo CSV
- **Formato**: Documentado na seção de instruções ao supermercado
- **Validações**:
  - Validar formato do arquivo
  - Relatório de erros por linha
  - Preview antes de confirmar importação
- **Prioridade**: Alta (MVP)

#### RF-PROD-003: Integração via API
- **Descrição**: Supermercados podem fornecer endpoint de API própria
- **Requisitos**:
  - Documentação do formato esperado
  - Webhook ou polling configurável
  - Log de sincronizações
- **Prioridade**: Baixa (Fase 3)

#### RF-PROD-004: Destaque de Produtos
- **Descrição**: Supermercados podem destacar produtos para maior visibilidade
- **Regras**: Quantidade de destaques conforme plano contratado
- **Prioridade**: Média (Fase 2)

#### RF-PROD-005: Gestão de Promoções
- **Descrição**: Configurar promoções com data início/fim
- **Tipos**: Desconto percentual, preço fixo promocional
- **Prioridade**: Média (Fase 2)

### 3.3 Módulo de Listas de Compras (Consumidor)

#### RF-LIST-001: Criar Lista de Compras
- **Descrição**: Usuário pode criar listas nomeadas
- **Dados**: Nome da lista, produtos, quantidades
- **Prioridade**: Alta (MVP)

#### RF-LIST-002: Adicionar Produtos à Lista
- **Descrição**: Buscar e adicionar produtos à lista
- **Funcionalidades**:
  - Busca por nome, categoria, código de barras
  - Definir quantidade
  - Sugestões baseadas em histórico
- **Prioridade**: Alta (MVP)

#### RF-LIST-003: Histórico de Listas
- **Descrição**: Manter histórico de listas anteriores
- **Funcionalidades**: Reutilizar lista anterior, duplicar lista
- **Prioridade**: Média (Fase 2)

### 3.4 Módulo de Comparação de Preços

#### RF-COMP-001: Comparar Lista entre Supermercados
- **Descrição**: Comparar preços de uma lista em diferentes supermercados
- **Regras por tipo de conta**:
  - Gratuita: até 2 supermercados
  - Simples: até 5 supermercados
  - Premium: ilimitado na cidade
- **Configurável**: Admin pode alterar esses limites
- **Prioridade**: Alta (MVP)

#### RF-COMP-002: Resultado Simples
- **Descrição**: Mostrar onde a lista completa é mais barata
- **Dados exibidos**: Total por supermercado, economia, distância
- **Prioridade**: Alta (MVP)

#### RF-COMP-003: Lista Otimizada por Supermercado
- **Descrição**: Criar listas separadas com itens mais baratos de cada supermercado
- **Exemplo**: 10 itens → 3 em A (mais baratos), 5 em B, 2 em C
- **Considerações**: Mostrar economia vs conveniência
- **Prioridade**: Média (Fase 2)

#### RF-COMP-004: Busca Individual de Produto
- **Descrição**: Pesquisar um produto e ver preços em todos os supermercados
- **Ordenação**: Por preço, por distância
- **Prioridade**: Alta (MVP)

### 3.5 Módulo de Alertas de Preço

#### RF-ALERT-001: Criar Alerta de Preço
- **Descrição**: Usuário define preço alvo para um produto
- **Notificações**: Email + push notification no app
- **Prioridade**: Média (Fase 2)

#### RF-ALERT-002: Gerenciar Alertas
- **Descrição**: Listar, editar e excluir alertas ativos
- **Limite**: Configurável por tipo de conta
- **Prioridade**: Média (Fase 2)

### 3.6 Módulo de Histórico de Preços

#### RF-HIST-001: Visualizar Histórico de Preço
- **Descrição**: Gráfico com variação de preço ao longo do tempo
- **Períodos**: 5, 10, 20, 30 dias, 3 meses, 6 meses, 1 ano
- **Visualização**: Linha temporal com valores
- **Prioridade**: Média (Fase 2)

### 3.7 Módulo de Analytics (Supermercado)

#### RF-ANLY-001: Dashboard do Supermercado
- **Descrição**: Visão geral de métricas
- **Métricas**:
  - Produtos em destaque: visualizações, cliques, conversões
  - Vezes incluído em comparações
  - Ranking de "lista mais barata"
  - Produtos mais buscados
- **Prioridade**: Média (Fase 2)

#### RF-ANLY-002: Relatório de Produtos
- **Descrição**: Análise detalhada por produto
- **Dados**: Inclusões em listas, comparações, alertas criados
- **Prioridade**: Baixa (Fase 3)

### 3.8 Módulo de Configurações de Conta

#### RF-CFG-001: Configurar Raio de Busca
- **Descrição**: Usuário define distância máxima dos supermercados
- **Opções**: 1km, 2km, 5km, 10km, 20km, cidade toda
- **Prioridade**: Alta (MVP)

#### RF-CFG-002: Preferências de Notificação
- **Descrição**: Configurar canais e tipos de notificação
- **Prioridade**: Média (Fase 2)

### 3.9 Módulo de Recomendações

#### RF-REC-001: Página Inicial Personalizada
- **Descrição**: Exibir produtos e promoções relevantes ao usuário
- **Critérios**:
  - Histórico de listas e comparações
  - Categorias frequentes
  - Supermercados preferidos
  - Localização
- **Prioridade**: Média (Fase 2)

#### RF-REC-002: Página Inicial para Novos Usuários
- **Descrição**: Exibir promoções e destaques dos supermercados no raio
- **Ordenação**: Por ranking do supermercado (plano contratado)
- **Prioridade**: Alta (MVP)

### 3.10 Módulo Administrativo

#### RF-ADM-001: Gestão de Planos
- **Descrição**: Configurar limites e features de cada plano
- **Prioridade**: Alta (MVP)

#### RF-ADM-002: Gestão de Supermercados
- **Descrição**: Aprovar/suspender supermercados, alterar planos
- **Prioridade**: Alta (MVP)

#### RF-ADM-003: Dashboard Geral
- **Descrição**: Métricas gerais da plataforma
- **Prioridade**: Baixa (Fase 3)

---

## 4. Documento de Requisitos Não-Funcionais

### 4.1 Performance

| Métrica | Objetivo MVP | Objetivo Final |
|---------|--------------|----------------|
| Time to First Byte | < 500ms | < 200ms |
| Largest Contentful Paint | < 2.5s | < 1.5s |
| First Input Delay | < 100ms | < 50ms |
| Cumulative Layout Shift | < 0.1 | < 0.05 |
| API Response Time (p95) | < 500ms | < 200ms |
| Busca de Produtos | < 300ms | < 100ms |

### 4.2 Escalabilidade

- **MVP**: Suportar 1.000 usuários simultâneos
- **Fase 2**: Suportar 10.000 usuários simultâneos
- **Fase 3**: Suportar 100.000 usuários simultâneos
- **Arquitetura**: Horizontal scaling com auto-scaling

### 4.3 Disponibilidade

- **SLA**: 99.5% uptime (MVP), 99.9% (produção)
- **Disaster Recovery**: Backups diários, retenção 30 dias
- **RTO**: 4 horas (MVP), 1 hora (produção)
- **RPO**: 24 horas (MVP), 1 hora (produção)

### 4.4 Segurança

- **Autenticação**: JWT com refresh tokens
- **Autorização**: RBAC (Role-Based Access Control)
- **Dados**: Criptografia em trânsito (TLS 1.3) e em repouso (AES-256)
- **Senhas**: Bcrypt com salt
- **Rate Limiting**: Por IP e por usuário
- **CORS**: Configurado restritivamente
- **Headers**: Security headers (CSP, HSTS, etc.)

### 4.5 Compatibilidade

- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS 14+, Android 10+
- **Responsivo**: 320px a 2560px de largura

### 4.6 Acessibilidade

- **Standard**: WCAG 2.1 Level AA
- **Contraste**: Mínimo 4.5:1 para texto
- **Navegação**: Suporte completo a teclado
- **Screen Readers**: Testado com NVDA e VoiceOver

### 4.7 Internacionalização

- **MVP**: Português (BR)
- **Futuro**: Estrutura preparada para i18n
- **Moeda**: BRL (centavos como integer)
- **Timezone**: America/Sao_Paulo display, UTC storage

---

## 5. Arquitetura do Sistema

### 5.1 Diagrama de Arquitetura (MVP - Serverless)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFRONT CDN                                  │
│                         (Cache estático + WAF)                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
┌───────────────────────────────┐     ┌───────────────────────────────────────┐
│      VERCEL / AMPLIFY         │     │           API GATEWAY                  │
│   (Next.js SSR + Static)      │     │    (REST API + Rate Limiting)          │
│                               │     └───────────────────────────────────────┘
│  ┌─────────────────────────┐  │                      │
│  │   Next.js App Router    │  │                      ▼
│  │   - Pages SSR/SSG       │  │     ┌───────────────────────────────────────┐
│  │   - API Routes          │──┼────▶│           AWS LAMBDA                   │
│  │   - Server Actions      │  │     │      (NestJS Functions)                │
│  └─────────────────────────┘  │     │                                        │
└───────────────────────────────┘     │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
                                      │  │  Auth   │ │Products │ │  Lists  │  │
                                      │  └─────────┘ └─────────┘ └─────────┘  │
                                      │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
                                      │  │Compare  │ │Analytics│ │ Alerts  │  │
                                      │  └─────────┘ └─────────┘ └─────────┘  │
                                      └───────────────────────────────────────┘
                                                       │
                    ┌──────────────────────────────────┼──────────────────────┐
                    │                                  │                      │
                    ▼                                  ▼                      ▼
┌───────────────────────────┐  ┌───────────────────────────┐  ┌──────────────────────┐
│   AMAZON RDS POSTGRES     │  │   AMAZON ELASTICACHE      │  │    AMAZON S3         │
│   (Serverless v2)         │  │   (Redis)                 │  │  (Assets/Uploads)    │
│                           │  │                           │  │                      │
│  - Dados transacionais    │  │  - Cache de sessões       │  │  - Imagens produtos  │
│  - Histórico de preços    │  │  - Cache de consultas     │  │  - Logos             │
│  - Analytics              │  │  - Rate limiting          │  │  - CSV uploads       │
└───────────────────────────┘  └───────────────────────────┘  └──────────────────────┘
                                           │
                                           ▼
                              ┌───────────────────────────┐
                              │     EVENTBRIDGE           │
                              │   (Eventos assíncronos)   │
                              │                           │
                              │  - Processar CSV          │
                              │  - Enviar notificações    │
                              │  - Calcular analytics     │
                              └───────────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
          ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
          │  SES (Email)    │   │  SNS (Push)     │   │ Lambda Workers  │
          └─────────────────┘   └─────────────────┘   └─────────────────┘
```

### 5.2 Arquitetura de Dados (Fluxo)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE DADOS - COMPARAÇÃO                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Usuário   │      │   Frontend  │      │   Backend   │      │   Database  │
│             │      │  (Next.js)  │      │  (NestJS)   │      │ (Postgres)  │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │                    │
       │ 1. Cria lista      │                    │                    │
       │───────────────────▶│                    │                    │
       │                    │ 2. POST /lists     │                    │
       │                    │───────────────────▶│                    │
       │                    │                    │ 3. Insert list     │
       │                    │                    │───────────────────▶│
       │                    │                    │◀───────────────────│
       │                    │◀───────────────────│                    │
       │◀───────────────────│                    │                    │
       │                    │                    │                    │
       │ 4. Comparar preços │                    │                    │
       │───────────────────▶│                    │                    │
       │                    │ 5. POST /compare   │                    │
       │                    │───────────────────▶│                    │
       │                    │                    │ 6. Query products  │
       │                    │                    │    + prices        │
       │                    │                    │───────────────────▶│
       │                    │                    │◀───────────────────│
       │                    │                    │                    │
       │                    │                    │ 7. Calculate &     │
       │                    │                    │    log comparison  │
       │                    │                    │───────────────────▶│
       │                    │                    │◀───────────────────│
       │                    │                    │                    │
       │                    │ 8. Return results  │                    │
       │                    │◀───────────────────│                    │
       │ 9. Display results │                    │                    │
       │◀───────────────────│                    │                    │
       │                    │                    │                    │
```

### 5.3 Componentes e Responsabilidades

| Componente | Responsabilidade | Tecnologia |
|------------|-----------------|------------|
| CDN | Cache, WAF, SSL | CloudFront |
| Frontend | UI, SSR, SEO | Next.js 14 |
| API Gateway | Routing, Auth, Rate Limit | AWS API Gateway |
| Auth Service | Autenticação, OAuth | NextAuth.js |
| Product Service | CRUD produtos, importação | NestJS Lambda |
| List Service | Gestão de listas | NestJS Lambda |
| Compare Service | Comparação de preços | NestJS Lambda |
| Alert Service | Gestão e disparo de alertas | NestJS Lambda |
| Analytics Service | Coleta e processamento de métricas | NestJS Lambda |
| Notification Service | Email, Push | SES + SNS |
| Database | Persistência | RDS PostgreSQL |
| Cache | Sessões, queries frequentes | ElastiCache Redis |
| Storage | Arquivos estáticos | S3 |
| Queue | Processamento assíncrono | EventBridge + SQS |

---

## 6. Modelagem do Banco de Dados

### 6.1 Decisão de Bancos de Dados

| Tipo de Dado | Banco | Justificativa |
|--------------|-------|---------------|
| Dados transacionais | PostgreSQL | ACID, relacionamentos, integridade |
| Sessões e cache | Redis | Performance, TTL nativo |
| Busca de produtos | PostgreSQL FTS | Simplicidade no MVP, migrar para Elasticsearch se necessário |
| Analytics (futuro) | TimescaleDB ou ClickHouse | Séries temporais, agregações |

### 6.2 Diagrama Entidade-Relacionamento (Simplificado)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMA ER - CORE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│    users      │       │  supermarkets │       │   products    │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id (PK)       │       │ id (PK)       │       │ id (PK)       │
│ email         │       │ user_id (FK)  │──┐    │ supermarket_id│───┐
│ password_hash │       │ name          │  │    │ name          │   │
│ name          │       │ cnpj          │  │    │ description   │   │
│ role          │       │ address       │  │    │ barcode       │   │
│ address       │       │ lat/lng       │  │    │ category_id   │   │
│ lat/lng       │       │ plan_id (FK)  │  │    │ price_cents   │   │
│ search_radius │       │ logo_url      │  │    │ promo_price   │   │
│ plan_id (FK)  │       │ created_at    │  │    │ promo_start   │   │
│ created_at    │       └───────────────┘  │    │ promo_end     │   │
│ updated_at    │              │           │    │ image_url     │   │
└───────────────┘              │           │    │ is_featured   │   │
       │                       │           │    │ status        │   │
       │                       │           │    │ created_at    │   │
       │                       │           │    └───────────────┘   │
       │                       │           │           │            │
       │    ┌──────────────────┘           │           │            │
       │    │                              │           │            │
       ▼    ▼                              │           ▼            │
┌───────────────┐                          │    ┌───────────────┐   │
│ shopping_lists│                          │    │ price_history │   │
├───────────────┤                          │    ├───────────────┤   │
│ id (PK)       │                          │    │ id (PK)       │   │
│ user_id (FK)  │───┐                      │    │ product_id(FK)│───┘
│ name          │   │                      │    │ price_cents   │
│ status        │   │                      │    │ recorded_at   │
│ created_at    │   │                      │    └───────────────┘
└───────────────┘   │                      │
       │            │                      │
       │            │                      │
       ▼            │                      │
┌───────────────┐   │                      │
│ list_items    │   │                      │
├───────────────┤   │                      │
│ id (PK)       │   │                      │
│ list_id (FK)  │───┘                      │
│ product_id(FK)│───────────────────────────
│ quantity      │
│ created_at    │
└───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  comparisons  │       │ price_alerts  │       │   plans       │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id (PK)       │       │ id (PK)       │       │ id (PK)       │
│ user_id (FK)  │       │ user_id (FK)  │       │ name          │
│ list_id (FK)  │       │ product_id(FK)│       │ type          │
│ supermarkets  │       │ target_price  │       │ compare_limit │
│ results_json  │       │ is_active     │       │ features_json │
│ cheapest_id   │       │ triggered_at  │       │ price_cents   │
│ created_at    │       │ created_at    │       │ created_at    │
└───────────────┘       └───────────────┘       └───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  categories   │       │ user_events   │       │ product_stats │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id (PK)       │       │ id (PK)       │       │ id (PK)       │
│ name          │       │ user_id (FK)  │       │ product_id(FK)│
│ parent_id(FK) │       │ event_type    │       │ views         │
│ icon          │       │ entity_type   │       │ clicks        │
│ sort_order    │       │ entity_id     │       │ list_adds     │
└───────────────┘       │ metadata_json │       │ date          │
                        │ created_at    │       └───────────────┘
                        └───────────────┘
```

### 6.3 Schema SQL Detalhado (PostgreSQL)

O schema SQL completo está disponível no arquivo `database/schema.sql`.

---

## 7. Fluxo do Sistema

Os fluxos detalhados do sistema estão documentados na seção 7 do documento completo.

---

## 8. Plano de Desenvolvimento em Fases

### 8.1 Fase 1 - MVP (4-6 semanas)

#### Sprint 1 (2 semanas): Fundação
- Setup de projeto (Next.js + NestJS)
- Configuração de banco de dados
- Sistema de autenticação
- Cadastro de consumidores e supermercados

#### Sprint 2 (2 semanas): Core Features
- CRUD de produtos
- Upload CSV
- Busca de produtos
- Listas de compras
- Geolocalização

#### Sprint 3 (2 semanas): Comparação + Deploy
- Comparação de preços
- Página inicial
- Dashboards
- Testes e deploy

### 8.2 Fase 2 - Engajamento (4-6 semanas)
- Login social
- Alertas de preço
- Histórico de preços
- Sistema de planos
- Recomendações

### 8.3 Fase 3 - Escala (4-6 semanas)
- API para integração
- Analytics avançado
- Dashboard administrativo
- PWA
- Otimizações

---

## 9. Prompts por Fase

Os prompts detalhados para cada fase estão documentados na seção 9.

---

## 10. Infraestrutura AWS

### Serviços Principais
- **Frontend**: Vercel (Next.js)
- **Backend**: AWS Lambda (NestJS)
- **Database**: Amazon RDS PostgreSQL Serverless
- **Cache**: Amazon ElastiCache (Redis)
- **Storage**: Amazon S3
- **CDN**: CloudFront
- **Email**: Amazon SES
- **Events**: EventBridge

### Custo Estimado MVP
- **Total**: $50-150/mês

---

## 11. Uso de IA para Otimização

### Features com IA
- Busca inteligente (Embeddings)
- Recomendações personalizadas
- Categorização automática de produtos
- Detecção de anomalias de preço
- OCR de encartes
- Chatbot de suporte

---

## 12. Checklists por Fase

As checklists detalhadas estão documentadas na seção 12.

---

## 13. Métricas e KPIs

### Métricas de Produto
- Cadastros/semana
- Supermercados ativos
- Taxa de ativação
- Engajamento (comparações/usuário)
- Retenção (D7, D30)
- Conversão free→paid

### Métricas Técnicas
- Uptime: 99.5%
- API Response Time: < 500ms
- Error Rate: < 1%

---

## 14. Considerações de Segurança

- Autenticação JWT com refresh tokens
- Senhas com bcrypt
- RBAC (Role-Based Access Control)
- Criptografia em trânsito e repouso
- Rate limiting
- Security headers
- Input validation

---

## 15. Glossário

Termos técnicos e suas definições estão documentados na seção 15.

---

*Documento gerado em: Janeiro 2026*
*Versão: 1.0*
