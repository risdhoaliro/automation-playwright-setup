import { Locator, Page } from "@playwright/test";

export class LoginElements {
    readonly userName: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.userName = page.locator('//input[@id="username"]');
        this.password = page.locator('//input[@id="password"]');
        this.loginButton = page.locator("//button[span[text()='Log In']]");
        this.successMessage = page.locator("//div[normalize-space(text())='Login success']");
    }
}
