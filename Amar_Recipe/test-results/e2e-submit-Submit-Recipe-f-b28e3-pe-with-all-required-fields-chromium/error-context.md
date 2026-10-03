# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\submit.spec.js >> Submit Recipe flow >> should successfully submit a recipe with all required fields
- Location: tests\e2e\submit.spec.js:10:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('text=আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!') with timeout 15000ms
  - waiting for locator('text=আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!')

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
- banner:
  - heading "আপনার রেসিপি শেয়ার করুন" [level=1]
  - paragraph: সহজেই আপনার রেসিপিটি সকলের মাঝে পৌঁছে দিন।
- heading "প্রাথমিক তথ্য" [level=3]
- text: রেসিপির নাম *
- textbox "মজাদার খাবারের নাম...": Test Recipe Auto 1790863103090
- text: রেসিপির ধরন *
- combobox:
  - option "মাংস"
  - option "মাছ"
  - option "ডিম"
  - option "দুগ্ধজাত"
  - option "শাকসবজি দিয়ে মাছ/মাংস/অন্যান্য"
  - option "শাকসবজি"
  - option "ভর্তা"
  - option "সালাদ"
  - option "আচার"
  - option "স্যুপ"
  - option "পানীয়"
  - option "ডেজার্ট, মিষ্টান্ন"
  - option "রাইস আইটেম"
  - option "হালকা খাবার/ ফাস্টফুড" [selected]
  - option "সস/মশলা"
  - option "বাঙ্গালী"
  - option "চাইনিজ্জ"
  - option "ইতালীয়ান"
- heading "রান্নার প্রক্রিয়া ও ছবি" [level=3]
- text: বানানোর প্রক্রিয়া *
- textbox "ধাপে ধাপে রান্নার পদ্ধতি লিখুন...": This is a test recipe description used for automated testing. It includes multiple steps to ensure validation passes.
- text: রেসিপির ছবি *
- img "Preview"
- img
- text: ছবি পরিবর্তন করুন
- button "Preview ছবি পরিবর্তন করুন"
- paragraph: "আবদ্ধ ফাইল: test.png"
- heading "অন্যান্য তথ্য" [level=3]
- text: অঞ্চল বা রেসিপির উৎপত্তিস্থল *
- 'textbox "উদা: ঢাকা, চট্টগ্রাম, বা দেশের নাম..."': Dhaka
- text: রান্নার সন্ধান কীভাবে পেলেন?
- combobox:
  - option "পরিবার"
  - option "বন্ধু-বান্ধব"
  - option "সোশ্যাল মিডিয়া"
  - option "রান্নার বই থেকে"
  - option "আমার নিজের"
  - option "অন্যান্য"
- heading "আপনার তথ্য" [level=3]
- text: আপনার নাম *
- textbox "নাম লিখুন...": Automated Tester
- text: ই-মেইল *
- textbox "example@mail.com": tester@example.com
- text: আপনার ঠিকানা *
- textbox "বাসা নম্বর, সড়ক, এলাকা...": 123 Test Street, QA City
- text: "ট্যাগ (শুরুতে # এবং শেষে ',')"
- 'textbox "#দেশি_খাবার, #সহজ_রান্না..."': "#test, #automation"
- text: রেফারেন্স লিংক (যদি থাকে)
- textbox "https://..."
- text: টিউটোরিয়াল ভিডিও লিংক
- textbox "https://youtube.com/..."
- text: আপনার মতামত
- textbox "ভিউয়ারদের জন্য কোনো বিশেষ বার্তা..."
- button "রেসিপিটি জমা দিন"
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
  2  | import { testRecipe } from '../helpers/testData.js';
  3  | import { fillRecipeForm } from '../helpers/actions.js';
  4  | 
  5  | test.describe('Submit Recipe flow', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto('/submit');
  8  |   });
  9  | 
  10 |   test('should successfully submit a recipe with all required fields', async ({ page }) => {
  11 |     await fillRecipeForm(page, testRecipe);
  12 |     
  13 |     // Upload a dummy image (we need to create one or use a fixture)
  14 |     // For now we'll skip the actual file upload if it's optional, but it says required={!imagePreview}
  15 |     // We'll mock the API response since it requires a backend
  16 |     await page.route('**/submit_recipe_request.php', route => {
  17 |       route.fulfill({
  18 |         status: 200,
  19 |         contentType: 'application/json',
  20 |         body: JSON.stringify({ success: true, message: 'আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!' })
  21 |       });
  22 |     });
  23 | 
  24 |     // Mocking file upload with a valid 1x1 PNG
  25 |     const fileInput = page.locator('input[type="file"]');
  26 |     await fileInput.setInputFiles({
  27 |       name: 'test.png',
  28 |       mimeType: 'image/png',
  29 |       buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')
  30 |     });
  31 | 
  32 |     await page.click('button[type="submit"]');
  33 | 
  34 |     // Expect success message
> 35 |     await expect(page.locator('text=আপনার রেসিপিটি সফলভাবে জমা দেওয়া হয়েছে!')).toBeVisible({ timeout: 15000 });
     |                                                                                ^ Error: expect(locator).toBeVisible() failed
  36 |   });
  37 | 
  38 |   test('should show validation error when required fields are missing', async ({ page }) => {
  39 |     // Try to submit empty form
  40 |     await page.click('button[type="submit"]');
  41 | 
  42 |     // HTML5 validation should kick in, we can check that form is not submitted
  43 |     // OR we can check for custom error if implemented
  44 |     const titleInput = page.locator('input[name="title"]');
  45 |     const isRequired = await titleInput.evaluate(el => el.hasAttribute('required'));
  46 |     expect(isRequired).toBeTruthy();
  47 |   });
  48 | });
  49 | 
```