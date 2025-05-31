import { test as base } from '@playwright/test';

import { LoginPage } from '@/playwright/pages/LoginPage';

import { ToastComponent } from '@/playwright/pages/components/Toast';

type MyFixtures = {
  loginPage: LoginPage;
  toast: ToastComponent;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  toast: async ({ page }, use) => {
    const toast = new ToastComponent(page)
    await use(toast)
  }
});
