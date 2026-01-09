# Issues Identificadas - FASE 1

**Data**: 2026-01-09
**Revisão**: Completa (Sprint 1, 2 e 3)
**Completude Geral**: ~89% (117/131 SP)

---

## 🔴 PRIORIDADE CRÍTICA

### Issue #1: Implementar Testes E2E dos Fluxos Principais
**Sprint**: Sprint 3
**Story Points**: 5 SP
**Status**: ❌ Não implementado
**Labels**: `testing`, `e2e`, `critical`, `sprint-3`

#### Descrição
Nenhum teste E2E foi implementado conforme planejado no Sprint 3. O sistema está sem cobertura de testes automatizados, aumentando o risco de regressões e dificultando refatorações futuras.

#### Impacto
- **Alto risco** de bugs não detectados
- QA manual obrigatório para cada deploy
- Impossibilidade de CI/CD confiável
- Refatorações arriscadas

#### Tarefas
- [ ] Configurar Playwright ou Cypress
- [ ] Implementar testes do fluxo de autenticação:
  - Cadastro de consumidor
  - Cadastro de supermercado
  - Login
  - Logout
- [ ] Implementar testes do fluxo de lista de compras:
  - Criar lista
  - Adicionar produtos à lista
  - Editar itens
  - Remover itens
- [ ] Implementar testes do fluxo de comparação:
  - Selecionar supermercados
  - Executar comparação
  - Visualizar resultados
- [ ] Implementar testes do fluxo de produtos (supermercado):
  - Criar produto
  - Editar produto
  - Upload CSV

#### Critérios de Aceitação
- [ ] Playwright/Cypress configurado e funcionando
- [ ] Mínimo 4 fluxos E2E implementados (auth, listas, comparação, produtos)
- [ ] Testes passando no CI/CD
- [ ] Documentação de como rodar os testes

#### Arquivos Afetados
- Criar: `/apps/frontend/e2e/` ou `/apps/frontend/tests/e2e/`
- Criar: `playwright.config.ts` ou `cypress.config.ts`
- Atualizar: `.github/workflows/ci.yml` (adicionar step de E2E tests)
- Atualizar: `package.json` (scripts de teste)

---

### Issue #2: Implementar Geocoding no Cadastro de Consumidor
**Sprint**: Sprint 1
**Story Points**: 2 SP
**Status**: ✅ Resolvido parcialmente (backend OK, frontend pendente)
**Labels**: `enhancement`, `geocoding`, `consumer`, `sprint-1`

#### Descrição
O geocoding foi implementado para o cadastro de supermercado, mas **não está implementado para o cadastro de consumidor**. Isso impede cálculo de distância para consumidores.

#### Impacto
- Comparações não mostram distância para consumidores
- Busca por proximidade não funciona para consumidores
- Funcionalidade de geolocalização incompleta

#### Tarefas
- [ ] Adicionar geocoding automático no cadastro de consumidor (backend)
- [ ] Adicionar campo opcional de endereço completo no RegisterDto
- [ ] Integrar GeocodingService no AuthService.register()
- [ ] Calcular lat/lng a partir do CEP + endereço no registro
- [ ] Atualizar lat/lng quando usuário edita endereço

#### Critérios de Aceitação
- [ ] Consumidor registrado tem lat/lng calculadas automaticamente
- [ ] Comparações mostram distância para consumidores
- [ ] Edição de endereço atualiza coordenadas

#### Arquivos Afetados
- `apps/backend/src/modules/auth/auth.service.ts`
- `apps/backend/src/modules/auth/dto/register.dto.ts`
- `apps/backend/src/modules/users/users.service.ts`

---

## 🟠 PRIORIDADE ALTA

### Issue #3: Criar Página Inicial com Promoções e Destaques
**Sprint**: Sprint 3
**Story Points**: 6 SP
**Status**: ⚠️ Parcial (backend 100%, frontend 0%)
**Labels**: `frontend`, `ui`, `sprint-3`, `high-priority`

#### Descrição
Backend implementado com filtros `featured=true` e `onPromotion=true`, mas **não existe UI** mostrando esses produtos. Página home (`/page.tsx`) é apenas landing page estática.

