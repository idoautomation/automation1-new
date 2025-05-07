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
  //await activityLogs.lastWeekButton.waitFor();
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

  // Wait for at least one assessmentID div to appear
  await logsPage.assessmentIdDivs.first().waitFor({ state: 'attached' });

  // Scroll to the last div into view to force rendering of all divs
  const divs = await logsPage.assessmentIdDivs.all();
  if (divs.length === 0) {
    console.log('No divs with test-data-id="assessmentID" were found.');
    throw new Error('No assessment ID divs found.');
  }
  await divs[divs.length - 1].scrollIntoViewIfNeeded();
  await page.waitForTimeout(800); // Wait for lazy loading/rendering

  // All the divs again after the scrolling 
  const allDivs = await logsPage.assessmentIdDivs.all();
  console.log(`Found ${allDivs.length} matching divs after scrolling.`);

  // Searching for different Ids
  const differentIds = new Set<string>();

  for (let i = 0; i < allDivs.length && differentIds.size < 3; i++) {
    try {
      const span = allDivs[i].locator('span span');
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

  // Assertion that we found exactly 3 different IDs
  if (differentIds.size !== 3) {
    throw new Error(`Expected 3 different assessment IDs, but found ${differentIds.size}.`);
  }

  // Printing the different Ids
  console.log('Three Different assessment IDs:');
  Array.from(differentIds).forEach((id, index) => {
    console.log(`${index + 1}. ${id}`);
  });
}



