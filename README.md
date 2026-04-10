# QA Test AI Agent - Playwright Testing Project

A Playwright automation project using a page object model and XML-style suite runner.

## Overview

This project contains end-to-end Playwright tests for the `/loginpagePractise/` flow, including login, shop, and checkout page scenarios.

## Prerequisites

- Node.js 16 or higher
- npm package manager

## Installation

```bash
npm install
npx playwright install
```

## Project Structure

```
qa-test-ai-agent/
├── data/                  # Shared test data
├── pages/                 # Page object classes
│   ├── loginPage.js
│   ├── shopPage.js
│   └── checkoutPage.js
├── scripts/               # Custom helper scripts
│   └── run-suite.js
├── tests/                 # Playwright specs
│   ├── login.spec.js
│   ├── shop.spec.js
│   └── checkout.spec.js
├── suite.xml              # XML-style suite file
├── playwright.config.js   # Playwright configuration
├── package.json           # NPM scripts and dependencies
└── README.md              # Project documentation
```

## Commands

### Run all Playwright tests

```bash
npm test
```

### Run XML-style suite

```bash
npm run test:suite
```

### Run tests in UI mode

```bash
npm run test:ui
```

### Run tests in debug mode

```bash
npm run test:debug
```

### Run tests in headed mode

```bash
npm run test:headed
```

### Environment variables

This repository does not store login credentials in source control. Use a local `.env` file for sensitive values:

1. Copy `.env.example` to `.env`.
2. Add your credentials in `.env`.

Example `.env` content:

```env
VALID_USERNAME=your_username
VALID_PASSWORD=your_password
OLD_PASSWORD=your_old_password
```

The `.env` file is ignored by Git via `.gitignore`, so it will not be committed.

Then run the test command:

```bash
npm install
npm test
```

### View generated HTML report

```bash
npm run test:report
```

## Suite Runner

The root `suite.xml` file lists the spec files to run sequentially.
The script `scripts/run-suite.js` reads `suite.xml` and executes each listed spec with Playwright.

## Test Coverage

- `tests/login.spec.js` — login validation, role selection, terms popup
- `tests/shop.spec.js` — product add-to-cart and checkout navigation
- `tests/checkout.spec.js` — positive, negative, and edge checkout scenarios

## Configuration

The current `playwright.config.js` uses:
- `testDir: './tests'`
- `baseURL: 'https://rahulshettyacademy.com/loginpagePractise/'`
- Chromium browser in headed mode
- HTML reporting
- `trace: 'on-first-retry'`

## Notes

- Page objects are implemented under `pages/`
- Credential values are centralized in `data/loginCredentials.js`
- `npm run test:suite` runs the suite in the order defined by `suite.xml`

## License

ISC