#### Impacto
- Usuários não vêem produtos em destaque
- Promoções não são exibidas
- Landing page não tem call-to-action para produtos

#### Tarefas
- [ ] Criar componente ProductGrid
- [ ] Criar componente ProductCard com badge de promoção
- [ ] Criar página `/products` ou atualizar homepage
- [ ] Implementar seção "Produtos em Destaque" (isFeatured)
- [ ] Implementar seção "Promoções" (onPromotion)
- [ ] Adicionar filtros por categoria
- [ ] Adicionar paginação
- [ ] Adicionar link para detalhes do produto

#### Critérios de Aceitação
- [ ] Página mostra grid de produtos
- [ ] Produtos em destaque destacados visualmente
- [ ] Promoções mostram preço original + promo price
- [ ] Filtros funcionando (categoria, promoção, destaque)
- [ ] Paginação implementada
- [ ] Responsivo (mobile + desktop)

#### Arquivos Afetados
- Criar: `apps/frontend/src/app/products/page.tsx`
- Criar: `apps/frontend/src/components/product-grid.tsx`
- Criar: `apps/frontend/src/components/product-card.tsx`
- Atualizar: `apps/frontend/src/app/page.tsx` (adicionar links)

#### Wireframe Sugerido
```
+--------------------------------+
| QANTO                   Login  |
+--------------------------------+
|                                |
|  🌟 Produtos em Destaque       |
|  +------+ +------+ +------+    |
|  |Prod1| |Prod2| |Prod3|       |
|  +------+ +------+ +------+    |
|                                |
|  🔥 Promoções da Semana        |
|  +------+ +------+ +------+    |
|  |PROMO| |PROMO| |PROMO|       |
|  +------+ +------+ +------+    |
+--------------------------------+
```

---

### Issue #4: Criar Página de Perfil do Usuário
**Sprint**: Sprint 3
**Story Points**: 3 SP
**Status**: ⚠️ Parcial (backend 100%, frontend 0%)
**Labels**: `frontend`, `ui`, `profile`, `sprint-3`

#### Descrição
APIs de perfil implementadas (`GET/PATCH /users/profile`, `PATCH /users/address`), mas **não há UI** para o usuário editar seus dados.

#### Impacto
- Usuário não consegue editar nome, telefone
- Usuário não consegue atualizar endereço
- Necessidade de usar API diretamente (não user-friendly)

#### Tarefas
- [ ] Criar rota `/profile` ou `/settings`
- [ ] Criar página com tabs (Dados Pessoais, Endereço, Segurança)
- [ ] Implementar formulário de edição de perfil
- [ ] Implementar formulário de edição de endereço (com ViaCEP)
- [ ] Adicionar botão de "Desativar Conta"
- [ ] Adicionar confirmação de desativação
- [ ] Adicionar loading states e error handling

#### Critérios de Aceitação
- [ ] Página `/profile` acessível do dashboard
- [ ] Formulário pré-preenchido com dados atuais
- [ ] Validações no frontend (nome, email, telefone, CEP)
- [ ] Integração ViaCEP funciona
- [ ] Feedback de sucesso/erro
- [ ] Modal de confirmação para desativar conta
- [ ] Responsivo

#### Arquivos Afetados
- Criar: `apps/frontend/src/app/profile/page.tsx`
- Criar: `apps/frontend/src/components/profile-form.tsx`
- Criar: `apps/frontend/src/components/address-form.tsx`
- Atualizar: `apps/frontend/src/app/dashboard/page.tsx` (adicionar link para perfil)

---

### Issue #5: Adicionar Deploy Automático ao Workflow CI/CD
**Sprint**: Sprint 1
**Story Points**: 2 SP
**Status**: ⚠️ Parcial (CI OK, CD faltando)
**Labels**: `devops`, `ci-cd`, `deployment`, `sprint-1`

#### Descrição
Workflow CI/CD implementado com lint, test e build, mas **não há deploy automático** para produção. A especificação menciona "Deploy Vercel".

#### Impacto
- Deploy manual necessário
- Maior risco de erro humano
- Processo mais lento

#### Tarefas
- [ ] Configurar deploy automático no Vercel (frontend)
- [ ] Adicionar step de deploy no workflow
- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Configurar deploy preview para PRs
- [ ] Documentar processo de deploy do backend (Railway/Render/etc)

