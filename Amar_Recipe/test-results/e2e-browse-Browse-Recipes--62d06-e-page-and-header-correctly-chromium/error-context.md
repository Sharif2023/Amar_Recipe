# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\browse.spec.js >> Browse Recipes >> should display the home page and header correctly
- Location: tests\e2e\browse.spec.js:8:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('header')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('header') with timeout 5000ms
  - waiting for locator('header')

```

```yaml
- navigation:
  - link "Amar Recipe Header Logo আমার রেসিপি":
    - /url: /
    - img "Amar Recipe Header Logo"
    - text: আমার রেসিপি
  - button "খাবারের ধরণ"
  - searchbox "অনুসন্ধান করুন মাংস, শাকসবজি, সালাত, পানীয় আইটেম..."
  - button "খুঁজুন"
  - link "রেসিপিগুলো দেখুন":
    - /url: /
  - link "নতুন রেসিপি যোগ করুন":
    - /url: /submit
  - link "আমাদের সম্পর্কে":
    - /url: /about
- paragraph: "ত্রুটি: ডাটাবেজের সাথে সংযোগ ব্যর্থ হচ্ছে"
- contentinfo:
  - link "Amar Recipe Header Logo আমার রেসিপি":
    - /url: /
    - img "Amar Recipe Header Logo"
    - text: আমার রেসিপি
  - list:
    - listitem:
      - link "রেসিপিগুলো দেখুন":
        - /url: /
    - listitem:
      - link "কিভাবে রেসিপি যোগ করবেন?":
        - /url: https://youtu.be/Cs7q1YvFoZs
    - listitem:
      - link "আমাদের সম্পর্কে":
        - /url: "#"
  - link:
    - /url: https://github.com/Sharif2023
    - img
  - link:
    - /url: https://www.instagram.com/shariful_islam10/
    - img
  - link:
    - /url: https://www.facebook.com/sharif.me2018/
    - img
  - link:
    - /url: https://www.youtube.com/@SHARIFsCODECORNER/
    - img
  - text: ©
  - link "Sharif Code Corner":
    - /url: https://engineer-sharif.infinityfreeapp.com/
  - text: 2025, All rights reserved.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Browse Recipes', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('should display the home page and header correctly', async ({ page }) => {
  9  |     // Assert title or header visibility
> 10 |     await expect(page.locator('header')).toBeVisible();
     |                                          ^ Error: expect(locator).toBeVisible() failed
  11 |     await expect(page).toHaveTitle(/আমার রেসিপি/);
  12 |   });
  13 | 
  14 |   test('should allow user to navigate to Browse Recipes', async ({ page }) => {
  15 |     // Navigate via link if exists or directly
  16 |     await page.goto('/browse-recipes');
  17 |     await expect(page.url()).toContain('/browse-recipes');
  18 |     
  19 |     // Check if search input exists
  20 |     const searchInput = page.locator('input[placeholder*="খুঁজুন"]');
  21 |     if (await searchInput.count() > 0) {
  22 |       await expect(searchInput).toBeVisible();
  23 |     }
  24 |   });
  25 | 
  26 |   test('should handle empty search results gracefully', async ({ page }) => {
  27 |     await page.goto('/browse-recipes');
  28 |     const searchInput = page.locator('input[placeholder*="খুঁজুন"]');
  29 |     if (await searchInput.count() > 0) {
  30 |       await searchInput.fill('NonExistentRecipeThatShouldNotBeFound');
  31 |       // Some text indicating no results should appear, or just no recipe cards
  32 |       // This is a basic negative scenario check
  33 |       // Adjust assertion based on actual app behavior
  34 |       await page.waitForTimeout(500); // Wait for debounce if any
  35 |     }
  36 |   });
  37 | });
  38 | 
```