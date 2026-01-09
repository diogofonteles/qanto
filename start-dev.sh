#!/bin/bash

echo "🚀 qanto - Setup Local Development"
echo "===================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

echo "📋 Verificando serviços necessários..."
echo ""

# Verificar PostgreSQL
if check_port 5432; then
    echo -e "${GREEN}✅ PostgreSQL está rodando na porta 5432${NC}"
else
    echo -e "${RED}❌ PostgreSQL NÃO está rodando${NC}"
    echo ""
    echo "Opções para iniciar PostgreSQL:"
    echo ""
    echo "🐳 Opção 1 - Com Docker:"
    echo "   docker run --name qanto-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=qanto -p 5432:5432 -d postgres:16"
    echo ""
    echo "📦 Opção 2 - Com Docker Compose:"
    echo "   docker-compose up -d postgres"
    echo ""
    echo "💻 Opção 3 - PostgreSQL Local:"
    echo "   Instale PostgreSQL e crie o banco 'qanto'"
    echo ""
fi

# Verificar Redis
if check_port 6379; then
    echo -e "${GREEN}✅ Redis está rodando na porta 6379${NC}"
else
    echo -e "${YELLOW}⚠️  Redis NÃO está rodando (opcional para MVP)${NC}"
    echo ""
    echo "Para iniciar Redis:"
    echo ""
    echo "🐳 Com Docker:"
    echo "   docker run --name qanto-redis -p 6379:6379 -d redis:7"
    echo ""
    echo "📦 Com Docker Compose:"
    echo "   docker-compose up -d redis"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Certifique-se que PostgreSQL está rodando"
echo "2. Execute as migrations:"
echo "   cd apps/backend && npx prisma migrate dev"
echo ""
echo "3. Execute os seeds:"
echo "   npx prisma db seed"
echo ""
echo "4. Inicie o backend (terminal 1):"
echo "   cd apps/backend && npm run start:dev"
echo ""
echo "5. Inicie o frontend (terminal 2):"
echo "   cd apps/frontend && npm run dev"
echo ""
echo "6. Acesse: http://localhost:3000"
echo ""
