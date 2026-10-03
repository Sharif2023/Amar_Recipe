export async function fillRecipeForm(page, data) {
  await page.fill('input[name="title"]', data.title);
  await page.selectOption('select[name="category"]', data.category);
  await page.fill('textarea[name="description"]', data.description);
  await page.fill('input[name="location"]', data.location);
  await page.fill('input[name="organizerName"]', data.organizerName);
  await page.fill('input[name="organizerEmail"]', data.organizerEmail);
  await page.fill('input[name="organizerAddress"]', data.organizerAddress);
  await page.fill('input[name="tags"]', data.tags);
}

export async function loginAsAdmin(page, credentials) {
  await page.goto('/adminlogin');
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/adminpanel');
}
