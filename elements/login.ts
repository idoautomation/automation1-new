import { Page } from '@playwright/test';

export class Login {
  constructor(private page: Page) {}

  get email() {
    return this.page.locator('[test-id="email"]');
  }

  get password() {
    return this.page.locator('[test-id="password"]');
  }

  get signInButton() {
    return this.page.locator('span.MuiButton-label span.Text__StyledSpan-sc-a1dltl-1');
  }
}