import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir a página de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Qanto/);
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();
  });

  test('deve realizar login com credenciais válidas', async ({ page }) => {
    await page.goto('/login');

    // Preencher formulário
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/senha/i).fill('Password123');

    // Submeter
    await page.getByRole('button', { name: /entrar/i }).click();

    // Verificar redirecionamento (aguardar navegação)
    await page.waitForURL(/dashboard|supermarket/, { timeout: 5000 });

    // Verificar que está logado
    await expect(page.getByText(/bem-vindo|dashboard/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');

    // Tentar login com credenciais erradas
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/senha/i).fill('WrongPassword');

    await page.getByRole('button', { name: /entrar/i }).click();

    // Verificar mensagem de erro
    await expect(page.getByText(/credenciais inválidas|erro/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve permitir cadastro de novo consumidor', async ({ page }) => {
    await page.goto('/register');

    // Gerar email único para evitar conflitos
    const uniqueEmail = `test-${Date.now()}@example.com`;

    // Preencher formulário
    await page.getByLabel(/nome/i).fill('João Silva');
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/senha/i).first().fill('Password123');
    await page.getByLabel(/confirmar senha/i).fill('Password123');

    // Submeter
    await page.getByRole('button', { name: /cadastrar|registrar/i }).click();

    // Verificar redirecionamento ou sucesso
    await expect(page.getByText(/bem-vindo|cadastro realizado|sucesso/i)).toBeVisible({ timeout: 10000 });
  });

  test('deve validar campos obrigatórios no cadastro', async ({ page }) => {
    await page.goto('/register');

    // Tentar submeter formulário vazio
    await page.getByRole('button', { name: /cadastrar|registrar/i }).click();

    // Verificar mensagens de validação
    await expect(page.getByText(/campo obrigatório|required/i).first()).toBeVisible();
  });

  test('deve permitir logout', async ({ page }) => {
    // Primeiro fazer login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/senha/i).fill('Password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForURL(/dashboard|supermarket/, { timeout: 5000 });

    // Fazer logout
    await page.getByRole('button', { name: /sair|logout/i }).click();

    // Verificar redirecionamento para login
    await page.waitForURL(/login/, { timeout: 5000 });
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();
  });
});
