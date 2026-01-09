# 🛒 qanto

Plataforma de comparação de preços de supermercados

---

## 🚀 Setup Local (3 comandos)

### 1. Instalar dependências
```bash
npm install
```

### 2. Setup inicial (primeira vez)
```bash
./setup.sh
```

Isso vai:
- ✅ Subir PostgreSQL e Redis (Docker)
- ✅ Configurar banco de dados
- ✅ Popular dados iniciais (categorias e planos)

### 3. Rodar aplicação
```bash
./dev.sh
```

Ou manualmente em 2 terminais:
```bash
# Terminal 1 - Backend
cd apps/backend && npm run start:dev

# Terminal 2 - Frontend
cd apps/frontend && npm run dev
```

**Pronto!** Acesse: http://localhost:3000

---

## 🛠️ Stack

- **Backend:** NestJS + Prisma + PostgreSQL + Redis
- **Frontend:** Next.js 14 + TypeScript + Tailwind + shadcn/ui
- **Monorepo:** Nx

---

## 📋 Funcionalidades (MVP)

### Para Consumidores
- ✅ Cadastro e login
- ✅ Criar listas de compras
- ✅ Comparar preços entre supermercados
- ✅ Ver economia estimada

### Para Supermercados
- ✅ Cadastro com validação de CNPJ
- ✅ Gerenciar produtos (CRUD)
- ✅ Upload CSV em massa
- ✅ Dashboard com catálogo

---

## 🐳 Serviços Docker

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Resetar tudo
docker-compose down -v
```

---

## 📊 Dados Iniciais

Após `./setup.sh`, você terá:

**6 Planos:**
- Consumidores: Free, Basic (R$ 9,90), Premium (R$ 29,90)
- Supermercados: Free, Growth (R$ 99,90), Enterprise (R$ 299)

**10 Categorias** com 60+ subcategorias

---

## 🔗 URLs

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |

---

## 🧪 Testar

1. **Criar consumidor:** http://localhost:3000/register
2. **Criar supermercado:** http://localhost:3000/register/supermarket (use CNPJ: `11.222.333/0001-81`)
3. **Cadastrar produtos** no dashboard do supermercado
4. **Criar lista** como consumidor
5. **Comparar preços!** 🎉

---

## 🛠️ Comandos Úteis

```bash
# Ver banco visualmente
cd apps/backend && npx prisma studio

# Resetar banco
cd apps/backend && npx prisma migrate reset

# Build para produção
npm run build

# Rodar testes
npm run test

# Lint
npm run lint
```

---

## 📁 Estrutura

```
qanto/
├── apps/
│   ├── backend/          # API NestJS
│   └── frontend/         # App Next.js
├── docs/                 # Documentação
├── .github/workflows/    # CI/CD
├── docker-compose.yml    # PostgreSQL + Redis
├── setup.sh             # Setup automático
└── dev.sh               # Rodar dev mode
```

---

## 🆘 Problemas?

**Porta em uso:**
```bash
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

**Docker não inicia:**
```bash
docker-compose down
docker-compose up -d
```

**Prisma Client desatualizado:**
```bash
cd apps/backend && npx prisma generate
```

---

## 📝 Licença

Proprietário

---

**Desenvolvido com ❤️**
