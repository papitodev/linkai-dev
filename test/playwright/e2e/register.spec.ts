import { test, expect } from '@playwright/test';

function randomUser() {
  const rand = Math.floor(Math.random() * 100000);
  return {
    name: `Usuário Teste ${rand}`,
    username: `testuser${rand}`,
    email: `test${rand}@mail.com`,
    password: 'pwd12345',
  };
}

test.describe('Cadastro', () => {
  test.only('deve cadastrar novo usuário com sucesso', async ({ page }) => {
    const user = randomUser();
    await page.goto('http://localhost:8080/cadastro');
    await page.getByPlaceholder('Como você gostaria de ser chamado?').fill(user.name);
    await page.getByPlaceholder('Escolha um @username único (ex: superdev_123)').fill(user.username);
    await page.getByPlaceholder('Seu melhor e-mail para receber novidades!').fill(user.email);
    await page.getByPlaceholder('Crie uma senha segura e secreta').fill(user.password);
    await page.getByPlaceholder('Repita sua senha para garantir!').fill(user.password);
    await page.getByRole('button', { name: /criar conta/i }).click();

    // Espera redirecionamento para dashboard ou mensagem de sucesso
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('text=Bem-vindo')).toBeVisible();
  });
}); 