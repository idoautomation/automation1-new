import { expect, test } from '@playwright/test';
import { Login } from '../elements/login';
import { config } from '../config/config';
import { loginToApplication, navigateToActivityLogs, filterAdvancedScenarios, printThreeDifferentAssessmentIds } from '../helpers/function';

test.setTimeout(120000);

test.describe('Cymulate Login Test', () => {
  let login: Login;

  test.beforeEach(async ({ page }) => {
    try {
      console.log('Setting up before each test...');
      login = new Login(page);
      // Log in with the provided email and password
      await loginToApplication(page, login, config.email, config.password);
    } catch (error) {
      console.error('Error during setup:', error);
      throw error;
    }
  });

  test('A successful Login', async ({ page }) => {
    // Wait for the page to fully load
    await page.waitForLoadState('load');  
    // Assert if the Dashboard is visible 
    const isVisible = await page.locator('[data-testid="link-button-Dashboards"]').isVisible();
    console.log('Dashboard visibility:', isVisible);  
    expect(isVisible).toBe(true);  
  });

  test('Move to Activity Log URL', async ({ page }) => {
    console.log('Navigating to Activity Logs...');
    
    // Go to the Activity Logs page
    await navigateToActivityLogs(page);
  
    // Wait for the page to be fully loaded
    await page.waitForSelector('[data-test-id="main-page-title"]', { timeout: 180000 });
    
    const activityLogHeader = page.locator('[data-test-id="main-page-title"]');
    await expect(activityLogHeader).toBeVisible();
    
    // Check if the header text is "Activity Log"
    const headerText = await activityLogHeader.textContent();
    expect(headerText?.trim()).toBe('Activity Log');
  
    // Apply filters for "Advanced Scenarios"
    await filterAdvancedScenarios(page);
    
    // Print three different assessment IDs
    await printThreeDifferentAssessmentIds(page);
  });
  
  test.afterEach(async ({ page }) => {
    // Close the page after each test
    await page.close();
  });
});