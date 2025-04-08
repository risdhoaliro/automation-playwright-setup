import { Page } from '@playwright/test';
import { ProfilePage } from './key_profile';
import { generateProfileData } from '@general/fakeData';
import { setupAdminLogin, setupMitraLogin } from '@pages/Login/suite_login';
import data from '@general/data';
import { LoginPage } from '@/Pages/Login/key_login';

export const setupAdminProfileTests = async (page: Page) => {
    console.log('Starting Admin Profile Tests setup...');
    const loginPage = await setupAdminLogin(page);
    const profilePage = new ProfilePage(page);
    await profilePage.gotoProfilePage();
    const profileData = generateProfileData();
    console.log('Admin Profile Tests setup completed');
    return { loginPage, profilePage, profileData };
};

export const setupMitraProfileTests = async (page: Page) => {
    console.log('Starting Mitra Profile Tests setup...');
    const loginPage = await setupMitraLogin(page);
    const profilePage = new ProfilePage(page);
    await profilePage.gotoProfilePage();
    const profileData = generateProfileData();
    console.log('Mitra Profile Tests setup completed');
    return { loginPage, profilePage, profileData };
};

export const setupAdminPasswordManagementTests = async (page: Page) => {
    console.log('Starting Admin Password Management Tests setup...');
    const account = data.ChangePasswordData.adminAccount;
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.loginWithCredentials(account.userName, account.initialPassword);
    const profilePage = new ProfilePage(page);
    await profilePage.gotoProfilePage();
    console.log('Admin Password Management Tests setup completed');
    return { loginPage, profilePage, account };
};

export const setupMitraPasswordManagementTests = async (page: Page) => {
    console.log('Starting Mitra Password Management Tests setup...');
    const account = data.ChangePasswordData.mitraAccount;
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.loginWithCredentials(account.userName, account.initialPassword);
    const profilePage = new ProfilePage(page);
    await profilePage.gotoProfilePage();
    console.log('Mitra Password Management Tests setup completed');
    return { loginPage, profilePage, account };
};
