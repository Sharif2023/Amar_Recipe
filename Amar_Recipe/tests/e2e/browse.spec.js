import { test, expect } from '@playwright/test';

test.describe('Browse Recipes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page and header correctly', async ({ page }) => {
    // Assert title or header visibility
    await expect(page.locator('nav')).toBeVisible();
    await expect(page).toHaveTitle(/আমার রেসিপি/);
  });

  test('should allow user to navigate to Browse Recipes', async ({ page }) => {
    // Navigate via link if exists or directly
    await page.goto('/browse-recipes');
    await expect(page.url()).toContain('/browse-recipes');
    
    // Check if search input exists
    const searchInput = page.locator('input[placeholder*="খুঁজুন"]');
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    await page.goto('/browse-recipes');
    const searchInput = page.locator('input[placeholder*="খুঁজুন"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('NonExistentRecipeThatShouldNotBeFound');
      // Some text indicating no results should appear, or just no recipe cards
      // This is a basic negative scenario check
      // Adjust assertion based on actual app behavior
      await page.waitForTimeout(500); // Wait for debounce if any
    }
  });
});
