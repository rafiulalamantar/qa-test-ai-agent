const { test, expect } = require('@playwright/test');

const baseURL = 'https://rahulshettyacademy.com/loginpagePractise/';
const redirectURL = 'https://rahulshettyacademy.com/angularpractice/shop';

async function openLogin(page) {
  await page.goto(baseURL);
  await page.waitForLoadState('domcontentloaded');
}

async function submitLogin(page, { username = '', password = '', role = 'admin', acceptTerms = true }) {
  await page.fill('#username', username);
  await page.fill('#password', password);

  if (role === 'user') {
    await page.locator('input[type="radio"][value="user"]').click();
    await expect(page.locator('#myModal .modal-content')).toBeVisible();
    await page.click('#okayBtn');
  } else {
    await page.locator('input[type="radio"][value="admin"]').click();
  }

  if (acceptTerms) {
    await page.locator('#terms').check();
  } else {
    await page.locator('#terms').uncheck().catch(() => {});
  }

  await page.click('#signInBtn');
}

async function expectLoginAlert(page, expected) {
  const alert = page.locator('.alert-danger');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(expected);
}

async function addIphoneAndCheckout(page) {
  await page.waitForSelector('.card', { timeout: 15000 });
  const cards = page.locator('.card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  let found = false;
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const text = await card.textContent();
    if (text.toLowerCase().includes('iphone x')) {
      await card.locator('button:has-text("Add")').click();
      found = true;
      break;
    }
  }

  expect(found).toBeTruthy();
  await page.click('a:has-text("Checkout")');
  await page.waitForLoadState('networkidle');

  const productRows = page.locator('tr:has-text("iphone X")');
  expect(await productRows.count()).toBe(1);

  await page.click('button:has-text("Checkout")');
  await page.waitForSelector('#country', { timeout: 15000 });
  await page.fill('#country', 'India');
  await page.locator('label[for="checkbox2"]').click();
  await page.click('input[type="submit"]');
  await page.waitForSelector('text=Success', { timeout: 15000 });
  const successText = await page.textContent('body');
  expect(successText.toLowerCase()).toContain('success');
}

test.describe('Login page scenarios', () => {
  test('should login successfully and complete purchase', async ({ page }) => {
    test.setTimeout(120000);
    await openLogin(page);
    await submitLogin(page, {
      username: 'rahulshettyacademy',
      password: 'Learning@830$3mK2',
      role: 'admin',
      acceptTerms: true,
    });

    await addIphoneAndCheckout(page);
  });

  test('should show error for empty username/password', async ({ page }) => {
    await openLogin(page);
    await page.click('#signInBtn');
    await expectLoginAlert(page, 'Empty username/password.');
  });

  test('should show error for old password usage', async ({ page }) => {
    await openLogin(page);
    await submitLogin(page, {
      username: 'rahulshettyacademy',
      password: 'learning',
      role: 'admin',
      acceptTerms: true,
    });
    await expectLoginAlert(page, 'Old password "learning" is no longer valid. Please use the new password "Learning@830$3mK2".');
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    await openLogin(page);
    await submitLogin(page, {
      username: 'baduser',
      password: 'badpass',
      role: 'admin',
      acceptTerms: true,
    });
    await expectLoginAlert(page, 'Incorrect username/password.');
  });

  test('should show user role modal and allow valid login as user', async ({ page }) => {
    await openLogin(page);
    await submitLogin(page, {
      username: 'rahulshettyacademy',
      password: 'Learning@830$3mK2',
      role: 'user',
      acceptTerms: true,
    });
    await page.waitForURL(redirectURL, { timeout: 15000 });
    await page.waitForSelector('.card', { timeout: 15000 });
    const cards = page.locator('.card');
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
