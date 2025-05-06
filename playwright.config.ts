// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // Set global timeout to 60 seconds for all tests
  projects: [
    {
      name: 'Cymulate Login Tests',
      testDir: './tests',  // Ensure this matches the directory where your test files are
      use: {
        headless: true,  // Run the tests headless by default
      },
    },
  ],
});
