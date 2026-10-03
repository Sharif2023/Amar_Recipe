# Bug Reports

## Bug ID: BUG-001
**Title:** Lack of Authentication/Authorization checks on Administrative APIs
**Severity:** Critical
**Priority:** High
**Environment:** Backend / API (`src/api/*`)
**Preconditions:** The server is running and accessible.
**Reproduction steps:**
1. Send a POST request to `update_admin_status.php` with `{ "id": 1, "status": "approved" }`.
2. Observe the response.
3. Send a POST request to `approve_submission.php` with a valid `id`.
4. Observe the response.
**Expected result:** The API should reject the request with `401 Unauthorized` or `403 Forbidden` because the requester is not an authenticated administrator.
**Actual result:** The API accepts the request and modifies the database, meaning anyone can approve admins or recipes.
**Evidence:** The PHP files (e.g. `update_admin_status.php`, `approve_submission.php`) do not check for any session, token, or authentication mechanism before executing database updates.
**Suggested fix:** Implement JWT or session-based authentication. Check the token in a centralized middleware or at the top of every administrative PHP file.

---

## Bug ID: BUG-002
**Title:** Admin Login fails for Root Admin due to case-sensitive status check
**Severity:** High
**Priority:** High
**Environment:** Backend / API (`admin_login.php`)
**Preconditions:** The PostgreSQL database is seeded with the Root Admin user (`status = 'Approved'`).
**Reproduction steps:**
1. Attempt to log in with the root admin credentials (`admin@amarrecipe.com` / `admin123`).
2. Observe the response.
**Expected result:** The admin should be successfully logged in, as their status is `'Approved'`.
**Actual result:** The login fails with "Invalid credentials" because `admin_login.php` strictly checks `if ($admin['status'] !== 'approved')`, and `'Approved' !== 'approved'`.
**Evidence:** `admin_login.php` line 23 uses strict string inequality for lowercase `'approved'`, while `schema_postgres.sql` inserts the root admin with capitalized `'Approved'`.
**Suggested fix:** Use `strtolower($admin['status']) !== 'approved'` in the condition.

---

## Bug ID: BUG-003
**Title:** Recipe Submission Verification logic is inverted
**Severity:** Medium
**Priority:** Medium
**Environment:** Backend / API (`submit_recipe_request.php`)
**Preconditions:** A user submits a recipe.
**Reproduction steps:**
1. Submit a recipe as a normal user (email `user@example.com`).
2. Observe the behavior regarding verification emails.
**Expected result:** The normal user should receive a verification email, and their submission is marked as `is_verified = FALSE` until they verify.
**Actual result:** The system bypasses verification for normal users (`$shouldVerify` evaluates to false) and immediately marks it as verified. Conversely, if the `organizerEmail` is the `ADMIN_EMAIL`, it requires verification.
**Evidence:** In `submit_recipe_request.php`, line 142 is `$shouldVerify = ($organizerEmail === ADMIN_EMAIL);`. It should likely be `!==`.
**Suggested fix:** Change the condition to `$shouldVerify = ($organizerEmail !== ADMIN_EMAIL);` so that admins bypass verification while regular users must verify.

---

## Bug ID: BUG-004
**Title:** Admin Signup uses manual ID calculation bypassing PostgreSQL SERIAL
**Severity:** Low
**Priority:** Medium
**Environment:** Backend / API (`admin_signup.php`)
**Preconditions:** An admin attempts to sign up.
**Reproduction steps:**
1. Sign up a new admin.
2. Note how the ID is generated.
**Expected result:** The database automatically assigns an ID using the `SERIAL` sequence.
**Actual result:** The PHP code calculates the next ID manually (`SELECT COALESCE(MAX(id), 0) + 1`), which can lead to race conditions if multiple signups occur simultaneously, and can desynchronize the sequence.
**Evidence:** `admin_signup.php` lines 42-43.
**Suggested fix:** Remove the manual ID calculation and omit `id` from the `INSERT` statement so PostgreSQL uses the default sequence.
