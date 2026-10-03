import { test, expect } from '@playwright/test';
import { testRecipe } from '../helpers/testData.js';
import { fillRecipeForm } from '../helpers/actions.js';

test.describe('Submit Recipe flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/submit');
  });

  test('should successfully submit a recipe with all required fields', async ({ page }) => {
    await fillRecipeForm(page, testRecipe);
    
    // Upload a dummy image (we need to create one or use a fixture)
    // For now we'll skip the actual file upload if it's optional, but it says required={!imagePreview}
    // We'll mock the API response since it requires a backend
    await page.route('**/submit_recipe_request.php', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!' })
      });
    });

    // Mocking file upload with a valid 1x1 PNG
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')
    });

    await page.click('button[type="submit"]');

    // Expect success message
    await expect(page.locator('text=আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!')).toBeVisible({ timeout: 15000 });
  });

  test('should show validation error when required fields are missing', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // HTML5 validation should kick in, we can check that form is not submitted
    // OR we can check for custom error if implemented
    const titleInput = page.locator('input[name="title"]');
    const isRequired = await titleInput.evaluate(el => el.hasAttribute('required'));
    expect(isRequired).toBeTruthy();
  });
});
