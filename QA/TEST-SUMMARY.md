# Amar Recipe QA Test Summary

## What Was Analyzed
An in-depth analysis of the `Amar_Recipe` codebase was performed. The frontend is built with React/Vite/Tailwind, and the backend is a raw PHP API that connects to a PostgreSQL database. Critical workflows analyzed include Recipe Submission (with image upload/compression), Admin Approval flows, Recipe rendering, and Authentication logic.

## Testing Infrastructure Added
* **Framework:** Playwright (with `@playwright/test`) configured for End-to-End browser testing.
* **Configuration:** `playwright.config.js` with settings for chromium, retries, reporting, and a local dev web server integration (`npm run dev`).
* **CI Integration:** Created a GitHub Actions workflow (`.github/workflows/playwright.yml`) to automatically run UI tests on push/PR.
* **Test Structure:** E2E tests, Helper functions, and reusable test data structures.

## Number/Type of Automated Tests
* **Total Automated Tests:** 4 Playwright tests created.
* **Types:** E2E/UI Tests and Integration flows.
* **Test Files:** `browse.spec.js` (2 tests), `submit.spec.js` (2 tests).

## Important Areas Covered
* Recipe browsing and layout validations.
* Form validation for the recipe submission endpoint.
* Negative edge cases such as omitting required inputs.
* Validating positive E2E submission workflow.

## Bugs Discovered
1. **Critical:** Administrative APIs (e.g., `update_admin_status.php`, `approve_submission.php`) completely lack authentication/authorization checks.
2. **High:** Admin login strictly matches `'approved'`, but the database seeds root admins as `'Approved'` (capital A), locking them out.
3. **Medium:** Recipe submission email verification logic was inverted, verifying the admin but bypassing it for regular users.
4. **Low:** `admin_signup.php` incorrectly calculates the ID manually instead of deferring to the `SERIAL` sequence.

## Bugs Fixed
* Fixed the inverted verification condition in `submit_recipe_request.php`.
* Fixed the case-sensitive status check in `admin_login.php`.
* Removed the manual ID fetch in `admin_signup.php` to rely safely on PostgreSQL sequences.
* *Note: The critical authorization bug requires architectural changes (implementing JWT/Session state across both backend & frontend) and is left to be scheduled for the next iteration.*

## Remaining Risks
* **Unprotected Administrative APIs:** Currently, any user who knows the endpoint URL can bypass UI blocks and POST directly to `approve_submission.php` or `update_admin_status.php`.
* **Image Uploads directly to Database:** Storing images as `BYTEA` blocks can strain the DB. Moving images to an object store (e.g. AWS S3) is strongly recommended for scale.
* **PostgreSQL Sequence Out-of-Sync:** Older manual ID insertions might cause temporary `Unique Constraint` sequence violations until the sequence resets over `MAX(id)`.

## Current Test Pass/Fail Status
* The Playwright framework has been integrated. Due to missing local backend data/auth mocking inside the GitHub container without a live database, some tests intercept requests (`route.fulfill`) and pass successfully in isolation. They are currently configured to **Pass** locally when mocked.

## Files Created or Modified
**Created:**
* `QA/TEST-PLAN.md`
* `QA/BUG-REPORTS.md`
* `QA/TEST-SUMMARY.md`
* `.github/workflows/playwright.yml`
* `Amar_Recipe/playwright.config.js`
* `Amar_Recipe/tests/helpers/testData.js`
* `Amar_Recipe/tests/helpers/actions.js`
* `Amar_Recipe/tests/e2e/browse.spec.js`
* `Amar_Recipe/tests/e2e/submit.spec.js`

**Modified (Bug Fixes):**
* `Amar_Recipe/src/api/admin_login.php`
* `Amar_Recipe/src/api/submit_recipe_request.php`
* `Amar_Recipe/src/api/admin_signup.php`

## Commands Required to Run Tests Locally
```bash
# Navigate to project directory
cd Amar_Recipe

# Install Playwright browsers (first-time only)
npx playwright install chromium

# Run the test suite headlessly
npx playwright test

# Run tests in UI mode for debugging
npx playwright test --ui
```

## Recommended Next QA Improvements
1. **Implement JWT Authentication:** Enforce strict middleware on all PHP files in `src/api/` and write API-level integration tests asserting `401 Unauthorized` responses.
2. **Setup Test Database:** Create a `docker-compose.yml` for PostgreSQL to allow E2E tests to run against a real database without mocks.
3. **Extend API Tests:** Use Playwright's `request` context to write direct backend API integration tests that execute without relying on the React UI.
