const { test, expect } = require('@playwright/test');

test('Login, add iPhone X, checkout and purchase', async ({ page }) => {
  test.setTimeout(120000);

  // Navigate to login page
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await page.waitForLoadState('domcontentloaded');

  // Fill login credentials
  await page.fill('input[name="username"]', 'rahulshettyacademy');
  await page.fill('input[name="password"]', 'Learning@830$3mK2');

  // Select Student from dropdown
  await page.selectOption('select', { label: 'Student' });

  // Check terms and conditions checkbox
  await page.locator('input[type="checkbox"]').first().check();

  // Submit login form
  await page.click('#signInBtn');

  // Wait for products page to load
  await page.waitForSelector('.card', { timeout: 15000 });

  // Confirm product page loaded
  const cards = page.locator('.card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  // Find and add iPhone X to cart
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

  // Go to cart page
  await page.click('a:has-text("Checkout")');
  await page.waitForLoadState('networkidle');

  // Verify the cart contains exactly one iPhone X row
  const productRows = page.locator('tr:has-text("iphone X")');
  expect(await productRows.count()).toBe(1);

  // Proceed to final checkout and delivery location
  await page.click('button:has-text("Checkout")');
  await page.waitForSelector('#country', { timeout: 15000 });
  await page.fill('#country', 'India');

  // Agree to terms and purchase
  await page.locator('label[for="checkbox2"]').click();
  await page.click('input[type="submit"]');

  // Verify success message
  await page.waitForSelector('text=Success', { timeout: 15000 });
  const successText = await page.textContent('body');
  expect(successText.toLowerCase()).toContain('success');
});