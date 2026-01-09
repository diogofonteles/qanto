import { test, expect } from '@playwright/test';

test.describe('Listas de Compras', () => {
  test.beforeEach(async ({ page }) => {
    // Login como consumidor
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('consumer@example.com');
    await page.getByLabel(/senha/i).fill('Password123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/dashboard/, { timeout: 5000 });
  });

  test('deve exibir dashboard do consumidor', async ({ page }) => {
    await expect(page.getByText(/dashboard|minhas listas/i)).toBeVisible();
  });

  test('deve criar nova lista de compras', async ({ page }) => {
    // Clicar em criar nova lista
    await page.getByRole('button', { name: /nova lista|criar lista/i }).click();

    // Preencher nome da lista
    await page.getByLabel(/nome|título/i).fill('Compras de Janeiro');

    // Salvar
    await page.getByRole('button', { name: /criar|salvar/i }).click();

    // Verificar que foi criada
    await expect(page.getByText(/Compras de Janeiro/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve adicionar itens à lista', async ({ page }) => {
    // Abrir primeira lista ou criar uma nova
    await page.getByRole('link', { name: /ver lista|minhas listas/i }).first().click();

    // Adicionar item
    await page.getByRole('button', { name: /adicionar item|adicionar produto/i }).click();

    // Buscar e selecionar produto
    await page.getByLabel(/buscar produto|produto/i).fill('Arroz');
    await page.getByLabel(/quantidade/i).fill('2');

    // Salvar item
    await page.getByRole('button', { name: /adicionar|salvar/i }).click();

    // Verificar que item foi adicionado
    await expect(page.getByText(/arroz/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve remover item da lista', async ({ page }) => {
    // Navegar para uma lista com itens
    await page.getByRole('link', { name: /ver lista|minhas listas/i }).first().click();

    // Clicar no botão de remover do primeiro item
    const removeButton = page.getByRole('button', { name: /remover|excluir/i }).first();
    await removeButton.click();

    // Confirmar remoção se houver modal
    const confirmButton = page.getByRole('button', { name: /confirmar|sim/i });
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click();
    }

    // Verificar sucesso
    await expect(page.getByText(/removido|excluído/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve duplicar lista existente', async ({ page }) => {
    // Encontrar lista para duplicar
    await page.getByRole('button', { name: /duplicar|copiar/i }).first().click();

    // Verificar que nova lista foi criada com nome "Cópia de..."
    await expect(page.getByText(/cópia de|duplicada/i)).toBeVisible({ timeout: 5000 });
  });
});
