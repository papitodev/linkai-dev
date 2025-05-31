import { Page, expect } from '@playwright/test';

export class ToastComponent {
  constructor(private readonly page: Page) {}

  async haveTitle(title: string) {
    const notification = this.page.locator('.toast[role="status"]').filter({ hasText: title });
    await expect(notification).toBeVisible({ timeout: 10000 });

    return notification
  }
}
