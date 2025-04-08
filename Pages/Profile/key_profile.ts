import { Page } from '@playwright/test';
import { BasePage } from '@fixtures/basePage';
import { ProfileElements } from './el_profile';
import { expect, test } from "@playwright/test";
import data from "../../General/data";
import { waitTime } from "../../General/constants";

interface UpdateProfileData {
    name: string;
    email: string;
    whatsappNumber: string;
    telegramUsername: string;
}

export class ProfilePage extends BasePage {
    private readonly elements: ProfileElements;

    constructor(page: Page) {
        super(page);
        this.elements = new ProfileElements(page);
    }

    async gotoProfilePage() {
        await this.elements.profileMenu.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.profileMenu.click();
        await this.page.waitForURL('**/profile', { timeout: waitTime.MEDIUM });
    }

    // Profile Picture Methods
    async uploadProfilePicture(filePath: string) {
        await this.elements.chooseFileButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.elements.chooseFileButton.click()
        ]);
        await fileChooser.setFiles(filePath);
    }

    async savePhotoProfileButton() {
        const button = this.elements.savePhotoProfileButton;
        await button.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await button.click();
    }

    async getProfilePicturePreview() {
        const preview = this.elements.profilePicturePreview;
        await preview.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return preview;
    }

    // Update Profile Methods
    async clickUpdateProfileButton() {
        await this.elements.updateButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.updateButton.click();
    }

    async getUpdateProfileModal() {
        return this.elements.updateProfileModal;
    }

    // Clear field methods
    private async clearProfileFields() {
        await this.elements.nameInput.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.nameInput.clear();
        
        await this.elements.emailInput.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.emailInput.clear();
        
        await this.elements.whatsappNumberInput.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.whatsappNumberInput.clear();
        
        await this.elements.telegramUsernameInput.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.telegramUsernameInput.clear();

        await this.verifyFieldsAreEmpty();
    }

    private async verifyFieldsAreEmpty() {
        await expect(this.elements.nameInput).toHaveValue('');
        await expect(this.elements.emailInput).toHaveValue('');
        await expect(this.elements.whatsappNumberInput).toHaveValue('');
        await expect(this.elements.telegramUsernameInput).toHaveValue('');
    }

    async fillUpdateProfileForm(data: UpdateProfileData) {
        await this.clearProfileFields();
        await this.elements.nameInput.fill(data.name);
        await this.elements.emailInput.fill(data.email);
        await this.elements.whatsappNumberInput.fill(data.whatsappNumber);
        await this.elements.telegramUsernameInput.fill(data.telegramUsername);
    }

    async clickSaveChangesButton() {
        await this.elements.saveChangesButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.saveChangesButton.click();
    }

    async clickCancelButton() {
        await this.elements.cancelButton.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        await this.elements.cancelButton.click();
    }

    async getSuccessMessageUploadImageValid() {
        const message = this.page.getByText(data.profileData.messages.successImageUpdate);
        await message.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return message;
    }

    async getErrorMessageUploadImageInValid() {
        const message = this.page.getByText(data.profileData.messages.error.fileTooBig);
        await message.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return message;
    }

    async getSuccessMessageUpdateProfile() {
        const message = this.page.getByText(data.profileData.messages.successProfileUpdate);
        await message.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return message;
    }

    // Password Change Methods
    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        await test.step('Change Password Process', async () => {
            let retries = 5;
            let isVisible = false;

            while (retries > 0 && !isVisible) {
                try {
                    await this.elements.changePasswordSection.scrollIntoViewIfNeeded();
                    await this.elements.currentPasswordInput.waitFor({ state: 'visible', timeout: waitTime.SHORT });
                    isVisible = true;
                } catch (error) {
                    retries--;
                    console.log(`Retry scrolling to change password section... (${retries} attempts left)`);
                    if (retries === 0) throw error;
                }
            }

            await test.step('Fill Password Form', async () => {
                await this.elements.currentPasswordInput.fill(currentPassword);
                await this.elements.newPasswordInput.fill(newPassword);
                await this.elements.confirmPasswordInput.fill(confirmPassword);
                await this.elements.savePasswordButton.click();
            });
        });
    }

    async getSuccessMessageChangePassword() {
        const message = this.page.getByText(data.ChangePasswordData.messages.success);
        await message.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return message;
    }

    async getPasswordMismatchError() {
        const message = this.page.getByText(data.ChangePasswordData.messages.error.passwordMismatch);
        await message.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
        return message;
    }

    // Activity Log Methods
    async isActivityLogSectionVisible(): Promise<boolean> {
        const visibility = await this.elements.activityLogSection.isVisible();
        console.log(visibility ? 'Permission Activity Log aktif' : 'Permission Activity Log belum diaktifkan');
        return visibility;
    }

    async openActivityLog() {
        await test.step('Open Activity Log Section', async () => {
            await this.elements.activityLogSection.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
            await this.elements.activityLogSection.click();
            
            try {
                await this.elements.activityLogData.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
                const logText = await this.elements.activityLogData.textContent();
                console.log('Activity Log Data:', { text: logText, timestamp: new Date().toISOString() });
            } catch (error) {
                console.log('No Activity Log Data visible');
                throw error;
            }
        });
    }

    // Getters for verification
    async getDisplayedNameValue() {
        return await this.elements.getDisplayedNameValue();
    }

    async getDisplayedEmailValue() {
        return await this.elements.getDisplayedEmailValue();
    }

    async getDisplayedWhatsappValue() {
        return await this.elements.getDisplayedWhatsappValue();
    }

    async getDisplayedTelegramValue() {
        return await this.elements.getDisplayedTelegramValue();
    }

    // Verification Methods
    async verifyProfileData(profileData: UpdateProfileData) {
        await this.page.waitForTimeout(waitTime.SHORT);
        let retries = 3;
        let success = false;

        while (retries > 0 && !success) {
            try {
                const displayedName = await this.getDisplayedNameValue();
                const displayedEmail = await this.getDisplayedEmailValue();
                const displayedWhatsapp = await this.getDisplayedWhatsappValue();
                const displayedTelegram = await this.getDisplayedTelegramValue();

                await test.step('Verify Name', async () => {
                    console.log(`Name Comparison:\nExpected: "${profileData.name}"\nActual  : "${displayedName}"`);
                    expect(displayedName).toBe(profileData.name);
                });

                await test.step('Verify Email', async () => {
                    console.log(`Email Comparison:\nExpected: "${profileData.email}"\nActual  : "${displayedEmail}"`);
                    expect(displayedEmail).toBe(profileData.email);
                });

                await test.step('Verify WhatsApp', async () => {
                    console.log(`WhatsApp Number Comparison:\nExpected: "${profileData.whatsappNumber}"\nActual  : "${displayedWhatsapp}"`);
                    expect(displayedWhatsapp).toBe(profileData.whatsappNumber);
                });

                await test.step('Verify Telegram', async () => {
                    console.log(`Telegram Username Comparison:\nExpected: "${profileData.telegramUsername}"\nActual  : "${displayedTelegram}"`);
                    expect(displayedTelegram).toBe(profileData.telegramUsername);
                });

                success = true;
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await this.page.waitForTimeout(waitTime.SHORT);
                console.log(`Retrying verification... (${retries} attempts left)`);
            }
        }
    }
}
