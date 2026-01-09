# Testes E2E - Qanto

Testes end-to-end (E2E) usando Playwright para validar os fluxos principais da aplicação.

## Estrutura dos Testes

```
e2e/
├── auth.spec.ts              # Autenticação (login, registro, logout)
├── supermarket.spec.ts       # Fluxo do supermercado (produtos, dashboard)
├── shopping-list.spec.ts     # Listas de compras (criar, editar, duplicar)
├── price-comparison.spec.ts  # Comparação de preços (core feature)
└── README.md                 # Este arquivo
```

## Executando os Testes

### Pré-requisitos

1. Instalar dependências:
```bash
npm install
```

2. Instalar navegadores do Playwright:
```bash
npx playwright install chromium
```

3. Ter o ambiente de desenvolvimento rodando (backend + frontend):
```bash
npm run dev
```

### Comandos

```bash
# Executar todos os testes (headless)
npm run test:e2e

# Executar com interface visual
npm run test:e2e:ui

# Executar com navegador visível
npm run test:e2e:headed

# Ver relatório dos últimos testes
npm run test:e2e:report
```

### Executar testes específicos

```bash
# Apenas testes de autenticação
npx playwright test auth

# Apenas testes de comparação de preços
npx playwright test price-comparison

# Executar um teste específico
npx playwright test auth.spec.ts -g "deve realizar login"
```

## Cobertura de Testes

### ✅ Implementado

1. **Autenticação** (`auth.spec.ts`)
   - Login com credenciais válidas e inválidas
   - Registro de novo consumidor
   - Validação de campos obrigatórios
   - Logout

2. **Supermercado** (`supermarket.spec.ts`)
   - Dashboard do supermercado
   - Adicionar novo produto
   - Listar produtos
   - Editar produto
   - Upload de CSV

3. **Listas de Compras** (`shopping-list.spec.ts`)
   - Dashboard do consumidor
   - Criar nova lista
   - Adicionar itens
   - Remover itens
   - Duplicar lista

4. **Comparação de Preços** (`price-comparison.spec.ts`)
   - Iniciar comparação
   - Exibir resultado da comparação
   - Mostrar detalhes dos supermercados
   - Calcular economia
   - Filtrar por distância
   - Histórico de comparações

## Integração com CI/CD

Os testes E2E são executados automaticamente no GitHub Actions em cada push/PR:

1. Build do backend e frontend
2. Setup do banco de dados PostgreSQL
3. Start dos serviços
4. Execução dos testes E2E
5. Upload do relatório como artifact

Ver `.github/workflows/ci.yml` para mais detalhes.

## Boas Práticas

1. **Seletores**: Usar preferencialmente `getByRole`, `getByLabel`, `getByText`
2. **Esperas**: Usar `waitForURL`, `waitForTimeout` apenas quando necessário
3. **Isolamento**: Cada teste deve ser independente
4. **Dados de teste**: Usar emails únicos com timestamp para evitar conflitos
5. **Assertions**: Sempre adicionar timeout em assertions que dependem de rede

## Debugging

```bash
# Modo debug (pausa automática em falhas)
npx playwright test --debug

# Abrir Playwright Inspector
npx playwright test --headed --debug

# Ver trace de um teste específico
npx playwright show-trace trace.zip
```

## Próximos Passos

- [ ] Adicionar testes de performance
- [ ] Implementar testes de acessibilidade
- [ ] Adicionar testes mobile (viewport)
- [ ] Testes de diferentes navegadores (Firefox, Safari)
- [ ] Visual regression testing
