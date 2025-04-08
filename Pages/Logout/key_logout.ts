import { Page, test, expect } from '@playwright/test';
import { BasePage } from '@fixtures/basePage';
import { LogoutElements } from './el_logout';
import { waitTime } from "../../General/constants";

export class LogoutPage extends BasePage {
    private readonly elements: LogoutElements;

    constructor(page: Page) {
        super(page);
        this.elements = new LogoutElements(page);
    }

    async clickLogout() {
        await test.step('Click Logout Button', async () => {
            await this.elements.logoutButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
            await this.elements.logoutButton.click();
        });
    }

    async verifyRedirectToLogin() {
        await test.step('Verify Redirect to Login Page', async () => {
            await this.page.waitForURL('**/login', { timeout: waitTime.MEDIUM });
            const currentUrl = this.page.url();
            expect(currentUrl).toContain('/login');
        });
    }

    async performLogout() {
        await test.step('Perform Complete Logout', async () => {
            await this.elements.logoutButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
            await this.clickLogout();
            await this.verifyRedirectToLogin();
        });
    }
}
