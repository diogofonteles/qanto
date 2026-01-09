# 🛒 ComparaPreços - Documentação Completa do Sistema

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
O **ComparaPreços** é uma plataforma web responsiva para comparação de preços de produtos de supermercados. O sistema conecta supermercados que desejam divulgar seus produtos e preços com consumidores que buscam economizar em suas compras.

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
o "ComparaPreços", uma plataforma de comparação de preços de supermercados.

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

```sql
-- =====================================================
-- SCHEMA: ComparaPreços
-- Database: PostgreSQL 15+
-- =====================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para busca fuzzy

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('consumer', 'supermarket', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'out_of_stock');
CREATE TYPE list_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE plan_type AS ENUM ('consumer', 'supermarket');
CREATE TYPE event_type AS ENUM (
  'view_product', 
  'click_product', 
  'add_to_list', 
  'remove_from_list',
  'create_comparison', 
  'view_comparison',
  'create_alert',
  'search_product'
);

-- =====================================================
-- PLANS (Planos de assinatura)
-- =====================================================

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type plan_type NOT NULL,
  compare_limit INTEGER, -- NULL = ilimitado
  alert_limit INTEGER,
  featured_limit INTEGER, -- Para supermercados
  features JSONB DEFAULT '{}',
  price_cents INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planos padrão
INSERT INTO plans (name, type, compare_limit, alert_limit, price_cents) VALUES
  ('Gratuito', 'consumer', 2, 3, 0),
  ('Simples', 'consumer', 5, 10, 990),
  ('Premium', 'consumer', NULL, NULL, 1990),
  ('Básico', 'supermarket', NULL, NULL, 0),
  ('Profissional', 'supermarket', NULL, NULL, 9900),
  ('Enterprise', 'supermarket', NULL, NULL, 29900);

-- =====================================================
-- USERS (Usuários)
-- =====================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'consumer',
  status user_status NOT NULL DEFAULT 'active',
  phone VARCHAR(20),
  birth_date DATE,
  
  -- Endereço
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_complement VARCHAR(100),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_zipcode VARCHAR(10),
  address_lat DECIMAL(10, 8),
  address_lng DECIMAL(11, 8),
  
  -- Configurações
  search_radius_km INTEGER DEFAULT 5,
  plan_id UUID REFERENCES plans(id),
  
  -- OAuth
  google_id VARCHAR(255) UNIQUE,
  apple_id VARCHAR(255) UNIQUE,
  
  -- Metadata
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(address_lat, address_lng);

-- =====================================================
-- SUPERMARKETS (Supermercados)
-- =====================================================

CREATE TABLE supermarkets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dados da empresa
  company_name VARCHAR(255) NOT NULL,
  trading_name VARCHAR(255),
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  
  -- Contato
  phone VARCHAR(20),
  website VARCHAR(255),
  
  -- Endereço
  address_street VARCHAR(255) NOT NULL,
  address_number VARCHAR(20) NOT NULL,
  address_complement VARCHAR(100),
  address_neighborhood VARCHAR(100) NOT NULL,
  address_city VARCHAR(100) NOT NULL,
  address_state VARCHAR(2) NOT NULL,
  address_zipcode VARCHAR(10) NOT NULL,
  address_lat DECIMAL(10, 8) NOT NULL,
  address_lng DECIMAL(11, 8) NOT NULL,
  
  -- Configurações
  logo_url VARCHAR(500),
  description TEXT,
  opening_hours JSONB, -- {"mon": {"open": "08:00", "close": "22:00"}, ...}
  
  -- Integração
  api_endpoint VARCHAR(500),
  api_key VARCHAR(255),
  last_sync_at TIMESTAMPTZ,
  
  -- Ranking/Visibilidade
  ranking_score INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_supermarkets_location ON supermarkets(address_lat, address_lng);
CREATE INDEX idx_supermarkets_city ON supermarkets(address_city);
CREATE INDEX idx_supermarkets_cnpj ON supermarkets(cnpj);

-- =====================================================
-- CATEGORIES (Categorias de produtos)
-- =====================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- =====================================================
-- PRODUCTS (Produtos)
-- =====================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supermarket_id UUID NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  
  -- Identificação
  name VARCHAR(255) NOT NULL,
  description TEXT,
  barcode VARCHAR(50), -- EAN-13
  sku VARCHAR(50), -- Código interno do supermercado
  
  -- Detalhes
  brand VARCHAR(100),
  unit VARCHAR(20), -- 'un', 'kg', 'l', 'g', 'ml'
  quantity DECIMAL(10, 3), -- Quantidade por unidade
  
  -- Preços (em centavos)
  price_cents INTEGER NOT NULL,
  promo_price_cents INTEGER,
  promo_start_date TIMESTAMPTZ,
  promo_end_date TIMESTAMPTZ,
  
  -- Mídia
  image_url VARCHAR(500),
  
  -- Visibilidade
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  status product_status DEFAULT 'active',
  
  -- Search
  search_vector tsvector,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca
CREATE INDEX idx_products_supermarket ON products(supermarket_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured, featured_until);
CREATE INDEX idx_products_promo ON products(promo_start_date, promo_end_date);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);

-- Trigger para atualizar search_vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.brand, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_search_vector
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- =====================================================
-- PRICE_HISTORY (Histórico de preços)
-- =====================================================

CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL,
  promo_price_cents INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_product ON price_history(product_id, recorded_at DESC);

-- Trigger para gravar histórico quando preço muda
CREATE OR REPLACE FUNCTION record_price_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.price_cents IS DISTINCT FROM NEW.price_cents OR 
     OLD.promo_price_cents IS DISTINCT FROM NEW.promo_price_cents THEN
    INSERT INTO price_history (product_id, price_cents, promo_price_cents)
    VALUES (NEW.id, NEW.price_cents, NEW.promo_price_cents);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_price_history
AFTER UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION record_price_history();

-- =====================================================
-- SHOPPING_LISTS (Listas de compras)
-- =====================================================

CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  status list_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id, status);

-- =====================================================
-- LIST_ITEMS (Itens das listas)
-- =====================================================

CREATE TABLE list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_checked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(list_id, product_id)
);

CREATE INDEX idx_list_items_list ON list_items(list_id);

-- =====================================================
-- COMPARISONS (Comparações de preço)
-- =====================================================

CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  list_id UUID REFERENCES shopping_lists(id) ON DELETE SET NULL,
  
  -- Supermercados comparados
  supermarket_ids UUID[] NOT NULL,
  
  -- Resultados
  results JSONB NOT NULL, -- Detalhamento por supermercado
  cheapest_supermarket_id UUID REFERENCES supermarkets(id),
  cheapest_total_cents INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comparisons_user ON comparisons(user_id, created_at DESC);
CREATE INDEX idx_comparisons_supermarkets ON comparisons USING GIN(supermarket_ids);

-- =====================================================
-- PRICE_ALERTS (Alertas de preço)
-- =====================================================

CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_price_cents INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_price_alerts_user ON price_alerts(user_id, is_active);
CREATE INDEX idx_price_alerts_product ON price_alerts(product_id, is_active);

-- =====================================================
-- USER_EVENTS (Eventos/Analytics)
-- =====================================================

CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  
  event_type event_type NOT NULL,
  entity_type VARCHAR(50), -- 'product', 'supermarket', 'list', etc
  entity_id UUID,
  
  metadata JSONB DEFAULT '{}',
  
  -- Contexto
  user_agent VARCHAR(500),
  ip_address INET,
  referrer VARCHAR(500),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Particionamento por mês (para performance)
CREATE INDEX idx_user_events_user ON user_events(user_id, created_at DESC);
CREATE INDEX idx_user_events_type ON user_events(event_type, created_at DESC);
CREATE INDEX idx_user_events_entity ON user_events(entity_type, entity_id);

-- =====================================================
-- PRODUCT_STATS (Estatísticas agregadas de produtos)
-- =====================================================

CREATE TABLE product_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  list_adds INTEGER DEFAULT 0,
  comparison_includes INTEGER DEFAULT 0,
  
  UNIQUE(product_id, date)
);

CREATE INDEX idx_product_stats_product ON product_stats(product_id, date DESC);

-- =====================================================
-- SUPERMARKET_STATS (Estatísticas agregadas de supermercados)
-- =====================================================

CREATE TABLE supermarket_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supermarket_id UUID NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  comparisons_included INTEGER DEFAULT 0,
  cheapest_wins INTEGER DEFAULT 0,
  products_viewed INTEGER DEFAULT 0,
  
  UNIQUE(supermarket_id, date)
);

CREATE INDEX idx_supermarket_stats ON supermarket_stats(supermarket_id, date DESC);

-- =====================================================
-- CSV_IMPORTS (Log de importações CSV)
-- =====================================================

CREATE TABLE csv_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supermarket_id UUID NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
  
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500),
  
  total_rows INTEGER,
  success_rows INTEGER,
  error_rows INTEGER,
  errors JSONB, -- Lista de erros por linha
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Função para calcular distância entre pontos (Haversine)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lng1 DECIMAL,
  lat2 DECIMAL, lng2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R CONSTANT DECIMAL := 6371; -- Raio da Terra em km
  dlat DECIMAL;
  dlng DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := RADIANS(lat2 - lat1);
  dlng := RADIANS(lng2 - lng1);
  a := SIN(dlat/2)^2 + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlng/2)^2;
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função para buscar supermercados próximos
CREATE OR REPLACE FUNCTION get_nearby_supermarkets(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km INTEGER
) RETURNS TABLE (
  supermarket_id UUID,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    calculate_distance(user_lat, user_lng, s.address_lat, s.address_lng)
  FROM supermarkets s
  WHERE calculate_distance(user_lat, user_lng, s.address_lat, s.address_lng) <= radius_km
  ORDER BY 2;
END;
$$ LANGUAGE plpgsql;

-- Função para obter preço efetivo (considerando promoção)
CREATE OR REPLACE FUNCTION get_effective_price(
  p_price_cents INTEGER,
  p_promo_price_cents INTEGER,
  p_promo_start TIMESTAMPTZ,
  p_promo_end TIMESTAMPTZ
) RETURNS INTEGER AS $$
BEGIN
  IF p_promo_price_cents IS NOT NULL 
     AND (p_promo_start IS NULL OR p_promo_start <= NOW())
     AND (p_promo_end IS NULL OR p_promo_end >= NOW()) THEN
    RETURN p_promo_price_cents;
  END IF;
  RETURN p_price_cents;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### 6.4 Índices Adicionais para Performance

```sql
-- Índices compostos para queries frequentes

