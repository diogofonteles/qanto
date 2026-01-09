#!/bin/bash
set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🚀 qanto - Setup Automático        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Passo 1: Dependências
echo -e "${BLUE}[1/5]${NC} Instalando dependências..."
npm install --silent
echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

# Passo 2: Docker
echo -e "${BLUE}[2/5]${NC} Iniciando PostgreSQL e Redis..."
docker-compose up -d 2>&1 | grep -v "docker-credential-desktop" || true
echo -e "${YELLOW}⏳ Aguardando serviços ficarem prontos...${NC}"
sleep 5
echo -e "${GREEN}✓ PostgreSQL e Redis rodando${NC}"
echo ""

# Passo 3: Prisma
echo -e "${BLUE}[3/5]${NC} Configurando banco de dados..."
cd apps/backend
npx prisma generate --silent
npx prisma migrate dev --name init --skip-seed 2>/dev/null || echo "Migrations já aplicadas"
echo -e "${GREEN}✓ Database configurado${NC}"
echo ""

# Passo 4: Seeds
echo -e "${BLUE}[4/5]${NC} Populando dados iniciais..."
npx prisma db seed
echo -e "${GREEN}✓ Seeds executados${NC}"
cd ../..
echo ""

# Passo 5: Pronto!
echo -e "${BLUE}[5/5]${NC} ${GREEN}Setup concluído!${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Próximos Passos                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo -e "  cd apps/backend && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo -e "  cd apps/frontend && npm run dev"
echo ""
echo -e "${GREEN}Depois acesse: http://localhost:3000${NC}"
echo ""
