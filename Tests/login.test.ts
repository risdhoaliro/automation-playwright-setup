import { test, expect } from '@playwright/test';
import { setupLoginTests } from '@pages/Login/suite_login';
import data from '@general/data';
import { waitTime } from '@general/constants';
import { LoginPage } from '@/Pages/Login/key_login';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeAll(async () => {
        console.log('Starting Login Test Suite');
    });

    test.beforeEach(async ({ page }) => {
        loginPage = await setupLoginTests(page);
    });

    test.describe('Admin Login Tests', () => {
        test("Valid login redirects to dashboard admin", async ({ page }) => {
            await test.step('Fill valid admin credentials', async () => {
                const { userName, password } = data.LoginData.validDataAdmin;
                await loginPage.loginWithCredentials(userName, password);
            });

            await test.step('Verify success message and redirect', async () => {
                const successMessage = await loginPage.getSuccessMessageLogin();
                await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                await expect(page).toHaveURL(/map/, { timeout: waitTime.MEDIUM });
            });
        });

        test("Invalid login shows popup error message", async ({ page }) => {
            await test.step('Fill invalid credentials', async () => {
                const { userName, password } = data.LoginData.invalidData;
                await loginPage.loginWithCredentials(userName, password, true);
            });

            await test.step('Verify error message and no redirect', async () => {
                const errorLocator = await loginPage.getErrorMessage();
                await expect(errorLocator).toBeVisible();
                await expect(errorLocator).toHaveText(data.LoginData.errorMessageLogin, { timeout: waitTime.MEDIUM });
                await expect(page).toHaveURL(/login/, { timeout: waitTime.MEDIUM });
            });
        });
    });

    test.describe('Mitra Login Tests', () => {
        test("Valid login redirects to dashboard client", async ({ page }) => {
            await test.step('Fill valid mitra credentials', async () => {
                const { userName, password } = data.LoginData.validMitraData;
                await loginPage.loginWithCredentials(userName, password);
            });

            await test.step('Verify success message and redirect', async () => {
                const successMessage = await loginPage.getSuccessMessageLogin();
                await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                await expect(page).toHaveURL(/client/, { timeout: waitTime.MEDIUM });
            });
        });

        test("Invalid login shows popup error message", async ({ page }) => {
            await test.step('Fill invalid credentials', async () => {
                const { userName, password } = data.LoginData.invalidData;
                await loginPage.loginWithCredentials(userName, password, true);
            });

            await test.step('Verify error message and no redirect', async () => {
                const errorLocator = await loginPage.getErrorMessage();
                await expect(errorLocator).toBeVisible();
                await expect(errorLocator).toHaveText(data.LoginData.errorMessageLogin, { timeout: waitTime.MEDIUM });
                await expect(page).toHaveURL(/login/, { timeout: waitTime.MEDIUM });
            });
        });
    });

    test.afterAll(async () => {
        console.log('Login Test Suite completed.');
    });
}); 