-- Busca de produtos em promoção por categoria
CREATE INDEX idx_products_promo_category ON products(category_id, is_featured)
WHERE status = 'active' AND promo_price_cents IS NOT NULL;

-- Produtos ativos de um supermercado por categoria
CREATE INDEX idx_products_supermarket_category ON products(supermarket_id, category_id)
WHERE status = 'active';

-- Comparações recentes por usuário
CREATE INDEX idx_comparisons_recent ON comparisons(user_id, created_at DESC)
WHERE created_at > NOW() - INTERVAL '90 days';
```

---

## 7. Fluxo do Sistema

### 7.1 Fluxo de Cadastro de Supermercado

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUXO: CADASTRO DE SUPERMERCADO                          │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Acessa página  │────▶│  Preenche form  │────▶│ Valida CNPJ na  │
│  de cadastro    │     │  dados básicos  │     │ Receita Federal │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                               ┌─────────────────────────┴─────────────────────┐
                               │                                               │
                               ▼                                               ▼
                        ┌──────────────┐                               ┌──────────────┐
                        │ CNPJ Válido  │                               │ CNPJ Inválido│
                        └──────┬───────┘                               └──────┬───────┘
                               │                                               │
                               ▼                                               ▼
                        ┌──────────────┐                               ┌──────────────┐
                        │ Preenche     │                               │ Exibe erro   │
                        │ endereço     │                               │ e bloqueia   │
                        └──────┬───────┘                               └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Geocodifica  │
                        │ endereço     │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Cria conta   │
                        │ user + super │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Envia email  │
                        │ confirmação  │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Redireciona  │
                        │ para onboard │
                        └──────┬───────┘
                               │
                               ▼
                          ┌─────────┐
                          │   END   │
                          └─────────┘
```

### 7.2 Fluxo de Comparação de Preços

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FLUXO: COMPARAÇÃO DE PREÇOS                            │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌─────────────────┐     
│  Usuário tem    │     
│  lista criada?  │     
└────────┬────────┘     
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  [Sim]     [Não]
    │         │
    │         ▼
    │   ┌──────────────┐
    │   │ Cria nova    │
    │   │ lista        │
    │   └──────┬───────┘
    │          │
    │          ▼
    │   ┌──────────────┐
    │   │ Adiciona     │
    │   │ produtos     │
    │   └──────┬───────┘
    │          │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│ Clica em        │
│ "Comparar"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Sistema busca   │
│ supermercados   │
│ no raio         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verifica limite │
│ do plano        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Dentro]   [Excede]
    │         │
    │         ▼
    │   ┌──────────────┐
    │   │ Mostra modal │
    │   │ upgrade plano│
    │   └──────┬───────┘
    │          │
    │     [Upgrade?]
    │     ┌────┴────┐
    │     ▼         ▼
    │   [Sim]     [Não]
    │     │         │
    │     ▼         ▼
    │   ┌────────┐  │
    │   │Checkout│  │
    │   └───┬────┘  │
    │       │       │
    └───┬───┘       │
        │           │
        ▼           │
