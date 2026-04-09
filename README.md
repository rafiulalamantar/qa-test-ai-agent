# QA Test AI Agent - Playwright Testing Project

A comprehensive testing automation project using [Playwright](https://playwright.dev/) for end-to-end testing across multiple browsers.

## Overview

This project provides a robust setup for automated web testing with Playwright, supporting Chromium, Firefox, and WebKit browsers with JavaScript.

## Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

## Installation

1. Install project dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
qa-test-ai-agent/
├── tests/                  # Test files
│   └── example.spec.js    # Sample test file
├── playwright.config.js   # Playwright configuration
├── package.json          # Project dependencies
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### View test report
```bash
npm run test:report
```

## Configuration

### Playwright Config (`playwright.config.ts`)

The configuration includes:
- **Test directory**: `./tests`
- **Browsers**: Chromium, Firefox, WebKit
- **Reporter**: HTML report
- **Base URL**: http://localhost:3000 (configurable)
- **Parallel execution**: Enabled by default
- **Web Server**: Optional integration for local dev server

Configure the `baseURL` in `playwright.config.js` to match your application's URL.

## Writing Tests

Tests follow Playwright's standard format. Example:

```javascript
const { test, expect } = require('@playwright/test');

test('example test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Expected Title/);
});
```

## Key Features

- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Parallel test execution
- ✅ HTML test reports
- ✅ UI mode for debug
- ✅ JavaScript support
- ✅ Trace recording for failed tests

## Tips

- Use `--headed` flag to see the browser while tests run
- Use `--debug` flag to step through tests interactively
- Check `playwright-report/` directory for detailed results
- Tests run in parallel by default for faster execution

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

## License

ISC
