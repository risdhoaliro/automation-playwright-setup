import { Page } from '@playwright/test';
import { elements_rbac } from './el_rbac';
import { BasePage } from '@fixtures/basePage';
import { waitTime } from '@general/constants';

export class RBACPage extends BasePage {
    elements = {
        privacySecurityMenu: this.page.locator(elements_rbac.privacySecurityMenu),
        rbacMenu: this.page.locator(elements_rbac.rbacMenu)
    };

    constructor(page: Page) {
        super(page);
    }

    async navigateToPrivacySecurity() {
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                await this.elements.privacySecurityMenu.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
                await this.elements.privacySecurityMenu.click();
                await this.page.waitForURL('**/privacy-and-security', { timeout: waitTime.MEDIUM });
                break;
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) throw error;
            }
        }
    }

    async navigateToRBAC() {
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                await this.elements.rbacMenu.waitFor({ state: 'visible', timeout: waitTime.MEDIUM });
                await this.elements.rbacMenu.click();
                await this.page.waitForURL('**/role', { timeout: waitTime.MEDIUM });
                break;
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) throw error;
            }
        }
    }

    async clickAddNewRole() {
        await this.page.click(elements_rbac.addNewRoleButton);
    }

    async fillRoleName(roleName: string) {
        await this.page.fill(elements_rbac.roleNameInput, roleName);
    }

    async toggleSelectAllPermission(enable: boolean) {
        const toggle = this.page.locator(elements_rbac.selectAllPermissionToggle);
        const isChecked = await toggle.isChecked();
        if (enable !== isChecked) {
            await toggle.click();
        }
    }

    async toggleSecretKeyPermissions(permissions: {
        selectAll?: boolean;
        viewAll?: boolean;
        create?: boolean;
        delete?: boolean;
        edit?: boolean;
        view?: boolean;
    }) {
        type ToggleMapType = {
            [K in keyof typeof permissions]: string;
        };

        const toggleMap: ToggleMapType = {
            selectAll: elements_rbac.selectAllSecretKeyToggle,
            viewAll: elements_rbac.viewAllSecretKeyToggle,
            create: elements_rbac.createSecretKeyToggle,
            delete: elements_rbac.deleteSecretKeyToggle,
            edit: elements_rbac.editSecretKeyToggle,
            view: elements_rbac.viewSecretKeyToggle
        };

        for (const [key, value] of Object.entries(permissions)) {
            if (value !== undefined && key in toggleMap) {
                const toggle = this.page.locator(toggleMap[key as keyof typeof permissions] as string);
                const isChecked = await toggle.isChecked();
                if (value !== isChecked) {
                    await toggle.click();
                }
            }
        }
    }

    async toggleProjectManagementAccess(enable: boolean) {
        const toggle = this.page.locator(elements_rbac.selectAllProjectManagementToggle);
        const isChecked = await toggle.isChecked();
        if (enable !== isChecked) {
            await toggle.click();
        }
    }

    async saveRole() {
        await this.page.click(elements_rbac.saveButton);
    }

    async cancelRole() {
        await this.page.click(elements_rbac.cancelButton);
    }

    async closeModal() {
        await this.page.click(elements_rbac.closeModalButton);
    }

    async getSuccessMessage() {
        return await this.page.locator(elements_rbac.successMessage).textContent();
    }
}
