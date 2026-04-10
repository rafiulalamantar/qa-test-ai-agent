const { expect } = require('@playwright/test');

class ShopPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('.card');
    this.checkoutLink = page.locator('a:has-text("Checkout")');
    this.finalCheckoutButton = page.locator('button:has-text("Checkout")');
  }

  async addProduct(productName) {
    await this.page.waitForSelector('.card', { timeout: 15000 });
    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(0);

    let added = false;
    for (let index = 0; index < count; index += 1) {
      const card = this.productCards.nth(index);
      const text = await card.textContent();
      if (text.toLowerCase().includes(productName.toLowerCase())) {
        await card.locator('button:has-text("Add")').click();
        added = true;
        break;
      }
    }

    expect(added).toBeTruthy();
  }

  async proceedToCheckout() {
    await this.checkoutLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectProductInCart(productName) {
    const productRow = this.page.locator(`tr:has-text("${productName}")`);
    await expect(productRow).toHaveCount(1);
  }

  async completeCheckout() {
    await this.finalCheckoutButton.click();
    await this.page.waitForSelector('#country', { timeout: 15000 });
  }
}

module.exports = { ShopPage };