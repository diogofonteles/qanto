#!/bin/bash

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  qanto - Verificação de Configuração  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Verificar Node.js
echo -e "${BLUE}1. Node.js${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "   ${GREEN}✅ Instalado: $NODE_VERSION${NC}"
else
    echo -e "   ${RED}❌ Node.js não encontrado${NC}"
    ((ERRORS++))
fi
echo ""

# Verificar npm
echo -e "${BLUE}2. npm${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "   ${GREEN}✅ Instalado: v$NPM_VERSION${NC}"
else
    echo -e "   ${RED}❌ npm não encontrado${NC}"
    ((ERRORS++))
fi
echo ""

# Verificar node_modules
echo -e "${BLUE}3. Dependências${NC}"
if [ -d "node_modules" ]; then
    echo -e "   ${GREEN}✅ node_modules existe${NC}"

    # Verificar principais pacotes
    if [ -d "node_modules/nx" ]; then
        echo -e "   ${GREEN}✅ Nx instalado${NC}"
    else
        echo -e "   ${RED}❌ Nx não encontrado${NC}"
        ((ERRORS++))
    fi

    if [ -d "node_modules/@nestjs/core" ]; then
        echo -e "   ${GREEN}✅ NestJS instalado${NC}"
    else
        echo -e "   ${RED}❌ NestJS não encontrado${NC}"
        ((ERRORS++))
    fi

    if [ -d "node_modules/next" ]; then
        echo -e "   ${GREEN}✅ Next.js instalado${NC}"
    else
        echo -e "   ${RED}❌ Next.js não encontrado${NC}"
        ((ERRORS++))
    fi
else
    echo -e "   ${RED}❌ node_modules não encontrado${NC}"
    echo -e "   ${YELLOW}   Execute: npm install${NC}"
    ((ERRORS++))
fi
echo ""

# Verificar .env files
echo -e "${BLUE}4. Arquivos de Configuração${NC}"
if [ -f "apps/backend/.env" ]; then
    echo -e "   ${GREEN}✅ apps/backend/.env existe${NC}"

    # Verificar variáveis importantes
    if grep -q "DATABASE_URL" apps/backend/.env; then
        echo -e "   ${GREEN}✅ DATABASE_URL configurado${NC}"
    else
        echo -e "   ${YELLOW}⚠️  DATABASE_URL não encontrado${NC}"
        ((WARNINGS++))
    fi

    if grep -q "JWT_SECRET" apps/backend/.env; then
        echo -e "   ${GREEN}✅ JWT_SECRET configurado${NC}"
    else
        echo -e "   ${YELLOW}⚠️  JWT_SECRET não encontrado${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "   ${RED}❌ apps/backend/.env não existe${NC}"
    echo -e "   ${YELLOW}   Veja SETUP-LOCAL.md para criar${NC}"
    ((ERRORS++))
fi

if [ -f "apps/frontend/.env.local" ]; then
    echo -e "   ${GREEN}✅ apps/frontend/.env.local existe${NC}"
else
    echo -e "   ${YELLOW}⚠️  apps/frontend/.env.local não existe${NC}"
    echo -e "   ${YELLOW}   Crie com: NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1${NC}"
    ((WARNINGS++))
fi
echo ""

# Verificar PostgreSQL
echo -e "${BLUE}5. Serviços${NC}"
if command -v lsof &> /dev/null; then
    if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ PostgreSQL rodando na porta 5432${NC}"
    else
        echo -e "   ${YELLOW}⚠️  PostgreSQL NÃO está rodando${NC}"
        echo -e "   ${YELLOW}   Veja SETUP-LOCAL.md para iniciar${NC}"
        ((WARNINGS++))
    fi

    # Verificar Redis
    if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Redis rodando na porta 6379${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Redis não está rodando (opcional)${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  Não foi possível verificar portas (lsof não instalado)${NC}"
fi
echo ""

# Verificar Prisma Client
echo -e "${BLUE}6. Prisma${NC}"
if [ -d "node_modules/.prisma/client" ]; then
    echo -e "   ${GREEN}✅ Prisma Client gerado${NC}"
else
    echo -e "   ${YELLOW}⚠️  Prisma Client não gerado${NC}"
    echo -e "   ${YELLOW}   Execute: cd apps/backend && npx prisma generate${NC}"
    ((WARNINGS++))
fi

if [ -d "apps/backend/prisma/migrations" ]; then
    echo -e "   ${GREEN}✅ Migrations existem${NC}"
else
    echo -e "   ${YELLOW}⚠️  Nenhuma migration encontrada${NC}"
    ((WARNINGS++))
fi
echo ""

# Verificar builds
echo -e "${BLUE}7. Builds${NC}"
if [ -d "apps/backend/dist" ]; then
    echo -e "   ${GREEN}✅ Backend já foi buildado${NC}"
else
    echo -e "   ${YELLOW}⚠️  Backend não buildado (normal em dev)${NC}"
fi

if [ -d "apps/frontend/.next" ]; then
    echo -e "   ${GREEN}✅ Frontend já foi buildado${NC}"
else
    echo -e "   ${YELLOW}⚠️  Frontend não buildado (normal em dev)${NC}"
fi
echo ""

# Resumo
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           RESUMO DA VERIFICAÇÃO        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo configurado corretamente!${NC}"
    echo ""
    echo -e "${GREEN}Próximos passos:${NC}"
    echo -e "  1. Inicie o backend: ${BLUE}cd apps/backend && npm run start:dev${NC}"
    echo -e "  2. Inicie o frontend: ${BLUE}cd apps/frontend && npm run dev${NC}"
    echo -e "  3. Acesse: ${BLUE}http://localhost:3000${NC}"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
    echo -e "${GREEN}✅ Nenhum erro crítico!${NC}"
    echo ""
    echo -e "Você pode começar, mas verifique os avisos acima."
else
    echo -e "${RED}❌ Erros: $ERRORS${NC}"
    echo -e "${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
    echo ""
    echo -e "${RED}Corrija os erros antes de continuar.${NC}"
    echo -e "Veja: ${BLUE}SETUP-LOCAL.md${NC} para instruções detalhadas"
fi

echo ""
exit $ERRORS
