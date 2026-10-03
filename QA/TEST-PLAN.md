# Amar Recipe - QA Test Plan & Strategy

## Phase 1: Project Analysis

### 1. What Can Realistically Be Tested
Based on a thorough inspection of the repository (`Amar_Recipe` containing a React frontend and PHP/PostgreSQL backend):
* **Public User Workflows:**
  * Browsing recipes (`/browse-recipes`), including search and category filtering.
  * Submitting a new recipe request (`/submit`) with image uploads and form validation.
  * Rating a recipe and viewing average ratings.
  * Reporting inappropriate recipes.
* **Admin Workflows:**
  * Admin Login and Authentication (`/adminlogin`).
  * Admin Signup/Registration (`/adminsignup`) and approval of admins.
  * Approving, rejecting, or deleting recipe submissions (`/submissionrequests`).
  * Managing approved recipes and viewing submission history.
  * Managing user reports and acting on them (`/reports`).
* **API Behavior:**
  * Endpoints for fetching, submitting, rating, reporting, and managing recipes.
  * Image upload handling and format validation.

### 2. Critical Workflows
* **End-to-End Recipe Submission:** A user submits a recipe -> Admin reviews and approves it -> Recipe is visible on the public Browse page.
* **Admin Authentication:** Secure login for administrators.
* **Recipe Rating & Reporting:** Ensuring user feedback and moderation tools function correctly.

### 3. APIs to be Tested
* `submit_recipe_request.php` (User submissions)
* `approve_submission.php` / `reject_submission.php` (Admin actions)
* `admin_login.php` (Authentication)
* `rate_recipe.php` & `report_recipe.php` (User interactions)
* `get_recipes.php` & `get_submission_requests.php` (Data fetching)

### 4. Highest Regression Risk Areas
* **Image Uploads & Compression:** The frontend compresses images before sending. The backend reads binary data into PostgreSQL. This flow is complex and prone to breaking on edge cases (large images, wrong formats).
* **Recipe State Transitions:** Moving a recipe from `pending` (in `submission_requests`) to `approved` (in `recipes`).
* **CORS & Authentication:** The API relies on strict CORS rules and session/cookie/token management for admin routes.

### 5. Edge Cases & Negative Scenarios
* Submitting recipes with missing required fields, extremely large files, or unsupported file formats (e.g., `.pdf` instead of images).
* XSS attempts in rich text areas (e.g., description, tags).
* Unauthorized access to admin APIs (calling `approve_submission.php` without being logged in).
* Rating a recipe with invalid values (e.g., > 5 or < 1).
* Duplicate recipe submissions.

### 6. Test Automation Strategy
* **Tooling:** **Playwright** with **TypeScript** for End-to-End (E2E) and Integration API testing.
* **Approach:**
  * **API Tests:** Verify the core PHP backend logic directly. This ensures that validation and database operations work independently of the UI.
  * **E2E UI Tests:** Cover critical user journeys (Browse -> Search, Submit Recipe, Admin Login -> Approve Recipe).
* **Environment:** Tests should be configurable via `.env` to point to a local development server or a staging backend.

---

## Phase 2: QA Strategy

### Priority Areas
1. **Critical End-to-End Workflows:** Recipe submission and admin approval flow.
2. **Authentication/Authorization:** Admin login and protection of administrative API endpoints.
3. **API Behavior & Input Validation:** Testing boundaries (e.g., rating constraints) and payload validation (required fields).
4. **Data Integrity:** Ensuring that when a recipe is approved, the image binary is correctly transferred from `submission_images` to `recipe_images`.

### Test Execution Plan
* **Setup:** Introduce `@playwright/test` to the frontend `Amar_Recipe` directory.
* **Test Structure:**
  * `tests/api/`: For headless API validation.
  * `tests/e2e/`: For browser-based workflow validation.
  * `tests/fixtures/`: For reusable test data and auth states.
* **Maintainability Guidelines:**
  * Use descriptive `test.describe()` and `test()` blocks.
  * Avoid `page.waitForTimeout()`; use Playwright's auto-waiting and web-first assertions (`expect(locator).toBeVisible()`).
  * Ensure tests are independent and clean up after themselves where possible.

### Deliverables
* Playwright test suite integrated into `Amar_Recipe`.
* `TEST-CASES.md` documenting the executed scenarios.
* `BUG-REPORTS.md` for any issues discovered during testing.
* GitHub Actions workflow (`.github/workflows/playwright.yml`).
