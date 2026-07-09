import { test, expect } from '@playwright/test';

const BASE = 'https://the-internet.herokuapp.com';

// 1. Dropdown selection
test('select an option from a dropdown', async ({ page }) => {
  await page.goto(`${BASE}/dropdown`);
  await page.locator('#dropdown').selectOption('2');
  await expect(page.locator('#dropdown')).toHaveValue('2');
});

// 2. Waiting for a dynamically-loaded element (element appears after a spinner)
test('wait for dynamically loaded element', async ({ page }) => {
  await page.goto(`${BASE}/dynamic_loading/1`);
  await page.getByRole('button', { name: 'Start' }).click();
  // Playwright auto-waits, but this element is hidden then revealed
  await expect(page.locator('#finish')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#finish')).toContainText('Hello World!');
});

// 3. Handling a JavaScript alert dialog
test('accept a JS alert', async ({ page }) => {
  await page.goto(`${BASE}/javascript_alerts`);
  // register the handler BEFORE triggering the dialog
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});

// 4. Handling a confirm dialog by dismissing it
test('dismiss a JS confirm', async ({ page }) => {
  await page.goto(`${BASE}/javascript_alerts`);
  page.on('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toContainText('You clicked: Cancel');
});

// 5. Opening a new tab / window and switching to it
test('handle a new browser tab', async ({ page, context }) => {
  await page.goto(`${BASE}/windows`);
  // clicking opens a new tab; wait for the 'page' event on the context
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Click Here' }).click(),
  ]);
  await newPage.waitForLoadState();
  await expect(newPage.locator('h3')).toContainText('New Window');
});

// 6. Interacting with content inside an iframe
test('type into an iframe editor', async ({ page }) => {
  await page.goto(`${BASE}/iframe`);
  const frame = page.frameLocator('#mce_0_ifr');
  const body = frame.locator('#tinymce');
  await body.click();
  await body.fill('Automation testing is fun');
  await expect(body).toContainText('Automation testing is fun');
});

// 7. Hovering to reveal hidden content
test('hover reveals user info', async ({ page }) => {
  await page.goto(`${BASE}/hovers`);
  const firstFigure = page.locator('.figure').first();
  await firstFigure.hover();
  await expect(firstFigure.locator('.figcaption')).toBeVisible();
  await expect(firstFigure.locator('.figcaption')).toContainText('name: user1');
});

// 8. Asserting on a table's contents
test('read data from a table', async ({ page }) => {
  await page.goto(`${BASE}/tables`);
  const table = page.locator('#table1');
  // check a specific cell by row/column
  const firstRowLastName = table.locator('tbody tr').first().locator('td').first();
  await expect(firstRowLastName).toHaveText('Smith');
});