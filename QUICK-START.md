# ⚡ Quick Start - qanto

Comandos prontos para copiar e colar! 🚀

---

## 🎯 Setup Rápido (5 minutos)

### 1. Instalar Tudo
```bash
# Instalar dependências
npm install

# Verificar se está tudo ok
./check-setup.sh
```

---

### 2. Iniciar Banco de Dados

**Opção A - Com Docker (Recomendado):**
```bash
# PostgreSQL
docker run --name qanto-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=qanto \
  -p 5432:5432 \
  -d postgres:16

# Redis (opcional)
docker run --name qanto-redis \
  -p 6379:6379 \
  -d redis:7
```

**Opção B - Com Docker Compose:**
```bash
docker-compose up -d
```

---

### 3. Configurar Backend
```bash
cd apps/backend

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Popular banco com dados iniciais
npx prisma db seed
```

Deve mostrar:
```
✅ Seeded 10 categories
✅ Seeded 6 plans
```

---

### 4. Rodar Aplicação

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

---

### 5. Testar! 🎉

Abra: **http://localhost:3000**

---

## 🧪 Teste Rápido

### Criar Conta de Consumidor
```bash
# Via API
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "123456",
    "name": "Teste User",
    "phone": "11987654321",
    "addressZipCode": "01310100",
    "addressStreet": "Av Paulista",
    "addressNumber": "1000",
    "addressNeighborhood": "Bela Vista",
    "addressCity": "São Paulo",
    "addressState": "SP"
  }'
```

Ou acesse: http://localhost:3000/register

---

## 🔥 Comandos Úteis

### Limpar e Reinstalar
```bash
# Limpar tudo
rm -rf node_modules apps/*/node_modules
rm -rf apps/backend/dist apps/frontend/.next
rm package-lock.json

# Reinstalar
npm install
```

### Ver Banco de Dados
```bash
cd apps/backend
npx prisma studio
```
Abre interface visual em: http://localhost:5555

### Ver Logs em Tempo Real
```bash
# Backend
cd apps/backend
npm run start:dev | grep --line-buffered -E '(error|warn|log)'

# Frontend
cd apps/frontend
npm run dev 2>&1 | grep --line-buffered -E '(error|warn|ready)'
```

### Resetar Banco
```bash
cd apps/backend

# CUIDADO: Apaga tudo!
npx prisma migrate reset

# Re-popular
npx prisma db seed
```

### Build para Produção
```bash
# Backend
npx nx build backend

# Frontend
npx nx build frontend

# Ambos
npm run build
```

---

## 🐛 Troubleshooting Rápido

### "Port already in use"
```bash
# Matar processo na porta 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Matar processo na porta 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Se não estiver, iniciar
docker start qanto-postgres

# Ver logs
docker logs qanto-postgres
```

### "Module not found"
```bash
# Reinstalar dependências específicas
cd apps/backend && npm install
cd apps/frontend && npm install
```

### "Prisma Client not found"
```bash
cd apps/backend
npx prisma generate
```

---

## 📊 Dados de Teste

### Planos Disponíveis
```
Consumidores:
- Free: 0 comparações/mês - R$ 0
- Basic: 10 comparações/mês - R$ 9,90
- Premium: Ilimitado - R$ 29,90

Supermercados:
- Free: 100 produtos - R$ 0
- Growth: 1000 produtos - R$ 99,90
- Enterprise: Ilimitado - R$ 299,00
```

### Categorias Principais
- Alimentos e Bebidas
- Laticínios e Frios
- Carnes e Peixes
- Hortifruti
- Padaria
- Mercearia
- Higiene e Limpeza
- Bebidas
- Congelados
- Outros

---

## 🚀 URLs Importantes

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **Swagger**: http://localhost:4000/api/docs
- **Prisma Studio**: http://localhost:5555

---

## ✅ Checklist

- [ ] Node.js 20+ instalado
- [ ] npm 10+ instalado
- [ ] PostgreSQL rodando (porta 5432)
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env` criado no backend
- [ ] `.env.local` criado no frontend
- [ ] Prisma Client gerado
- [ ] Migrations rodadas
- [ ] Seeds executados
- [ ] Backend iniciado (porta 4000)
- [ ] Frontend iniciado (porta 3000)
- [ ] Tudo funcionando! 🎉

---

**Dica**: Use `./check-setup.sh` para verificar tudo automaticamente!