┌─────────────────┐ │
│ Seleciona       │◀┘ (limita seleção)
│ supermercados   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Processa        │
│ comparação      │
│                 │
│ - Busca preços  │
│ - Calcula totais│
│ - Identifica    │
│   mais barato   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Registra evento │
│ analytics       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Exibe resultado │
│                 │
│ - Total por     │
│   supermercado  │
│ - Economia      │
│ - Distância     │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │   END   │
    └─────────┘
```

### 7.3 Fluxo de Upload CSV

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO: UPLOAD DE CSV                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Supermercado    │
│ acessa área de  │
│ produtos        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Seleciona       │
│ "Importar CSV"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Faz upload do   │
│ arquivo         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ VALIDAÇÃO       │
│ FRONTEND        │
│                 │
│ - Tamanho max   │
│ - Extensão .csv │
│ - Encoding UTF-8│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 [OK]      [Erro]
    │         │
    │         ▼
    │   ┌──────────────┐
    │   │ Exibe erro   │
    │   │ específico   │
    │   └──────────────┘
    │
    ▼
┌─────────────────┐
│ Upload para S3  │
│ (presigned URL) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dispara job     │
│ assíncrono      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PROCESSAMENTO   │
│ (Lambda)        │
│                 │
│ Para cada linha:│
│ - Valida campos │
│ - Verifica EAN  │
│ - Cria/atualiza │
│   produto       │
│ - Registra erro │
│   se houver     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Atualiza status │
│ do import       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notifica usuário│
│ (WebSocket/Poll)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Exibe relatório │
│                 │
│ - Total linhas  │
│ - Sucesso       │
│ - Erros (lista) │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │   END   │
    └─────────┘
```

### 7.4 Fluxo de Alerta de Preço

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FLUXO: ALERTA DE PREÇO                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────┐
                    │           CRIAÇÃO DO ALERTA                  │
                    └─────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Usuário busca   │────▶│ Visualiza       │────▶│ Clica "Criar    │
│ produto         │     │ produto         │     │ Alerta"         │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Define preço    │
                                                │ alvo            │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Valida limite   │
                                                │ do plano        │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Salva alerta    │
                                                │ is_active=true  │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                    ┌─────────┐
                                                    │   END   │
                                                    └─────────┘


                    ┌─────────────────────────────────────────────┐
                    │          VERIFICAÇÃO (CRON JOB)              │
                    └─────────────────────────────────────────────┘

    ┌─────────────────┐
    │ Cron: a cada    │
    │ 15 minutos      │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Busca alertas   │
    │ ativos          │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Para cada       │
    │ alerta:         │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Busca preço     │
    │ atual do produto│
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Preço <=        │
    │ target?         │
    └────────┬────────┘
             │
        ┌────┴────┐
        │         │
        ▼         ▼
      [Sim]     [Não]
        │         │
        ▼         │
┌───────────────┐ │
│ Envia email   │ │
│ notificação   │ │
└───────┬───────┘ │
        │         │
        ▼         │
┌───────────────┐ │
│ Cria notif.   │ │
│ in-app        │ │
└───────┬───────┘ │
        │         │
        ▼         │
┌───────────────┐ │
│ Marca alerta  │ │
│ triggered_at  │ │
│ is_active=    │ │
│ false         │ │
└───────┬───────┘ │
        │         │
        └────┬────┘
             │
             ▼
        ┌─────────┐
        │   END   │
        └─────────┘
```

---

## 8. Plano de Desenvolvimento em Fases

### 8.1 Visão Geral das Fases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ROADMAP DE DESENVOLVIMENTO                              │
└─────────────────────────────────────────────────────────────────────────────┘

        Fase 1 (MVP)              Fase 2                    Fase 3
        4-6 semanas              4-6 semanas               4-6 semanas
    ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
    │                   │   │                   │   │                   │
    │  • Autenticação   │   │  • Login Social   │   │  • API Integração │
    │  • Cadastro users │   │  • Alertas preço  │   │  • Analytics      │
    │  • Cadastro super │   │  • Hist. preços   │   │    avançado       │
    │  • CRUD produtos  │   │  • Destaques/     │   │  • Dashboard      │
    │  • Upload CSV     │   │    Promoções      │   │    admin          │
    │  • Listas compras │   │  • Recomendações  │   │  • Otimização     │
    │  • Comparação     │   │    básicas        │   │    lista split    │
    │    básica         │   │  • Histórico      │   │  • Reports para   │
    │  • Busca produtos │   │    listas         │   │    supermercados  │
    │  • Geolocalização │   │  • Planos pagos   │   │  • PWA            │
    │                   │   │                   │   │                   │
    └───────────────────┘   └───────────────────┘   └───────────────────┘
            │                       │                       │
            ▼                       ▼                       ▼
    ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
    │  ENTREGÁVEIS      │   │  ENTREGÁVEIS      │   │  ENTREGÁVEIS      │
    │                   │   │                   │   │                   │
    │  - App funcional  │   │  - Monetização    │   │  - Plataforma     │
    │  - Core features  │   │  - Engajamento    │   │    completa       │
    │  - Validação MVP  │   │  - Retenção       │   │  - Escalável      │
    └───────────────────┘   └───────────────────┘   └───────────────────┘
```

### 8.2 Fase 1 - MVP (4-6 semanas)

#### Sprint 1 (2 semanas): Fundação

| Item | Descrição | Story Points |
|------|-----------|--------------|
| Setup Projeto | Next.js + NestJS + Prisma + Docker | 5 |
| CI/CD | GitHub Actions + Deploy Vercel | 3 |
| Database | Schema Prisma + Migrations | 5 |
| Auth Base | Email/senha + JWT | 8 |
| Cadastro Consumidor | Form + validações + CEP | 5 |
| Cadastro Supermercado | Form + CNPJ + geocoding | 8 |
| UI Base | Layout + componentes shadcn | 5 |

**Total Sprint 1: 39 SP**

#### Sprint 2 (2 semanas): Core Features

| Item | Descrição | Story Points |
|------|-----------|--------------|
| CRUD Produtos | Create, Read, Update, Delete | 8 |
| Upload CSV | Upload + validação + processamento | 13 |
| Categorias | Seed + gerenciamento | 3 |
| Busca Produtos | Full-text search + filtros | 8 |
| Listas de Compras | CRUD listas + itens | 8 |
| Geolocalização | Busca supermercados no raio | 5 |

**Total Sprint 2: 45 SP**

#### Sprint 3 (2 semanas): Comparação + Polish

