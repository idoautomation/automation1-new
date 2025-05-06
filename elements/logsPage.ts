import { Page, Locator } from '@playwright/test';

export class LogsPage {
  readonly page: Page;
  readonly assessmentIdDivs: Locator;
  readonly nextPageButton: Locator; // NEW!

  constructor(page: Page) {
    this.page = page;
    this.assessmentIdDivs = page.locator('div[test-data-id="assessmentID"]');
    this.nextPageButton = page.locator('[data-test-id="next-page"]'); // <-- Add the correct selector here!
  }
}
