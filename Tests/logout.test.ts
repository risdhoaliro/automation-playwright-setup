import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/Login/key_login';
import { LogoutPage } from '@pages/Logout/key_logout';
import { setupLogoutTests } from '@pages/Logout/suite_logout';

test.describe('Logout Tests', () => {
    let loginPage: LoginPage;
    let logoutPage: LogoutPage;

    test.beforeEach(async ({ page }) => {
        const setup = await setupLogoutTests(page);
        loginPage = setup.loginPage;
        logoutPage = setup.logoutPage;
    });

    test('should successfully logout', async () => {
        await test.step('Click Logout Button', async () => {
            await logoutPage.clickLogout();
        });

        await test.step('Verify Redirect to Login Page', async () => {
            await logoutPage.verifyRedirectToLogin();
        });
    });

    test.afterEach(async () => {
        console.log('Logout Test completed');
    });
});
