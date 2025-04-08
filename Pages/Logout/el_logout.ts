import { Locator, Page } from "@playwright/test";

export class LogoutElements {
    private readonly page: Page;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoutButton = page.locator('//*[@id="logout"]/span/span').last();
    }
}
