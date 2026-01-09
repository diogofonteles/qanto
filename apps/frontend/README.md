# qanto

> Plataforma de comparação de preços de supermercados

## 🚀 Sobre o Projeto

qanto é uma plataforma que permite consumidores compararem preços de produtos entre diferentes supermercados, economizando tempo e dinheiro nas compras. Supermercados podem cadastrar seus produtos e alcançar mais clientes.

## 📋 Funcionalidades (Fase 1 - MVP)

### Para Consumidores
- ✅ Cadastro e autenticação
- ✅ Criação de listas de compras
- ✅ Busca de produtos
- ✅ Comparação de preços entre supermercados
- ✅ Cálculo de economia
- ✅ Visualização de supermercados por proximidade

### Para Supermercados
- ✅ Cadastro com validação de CNPJ
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Upload em massa via CSV
- ✅ Dashboard com catálogo de produtos

## 🛠️ Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **Redis** - Cache
- **JWT** - Autenticação
- **Swagger** - Documentação da API

### Frontend
- **Next.js 14** - Framework React (App Router)
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Zod** - Validação de formulários

### DevOps
- **Docker Compose** - Ambiente de desenvolvimento
- **GitHub Actions** - CI/CD
- **Nx** - Monorepo

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/diogofonteles/qanto.git
cd qanto
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
\`\`\`

### 3. Configure as variáveis de ambiente

**Backend** (\`apps/backend/.env\`):
\`\`\`env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qanto"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
FRONTEND_URL="http://localhost:3000"
PORT=4000
\`\`\`

**Frontend** (\`apps/frontend/.env.local\`):
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
\`\`\`

### 4. Inicie os serviços Docker

\`\`\`bash
docker-compose up -d
\`\`\`

### 5. Execute as migrations

\`\`\`bash
cd apps/backend
npx prisma migrate dev
npx prisma db seed
\`\`\`

### 6. Inicie o desenvolvimento

**Backend:**
\`\`\`bash
cd apps/backend
npm run start:dev
\`\`\`

**Frontend:**
\`\`\`bash
cd apps/frontend
npm run dev
\`\`\`

## 📱 Acessando

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **Swagger**: http://localhost:4000/api/docs

## 🧪 Testes

\`\`\`bash
cd apps/backend
npm run test
\`\`\`

---

**Desenvolvido com ❤️ pela equipe qanto**