#### Critérios de Aceitação
- [ ] Push para `main` faz deploy automático
- [ ] PRs geram preview deployments
- [ ] Variáveis de ambiente configuradas
- [ ] Logs de deploy acessíveis

#### Arquivos Afetados
- Atualizar: `.github/workflows/ci.yml`
- Criar: `vercel.json` (se necessário)
- Atualizar: `README.md` (documentação de deploy)

---

## 🟡 PRIORIDADE MÉDIA

### Issue #6: Implementar Processamento Assíncrono de CSV
**Sprint**: Sprint 2
**Story Points**: 5 SP
**Status**: ⚠️ Melhoria recomendada
**Labels**: `enhancement`, `backend`, `performance`, `csv`

#### Descrição
Processamento de CSV é **síncrono** (`products.service.ts:324`). Para arquivos grandes (1000+ produtos), pode causar timeout ou travar a requisição.

#### Impacto
- Arquivos grandes causam timeout (>30s)
- Usuário não recebe feedback durante processamento
- Impossibilidade de cancelar processamento

#### Solução Proposta
Usar **Bull Queue** para processamento em background:
1. Upload retorna job ID imediatamente
2. Processamento roda em background
3. WebSocket ou polling para status
4. Notificação quando completo

#### Tarefas
- [ ] Instalar `@nestjs/bull` e `bull`
- [ ] Configurar Redis connection
- [ ] Criar `ProductCsvQueue` processor
- [ ] Mover lógica de CSV para processor
- [ ] Criar endpoint GET /products/csv-imports/:id (status)
- [ ] Atualizar endpoint POST /products/upload-csv (retornar job ID)
- [ ] Frontend: polling ou WebSocket para status

#### Critérios de Aceitação
- [ ] Upload de CSV retorna imediatamente
- [ ] Processamento roda em background
- [ ] Status pode ser consultado
- [ ] Notificação quando completo
- [ ] Logs de erro detalhados

#### Arquivos Afetados
- Criar: `apps/backend/src/modules/products/products.queue.ts`
- Criar: `apps/backend/src/modules/products/products.processor.ts`
- Atualizar: `apps/backend/src/modules/products/products.service.ts`
- Atualizar: `apps/backend/src/modules/products/products.controller.ts`
- Atualizar: `apps/backend/src/modules/products/products.module.ts`

---

### Issue #7: Implementar Upload de Imagens de Produtos
**Sprint**: Backlog (não planejado em FASE 1)
**Story Points**: 5 SP
**Status**: ⚠️ Feature request
**Labels**: `enhancement`, `feature`, `upload`, `images`

#### Descrição
Atualmente, produtos só aceitam **URLs de imagens**. Supermercados não conseguem fazer upload de imagens diretamente.

#### Impacto
- Supermercados dependem de hospedagem externa
- Experiência ruim (precisam hospedar imagem em outro lugar)
- Imagens podem quebrar (links externos)

#### Solução Proposta
Integrar com **Cloudinary** ou **AWS S3**:
1. Endpoint POST /products/:id/image
2. Upload via multipart/form-data
3. Armazenamento em cloud storage
4. Retorna URL da imagem hospedada

#### Tarefas
- [ ] Escolher serviço (Cloudinary, S3, ou similar)
- [ ] Configurar SDK e credenciais
- [ ] Criar endpoint POST /products/:id/image
- [ ] Adicionar validações (tipo, tamanho)
- [ ] Implementar upload no frontend
- [ ] Adicionar preview de imagem
- [ ] Adicionar opção de remover imagem

#### Critérios de Aceitação
- [ ] Supermercado pode fazer upload de imagem
- [ ] Validação de tipo (JPEG, PNG, WebP)
- [ ] Limite de tamanho (5MB)
- [ ] Preview antes de salvar
- [ ] Imagem salva com URL permanente
- [ ] Opção de remover/substituir

#### Arquivos Afetados
- Criar: `apps/backend/src/common/services/storage.service.ts`
- Atualizar: `apps/backend/src/modules/products/products.controller.ts`
- Atualizar: `apps/backend/src/modules/products/products.service.ts`
- Criar: `apps/frontend/src/components/image-upload.tsx`

---

