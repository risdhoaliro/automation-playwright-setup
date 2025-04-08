import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/Login/key_login';
import { RBACPage } from '@pages/Role Bassed Access Control/key_rbac';
import { elements_rbac } from '@pages/Role Bassed Access Control/el_rbac';
import { waitTime } from '@general/constants';
import { setupAdminLogin } from '@pages/Login/suite_login';

let loginPage: LoginPage;
let rbacPage: RBACPage;

test.describe('Role Based Access Control Tests', () => {
    test.beforeEach(async ({ page }) => {
        console.log('Starting RBAC Tests setup...');
        loginPage = await setupAdminLogin(page);
        rbacPage = new RBACPage(page);
        await rbacPage.navigateToPrivacySecurity();
        await rbacPage.navigateToRBAC();
    });

    test.describe('Create Role Tests', () => {
        test('should create new role with all permissions', async ({ page }) => {
            await test.step('Click Add New Role button', async () => {
                await rbacPage.clickAddNewRole();
            });

            await test.step('Fill Role Name', async () => {
                await rbacPage.fillRoleName('Test Automation Role');
            });

            await test.step('Enable All Permissions', async () => {
                await rbacPage.toggleSelectAllPermission(true);
            });

            await test.step('Enable All Secret Key Permissions', async () => {
                await rbacPage.toggleSecretKeyPermissions({
                    selectAll: true
                });
            });

            await test.step('Enable Project Management Access', async () => {
                await rbacPage.toggleProjectManagementAccess(true);
            });

            await test.step('Save Role', async () => {
                await rbacPage.saveRole();
            });

            await test.step('Verify Success Message', async () => {
                const successMessage = await rbacPage.getSuccessMessage();
                await expect(successMessage).toBeTruthy();
            });
        });

        test('should create new role with specific permissions', async ({ page }) => {
            await test.step('Click Add New Role button', async () => {
                await rbacPage.clickAddNewRole();
            });

            await test.step('Fill Role Name', async () => {
                await rbacPage.fillRoleName('Limited Access Role');
            });

            await test.step('Enable Specific Secret Key Permissions', async () => {
                await rbacPage.toggleSecretKeyPermissions({
                    viewAll: true,
                    view: true,
                    create: false,
                    delete: false,
                    edit: false
                });
            });

            await test.step('Save Role', async () => {
                await rbacPage.saveRole();
            });

            await test.step('Verify Success Message', async () => {
                const successMessage = await rbacPage.getSuccessMessage();
                await expect(successMessage).toBeTruthy();
            });
        });

        test('should cancel role creation', async ({ page }) => {
            await test.step('Click Add New Role button', async () => {
                await rbacPage.clickAddNewRole();
            });

            await test.step('Fill Role Name', async () => {
                await rbacPage.fillRoleName('Cancelled Role');
            });

            await test.step('Cancel Role Creation', async () => {
                await rbacPage.cancelRole();
            });

            await test.step('Verify Modal is Closed', async () => {
                const modal = await page.locator(elements_rbac.addNewRoleModal);
                await expect(modal).not.toBeVisible({ timeout: waitTime.MEDIUM });
            });
        });
    });
});
