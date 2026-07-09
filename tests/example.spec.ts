import { test, expect } from '@playwright/test';

// 1. Basic navigation + title assertion
test('playwright site loads with correct title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});

// 2. Clicking a link and checking the URL changed
test('clicking Get Started navigates to docs', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*intro/);
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// 3. Filling a form and submitting (classic login practice)
test('login form with valid credentials succeeds', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.locator('#username').fill('tomsmith');
  await page.locator('#password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#flash')).toContainText('You logged into a secure area');
});

// 4. Testing a failure path (invalid login)
test('login form with invalid credentials shows error', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.locator('#username').fill('wronguser');
  await page.locator('#password').fill('wrongpass');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#flash')).toContainText('Your username is invalid');
});

// 5. Checking a checkbox and verifying its state
test('checkbox can be checked', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  const secondCheckbox = page.locator('#checkboxes input').nth(1);
  await expect(secondCheckbox).toBeChecked(); // starts checked
  await secondCheckbox.uncheck();
  await expect(secondCheckbox).not.toBeChecked();
});

//testing Playwright test
