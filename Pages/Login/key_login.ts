import { Page } from '@playwright/test';
import { BasePage } from '@fixtures/basePage';
import { LoginElements } from './el_login';
import data from "@general/data";
import { expect } from "@playwright/test";
import { waitTime } from "@general/constants";

export class LoginPage extends BasePage {
    private readonly elements: LoginElements;

    constructor(page: Page) {
        super(page);
        this.elements = new LoginElements(page);
    }

    async gotoLoginPage() {
        let retryCount = 0;
        const maxRetries = 5;

        while (retryCount < maxRetries) {
            try {
                await this.page.goto("/");
                await this.elements.userName.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
                await this.elements.password.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
                await this.elements.loginButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
                return;
            } catch (error) {
                retryCount++;
                console.log(`Retry loading login page... (${retryCount}/${maxRetries})`);
                if (retryCount === maxRetries) {
                    throw new Error(`Failed to load login page after ${maxRetries} attempts`);
                }
                await this.page.waitForTimeout(waitTime.MEDIUM);
            }
        }
    }

    async loginWithCredentials(userName: string, password: string, isNegativeTest: boolean = false) {
        await this.elements.userName.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.password.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.loginButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });

        await this.elements.userName.fill(userName);
        await this.elements.password.fill(password);
        await this.elements.loginButton.click();

        if (!isNegativeTest) {
            let retryCount = 0;
            const maxRetries = 5;
            
            while (retryCount < maxRetries) {
                try {
                    await expect(this.page).toHaveURL(/map/, { timeout: waitTime.MEDIUM });
                    break;
                } catch (error) {
                    retryCount++;
                    if (retryCount === maxRetries) {
                        throw new Error(`Gagal redirect ke halaman map setelah ${maxRetries} percobaan`);
                    }
                    console.log(`Percobaan login ke-${retryCount} gagal, mencoba lagi...`);
                    await this.page.waitForTimeout(waitTime.MEDIUM);
                }
            }
        }
    }

    async getSuccessMessageLogin() {
        await this.elements.successMessage.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return this.elements.successMessage;
        // const message = this.page.getByText(data.LoginData.successMessageLogin);
        // await message.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        // return message;
    }

    async getErrorMessage() {
        const message = this.page.getByText(data.LoginData.errorMessageLogin);
        await message.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return message;
    }
}