| Item | Descrição | Story Points |
|------|-----------|--------------|
| Comparação Básica | Entre 2 supermercados | 13 |
| Página Inicial | Promoções + destaques | 8 |
| Perfil Usuário | Edição dados + configurações | 5 |
| Área Supermercado | Dashboard básico | 8 |
| Testes E2E | Fluxos principais | 5 |
| Bug fixes + polish | QA e ajustes | 8 |

**Total Sprint 3: 47 SP**

### 8.3 Fase 2 - Engajamento (4-6 semanas)

#### Sprint 4-5: Features de Valor

| Item | Descrição |
|------|-----------|
| Login Social | Google + Apple OAuth |
| Alertas de Preço | Criar, listar, processar, notificar |
| Histórico de Preços | Gráficos + períodos |
| Destaques/Promoções | Gestão pelo supermercado |
| Sistema de Planos | Configuração + limites |
| Checkout | Integração gateway pagamento |
| Recomendações v1 | Baseado em histórico |

#### Sprint 6: Refinamento

| Item | Descrição |
|------|-----------|
| Histórico de Listas | Visualizar, duplicar |
| Email Templates | Transacionais + marketing |
| Analytics Básico | Eventos + dashboard |
| Performance | Otimizações + cache |

### 8.4 Fase 3 - Escala (4-6 semanas)

| Item | Descrição |
|------|-----------|
| API Integração | Endpoint para supermercados |
| Dashboard Admin | Gestão completa |
| Analytics Avançado | BI + relatórios |
| Lista Otimizada | Split por supermercado |
| PWA | Offline + push |
| Recomendações v2 | ML-based |

---

## 9. Prompts por Fase

### 9.1 Prompt Fase 1 - Sprint 1 (Setup + Auth)

```markdown
# PROMPT: Fase 1 - Sprint 1 - Setup e Autenticação

## CONTEXTO
Você está iniciando o desenvolvimento do ComparaPreços, um sistema de comparação 
de preços de supermercados. Este é o Sprint 1, focado em setup do projeto e autenticação.

## TAREFAS DESTE SPRINT

### 1. Setup do Projeto (Next.js 14)
Crie a estrutura inicial do projeto frontend com:
- Next.js 14 com App Router
- TypeScript configurado corretamente
- Tailwind CSS
- shadcn/ui configurado
- ESLint + Prettier
- Husky + lint-staged

Estrutura de pastas:
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── register/supermarket/page.tsx
│   ├── (consumer)/
│   │   └── dashboard/page.tsx
│   ├── (supermarket)/
│   │   └── dashboard/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/           # shadcn components
│   ├── forms/        # Form components
│   └── layouts/      # Layout components
├── lib/
│   ├── auth.ts       # Auth utilities
│   └── validations/  # Zod schemas
└── types/
    └── index.ts      # Type definitions
```

### 2. Setup Backend (NestJS)
Crie o backend com:
- NestJS com TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Class-validator para validação
- Swagger para documentação

Estrutura de módulos:
```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   └── supermarkets/
├── common/
│   ├── decorators/
│   ├── guards/
│   └── pipes/
└── config/
```

### 3. Schema do Banco (Prisma)
Implemente os models iniciais:
- User (com roles: consumer, supermarket, admin)
- Supermarket (vinculado ao user)
- Plan (planos de assinatura)

### 4. Sistema de Autenticação
Implemente:
- Registro de usuário consumidor
- Registro de supermercado (com validação CNPJ)
- Login com email/senha
- JWT com refresh token
- Middleware de autenticação
- Guards por role

### 5. Validação de CEP e CNPJ
Integre:
- API ViaCEP para validação de CEP
- Validação de CNPJ (algoritmo)

## REQUISITOS TÉCNICOS
- Use Zod para validação no frontend
- Use class-validator no backend
- Senhas com bcrypt (min 10 rounds)
- Tokens JWT: access (15min), refresh (7 dias)
- Todas as rotas de API documentadas no Swagger

## ENTREGÁVEIS
1. Código fonte completo
2. Docker compose para desenvolvimento local
3. Migrations do Prisma
4. Documentação de setup (README.md)
5. Collection do Postman/Insomnia para testes

## CRITÉRIOS DE ACEITE
- [ ] Usuário consegue se registrar como consumidor
- [ ] Supermercado consegue se registrar com CNPJ válido
- [ ] Login funciona e retorna tokens
- [ ] Rotas protegidas rejeitam acesso não autenticado
- [ ] Refresh token renova o access token
- [ ] CEP inválido é rejeitado no cadastro
- [ ] CNPJ inválido é rejeitado no cadastro de supermercado
```

### 9.2 Prompt Fase 1 - Sprint 2 (Produtos + Listas)

```markdown
# PROMPT: Fase 1 - Sprint 2 - Produtos e Listas

## CONTEXTO
Continuando o desenvolvimento do ComparaPreços. O Sprint 1 está concluído com 
autenticação funcionando. Agora vamos implementar o core de produtos e listas.

## DEPENDÊNCIAS DO SPRINT ANTERIOR
- Sistema de autenticação funcionando
- Users e Supermarkets cadastráveis
- Database rodando com Prisma

## TAREFAS DESTE SPRINT

### 1. Módulo de Categorias
- Criar seed com categorias padrão (Alimentos, Bebidas, Limpeza, etc.)
- Suporte a subcategorias (parent_id)
- API para listar categorias (público)

### 2. CRUD de Produtos (Supermercado)
Backend:
- POST /products - criar produto
- GET /products - listar produtos do supermercado logado
- GET /products/:id - detalhes
- PUT /products/:id - atualizar
- DELETE /products/:id - remover (soft delete via status)

Frontend:
- Tela de listagem com paginação e filtros
- Modal/página de criação/edição
- Upload de imagem para S3
- Validação de código de barras (EAN-13)

Schema do produto:
```typescript
{
  name: string;
  description?: string;
  barcode?: string;
  categoryId: string;
  brand?: string;
  unit: 'un' | 'kg' | 'l' | 'g' | 'ml';
  quantity: number;
  priceCents: number;
  promoPriceCents?: number;
  promoStartDate?: Date;
  promoEndDate?: Date;
  imageUrl?: string;
}
```

### 3. Upload de CSV
Backend:
- Endpoint para gerar presigned URL (S3)
- Lambda/Worker para processar CSV
- Validação de formato e campos
- Relatório de erros por linha
- Webhook/polling para status

Frontend:
- Componente de upload com drag-and-drop
- Preview do arquivo
- Progress bar
- Exibição de resultado (sucesso/erros)

Formato do CSV esperado:
```
nome,descricao,codigo_barras,categoria,marca,unidade,quantidade,preco,preco_promocional,inicio_promocao,fim_promocao
```

### 4. Busca de Produtos (Consumidor)
- Full-text search com PostgreSQL
- Filtros: categoria, preço min/max, supermercado
- Ordenação: relevância, preço, distância
- Paginação com cursor

