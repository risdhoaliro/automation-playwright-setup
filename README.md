# Nearon Web Automation

This project is an automation testing suite for the Nearon web application using Playwright. It covers various testing features including login, logout, profile management, and Role-Based Access Control (RBAC).

## 🚀 Features

- Automated testing for Login functionality
- Automated testing for Logout functionality
- Automated testing for Profile management
- Automated testing for Role-Based Access Control (RBAC)
- Support for multiple browsers (Chrome, Firefox, Safari)
- Allure integration for reporting
- Screenshot and video capture for test failures
- Support for multiple environments (staging, production)

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Playwright
- Supported browsers (Chrome, Firefox, Safari)

## 🔧 Installation

1. Clone this repository:
```bash
git clone [REPOSITORY_URL]
cd automation-nearon-playwright
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install required browsers:
```bash
npx playwright install
```

## ⚙️ Configuration

This project uses environment variables for configuration. Create a `.env` file in the project root with the following configuration:

```env
ENV=staging  # or production
```

## 🧪 Running Tests

### Running all tests
```bash
npm test
# or
yarn test
```

### Running tests by environment
```bash
# For staging environment
ENV=staging npx playwright test

# For production environment
ENV=production npx playwright test
```

### Running specific tests
```bash
# For staging environment
ENV=staging npx playwright test [test_file_name].test.ts

# For production environment
ENV=production npx playwright test [test_file_name].test.ts
```

### Running tests with specific browsers
```bash
# For staging environment
ENV=staging npx playwright test --project="Nearon In Chrome"
ENV=staging npx playwright test --project="Nearon In Firefox"
ENV=staging npx playwright test --project="Nearon In Safari"

# For production environment
ENV=production npx playwright test --project="Nearon In Chrome"
ENV=production npx playwright test --project="Nearon In Firefox"
ENV=production npx playwright test --project="Nearon In Safari"
```

### Running tests with multiple workers
```bash
# Run tests with 4 workers (parallel execution)
ENV=staging npx playwright test Tests/ --workers=4

# Run tests with maximum workers (based on CPU cores)
ENV=staging npx playwright test Tests/ --workers=max

# Run tests with specific number of workers for production
ENV=production npx playwright test Tests/ --workers=4
```

## 📊 Reporting

This project uses Allure for reporting. To view reports:

1. Generate report:
```bash
npx allure generate allure-results
```

2. Open report:
```bash
npx allure open allure-report
```

## 📁 Project Structure

```
automation-nearon-playwright/
├── Fixtures/           # Base testing files
├── Pages/             # Page objects for each page
│   ├── Login/
│   ├── Logout/
│   ├── Profile/
│   └── Role Bassed Access Control/
├── Tests/             # Test files
├── General/           # Data and constant files
├── allure-results/    # Allure test results
├── allure-report/     # Allure reports
└── playwright.config.ts # Playwright configuration
```

## ⚠️ Important Notes

- Ensure all required browsers are installed
- For debugging, slowMo is set to 1000ms
- Screenshots are captured on test failures
- Videos are saved for failed tests
- Global timeout is set to 60 seconds
- Ensure environment (ENV) is set before running tests
- Default environment is staging if not set

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

[License used]

## 📞 Contact

risdho@synapsis.id