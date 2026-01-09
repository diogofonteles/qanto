# Guia de Deploy - Qanto

Este documento descreve como fazer o deploy da plataforma Qanto em produção.

## Sumário

- [Frontend (Vercel)](#frontend-vercel)
- [Backend (Railway/Render/AWS)](#backend)
- [Banco de Dados (PostgreSQL)](#banco-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Deploy Automático (CD)](#deploy-automático)

---

## Frontend (Vercel)

### 1. Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy do frontend
cd apps/frontend
vercel

# Deploy para produção
vercel --prod
```

### 2. Deploy via GitHub (Recomendado)

1. Acesse [Vercel](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `cd ../.. && npx nx build frontend`
   - **Output Directory**: `apps/frontend/.next`

5. Adicione as variáveis de ambiente:
   ```env
   NEXT_PUBLIC_API_URL=https://api.qanto.com.br/api/v1
   ```

6. Clique em "Deploy"

### 3. Configuração de Domínio

1. No painel da Vercel, vá em **Settings > Domains**
2. Adicione seu domínio customizado (ex: `www.qanto.com.br`)
3. Configure os registros DNS conforme instruções da Vercel

### 4. Deploy Automático

O Vercel automaticamente faz deploy em cada push para:
- **Production**: Branch `main`
- **Preview**: Pull Requests e branches

---

## Backend

### Opção 1: Railway (Recomendado)

#### Deploy via Railway

1. Acesse [Railway](https://railway.app)
2. Clique em "New Project" > "Deploy from GitHub repo"
3. Selecione o repositório
4. Adicione serviços:
   - **PostgreSQL** (banco de dados)
   - **NestJS App** (backend)

#### Configuração do Backend

**Build Command**:
```bash
cd apps/backend && npm install && npx prisma generate && npm run build
```

**Start Command**:
```bash
cd apps/backend && npx prisma migrate deploy && npm run start:prod
```

**Root Directory**: `/`

#### Variáveis de Ambiente

```env
# Database (fornecido automaticamente pelo Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
JWT_SECRET=<generate-a-secure-random-string-here>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=production

# CORS (frontend URL)
FRONTEND_URL=https://qanto.com.br
```

### Opção 2: Render

1. Acesse [Render](https://render.com)
2. Crie um **Web Service**
3. Conecte ao repositório GitHub
4. Configure:
   - **Build Command**: `cd apps/backend && npm install && npx prisma generate && npm run build`
   - **Start Command**: `cd apps/backend && npx prisma migrate deploy && npm run start:prod`
   - **Root Directory**: `/`

### Opção 3: AWS EC2 / DigitalOcean

#### 1. Setup do Servidor

```bash
# Conectar via SSH
ssh user@your-server-ip

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositório
git clone https://github.com/seu-usuario/qanto.git
cd qanto
```

#### 2. Configurar Backend

```bash
cd apps/backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
nano .env  # Configure as variáveis

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Build
npm run build

# Iniciar com PM2
pm2 start dist/main.js --name qanto-backend
pm2 save
pm2 startup
```

#### 3. Configurar Nginx

```nginx
server {
    listen 80;
    server_name api.qanto.com.br;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Reiniciar Nginx
sudo systemctl restart nginx
```

#### 4. Configurar SSL com Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.qanto.com.br
```

---

## Banco de Dados

### Produção (PostgreSQL)

#### Railway/Render (Gerenciado)
- O banco é provisionado automaticamente
- Backups automáticos incluídos
- CONNECTION_STRING é fornecido

#### AWS RDS / DigitalOcean (Manual)

1. **Criar instância PostgreSQL 16**
2. **Configurar security group** (permitir acesso do backend)
3. **Criar database**:
   ```sql
   CREATE DATABASE qanto_production;
   ```

4. **Executar migrations**:
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/qanto_production" npx prisma migrate deploy
   ```

### Backups

#### Backup Manual

```bash
# Backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20260109.sql
```

#### Backup Automático (Cron)

```bash
# Adicionar ao crontab
crontab -e

# Backup diário às 3h da manhã
0 3 * * * pg_dump $DATABASE_URL > /backups/qanto_$(date +\%Y\%m\%d).sql
```

---

## Variáveis de Ambiente

### Frontend (Vercel)

```env
# API URL (obrigatório)
NEXT_PUBLIC_API_URL=https://api.qanto.com.br/api/v1
```

### Backend

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/qanto_production

# JWT Secret (gerar com: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=production

# CORS
FRONTEND_URL=https://qanto.com.br,https://www.qanto.com.br

# Optional: Geocoding API (se não usar Nominatim)
# GEOCODING_API_KEY=your-key
```

---

## Deploy Automático (CD)

### GitHub Actions (Já Configurado)

O repositório já possui CI configurado (`.github/workflows/ci.yml`):

- ✅ Lint e testes unitários
- ✅ Build backend e frontend
- ✅ Testes E2E com Playwright

### Adicionar CD ao Workflow

Para adicionar deploy automático, crie `.github/workflows/cd.yml`:

```yaml
name: CD

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/frontend
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Railway auto-deploy (conectar GitHub repo)
      # ou

      - name: Deploy to custom server via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/qanto
            git pull origin main
            cd apps/backend
            npm install
            npx prisma migrate deploy
            npm run build
            pm2 restart qanto-backend
```

### Secrets Necessários

Adicionar em **Settings > Secrets and variables > Actions**:

- `VERCEL_TOKEN`: Token da Vercel (Vercel Dashboard > Settings > Tokens)
- `VERCEL_ORG_ID`: ID da organização Vercel
- `VERCEL_PROJECT_ID`: ID do projeto Vercel
- `SERVER_HOST`: IP do servidor (se deploy manual)
- `SERVER_USER`: Usuário SSH
- `SSH_PRIVATE_KEY`: Chave privada SSH

---

## Monitoramento

### Logs

#### Vercel (Frontend)
- Logs disponíveis no painel da Vercel
- Runtime logs em **Deployments > Logs**

#### Railway (Backend)
- Logs em tempo real no painel
- `railway logs` via CLI

#### PM2 (Backend Manual)
```bash
# Ver logs
pm2 logs qanto-backend

# Monitoramento
pm2 monit
```

### Health Checks

#### Backend Health Endpoint

Já existe em `/health`:

```bash
curl https://api.qanto.com.br/health
# Resposta: {"status": "ok"}
```

### Alertas

Configure alertas para:
- **Uptime**: UptimeRobot, Pingdom
- **Erros**: Sentry, Bugsnag
- **Performance**: New Relic, Datadog

---

## Rollback

### Vercel (Frontend)

1. Acesse **Deployments**
2. Encontre o deploy anterior
3. Clique em **⋯ > Promote to Production**

### Railway (Backend)

1. Acesse **Deployments**
2. Selecione deployment anterior
3. Clique em "Redeploy"

### PM2 (Backend Manual)

```bash
# Reverter para commit anterior
git reset --hard HEAD~1
cd apps/backend
npm install
npx prisma migrate deploy
npm run build
pm2 restart qanto-backend
```

---

## Checklist de Deploy

### Pré-Deploy

- [ ] Todas as migrations foram testadas
- [ ] Variáveis de ambiente configuradas
- [ ] Testes E2E passando
- [ ] Build local funciona
- [ ] Dados de seed prontos (se necessário)

### Deploy

- [ ] Backend deployed e funcionando
- [ ] Migrations executadas
- [ ] Frontend deployed
- [ ] Variáveis de ambiente verificadas
- [ ] Health checks passando

### Pós-Deploy

- [ ] Testar fluxos principais
- [ ] Verificar logs por erros
- [ ] Monitorar performance
- [ ] Backup do banco realizado
- [ ] Documentação atualizada

---

## Troubleshooting

### Frontend não consegue se conectar ao Backend

1. Verifique `NEXT_PUBLIC_API_URL`
2. Verifique CORS no backend
3. Confirme que backend está rodando

### Migrations falhando

```bash
# Ver status
npx prisma migrate status

# Resetar (CUIDADO: apaga dados)
npx prisma migrate reset

# Aplicar migrations pendentes
npx prisma migrate deploy
```

### Backend crashando

```bash
# Ver logs
pm2 logs qanto-backend --lines 100

# Restart
pm2 restart qanto-backend

# Ver uso de memória
pm2 monit
```

---

## Contato e Suporte

Para problemas ou dúvidas sobre deploy:
- Abra uma issue no GitHub
- Consulte a documentação do NestJS e Next.js
- Verifique os logs da plataforma de deploy

---

**Última atualização**: 09/01/2026
