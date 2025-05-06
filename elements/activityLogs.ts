import { Page, Locator } from '@playwright/test';

export class ActivityLogsPage {
  readonly page: Page;
  readonly filterBarButton: Locator;
  readonly past3DaysOption: Locator;
  readonly typeSection: Locator;
  readonly advancedScenariosOption: Locator;
  readonly applyFiltersButton: Locator;
  readonly mainPageTitle: Locator;
  readonly lastWeekButton: Locator;
  readonly assessmentIdDivs: Locator;
  readonly nextPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterBarButton = page.locator('[data-test-id="filter-bar"] button');
    this.past3DaysOption = page.locator('[test-id="past-3-days"]');
    this.typeSection = page.locator('span:has-text("Type")').first();
    this.advancedScenariosOption = page.locator('[test-id="advanced-scenarios"]');
    this.applyFiltersButton = page.locator('[test-id="apply-filters"]');
    this.mainPageTitle = page.locator('[data-test-id="main-page-title"]');
    this.lastWeekButton = page.locator('[test-id="last-week"]');
    this.assessmentIdDivs = page.locator('[test-data-id="assessmentID"]'); // Adjust selector if needed
    this.nextPageButton = page.locator('[aria-label="Go to next page"]'); // Adjust selector if needed
  }
}