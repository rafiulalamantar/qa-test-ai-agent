const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ShopPage } = require('../pages/shopPage');
const { DEFAULT_LOGIN_DATA } = require('../data/loginCredentials');

test.describe('Shop page tests', () => {
  test('should add iPhone X to cart and go to checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);

    await loginPage.goto();
    await loginPage.login(DEFAULT_LOGIN_DATA);

    await shopPage.addProduct('iphone x');
    await shopPage.proceedToCheckout();
    await shopPage.expectProductInCart('iphone X');
  });

  test('should proceed from shop to checkout page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);

    await loginPage.goto();
    await loginPage.login(DEFAULT_LOGIN_DATA);

    await shopPage.addProduct('iphone x');
    await shopPage.proceedToCheckout();
    await shopPage.completeCheckout();
  });
});