### Issue #8: Adicionar Paginação ao Dashboard do Supermercado
**Sprint**: Sprint 3 (Polish)
**Story Points**: 2 SP
**Status**: ⚠️ Melhoria recomendada
**Labels**: `enhancement`, `ui`, `pagination`

#### Descrição
Dashboard do supermercado carrega todos os produtos com **limit fixo de 100** (`supermarket/dashboard/page.tsx:49`). Para supermercados com muitos produtos, isso é problemático.

#### Impacto
- Performance ruim com muitos produtos
- UI sobrecarregada
- Impossibilidade de ver todos os produtos (limite de 100)

#### Tarefas
- [ ] Adicionar controles de paginação (página anterior/próxima)
- [ ] Adicionar seletor de itens por página (20, 50, 100)
- [ ] Persistir página atual no estado
- [ ] Atualizar chamada de API com page e limit
- [ ] Mostrar "Página X de Y"

#### Critérios de Aceitação
- [ ] Paginação funcional
- [ ] Controles de página (anterior, próximo, número)
- [ ] Seletor de itens por página
- [ ] Estado persistido ao navegar
- [ ] Performance melhorada

#### Arquivos Afetados
- Atualizar: `apps/frontend/src/app/supermarket/dashboard/page.tsx`
- Criar: `apps/frontend/src/components/pagination.tsx` (componente reutilizável)

---

### Issue #9: Seed de Categorias Iniciais
**Sprint**: Sprint 2
**Story Points**: 1 SP
**Status**: ⚠️ Não verificado
**Labels**: `database`, `seed`, `sprint-2`

#### Descrição
Especificação menciona "Seed + gerenciamento" de categorias. Não foi verificado se há seed de categorias iniciais.

#### Impacto
- Supermercados precisam criar categorias manualmente
- Inconsistência entre supermercados (nomes diferentes)
- Experiência ruim para novos usuários

#### Tarefas
- [ ] Criar seed file com categorias padrão brasileiras
- [ ] Implementar hierarquia (parent/children)
- [ ] Categorias sugeridas:
  - Bebidas (Refrigerantes, Sucos, Água, Cervejas)
  - Açougue (Carne Bovina, Frango, Suína, Peixes)
  - Padaria (Pães, Bolos, Biscoitos)
  - Laticínios (Leite, Queijos, Iogurtes)
  - Mercearia (Arroz, Feijão, Massas, Óleos)
  - Higiene (Sabonetes, Shampoo, Pasta de dente)
  - Limpeza (Detergentes, Sabão, Desinfetantes)
  - Hortifruti (Frutas, Verduras, Legumes)
- [ ] Script de seed executável
- [ ] Documentar como rodar seed

#### Critérios de Aceitação
- [ ] Seed cria 8+ categorias principais
- [ ] Cada categoria tem 3+ subcategorias
- [ ] Script idempotente (pode rodar múltiplas vezes)
- [ ] Documentado em README

#### Arquivos Afetados
- Criar: `apps/backend/prisma/seeds/categories.seed.ts`
- Criar: `apps/backend/prisma/seeds/index.ts`
- Atualizar: `apps/backend/package.json` (adicionar script seed)
- Atualizar: `README.md`

---

## 🟢 PRIORIDADE BAIXA

### Issue #10: Implementar Testes Unitários
**Sprint**: Backlog
**Story Points**: 8 SP
**Status**: ⚠️ Melhoria futura
**Labels**: `testing`, `unit-tests`, `low-priority`

#### Descrição
Além de E2E, implementar **testes unitários** para serviços críticos do backend.

#### Módulos Prioritários
- AuthService (register, login, JWT)
- ComparisonsService (algoritmo de matching)
- ProductsService (CSV processing)
- GeocodingService

#### Tarefas
- [ ] Configurar Jest (já configurado no NestJS)
- [ ] Criar mocks do PrismaService
- [ ] Implementar testes do AuthService
- [ ] Implementar testes do ComparisonsService
- [ ] Implementar testes do ProductsService
- [ ] Implementar testes do GeocodingService
- [ ] Meta: >70% code coverage

#### Arquivos Afetados
- Criar: `apps/backend/src/**/*.spec.ts`

---

