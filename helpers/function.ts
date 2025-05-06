// helpers/function.ts
import { expect, Page } from '@playwright/test';
import { Login } from '../elements/login';
import { ActivityLogsPage } from '../elements/activityLogs';
import { LogsPage } from '../elements/logsPage';
import { config } from '../config/config';

export async function loginToApplication(page: Page, login: Login, email: string, password: string) {
  await page.goto(config.loginUrl);
  await login.email.fill(email);
  await login.password.fill(password);

  const signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
  await signInButton.waitFor({ state: 'visible' });
  await signInButton.click();

  await page.waitForSelector('[data-testid="link-button-Dashboards"]', { timeout: 120000 });
}

export async function navigateToActivityLogs(page: Page) {
  const activityLogsPage = new ActivityLogsPage(page);
  await page.goto(config.activityLogsUrl, { timeout: 180000 });

  await activityLogsPage.mainPageTitle.waitFor({ state: 'visible', timeout: 180000 });
  await expect(activityLogsPage.mainPageTitle).toBeVisible();
}

export async function filterAdvancedScenarios(page: Page) {
  const activityLogs = new ActivityLogsPage(page);
  await page.waitForLoadState('load');

  console.log('Waiting for filter bar to load...');
  await activityLogs.filterBarButton.waitFor({ state: 'visible', timeout: 180000 });

  console.log('Opening filter panel...');
  await activityLogs.filterBarButton.click({ force: true });
  await activityLogs.lastWeekButton.waitFor();
  //await activityLogs.lastWeekButton.click({ force: true });

  console.log('Waiting for type section to be visible...');
  await expect(activityLogs.typeSection).toBeVisible({ timeout: 10000 });
  await activityLogs.typeSection.scrollIntoViewIfNeeded();

  console.log('Clicking type section...');
  await activityLogs.typeSection.click({ force: true });

  console.log('Clicking advanced scenarios option...');
  await activityLogs.advancedScenariosOption.scrollIntoViewIfNeeded();
  await activityLogs.advancedScenariosOption.click({ force: true });


  console.log('Confirming advanced scenarios selection...');
  await expect(page.getByRole('button', { name: 'Advanced Scenarios' })).toBeVisible();


  console.log('Applying filters...');
  await activityLogs.applyFiltersButton.click();
}



export async function printThreeDifferentAssessmentIds(page: Page) {
  const logsPage = new LogsPage(page);
  console.log('Looking for assessment ID elements...');

  // Set to store unique IDs
  const differentIds = new Set<string>();

  // Iterate over the pages
  for (let currentPage = 1; differentIds.size < 3; currentPage++) {
    console.log(`Looking for assessment IDs on page ${currentPage}...`);

    // Wait for the divs to be attached to the DOM
    await logsPage.assessmentIdDivs.first().waitFor({ state: 'attached' });

    // Get all divs with assessment IDs on the current page
    const divs = await logsPage.assessmentIdDivs.all();
    console.log(`Found ${divs.length} matching divs on page ${currentPage}.`);

    // Iterate over the divs to collect IDs
    for (let i = 0; i < divs.length && differentIds.size < 3; i++) {
      try {
        const span = divs[i].locator('span span');
        const idText = await span.textContent();

        if (idText) {
          const id = idText.trim();
          if (!differentIds.has(id)) {
            differentIds.add(id);
            console.log(`Found ID ${differentIds.size}: ${id}`);
          }
        }
      } catch (error) {
        console.warn(`Failed to process div ${i + 1}:`, error);
      }
    }

    // If we haven’t found enough IDs, click the next page button
    if (differentIds.size < 3) {
      const nextPageButton = logsPage.nextPageButton;

      // Check if the "Next" button is visible and enabled
      if (await nextPageButton.isVisible() && await nextPageButton.isEnabled()) {
        console.log('Clicking next page button...');
        await nextPageButton.click();
        await page.waitForTimeout(2000); // Wait for the next page to load
      } else {
        console.log('Next page button is not visible or not enabled. Stopping.');
        break; // Stop if no next page or it's not enabled
      }
    }
  }

  // Ensure we’ve found exactly 3 unique IDs, otherwise throw an error
  if (differentIds.size !== 3) {
    throw new Error(`Expected 3 different assessment IDs, but found ${differentIds.size}.`);
  }

  // Printing the three different IDs
  console.log('Three Different assessment IDs:');
  Array.from(differentIds).forEach((id, index) => {
    console.log(`${index + 1}. ${id}`);
  });
}
