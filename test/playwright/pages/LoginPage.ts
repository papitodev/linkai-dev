import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:8080/login');
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Seu @username incrível').fill(username);
    await this.page.getByPlaceholder('Digite sua senha secreta').fill(password);
    await this.page.getByRole('button', { name: /Entrar/i }).click();
  }

  async isLoggedIn(fullname: string) {
    // await expect(this.page).toHaveURL(/dashboard/);

    return this.page.getByRole('heading', { name: `Olá, ${fullname}! 👋` })
  }
}
