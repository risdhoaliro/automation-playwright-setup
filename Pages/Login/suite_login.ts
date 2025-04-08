import { Page } from '@playwright/test';
import { LoginPage } from './key_login';
import data from '@general/data';

export const setupAdminLogin = async (page: Page): Promise<LoginPage> => {
    console.log('Starting Admin Login setup...');
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    console.log('Logging in as admin...');
    await loginPage.loginWithCredentials(
        data.LoginData.validDataAdmin.userName,
        data.LoginData.validDataAdmin.password
    );
    return loginPage;
};

export const setupMitraLogin = async (page: Page): Promise<LoginPage> => {
    console.log('Starting Mitra Login setup...');
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    console.log('Logging in as mitra...');
    await loginPage.loginWithCredentials(
        data.LoginData.validMitraData.userName,
        data.LoginData.validMitraData.password
    );
    return loginPage;
};

export const setupLoginTests = async (page: Page): Promise<LoginPage> => {
    console.log('Starting Login Tests setup...');
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    return loginPage;
};
