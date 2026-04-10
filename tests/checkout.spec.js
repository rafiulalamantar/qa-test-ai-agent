const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ShopPage } = require('../pages/shopPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const { DEFAULT_LOGIN_DATA } = require('../data/loginCredentials');

test.describe('Checkout page tests', () => {
  test('should complete checkout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(DEFAULT_LOGIN_DATA);

    await shopPage.addProduct('iphone x');
    await shopPage.proceedToCheckout();
    await shopPage.completeCheckout();

    await checkoutPage.waitForCountryInput();
    await checkoutPage.fillCountry('India');
    await checkoutPage.agreeTerms();
    await checkoutPage.submitOrder();
    await checkoutPage.expectSuccess();
  });

  test('should allow checkout even without country input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(DEFAULT_LOGIN_DATA);

    await shopPage.addProduct('iphone x');
    await shopPage.proceedToCheckout();
    await shopPage.completeCheckout();

    await checkoutPage.waitForCountryInput();
    await checkoutPage.agreeTerms();
    await checkoutPage.submitOrder();
    await checkoutPage.expectSuccess();
  });

  test('should allow checkout even without agreeing terms', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(DEFAULT_LOGIN_DATA);

    await shopPage.addProduct('iphone x');
    await shopPage.proceedToCheckout();
    await shopPage.completeCheckout();

    await checkoutPage.waitForCountryInput();
    await checkoutPage.fillCountry('India');
    await checkoutPage.submitOrder();
    await checkoutPage.expectSuccess();
  });

  test('should complete checkout with edge case country input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(DEFAULT_LOGIN_DATA);

    await shopPage.addProduct('iphone x');
    await shopPage.proceedToCheckout();
    await shopPage.completeCheckout();

    await checkoutPage.waitForCountryInput();
    await checkoutPage.fillCountry('INDIA');
    await checkoutPage.agreeTerms();
    await checkoutPage.submitOrder();
    await checkoutPage.expectSuccess();
  });
});