import { expect } from '@playwright/test'
import { test } from '@/playwright/base'

// import { writeFileSync } from 'fs'

test.describe('Login', () => {
    test('deve fazer login com sucesso', async ({ loginPage }) => {
        await loginPage.goto()
        await loginPage.login('papito', 'pwd123')
        await expect(await loginPage.isLoggedIn('Papito Fernando')).toBeVisible()
    })

    test('deve exibir mensagem de erro ao informar senha incorreta', async ({ loginPage, page }) => {
        await loginPage.goto()
        await loginPage.login('papito', 'abc123')

        // await page.waitForTimeout(2000)
        // writeFileSync('temp.html', await page.content());

        // da ruim pq mostra dois
        // const notification = page.getByRole('status');

        const notification = page.locator('.toast[role="status"]').filter({ hasText: 'Oops!' });
        await expect(notification).toBeVisible({ timeout: 10000 });

        await expect(notification).toContainText('Oops!');
        await expect(notification).toContainText('Algo deu errado com seu login');
    })

    test('deve exibir mensagem de erro ao informar usuário inexistente', async ({ loginPage, toast }) => {
        await loginPage.goto()
        await loginPage.login('noekziste', 'abc123')

        // const notification = page.locator('.toast[role="status"]').filter({ hasText: 'Oops!' });
        // await expect(notification).toBeVisible({ timeout: 10000 });

        await expect(await toast.haveTitle('Oops!')).toContainText('Algo deu errado com seu login');
    })

    test('deve alertar sobre campos obrigatórios quando usuário não é informado', async ({ loginPage, page }) => {
        await loginPage.goto()
        await loginPage.login('', 'abc123')

        const notification = page.locator('.toast[role="status"]').filter({ hasText: 'Campos obrigatórios' });
        await expect(notification).toBeVisible({ timeout: 10000 });

        await expect(notification).toContainText('Por favor, preencha todos os campos');
    })

    test('deve alertar sobre campos obrigatórios quando senha não é informada', async ({ loginPage, page }) => {
        await loginPage.goto()
        await loginPage.login('', 'abc123')

        const notification = page.locator('.toast[role="status"]').filter({ hasText: 'Campos obrigatórios' });
        await expect(notification).toBeVisible({ timeout: 10000 });

        await expect(notification).toContainText('Por favor, preencha todos os campos');
    })

    test('deve alertar sobre campos obrigatórios quando usuário e senha não são informados', async ({ loginPage, page }) => {
        await loginPage.goto()
        await loginPage.login('', '')

        const notification = page.locator('.toast[role="status"]').filter({ hasText: 'Campos obrigatórios' });
        await expect(notification).toBeVisible({ timeout: 10000 });

        await expect(notification).toContainText('Por favor, preencha todos os campos');
    })
})