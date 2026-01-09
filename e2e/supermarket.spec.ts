import { test, expect } from '@playwright/test';

test.describe('Fluxo do Supermercado', () => {
  test.beforeEach(async ({ page }) => {
    // Login como supermercado
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('supermarket@example.com');
    await page.getByLabel(/senha/i).fill('Password123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/supermarket/, { timeout: 5000 });
  });

  test('deve exibir dashboard do supermercado', async ({ page }) => {
    await expect(page.getByText(/dashboard|painel/i)).toBeVisible();
    await expect(page.getByText(/produtos|meus produtos/i)).toBeVisible();
  });

  test('deve permitir adicionar novo produto', async ({ page }) => {
    await page.getByRole('link', { name: /produtos|adicionar produto/i }).click();

    // Preencher formulário de produto
    await page.getByLabel(/nome|produto/i).fill('Arroz Tio João 5kg');
    await page.getByLabel(/descrição/i).fill('Arroz branco tipo 1');
    await page.getByLabel(/preço/i).fill('25.90');
    await page.getByLabel(/código de barras|ean/i).fill('7891234567890');

    // Submeter
    await page.getByRole('button', { name: /adicionar|salvar|cadastrar/i }).click();

    // Verificar sucesso
    await expect(page.getByText(/produto adicionado|sucesso/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve listar produtos do supermercado', async ({ page }) => {
    await page.goto('/supermarket/dashboard');

    // Verificar que a lista de produtos está visível
    await expect(page.getByText(/produtos|lista de produtos/i)).toBeVisible();

    // Verificar se há pelo menos uma linha de produto (se houver produtos)
    const productsList = page.locator('[data-testid="products-list"], table, .product-item').first();
    await expect(productsList).toBeVisible({ timeout: 5000 });
  });

  test('deve permitir editar produto', async ({ page }) => {
    await page.goto('/supermarket/dashboard');

    // Clicar no primeiro produto para editar
    const editButton = page.getByRole('button', { name: /editar/i }).first();
    await editButton.click();

    // Alterar preço
    const priceInput = page.getByLabel(/preço/i);
    await priceInput.clear();
    await priceInput.fill('29.90');

    // Salvar
    await page.getByRole('button', { name: /salvar|atualizar/i }).click();

    // Verificar sucesso
    await expect(page.getByText(/atualizado|sucesso/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve permitir upload de CSV', async ({ page }) => {
    await page.goto('/supermarket/dashboard');

    // Procurar botão de upload
    const uploadButton = page.getByRole('button', { name: /upload|importar|csv/i });
    await expect(uploadButton).toBeVisible({ timeout: 5000 });

    // Nota: Teste de upload de arquivo real requer arquivo CSV de teste
    // Por enquanto, apenas verificamos que o botão existe
  });
});