### 5. Listas de Compras
Backend:
- CRUD de listas
- Adicionar/remover itens
- Atualizar quantidade

Frontend:
- Criar nova lista
- Adicionar produtos via busca
- Visualizar/editar lista
- Marcar itens como comprados

### 6. Geolocalização
- Implementar função de distância (Haversine)
- Buscar supermercados no raio do usuário
- Ordenar por distância

## REQUISITOS TÉCNICOS
- Processamento de CSV assíncrono (não bloquear request)
- Cache de categorias no Redis
- Índices otimizados para busca
- Presigned URLs com expiração de 15min
- Limite de 10MB para CSV

## ENTREGÁVEIS
1. Módulo de produtos completo (backend + frontend)
2. Sistema de upload CSV
3. Busca de produtos funcional
4. Módulo de listas de compras
5. Documentação da API atualizada
6. Instruções para supermercados (formato CSV)

## CRITÉRIOS DE ACEITE
- [ ] Supermercado consegue cadastrar produto manualmente
- [ ] Supermercado consegue fazer upload de CSV
- [ ] Erros no CSV são reportados com linha e motivo
- [ ] Consumidor consegue buscar produtos
- [ ] Busca retorna resultados relevantes em < 300ms
- [ ] Consumidor consegue criar lista e adicionar produtos
- [ ] Supermercados são filtrados por raio do usuário
```

### 9.3 Prompt Fase 1 - Sprint 3 (Comparação)

```markdown
# PROMPT: Fase 1 - Sprint 3 - Comparação e Finalização MVP

## CONTEXTO
Finalizando a Fase 1 do ComparaPreços. Sprints anteriores concluídos:
- Sprint 1: Auth e setup
- Sprint 2: Produtos, CSV, listas, busca

Este sprint foca na feature principal: comparação de preços.

## TAREFAS DESTE SPRINT

### 1. Comparação de Preços (Core Feature)
Backend:
```typescript
POST /comparisons
{
  listId: string;
  supermarketIds: string[]; // máx 2 no plano gratuito
}

Response:
{
  id: string;
  results: [
    {
      supermarketId: string;
      supermarketName: string;
      distance: number;
      items: [
        {
          productId: string;
          name: string;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
          available: boolean;
        }
      ],
      subtotal: number;
      unavailableCount: number;
    }
  ],
  cheapest: {
    supermarketId: string;
    total: number;
    savings: number; // vs segundo mais barato
  }
}
```

Regras:
- Verificar limite do plano do usuário
- Considerar preço promocional se ativo
- Marcar itens não encontrados no supermercado
- Calcular economia total
- Registrar comparação para analytics

Frontend:
- Tela de seleção de supermercados (checkboxes)
- Exibir limite conforme plano
- Resultado em cards comparativos
- Highlight do mais barato
- Mostrar economia

### 2. Página Inicial (Home)
Para usuários logados:
- Promoções dos supermercados no raio
- Produtos em destaque
- Ordenar por ranking do supermercado

Para visitantes:
- CTA para cadastro
- Explicação do sistema
- Demo/screenshots

### 3. Dashboard do Supermercado
- Total de produtos cadastrados
- Produtos em promoção
- Últimas importações CSV
- Quick actions: adicionar produto, importar CSV

### 4. Perfil do Usuário
- Editar dados pessoais
- Alterar endereço (com revalidação CEP)
- Configurar raio de busca
- Alterar senha

### 5. Área de Instruções (Supermercado)
- Página explicativa sobre upload CSV
- Template CSV para download
- Documentação do formato esperado
- FAQ

### 6. Testes e QA
- Testes E2E para fluxos críticos:
  - Cadastro → Login → Criar lista → Comparar
  - Cadastro supermercado → Upload CSV
- Testes unitários para lógica de negócio
- Teste de carga básico

### 7. Deploy e Infraestrutura
- Setup AWS (ver seção de infraestrutura)
- Deploy frontend na Vercel
- Deploy backend na AWS Lambda
- Configurar domínio e SSL
- Monitoramento básico (CloudWatch)

## REQUISITOS TÉCNICOS
- Comparação deve executar em < 2 segundos
- Resultados cacheados por 5 minutos
- Log de todas as comparações para analytics
- Rate limit: 10 comparações/minuto por usuário

## ENTREGÁVEIS
1. Sistema de comparação completo
2. Home page funcional
3. Dashboards de consumidor e supermercado
4. Testes automatizados
5. Ambiente de produção configurado
6. Documentação de deploy

## CRITÉRIOS DE ACEITE (MVP COMPLETO)
- [ ] Consumidor consegue criar conta e configurar localização
- [ ] Supermercado consegue cadastrar produtos manualmente
- [ ] Supermercado consegue importar produtos via CSV
- [ ] Consumidor consegue buscar produtos
- [ ] Consumidor consegue criar listas de compras
- [ ] Consumidor consegue comparar preços entre 2 supermercados
- [ ] Resultado mostra economia e supermercado mais barato
- [ ] Sistema funciona em mobile (responsivo)
- [ ] Performance aceitável (< 3s para principais ações)
```

### 9.4 Prompt Fase 2 (Resumido)

```markdown
# PROMPT: Fase 2 - Engajamento e Monetização

## FEATURES DESTA FASE

### 1. Login Social
- Implementar NextAuth.js
- Providers: Google, Apple
- Merge de contas se email já existe

### 2. Sistema de Alertas de Preço
- CRUD de alertas
- Job de verificação (cada 15min)
- Notificação email + in-app
- Limite por plano

### 3. Histórico de Preços
- Trigger para gravar mudanças
- API para consultar histórico
- Gráfico interativo (Recharts)
- Períodos: 5d, 10d, 30d, 3m, 6m, 1a

### 4. Destaques e Promoções (Supermercado)
- Marcar produto como destaque
- Limite conforme plano
- Gestão de promoções com período

### 5. Sistema de Planos
- Configuração de limites
- Checkout com Stripe
- Gestão de assinaturas
- Upgrade/downgrade

### 6. Recomendações v1
- Baseado em:
  - Histórico de listas
  - Categorias frequentes
  - Supermercados preferidos
- Exibir na home

