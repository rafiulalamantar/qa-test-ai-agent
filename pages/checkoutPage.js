const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.countryInput = page.locator('#country');
    this.agreeCheckboxLabel = page.locator('label[for="checkbox2"]');
    this.submitButton = page.locator('input[type="submit"]');
    this.successMessage = page.locator('text=Success');
  }

  async waitForCountryInput() {
    await this.countryInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillCountry(country) {
    await this.countryInput.fill(country);
  }

  async agreeTerms() {
    await this.agreeCheckboxLabel.click();
  }

  async submitOrder() {
    await this.submitButton.click();
  }

  async expectSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { CheckoutPage };