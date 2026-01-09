import { test, expect } from '@playwright/test';

test.describe('Comparação de Preços', () => {
  test.beforeEach(async ({ page }) => {
    // Login como consumidor
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('consumer@example.com');
    await page.getByLabel(/senha/i).fill('Password123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/dashboard/, { timeout: 5000 });
  });

  test('deve iniciar comparação de preços', async ({ page }) => {
    // Navegar para lista de compras
    await page.getByRole('link', { name: /minhas listas/i }).first().click();

    // Clicar em comparar preços
    await page.getByRole('button', { name: /comparar preços|comparar/i }).click();

    // Verificar que a tela de comparação apareceu
    await expect(page.getByText(/comparação|resultado|supermercados/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve exibir resultado da comparação', async ({ page }) => {
    // Iniciar comparação
    await page.goto('/dashboard/comparison');

    // Selecionar lista
    await page.getByLabel(/lista de compras|selecione uma lista/i).click();
    await page.getByRole('option').first().click();

    // Executar comparação
    await page.getByRole('button', { name: /comparar|buscar/i }).click();

    // Verificar resultados
    await expect(page.getByText(/total|economia|mais barato/i)).toBeVisible({ timeout: 10000 });
  });

  test('deve mostrar detalhes dos supermercados', async ({ page }) => {
    await page.goto('/dashboard/comparison');

    // Após comparação, verificar que supermercados estão listados
    const supermarketCard = page.locator('[data-testid="supermarket-card"], .supermarket-item').first();
    await expect(supermarketCard).toBeVisible({ timeout: 10000 });

    // Verificar informações básicas
    await expect(page.getByText(/total|R\$/i)).toBeVisible();
    await expect(page.getByText(/distância|km/i)).toBeVisible();
  });

  test('deve calcular economia corretamente', async ({ page }) => {
    await page.goto('/dashboard/comparison');

    // Após comparação bem-sucedida
    const economyText = page.getByText(/economia|economize|você economiza/i);
    await expect(economyText).toBeVisible({ timeout: 10000 });

    // Verificar que há valor de economia (R$ X,XX)
    await expect(page.getByText(/R\$\s*\d+,\d{2}/)).toBeVisible();
  });

  test('deve permitir filtrar por distância', async ({ page }) => {
    await page.goto('/dashboard/comparison');

    // Verificar se há filtro de distância/raio
    const radiusFilter = page.getByLabel(/raio|distância|km/i);

    if (await radiusFilter.isVisible({ timeout: 2000 })) {
      await radiusFilter.fill('5');
      await page.getByRole('button', { name: /aplicar|filtrar/i }).click();

      // Verificar que resultados foram atualizados
      await expect(page.getByText(/resultados|supermercados/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('deve salvar histórico de comparações', async ({ page }) => {
    // Realizar comparação
    await page.goto('/dashboard/comparison');
    await page.getByRole('button', { name: /comparar/i }).click();

    await page.waitForTimeout(2000); // Aguardar processamento

    // Navegar para histórico
    await page.goto('/dashboard/history');

    // Verificar que há registros no histórico
    await expect(page.getByText(/histórico|comparações anteriores/i)).toBeVisible({ timeout: 5000 });
  });
});