### 7. Analytics Básico
- Tracking de eventos principais
- Dashboard com métricas
- Export básico
```

---

## 10. Infraestrutura AWS

### 10.1 Arquitetura MVP (Custo Otimizado)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INFRAESTRUTURA AWS - MVP                                  │
│                    Custo estimado: $50-150/mês                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   ROUTE 53      │  DNS
│   ~$0.50/mês    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CLOUDFRONT     │  CDN + Cache + WAF básico
│  ~$5-20/mês     │  (Free tier generoso)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────────┐
│ VERCEL  │ │  API GATEWAY    │  REST API
│ $0-20   │ │  ~$3-10/mês     │  (1M requests free)
│ (Free   │ └────────┬────────┘
│  tier)  │          │
└─────────┘          ▼
            ┌─────────────────┐
            │  LAMBDA         │  Backend NestJS
            │  ~$0-5/mês      │  (1M requests free)
            └────────┬────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────┐  ┌─────────────┐  ┌─────────────┐
│   RDS   │  │ ELASTICACHE │  │     S3      │
│Postgres │  │   Redis     │  │   Assets    │
│Serverless│  │  t4g.micro │  │  ~$1-5/mês  │
│~$15-50  │  │  ~$12/mês   │  │             │
└─────────┘  └─────────────┘  └─────────────┘

┌─────────────────┐  ┌─────────────────┐
│  EVENTBRIDGE    │  │      SES        │
│  ~$1/mês        │  │   ~$0.10/1k     │
│  (eventos)      │  │   emails        │
└─────────────────┘  └─────────────────┘
```

### 10.2 Serviços e Custos Detalhados

| Serviço | Configuração MVP | Custo Estimado/Mês |
|---------|-----------------|-------------------|
| Route 53 | 1 hosted zone | $0.50 |
| CloudFront | 50GB transfer | $5-10 (free tier) |
| Vercel | Hobby/Pro | $0-20 |
| API Gateway | REST, 1M req | $3.50 (free tier 1M) |
| Lambda | 1M invocações | $0 (free tier) |
| RDS PostgreSQL | Serverless v2, min 0.5 ACU | $15-50 |
| ElastiCache Redis | t4g.micro | $12.41 |
| S3 | 10GB storage | $0.23 + transfer |
| SES | 10k emails | $1 |
| EventBridge | 1M events | $1 |
| CloudWatch | Basic | $0-5 |
| **TOTAL** | | **$38-110/mês** |

### 10.3 Configuração Terraform (Exemplo)

```hcl
# main.tf - Infraestrutura MVP ComparaPreços

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "sa-east-1" # São Paulo
}

# =====================================================
# VPC
# =====================================================

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "compara-precos-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["sa-east-1a", "sa-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = false # Economia - usar VPC endpoints
  enable_vpn_gateway = false
}

# =====================================================
# RDS PostgreSQL Serverless v2
# =====================================================

resource "aws_rds_cluster" "main" {
  cluster_identifier     = "compara-precos-db"
  engine                 = "aurora-postgresql"
  engine_mode            = "provisioned"
  engine_version         = "15.4"
  database_name          = "comparaprecos"
  master_username        = var.db_username
  master_password        = var.db_password
  
  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 2
  }

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  skip_final_snapshot    = true # Mudar em prod
}

resource "aws_rds_cluster_instance" "main" {
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version
}

# =====================================================
# ElastiCache Redis
# =====================================================

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "compara-precos-cache"
  engine               = "redis"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}

# =====================================================
# S3 Bucket para assets
# =====================================================

resource "aws_s3_bucket" "assets" {
  bucket = "compara-precos-assets-${var.environment}"
}

resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = var.allowed_origins
    max_age_seconds = 3600
  }
}

# =====================================================
# Lambda Function (Backend)
# =====================================================

resource "aws_lambda_function" "api" {
  filename         = "api.zip"
  function_name    = "compara-precos-api"
  role            = aws_iam_role.lambda.arn
  handler         = "dist/lambda.handler"
  runtime         = "nodejs20.x"
  timeout         = 30
  memory_size     = 512

  environment {
    variables = {
      DATABASE_URL    = "postgresql://${var.db_username}:${var.db_password}@${aws_rds_cluster.main.endpoint}:5432/comparaprecos"
      REDIS_URL       = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379"
      JWT_SECRET      = var.jwt_secret
      S3_BUCKET       = aws_s3_bucket.assets.id
    }
  }

  vpc_config {
    subnet_ids         = module.vpc.private_subnets
    security_group_ids = [aws_security_group.lambda.id]
  }
}

# =====================================================
# API Gateway
# =====================================================

resource "aws_apigatewayv2_api" "main" {
  name          = "compara-precos-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["*"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api.invoke_arn
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# =====================================================
# CloudFront Distribution
# =====================================================

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200" # América do Sul + Norte

  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3Assets"
  }

  origin {
    domain_name = replace(aws_apigatewayv2_api.main.api_endpoint, "https://", "")
    origin_id   = "API"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "S3Assets"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "API"
    viewer_protocol_policy = "https-only"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Origin"]
      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### 10.4 Estratégia de Escalabilidade

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVOLUÇÃO DA INFRAESTRUTURA                                │
└─────────────────────────────────────────────────────────────────────────────┘

    MVP (0-1k users)          GROWTH (1k-10k)           SCALE (10k-100k)
    
    ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
    │ Vercel (Free)   │      │ Vercel Pro      │      │ Vercel Pro      │
    │ Lambda (Free)   │      │ Lambda          │      │ ECS Fargate     │
    │ RDS Serverless  │ ──▶  │ RDS Serverless  │ ──▶  │ RDS Provisioned │
    │ Redis t4g.micro │      │ Redis t4g.small │      │ Redis Cluster   │
    │ S3 Standard     │      │ S3 + CloudFront │      │ S3 + CloudFront │
    └─────────────────┘      └─────────────────┘      └─────────────────┘
    
    ~$50-100/mês              ~$200-500/mês            ~$1000-3000/mês
```

---

## 11. Uso de IA para Otimização

### 11.1 Features com IA

| Feature | Técnica | Implementação |
|---------|---------|---------------|
| **Busca inteligente** | Embeddings + Similaridade | OpenAI Embeddings + pgvector |
| **Recomendações** | Collaborative Filtering | Amazon Personalize ou custom |
| **Categorização automática** | Classificação de texto | GPT-4 ou fine-tuned model |
| **Detecção de anomalias** | Análise estatística | Preços muito fora do padrão |
| **OCR de encartes** | Computer Vision | AWS Textract |
| **Chatbot de suporte** | LLM | Claude ou GPT-4 |

### 11.2 Sistema de Recomendações

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA DE RECOMENDAÇÕES                              │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │   USER EVENTS   │
                         │                 │
                         │ - views         │
                         │ - clicks        │
                         │ - list_adds     │
                         │ - comparisons   │
                         │ - purchases     │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
         ┌─────────────────┐         ┌─────────────────┐
         │  BATCH PROCESS  │         │  REAL-TIME      │
         │  (diário)       │         │  (cada request) │
         │                 │         │                 │
         │ - User profiles │         │ - Session data  │
         │ - Item-item     │         │ - Context       │
         │   similarity    │         │ - Location      │
         │ - Trends        │         │                 │
         └────────┬────────┘         └────────┬────────┘
                  │                           │
                  └─────────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │  RECOMMENDATION     │
                    │  ENGINE             │
                    │                     │
                    │  Hybrid approach:   │
                    │  - Collaborative    │
                    │  - Content-based    │
                    │  - Popularity       │
                    │  - Business rules   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  PERSONALIZED       │
                    │  RESULTS            │
                    │                     │
                    │  Ranked by:         │
                    │  - Relevance score  │
                    │  - Supermarket rank │
                    │  - Recency          │
                    │  - Distance         │
                    └─────────────────────┘
