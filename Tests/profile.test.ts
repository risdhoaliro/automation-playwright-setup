import { test, expect } from '@playwright/test';
import { ProfilePage } from '@pages/Profile/key_profile';
import { LogoutPage } from '../Pages/Logout/key_logout';
import data from '@general/data';
import { waitTime } from '@general/constants';
import path from 'path';
import { LoginPage } from '@/Pages/Login/key_login';
import { 
    setupAdminProfileTests, 
    setupMitraProfileTests, 
    setupAdminPasswordManagementTests,
    setupMitraPasswordManagementTests 
} from '@pages/Profile/suite_profile';

test.describe('Profile Tests', () => {
    let profilePage: ProfilePage;
    let loginPage: LoginPage;
    let logoutPage: LogoutPage;
    let profileData: any;

    test.beforeAll(async () => {
        console.log('Starting Profile Test Suite');
    });

    test.describe('Admin Profile Tests', () => {
        test.beforeEach(async ({ page }) => {
            const setup = await setupAdminProfileTests(page);
            profilePage = setup.profilePage;
            loginPage = setup.loginPage;
            profileData = setup.profileData;
        });

        test.describe('Profile Picture Tests', () => {
            test('Upload Profile Picture With Valid Image', async () => {
                await test.step('Select Valid Profile Picture', async () => {
                    await profilePage.uploadProfilePicture(path.join(__dirname, data.profileData.validProfilePicture));
                });

                await test.step('Save Profile Picture Changes', async () => {
                    await profilePage.savePhotoProfileButton();
                });

                await test.step('Verify Success Upload Message', async () => {
                    const successMessage = await profilePage.getSuccessMessageUploadImageValid();
                    await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                });
            });

            test('Upload Profile Picture With Invalid Image', async () => {
                await test.step('Select Invalid Profile Picture', async () => {
                    await profilePage.uploadProfilePicture(path.join(__dirname, data.profileData.largeProfilePicture));
                });

                await test.step('Attempt to Save Invalid Picture', async () => {
                    await profilePage.savePhotoProfileButton();
                });

                await test.step('Verify Error Message for Invalid Upload', async () => {
                    const errorMessage = await profilePage.getErrorMessageUploadImageInValid();
                    await expect(errorMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                });
            });
        });

        test.describe('Profile Management Tests', () => {
            test('Update Profile with Valid Data', async () => {
                await test.step('Click Update Profile Button', async () => {
                    await profilePage.clickUpdateProfileButton();
                    const updateProfileModal = await profilePage.getUpdateProfileModal();
                    await expect(updateProfileModal).toBeVisible({ timeout: waitTime.MEDIUM });
                });

                await test.step('Fill Update Profile Form', async () => {
                    await profilePage.fillUpdateProfileForm(profileData);
                });

                await test.step('Save Profile Changes', async () => {
                    await profilePage.clickSaveChangesButton();
                });

                await test.step('Verify Success Message', async () => {
                    const successMessage = await profilePage.getSuccessMessageUpdateProfile();
                    await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                });

                await test.step('Verify Updated Profile Data', async () => {
                    await profilePage.verifyProfileData(profileData);
                });
            });

            test('Cancel Update Profile', async () => {
                await test.step('Open Update Profile Modal', async () => {
                    await profilePage.clickUpdateProfileButton();
                    const updateProfileModal = await profilePage.getUpdateProfileModal();
                    await expect(updateProfileModal).toBeVisible({ timeout: waitTime.MEDIUM });
                });

                await test.step('Click Cancel Button', async () => {
                    await profilePage.clickCancelButton();
                });

                await test.step('Verify Modal is Closed', async () => {
                    const updateProfileModal = await profilePage.getUpdateProfileModal();
                    await expect(updateProfileModal).not.toBeVisible({ timeout: waitTime.MEDIUM });
                });
            });
        });

        test.describe('Activity Log Tests', () => {
            test('Verify activity log section visibility based on permission', async () => {
                let isVisible = false;
                
                await test.step('Check Activity Log Permission Status', async () => {
                    isVisible = await profilePage.isActivityLogSectionVisible();
                });

                if (!isVisible) {
                    await test.step('Log Permission Disabled', async () => {
                        console.log('Permission Activity Log belum diaktifkan');
                    });
                    return;
                }

                await test.step('Log Permission Enabled', async () => {
                    console.log('Permission Activity Log aktif');
                });

                await test.step('Open and Verify Activity Log', async () => {
                    await profilePage.openActivityLog();
                });
            });
        });
    });

    test.describe('Admin Profile Tests > Password Management Tests', () => {
        const account = data.ChangePasswordData.adminAccount;
        
        test.beforeEach(async ({ page }) => {
            const setup = await setupAdminPasswordManagementTests(page);
            profilePage = setup.profilePage;
            loginPage = setup.loginPage;
            logoutPage = new LogoutPage(page);
        });

        test('Should validate password confirmation match', async () => {
            await test.step('Fill Change Password Form with Mismatched Confirmation', async () => {
                await profilePage.changePassword(
                    account.initialPassword,
                    account.newPassword,
                    account.wrongConfirmation
                );
            });

            await test.step('Verify Password Mismatch Error', async () => {
                const errorMessage = await profilePage.getPasswordMismatchError();
                await expect(errorMessage).toBeVisible({ timeout: waitTime.MEDIUM });
            });
            console.log('Success validate password confirmation match');
        });

        test('should be able to change password', async () => {
            await test.step('Fill Change Password Form', async () => {
                await profilePage.changePassword(
                    account.initialPassword, 
                    account.newPassword, 
                    account.newPassword
                );
            });

            await test.step('Verify Success Message', async () => {
                const successMessage = await profilePage.getSuccessMessageChangePassword();
                await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
            });

            await test.step('Verify Can Login with New Password', async () => {
                await logoutPage.performLogout();
                await loginPage.loginWithCredentials(account.userName, account.newPassword);
                const successMessage = await loginPage.getSuccessMessageLogin();
                await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
            });
        });

        test.afterAll(async ({ browser }) => {
            // Cleaning up Password Management Tests
            const context = await browser.newContext();
            const page = await context.newPage();
            
            await test.step('Cleanup Password Management Test', async () => {
                console.log('Cleaning up Password Management Tests');
                
                loginPage = new LoginPage(page);
                await loginPage.gotoLoginPage();
                await loginPage.loginWithCredentials(account.userName, account.newPassword);

                profilePage = new ProfilePage(page);
                await profilePage.gotoProfilePage();
                await profilePage.changePassword(
                    account.newPassword,      // current password
                    account.initialPassword,  // reset ke password awal
                    account.initialPassword   // konfirmasi
                );

                await context.close();
            });
        });
    });

    test.describe('Mitra Profile Tests', () => {
        test.beforeEach(async ({ page }) => {
            const setup = await setupMitraProfileTests(page);
            profilePage = setup.profilePage;
            loginPage = setup.loginPage;
            profileData = setup.profileData;
        });

        test.describe('Profile Picture Tests', () => {
            test('Upload Profile Picture With Valid Image', async () => {
                await test.step('Select Valid Profile Picture', async () => {
                    await profilePage.uploadProfilePicture(path.join(__dirname, data.profileData.validProfilePicture));
                });

                await test.step('Save Profile Picture Changes', async () => {
                    await profilePage.savePhotoProfileButton();
                });

                await test.step('Verify Success Upload Message', async () => {
                    const successMessage = await profilePage.getSuccessMessageUploadImageValid();
                    await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                });
            });

            test('Upload Profile Picture With Invalid Image', async () => {
                await test.step('Select Invalid Profile Picture', async () => {
                    await profilePage.uploadProfilePicture(path.join(__dirname, data.profileData.largeProfilePicture));
                });

                await test.step('Attempt to Save Invalid Picture', async () => {
                    await profilePage.savePhotoProfileButton();
                });

                await test.step('Verify Error Message for Invalid Upload', async () => {
                    const errorMessage = await profilePage.getErrorMessageUploadImageInValid();
                    await expect(errorMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                });
            });
        });

        test.describe('Profile Management Tests', () => {
            test('Update Profile with Valid Data', async () => {
                await test.step('Click Update Profile Button', async () => {
                    await profilePage.clickUpdateProfileButton();
                    const updateProfileModal = await profilePage.getUpdateProfileModal();
                    await expect(updateProfileModal).toBeVisible({ timeout: waitTime.MEDIUM });
                });

                await test.step('Fill Update Profile Form', async () => {
                    await profilePage.fillUpdateProfileForm(profileData);
                });

                await test.step('Save Profile Changes', async () => {
                    await profilePage.clickSaveChangesButton();
                });

                await test.step('Verify Success Message', async () => {
                    const successMessage = await profilePage.getSuccessMessageUpdateProfile();
                    await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
                });

                await test.step('Verify Updated Profile Data', async () => {
                    await profilePage.verifyProfileData(profileData);
                });
            });

            test('Cancel Update Profile', async () => {
                await test.step('Open Update Profile Modal', async () => {
                    await profilePage.clickUpdateProfileButton();
                    const updateProfileModal = await profilePage.getUpdateProfileModal();
                    await expect(updateProfileModal).toBeVisible({ timeout: waitTime.MEDIUM });
                });

                await test.step('Click Cancel Button', async () => {
                    await profilePage.clickCancelButton();
                });

                await test.step('Verify Modal is Closed', async () => {
                    const updateProfileModal = await profilePage.getUpdateProfileModal();
                    await expect(updateProfileModal).not.toBeVisible({ timeout: waitTime.MEDIUM });
                });
            });
        });

        test.describe('Activity Log Tests', () => {
            test('Verify activity log section visibility based on permission', async () => {
                let isVisible = false;
                
                await test.step('Check Activity Log Permission Status', async () => {
                    isVisible = await profilePage.isActivityLogSectionVisible();
                });

                if (!isVisible) {
                    await test.step('Log Permission Disabled', async () => {
                        console.log('Permission Activity Log belum diaktifkan');
                    });
                    return;
                }

                await test.step('Log Permission Enabled', async () => {
                    console.log('Permission Activity Log aktif');
                });

                await test.step('Open and Verify Activity Log', async () => {
                    await profilePage.openActivityLog();
                });
            });
        });
    });

    test.describe('Mitra Profile Tests > Password Management Tests', () => {
        const account = data.ChangePasswordData.mitraAccount;
        
        test.beforeEach(async ({ page }) => {
            const setup = await setupMitraPasswordManagementTests(page);
            profilePage = setup.profilePage;
            loginPage = setup.loginPage;
            logoutPage = new LogoutPage(page);
        });

        test('should validate password confirmation match', async () => {
            await test.step('Fill Change Password Form with Mismatched Confirmation', async () => {
                await profilePage.changePassword(
                    account.initialPassword,
                    account.newPassword,
                    account.wrongConfirmation
                );
            });

            await test.step('Verify Password Mismatch Error', async () => {
                const errorMessage = await profilePage.getPasswordMismatchError();
                await expect(errorMessage).toBeVisible({ timeout: waitTime.MEDIUM });
            });
        });

        test('should be able to change password', async () => {
            await test.step('Fill Change Password Form', async () => {
                await profilePage.changePassword(
                    account.initialPassword, 
                    account.newPassword, 
                    account.newPassword
                );
            });

            await test.step('Verify Success Message', async () => {
                const successMessage = await profilePage.getSuccessMessageChangePassword();
                await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
            });

            await test.step('Verify Can Login with New Password', async () => {
                await logoutPage.performLogout();
                await loginPage.loginWithCredentials(account.userName, account.newPassword);
                const successMessage = await loginPage.getSuccessMessageLogin();
                await expect(successMessage).toBeVisible({ timeout: waitTime.MEDIUM });
            });
        });

        test.afterAll(async ({ browser }) => {
            // Cleaning up Password Management Tests
            const context = await browser.newContext();
            const page = await context.newPage();
            
            await test.step('Cleanup Password Management Test', async () => {
                console.log('Cleaning up Password Management Tests');
                
                loginPage = new LoginPage(page);
                await loginPage.gotoLoginPage();
                await loginPage.loginWithCredentials(account.userName, account.newPassword);

                profilePage = new ProfilePage(page);
                await profilePage.gotoProfilePage();
                await profilePage.changePassword(
                    account.newPassword,      // current password
                    account.initialPassword,  // reset ke password awal
                    account.initialPassword   // konfirmasi
                );

                await context.close();
            });
        });
    });

    test.afterAll(async () => {
        console.log('Profile Test Suite completed.');
    });
});
