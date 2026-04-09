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

async function showTermsAndConditionsPopup(page) {
  await openLogin(page);
  await page.evaluate(() => {
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

  await page.click('.termsText a');
  await expect(page.locator('#termsModal')).toBeVisible();
  await expect(page.locator('#termsCloseBtn')).toBeVisible();
  await expect(page.locator('#termsCloseAction')).toBeVisible();
  await page.click('#termsCloseBtn');
  await expect(page.locator('#termsModal')).toBeHidden();
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

  test('should display terms and conditions popup with close and cross icon', async ({ page }) => {
    await showTermsAndConditionsPopup(page);
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