```

### 11.3 Prompt para Categorização Automática

```markdown
# PROMPT: Categorização Automática de Produtos

Você é um sistema de categorização de produtos de supermercado. 
Dado o nome e descrição de um produto, classifique-o na categoria e subcategoria corretas.

## CATEGORIAS DISPONÍVEIS:

1. Alimentos
   - Arroz e Grãos
   - Massas
   - Conservas
   - Temperos e Condimentos
   - Açúcar e Adoçantes
   - Farinhas
   - Cereais Matinais
   
2. Bebidas
   - Águas
   - Refrigerantes
   - Sucos
   - Cervejas
   - Vinhos
   - Destilados
   
3. Laticínios
   - Leites
   - Queijos
   - Iogurtes
   - Manteigas e Margarinas
   
[... continuar com todas as categorias]

## INPUT
Nome do produto: {nome}
Descrição: {descricao}
Marca: {marca}

## OUTPUT (JSON)
{
  "categoria": "string",
  "subcategoria": "string",
  "confianca": 0.0-1.0
}
```

### 11.4 Detecção de Anomalias de Preço

```python
# Exemplo de algoritmo para detectar preços anômalos

import numpy as np
from scipy import stats

def detect_price_anomaly(product_id: str, new_price: int) -> dict:
    """
    Detecta se um novo preço é anômalo comparado ao histórico.
    
    Returns:
        {
            "is_anomaly": bool,
            "severity": "low" | "medium" | "high",
            "reason": str,
            "suggestion": str
        }
    """
    
    # Buscar histórico de preços (últimos 90 dias)
    history = get_price_history(product_id, days=90)
    
    if len(history) < 5:
        return {"is_anomaly": False, "reason": "Insufficient history"}
    
    prices = np.array([h.price_cents for h in history])
    
    # Calcular Z-score
    mean = np.mean(prices)
    std = np.std(prices)
    z_score = (new_price - mean) / std if std > 0 else 0
    
    # Calcular variação percentual vs última entrada
    last_price = prices[-1]
    pct_change = ((new_price - last_price) / last_price) * 100
    
    # Regras de detecção
    is_anomaly = False
    severity = "low"
    reasons = []
    
    # Z-score alto
    if abs(z_score) > 3:
        is_anomaly = True
        severity = "high"
        reasons.append(f"Preço {z_score:.1f} desvios padrão da média")
    elif abs(z_score) > 2:
        is_anomaly = True
        severity = "medium"
        reasons.append(f"Preço {z_score:.1f} desvios padrão da média")
    
    # Variação brusca
    if abs(pct_change) > 50:
        is_anomaly = True
        severity = "high" if abs(pct_change) > 80 else "medium"
        direction = "aumento" if pct_change > 0 else "redução"
        reasons.append(f"{direction} de {abs(pct_change):.0f}% vs último preço")
    
    # Preço muito baixo (possível erro de digitação)
    if new_price < mean * 0.3:
        is_anomaly = True
        severity = "high"
        reasons.append("Preço muito abaixo do histórico (possível erro)")
    
    return {
        "is_anomaly": is_anomaly,
        "severity": severity,
        "reason": "; ".join(reasons) if reasons else "OK",
        "suggestion": "Verifique o preço antes de confirmar" if is_anomaly else None,
        "stats": {
            "mean": mean,
            "std": std,
            "z_score": z_score,
            "pct_change": pct_change
        }
    }
```

---

## 12. Checklists por Fase

### 12.1 Checklist Fase 1 (MVP)

```markdown
## PRÉ-DESENVOLVIMENTO
- [ ] Ambiente de desenvolvimento configurado
- [ ] Repositórios Git criados
- [ ] Board de tarefas configurado (Jira/Linear/Trello)
- [ ] Documentação inicial revisada pela equipe
- [ ] Design system definido (cores, tipografia, componentes)
- [ ] Wireframes das principais telas aprovados

## SPRINT 1 - SETUP E AUTH
### Backend
- [ ] Projeto NestJS inicializado
- [ ] Prisma configurado com PostgreSQL
- [ ] Schema inicial migrado
- [ ] Módulo de autenticação implementado
- [ ] Validação de CNPJ funcionando
- [ ] Integração com ViaCEP funcionando
- [ ] Swagger documentado
- [ ] Testes unitários de auth

### Frontend
- [ ] Projeto Next.js inicializado
- [ ] Tailwind + shadcn configurados
- [ ] Página de login implementada
- [ ] Página de cadastro consumidor implementada
- [ ] Página de cadastro supermercado implementada
- [ ] Validação de formulários com Zod
- [ ] Estado de autenticação gerenciado
- [ ] Proteção de rotas implementada

### DevOps
- [ ] Docker compose para desenvolvimento
- [ ] CI pipeline básico
- [ ] Linting automatizado

## SPRINT 2 - PRODUTOS E LISTAS
### Backend
- [ ] CRUD de categorias
- [ ] CRUD de produtos
- [ ] Upload para S3 implementado
- [ ] Processamento de CSV implementado
- [ ] Full-text search funcionando
- [ ] CRUD de listas de compras
- [ ] Geolocalização implementada

### Frontend
- [ ] Área do supermercado - listagem de produtos
- [ ] Formulário de produto
- [ ] Componente de upload CSV
- [ ] Área de instruções CSV
- [ ] Busca de produtos
- [ ] Criação de listas
- [ ] Adição de produtos às listas

## SPRINT 3 - COMPARAÇÃO E DEPLOY
### Backend
- [ ] Endpoint de comparação implementado
- [ ] Validação de limites por plano
- [ ] Logging de comparações para analytics
- [ ] Testes de integração

### Frontend
- [ ] Seleção de supermercados para comparação
- [ ] Exibição de resultados
- [ ] Home page com promoções
- [ ] Dashboard do supermercado básico
- [ ] Perfil do usuário

### Deploy
- [ ] Infraestrutura AWS provisionada
- [ ] Deploy backend funcionando
- [ ] Deploy frontend funcionando
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Monitoramento básico ativo

