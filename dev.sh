#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Iniciando qanto em modo desenvolvimento...${NC}"
echo ""

# Verificar se docker está rodando
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${BLUE}📦 Iniciando PostgreSQL e Redis...${NC}"
    docker-compose up -d
    sleep 3
fi

echo -e "${GREEN}✓ Infraestrutura pronta${NC}"
echo ""
echo -e "${BLUE}Rodando backend e frontend...${NC}"
echo ""

# Rodar backend e frontend em paralelo
trap 'kill 0' EXIT

(cd apps/backend && npm run start:dev) &
(cd apps/frontend && npm run dev) &

wait
