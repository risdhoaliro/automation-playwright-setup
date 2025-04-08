import { Locator, Page, test } from "@playwright/test";
import { waitTime } from "../../General/constants";

export class ProfileElements {
    private readonly page: Page;

    // Navigation
    readonly profileMenu: Locator;

    // Profile Picture Section
    readonly chooseFileButton: Locator;
    readonly profilePicturePreview: Locator;
    readonly savePhotoProfileButton: Locator;

    // Password Change Section
    readonly currentPasswordInput: Locator;
    readonly newPasswordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly savePasswordButton: Locator;
    readonly changePasswordSection: Locator;

    // Profile Management Section
    readonly updateButton: Locator;
    readonly updateProfileModal: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly whatsappNumberInput: Locator;
    readonly telegramUsernameInput: Locator;
    readonly saveChangesButton: Locator;
    readonly cancelButton: Locator;

    // Profile Information Display
    async getDisplayedName() {
        const locator = this.page.locator("//input[@id='name']");
        await locator.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return locator;
    }

    async getDisplayedEmail() {
        const locator = this.page.locator("//input[@id='email']");
        await locator.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return locator;
    }

    async getDisplayedWhatsappNumber() {
        const locator = this.page.locator('//*[@id="whatsapp"]/input');
        await locator.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return locator;
    }

    async getDisplayedTelegramUsername() {
        const locator = this.page.locator('//*[@id="telegram"]/input');
        await locator.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return locator;
    }

    // Methods to get displayed values
    async getDisplayedNameValue() {
        return await test.step('Get Displayed Name Value', async () => {
            const element = await this.getDisplayedName();
            const value = await element.inputValue();
            return value.trim();
        });
    }

    async getDisplayedEmailValue() {
        return await test.step('Get Displayed Email Value', async () => {
            const element = await this.getDisplayedEmail();
            const value = await element.inputValue();
            return value.trim();
        });
    }

    async getDisplayedWhatsappValue() {
        return await test.step('Get Displayed WhatsApp Value', async () => {
            const element = await this.getDisplayedWhatsappNumber();
            const value = await element.inputValue();
            return value.trim();
        });
    }

    async getDisplayedTelegramValue() {
        return await test.step('Get Displayed Telegram Value', async () => {
            const element = await this.getDisplayedTelegramUsername();
            const value = await element.inputValue();
            return value.trim();
        });
    }

    // Activity Log Section
    readonly activityLogSection: Locator;
    readonly activityLogData: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.profileMenu = page.locator('//*[@id="__next"]/div/div/div[1]/div[2]/a/div');

        // Profile Picture Section
        this.chooseFileButton = page.locator('//span[contains(@class, "ant-typography") and normalize-space(text())="Choose file.."]');
        this.profilePicturePreview = page.locator("//span[contains(@class, 'ant-avatar') and contains(@class, 'ant-avatar-circle')]/img");
        this.savePhotoProfileButton = page.locator("//button[span[text()='Save']]");

        // Password Change Section
        this.currentPasswordInput = page.locator('//*[@id="form-change-password_currentPassword"]');
        this.newPasswordInput = page.locator('//*[@id="form-change-password_newPassword"]');
        this.confirmPasswordInput = page.locator('//*[@id="form-change-password_confirmPassword"]');
        this.savePasswordButton = page.getByText('Save Password');
        this.changePasswordSection = page.locator('//*[@id="contentContainer"]/main/div[3]/div[1]/h5');

        // Profile Management Section
        this.updateButton = page.locator("//span[contains(text(),'Update')]");
        this.updateProfileModal = page.locator("//h4[contains(text(),'Update Profile')]");
        this.nameInput = page.locator("//input[@id='dynamic_form_nest_item_name']");
        this.emailInput = page.locator("//input[@id='dynamic_form_nest_item_email']");
        this.whatsappNumberInput = page.locator("//input[@id='dynamic_form_nest_item_whatsapps_0_whatsapp']");
        this.telegramUsernameInput = page.locator("//input[@id='dynamic_form_nest_item_telegrams_0_telegram']")
        this.saveChangesButton = page.locator('button:has-text("Save Changes")');
        this.cancelButton = page.locator('button:has-text("Cancel")');

        // Activity Log Section
        this.activityLogSection = page.locator("//h5[normalize-space(text())='Activity Log']");
        this.activityLogData = page.locator("(//span[contains(@class,'ant-typography text-lg')])[1]");
    }
}
