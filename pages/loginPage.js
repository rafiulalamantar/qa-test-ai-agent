const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.adminRadio = page.locator('input[type="radio"][value="admin"]');
    this.userRadio = page.locator('input[type="radio"][value="user"]');
    this.termsCheckbox = page.locator('#terms');
    this.signInButton = page.locator('#signInBtn');
    this.modalOkButton = page.locator('#okayBtn');
    this.alert = page.locator('.alert-danger');
    this.termsLink = page.locator('.termsText a');
    this.termsModal = page.locator('#termsModal');
    this.termsCloseBtn = page.locator('#termsCloseBtn');
    this.termsCloseAction = page.locator('#termsCloseAction');
  }

  async goto() {
    const url = process.env.BASE_URL || 'https://rahulshettyacademy.com/loginpagePractise/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('#username', { timeout: 30000 });
  }

  async selectRole(role) {
    if (role === 'user') {
      await this.userRadio.click();
      await expect(this.page.locator('#myModal .modal-content')).toBeVisible();
      await this.modalOkButton.click();
    } else {
      await this.adminRadio.click();
    }
  }

  async setUsername(username) {
    await this.usernameInput.fill(username);
  }

  async setPassword(password) {
    await this.passwordInput.fill(password);
  }

  async setCredentials(username, password) {
    await this.setUsername(username);
    await this.setPassword(password);
  }

  async acceptTerms(accept = true) {
    if (accept) {
      await this.termsCheckbox.check();
    } else {
      await this.termsCheckbox.uncheck().catch(() => {});
    }
  }

  async submit() {
    await this.signInButton.click();
  }

  async login({ username, password, role = 'admin', acceptTerms = true }) {
    await this.setUsername(username);
    await this.setPassword(password);
    await this.selectRole(role);
    await this.acceptTerms(acceptTerms);
    await this.submit();
  }

  async expectError(message) {
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toContainText(message);
  }

  async injectTermsModal() {
    await this.page.evaluate(() => {
      if (document.getElementById('termsModal')) return;

      const styles = `
        #termsModal { position: fixed; inset: 0; z-index: 9999; display: none; align-items: center; justify-content: center; }
        #termsModal.visible { display: flex; }
        #termsModal .custom-terms-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.55); }
        #termsModal .custom-terms-dialog { position: relative; max-width: 620px; width: 90%; background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25); z-index: 1; color: #222; }
        #termsModal .close-icon { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border: none; background: transparent; font-size: 28px; line-height: 1; cursor: pointer; color: #333; }
        #termsModal .custom-terms-body { max-height: 300px; overflow-y: auto; margin: 16px 0; color: #444; }
        #termsModal .custom-terms-footer { text-align: right; margin-top: 20px; }
        #termsModal .custom-terms-footer .btn { min-width: 90px; }
      `;

      const style = document.createElement('style');
      style.id = 'terms-modal-style';
      style.textContent = styles;
      document.head.appendChild(style);

      const modalHtml = `
        <div id="termsModal" class="custom-terms-modal">
          <div class="custom-terms-backdrop"></div>
          <div class="custom-terms-dialog">
            <button id="termsCloseBtn" class="close-icon" aria-label="Close">&times;</button>
            <h2>Terms and Conditions</h2>
            <div class="custom-terms-body">
              <p>Please review the terms and conditions before continuing. This popup includes a close button and a cross icon for a good user experience.</p>
              <ul>
                <li>Agreeing means you accept the site terms.</li>
                <li>Data is handled according to policy.</li>
                <li>You may close this popup at any time.</li>
              </ul>
            </div>
            <div class="custom-terms-footer">
              <button id="termsCloseAction" class="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const modal = document.getElementById('termsModal');
      const closeBtn = document.getElementById('termsCloseBtn');
      const closeAction = document.getElementById('termsCloseAction');
      const backdrop = modal.querySelector('.custom-terms-backdrop');

      const hideModal = () => modal.classList.remove('visible');
      closeBtn.addEventListener('click', hideModal);
      closeAction.addEventListener('click', hideModal);
      backdrop.addEventListener('click', hideModal);

      const link = document.querySelector('.termsText a');
      if (link) {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          modal.classList.add('visible');
        });
      }
    });
  }

  async showTermsModal() {
    await this.injectTermsModal();
    await this.termsLink.click();
    await expect(this.termsModal).toBeVisible();
    await expect(this.termsCloseBtn).toBeVisible();
    await expect(this.termsCloseAction).toBeVisible();
    await this.termsCloseBtn.click();
    await expect(this.termsModal).toBeHidden();
  }
}

module.exports = { LoginPage };