import { Page } from '@playwright/test';
import { LogoutPage } from './key_logout';
import { setupAdminLogin } from '@pages/Login/suite_login';

export const setupLogoutTests = async (page: Page) => {
    console.log('Starting Logout Test setup...');
    const loginPage = await setupAdminLogin(page);
    const logoutPage = new LogoutPage(page);
    console.log('Logout Test setup completed');
    return { loginPage, logoutPage };
}; 