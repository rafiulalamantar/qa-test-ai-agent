const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const {
  VALID_USERNAME,
  VALID_PASSWORD,
  OLD_PASSWORD,
  INVALID_USERNAME,
  INVALID_PASSWORD,
  DEFAULT_LOGIN_DATA,
} = require('../data/loginCredentials');

test.describe('Login page tests', () => {
  test('should login successfully and reach the shop page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(DEFAULT_LOGIN_DATA);
    await expect(page).toHaveURL(/.*shop/);
  });

  test('should show error for empty username/password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.submit();
    await loginPage.expectError('Empty username/password.');
  });

  test('should display terms and conditions popup with close and cross icon', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.showTermsModal();
  });

  test('should show error for old password usage', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login({
      username: VALID_USERNAME,
      password: OLD_PASSWORD,
      role: 'admin',
      acceptTerms: true,
    });
    await loginPage.expectError(
      'Old password "' + OLD_PASSWORD + '" is no longer valid. Please use the new password "' + VALID_PASSWORD + '".'
    );
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login({
      username: INVALID_USERNAME,
      password: INVALID_PASSWORD,
      role: 'admin',
      acceptTerms: true,
    });
    await loginPage.expectError('Incorrect username/password.');
  });

  test('should show user role modal and allow valid login as user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login({
      username: VALID_USERNAME,
      password: VALID_PASSWORD,
      role: 'user',
      acceptTerms: true,
    });
    await expect(page).toHaveURL(/.*shop/);
  });
});