### Issue #11: Adicionar Soft Delete Consistente
**Sprint**: Backlog
**Story Points**: 3 SP
**Status**: ⚠️ Inconsistência identificada
**Labels**: `enhancement`, `database`, `consistency`

#### Descrição
Produtos usam soft delete (status='inactive'), mas listas e outros modelos usam hard delete. Seria mais seguro ter soft delete consistente.

#### Tarefas
- [ ] Adicionar campo `deletedAt` em modelos relevantes
- [ ] Atualizar queries para filtrar deletedAt IS NULL
- [ ] Atualizar deletes para SET deletedAt = NOW()
- [ ] Documentar estratégia de deletion

#### Arquivos Afetados
- `apps/backend/prisma/schema.prisma`
- Múltiplos services

---

### Issue #12: Implementar Rate Limiting
**Sprint**: Backlog
**Story Points**: 2 SP
**Status**: ⚠️ Segurança recomendada
**Labels**: `security`, `rate-limiting`

#### Descrição
Não há rate limiting implementado. APIs públicas (como comparação) podem ser abusadas.

#### Solução Proposta
Usar `@nestjs/throttler`:
- 100 requests/minuto por IP (geral)
- 10 comparisons/hora por usuário
- 5 uploads CSV/hora por supermercado

#### Arquivos Afetados
- `apps/backend/src/app.module.ts`
- Controladores específicos

---

### Issue #13: Adicionar Logging e Monitoring
**Sprint**: Backlog
**Story Points**: 3 SP
**Status**: ⚠️ Observabilidade limitada
**Labels**: `monitoring`, `logging`, `observability`

#### Descrição
Apenas logging básico com NestJS Logger. Falta structured logging e monitoring.

#### Solução Proposta
- Winston para structured logging
- Sentry para error tracking
- Metrics com Prometheus (opcional)

#### Arquivos Afetados
- `apps/backend/src/main.ts`
- Criar: `apps/backend/src/common/logger/`

---

### Issue #14: Otimizar Queries de Comparação
**Sprint**: Backlog
**Story Points**: 3 SP
**Status**: ⚠️ Performance
**Labels**: `performance`, `optimization`, `database`

#### Descrição
Algoritmo de comparação faz **N queries sequenciais** (um findFirst por produto). Para listas grandes, isso é lento.

#### Solução Proposta
- Buscar todos os produtos do supermercado de uma vez
- Fazer matching em memória
- Usar índices no barcode e name

#### Arquivos Afetados
- `apps/backend/src/modules/comparisons/comparisons.service.ts:101-149`

---

## 📊 RESUMO DE ISSUES

### Por Prioridade
- 🔴 **CRÍTICA**: 2 issues (7 SP)
- 🟠 **ALTA**: 3 issues (11 SP)
- 🟡 **MÉDIA**: 4 issues (17 SP)
- 🟢 **BAIXA**: 5 issues (19 SP)

**TOTAL**: 14 issues, **54 Story Points**

### Por Sprint
- **Sprint 1**: 2 issues (4 SP) - Geocoding consumer, Deploy CD
- **Sprint 2**: 2 issues (6 SP) - CSV async, Categorias seed
- **Sprint 3**: 5 issues (19 SP) - Testes E2E, Página inicial, Perfil UI, Paginação, Polish
- **Backlog**: 5 issues (25 SP) - Melhorias futuras

---

## 🎯 ROADMAP RECOMENDADO

### Sprint de Correção 1 (1 semana - 13 SP)
- [ ] Issue #1: Testes E2E (5 SP) ⚠️ CRÍTICO
- [ ] Issue #3: Página Inicial (6 SP) ⚠️ ALTA
- [ ] Issue #5: Deploy CD (2 SP) ⚠️ ALTA

### Sprint de Correção 2 (1 semana - 10 SP)
- [ ] Issue #2: Geocoding Consumer (2 SP) ⚠️ CRÍTICA
- [ ] Issue #4: Perfil UI (3 SP) ⚠️ ALTA
- [ ] Issue #6: CSV Async (5 SP) ⚠️ MÉDIA

### Backlog Técnico
- [ ] Issue #7-14: Melhorias incrementais conforme necessidade

---

**Documento gerado em**: 2026-01-09
**Próxima revisão**: Após Sprint de Correção 1