## QA FINAL MVP
- [ ] Fluxo completo de cadastro testado
- [ ] Fluxo de produtos testado
- [ ] Fluxo de listas testado
- [ ] Fluxo de comparação testado
- [ ] Testes em diferentes navegadores
- [ ] Testes em mobile
- [ ] Performance aceitável (< 3s)
- [ ] Sem erros críticos em produção
```

### 12.2 Checklist Fase 2

```markdown
## FEATURES
- [ ] Login social (Google) implementado
- [ ] Login social (Apple) implementado
- [ ] Sistema de alertas de preço implementado
- [ ] Histórico de preços com gráficos
- [ ] Gestão de destaques pelo supermercado
- [ ] Sistema de planos configurável
- [ ] Checkout com Stripe
- [ ] Recomendações básicas na home
- [ ] Histórico de listas
- [ ] Email templates transacionais

## QUALIDADE
- [ ] Cobertura de testes > 60%
- [ ] Performance melhorada (< 2s)
- [ ] Métricas de engajamento sendo coletadas
- [ ] Feedback de usuários beta incorporado
```

---

## 13. Métricas e KPIs

### 13.1 Métricas de Produto

| Categoria | Métrica | Meta MVP | Meta 6 meses |
|-----------|---------|----------|--------------|
| Aquisição | Cadastros/semana | 100 | 1.000 |
| Aquisição | Supermercados ativos | 10 | 100 |
| Ativação | Taxa de conclusão cadastro | 60% | 75% |
| Ativação | Usuários que criam 1+ lista | 40% | 60% |
| Engajamento | Comparações/usuário/mês | 2 | 5 |
| Engajamento | DAU/MAU ratio | 10% | 25% |
| Retenção | Retenção D7 | 20% | 40% |
| Retenção | Retenção D30 | 10% | 25% |
| Receita | Conversão free→paid | - | 5% |
| Receita | MRR | - | $5.000 |

### 13.2 Métricas Técnicas

| Métrica | Meta | Alertar se |
|---------|------|------------|
| Uptime | 99.5% | < 99% |
| API Response Time p95 | < 500ms | > 1s |
| Error Rate | < 1% | > 2% |
| Apdex Score | > 0.9 | < 0.8 |
| Database CPU | < 50% | > 80% |

---

## 14. Considerações de Segurança

### 14.1 Checklist de Segurança

```markdown
## AUTENTICAÇÃO
- [ ] Senhas hasheadas com bcrypt (min 10 rounds)
- [ ] Tokens JWT com expiração curta (15min)
- [ ] Refresh tokens com rotação
- [ ] Rate limiting em endpoints de auth
- [ ] Lockout após tentativas falhas
- [ ] 2FA disponível (opcional)

## AUTORIZAÇÃO
- [ ] RBAC implementado
- [ ] Validação de ownership em todas operações
- [ ] Endpoints admin protegidos
- [ ] Logs de acesso administrativo

## DADOS
- [ ] Criptografia em trânsito (TLS 1.3)
- [ ] Criptografia em repouso (RDS, S3)
- [ ] PII identificado e protegido
- [ ] Backup criptografado
- [ ] Política de retenção definida

## INFRAESTRUTURA
- [ ] Security Groups restritivos
- [ ] VPC com subnets privadas
- [ ] Secrets em Secrets Manager
- [ ] WAF básico ativo
- [ ] Scanning de dependências

## APLICAÇÃO
- [ ] Input validation em todas entradas
- [ ] Output encoding
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention (Prisma)
- [ ] Security headers configurados
```

### 14.2 Headers de Segurança

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
  }
];
```

---

## 15. Glossário

| Termo | Definição |
|-------|-----------|
| ACU | Aurora Capacity Unit - unidade de capacidade do Aurora Serverless |
| CEP | Código de Endereçamento Postal |
| CNPJ | Cadastro Nacional de Pessoa Jurídica |
| DXA | Unidade de medida em documentos Office (1440 DXA = 1 polegada) |
| EAN | European Article Number - código de barras padrão |
| Haversine | Fórmula para calcular distância entre pontos geográficos |
| JWT | JSON Web Token - padrão para tokens de autenticação |
| LCP | Largest Contentful Paint - métrica de performance |
| MVP | Minimum Viable Product - produto mínimo viável |
| ORM | Object-Relational Mapping |
| RBAC | Role-Based Access Control - controle de acesso baseado em papéis |
| RPO | Recovery Point Objective - perda máxima de dados aceitável |
| RTO | Recovery Time Objective - tempo máximo para recuperação |
| SLA | Service Level Agreement - acordo de nível de serviço |
| SSR | Server-Side Rendering |
| TTL | Time To Live - tempo de vida de um cache |
| WAF | Web Application Firewall |

---

## Apêndice A: Template CSV para Supermercados

```csv
nome,descricao,codigo_barras,categoria,marca,unidade,quantidade,preco,preco_promocional,inicio_promocao,fim_promocao
"Arroz Tipo 1","Arroz branco longo fino","7891234567890","Arroz e Grãos","Tio João","kg",5,2499,,
"Feijão Carioca","Feijão tipo 1","7891234567891","Arroz e Grãos","Camil","kg",1,899,799,2024-01-15,2024-01-31
"Leite Integral","Leite UHT integral","7891234567892","Leites","Itambé","l",1,549,,
```

**Observações:**
- Preços em centavos (ex: 2499 = R$ 24,99)
- Datas no formato YYYY-MM-DD
- Campos opcionais podem ficar vazios
- Encoding: UTF-8
- Separador: vírgula
- Strings com vírgula devem estar entre aspas

---

## Apêndice B: Formato da API para Integração

```yaml
openapi: 3.0.0
info:
  title: ComparaPreços - API de Integração
  version: 1.0.0
  description: API para supermercados enviarem dados de produtos

paths:
  /webhook/products:
    post:
      summary: Receber produtos do supermercado
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                products:
                  type: array
                  items:
                    $ref: '#/components/schemas/Product'
      responses:
        '200':
          description: Produtos recebidos com sucesso
          content:
            application/json:
              schema:
                type: object
                properties:
                  received: 
                    type: integer
                  processed:
                    type: integer
                  errors:
                    type: array
                    items:
                      type: object

components:
  schemas:
    Product:
      type: object
      required:
        - name
        - priceCents
      properties:
        externalId:
          type: string
          description: ID do produto no sistema do supermercado
        name:
          type: string
          maxLength: 255
        description:
          type: string
        barcode:
          type: string
          pattern: '^\d{13}$'
        category:
          type: string
        brand:
          type: string
        unit:
          type: string
          enum: [un, kg, l, g, ml]
        quantity:
          type: number
        priceCents:
          type: integer
          minimum: 1
        promoPriceCents:
          type: integer
        promoStartDate:
          type: string
          format: date
        promoEndDate:
          type: string
          format: date
        imageUrl:
          type: string
          format: uri

  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
```

---

*Documento gerado em: Janeiro 2026*
*Versão: 1.0*
*Autor: Equipe de Produto ComparaPreços*
