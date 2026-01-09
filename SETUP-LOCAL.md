# 🚀 Guia de Setup Local - qanto

Este guia vai te ajudar a configurar e rodar o projeto localmente do zero.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- ✅ **Node.js 20+** ([Download](https://nodejs.org/))
- ✅ **npm 10+** (vem com Node.js)
- ✅ **PostgreSQL** (escolha uma opção abaixo)
- ⚠️ **Redis** (opcional, mas recomendado)

### Opções para PostgreSQL:

**Opção 1 - Docker (Recomendado):**
```bash
docker run --name qanto-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=qanto \
  -p 5432:5432 \
  -d postgres:16
```

**Opção 2 - Docker Compose:**
```bash
docker-compose up -d postgres
```

**Opção 3 - PostgreSQL Local:**
- Instale PostgreSQL no seu sistema
- Crie um banco chamado `qanto`

### Opções para Redis (opcional):

**Com Docker:**
```bash
docker run --name qanto-redis -p 6379:6379 -d redis:7
```

**Com Docker Compose:**
```bash
docker-compose up -d redis
```

---

## 🔧 Setup Passo a Passo

### 1. Clone o Repositório

```bash
git clone https://github.com/diogofonteles/qanto.git
cd qanto
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

**Backend** - Crie `apps/backend/.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qanto"

# Redis (opcional)
REDIS_URL="redis://localhost:6379"

# JWT Secrets (MUDE EM PRODUÇÃO!)
JWT_SECRET="qanto-super-secret-jwt-key-change-in-production-2024"
JWT_REFRESH_SECRET="qanto-super-secret-refresh-key-change-in-production-2024"

# CORS
FRONTEND_URL="http://localhost:3000"

# Server
PORT=4000
NODE_ENV=development
```

**Frontend** - Crie `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 4. Configure o Banco de Dados

```bash
cd apps/backend

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Rodar seeds (categorias e planos)
npx prisma db seed
```

Você deve ver:
```
✅ Seeded 10 categories (with 60+ subcategories)
✅ Seeded 6 plans
```

### 5. Inicie o Backend

**Terminal 1:**
```bash
cd apps/backend
npm run start:dev
```

Você deve ver:
```
[Nest] Application is running on: http://localhost:4000
[Nest] Swagger docs available at: http://localhost:4000/api/docs
```

### 6. Inicie o Frontend

**Terminal 2:**
```bash
cd apps/frontend
npm run dev
```

Você deve ver:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

---

## 🎉 Testando a Aplicação

### Acesse o Frontend
Abra: **http://localhost:3000**

Você verá a landing page com opções para:
- Login
- Cadastro de Consumidor
- Cadastro de Supermercado

### Acesse a API
- **API Base**: http://localhost:4000/api/v1
- **Swagger Docs**: http://localhost:4000/api/docs

### Teste o Fluxo Completo

#### 1. **Criar Consumidor**
1. Acesse http://localhost:3000/register
2. Preencha o formulário:
   - Nome: João Silva
   - Email: joao@example.com
   - Senha: 123456
   - Telefone: (11) 98765-4321
   - CEP: 01310-100 (vai preencher automaticamente)
   - Número: 100
3. Clique em "Create Account"
4. Você será redirecionado para `/dashboard`

#### 2. **Criar Supermercado**
1. Abra uma aba anônima ou outro navegador
2. Acesse http://localhost:3000/register/supermarket
3. Preencha:
   - Nome da Empresa: Supermercado Exemplo LTDA
   - Nome Fantasia: Super Exemplo
   - CNPJ: 11.222.333/0001-81
   - Email: super@example.com
   - Senha: 123456
   - CEP: 01310-100
4. Você será redirecionado para login (não faz login automático de supermarket)

#### 3. **Fazer Login como Supermercado**
1. Faça login com: super@example.com / 123456
2. Você verá o dashboard do supermercado

#### 4. **Cadastrar Produtos (Supermercado)**

**Opção 1 - Manual:**
1. No dashboard, clique em "Add New Product"
2. Preencha:
   - Nome: Arroz Integral 1kg
   - Preço (centavos): 599
   - Categoria: (escolha uma)
   - Estoque: 100
3. Clique em "Create Product"

**Opção 2 - CSV Upload:**
1. Baixe o template CSV no dashboard
2. Preencha com produtos
3. Faça upload

#### 5. **Fazer Comparação (Consumidor)**
1. Volte para o consumidor (joao@example.com)
2. No dashboard, vá em "My Lists"
3. Crie uma lista: "Compras da Semana"
4. Vá em "Add Products"
5. Busque e adicione produtos
6. Vá em "Compare Prices"
7. Selecione 2+ supermercados
8. Clique em "Compare Prices"
9. Veja os resultados com economia!

---

## 🛠️ Comandos Úteis

### Backend
```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Build
npm run build

# Prisma Studio (interface visual do banco)
npx prisma studio

# Ver logs do Prisma
npx prisma migrate status

# Criar nova migration
npx prisma migrate dev --name nome_da_migration
```

### Frontend
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Iniciar em produção
npm run start
```

### Monorepo (Nx)
```bash
# Rodar ambos em paralelo
npm run dev

# Build de tudo
npm run build

# Ver graph de dependências
npm run graph

# Lint
npm run lint
```

---

## 🐛 Troubleshooting

### Erro: "Port 5432 already in use"
PostgreSQL já está rodando. Use-o ou pare o processo:
```bash
# Ver processo
lsof -i :5432

# Parar PostgreSQL (macOS)
brew services stop postgresql

# Parar PostgreSQL (Linux)
sudo systemctl stop postgresql
```

### Erro: "Cannot connect to database"
Verifique se PostgreSQL está rodando:
```bash
# Testar conexão
psql -h localhost -U postgres -d qanto

# Se não funcionar, verifique a senha e o banco
```

### Erro: "Prisma Client not generated"
```bash
cd apps/backend
npx prisma generate
```

### Erro: "Module not found"
```bash
# Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Frontend não conecta com Backend
1. Verifique se backend está rodando: http://localhost:4000/api/v1
2. Verifique CORS no backend (deve permitir localhost:3000)
3. Verifique `.env.local` do frontend

---

## 📊 Estrutura do Banco

Após rodar seeds, você terá:

### Planos (6 total)
**Consumidores:**
- Free (0 comparações)
- Basic (10 comparações/mês)
- Premium (ilimitado)

**Supermercados:**
- Free (100 produtos)
- Growth (1000 produtos)
- Enterprise (ilimitado)

### Categorias (10 principais + 60 subcategorias)
- Alimentos e Bebidas
- Laticínios e Frios
- Carnes e Peixes
- Hortifruti
- Padaria e Confeitaria
- Mercearia
- Higiene e Limpeza
- Bebidas
- Congelados
- Outros

---

## 🔐 Usuários de Teste

Após cadastrar manualmente, você pode criar usuários via Prisma Studio ou SQL:

```sql
-- Ver usuários
SELECT email, role, name FROM users;

-- Ver produtos
SELECT name, "priceCents", "supermarketId" FROM products;

-- Ver listas
SELECT name, "userId" FROM shopping_lists;
```

---

## 📈 Próximos Passos

Após rodar localmente:

1. ✅ Teste todos os fluxos
2. ✅ Crie produtos via CSV
3. ✅ Faça comparações reais
4. ✅ Teste em diferentes navegadores
5. ✅ Verifique a documentação Swagger

---

## 🆘 Suporte

Problemas? Verifique:
1. Logs do backend (terminal 1)
2. Logs do frontend (terminal 2)
3. Console do navegador (F12)
4. Network tab para erros de API

Se precisar de ajuda, abra uma issue no GitHub!

---

**Desenvolvido com ❤️ pela equipe qanto**
