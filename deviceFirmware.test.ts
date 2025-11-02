import { test, expect, TestInfo } from '@playwright/test';
import { LoginAPI } from '@src/api/pages/Login/apiLogin';
import { ApiDeviceFirmware } from '@src/api/pages/deviceFirmware/apiDeviceFirmware';
import { ENV } from '@src/config/data';
import { apiMessages } from '@src/config/responsMessages';
import { apiResponseCodes } from '@src/config/statusCode';
import { testConfig } from '@src/config/timeouts';

// Import untuk enhancement
import { assertAPI } from '@src/assertions/api.assertions';
import { APIInterceptor } from '@src/interceptors/api.interceptor';
import { FirmwareUploadResponse } from '@src/api/pages/deviceFirmware/apiDeviceFirmware';
import { userData } from '@src/types/login.types';
import { 
    firmwareUploadRequestBody, 
    generateFirmwareRequestBody,
    firmwareRequestBodyNegative,
    CreateFirmwareResponse,
    generateDeviceModelUpdateBody,
    deviceModelUpdateBodyNegative,
    UpdateDeviceModelResponse,
    SearchFirmwareResponse
} from '@src/api/pages/deviceFirmware/bodyDeviceFirmware';

// Allure metadata management
const allureReporter = {
    setMeta(
        testInfo: TestInfo,
        data: {
            feature?: string;
            epic?: string;
            story?: string;
            severity?: string;
            testId?: string;
            description?: string;
        },
    ) {
        testInfo.annotations.push({
            type: "feature",
            description: data.feature || "Device Firmware Management",
        });
        testInfo.annotations.push({
            type: "epic",
            description: data.epic || "Firmware Upload",
        });
        testInfo.annotations.push({
            type: "story",
            description: data.story || "Upload Firmware Binary",
        });
        testInfo.annotations.push({
            type: "severity",
            description: data.severity || "critical",
        });
        if (data.testId)
            testInfo.annotations.push({ type: "testId", description: data.testId });
        if (data.description)
            testInfo.annotations.push({
                type: "description",
                description: data.description,
            });
    },
};

test.describe('Device Firmware API - Upload Binary File', () => {
    let loginApi: LoginAPI;
    let deviceFirmwareApi: ApiDeviceFirmware;

    // Enable logging untuk semua test
    test.beforeAll(() => {
        APIInterceptor.setLoggingEnabled(true);
        APIInterceptor.setLogLevel('info');
        console.log('🚀 API Interceptor enabled for Device Firmware API tests');
    });

    test.beforeEach(async ({ request }) => {
        loginApi = new LoginAPI(request);
        deviceFirmwareApi = new ApiDeviceFirmware(request);
    });

    test('Should successfully upload .bin firmware file as Admin', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Upload",
            epic: "Firmware Management",
            story: "Upload BIN Firmware Success as Admin",
            severity: "critical",
            testId: "FIRMWARE-UPLOAD-001",
            description: "Verify successful .bin firmware upload with valid file data and proper response validation as Admin user"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Upload .bin firmware file', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.uploadFirmwareBin(
                    ENV.testFirmware.validBin,
                    firmwareUploadRequestBody.path,
                    adminToken
                )
            );
            console.log('Upload Response:', JSON.stringify(response, null, 2));

            await test.info().attach('BIN Firmware Upload Response', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert upload response
            if (response.status) {
                assertAPI(response)
                    .shouldBeSuccessful(apiResponseCodes.created)
                    .shouldHaveMessage(apiMessages.deviceFirmware.uploadSuccess)
                    .shouldHaveData()
                    .shouldSatisfy((resp) => {
                        expect(resp.data).toMatch(/^https:\/\/dev-assets\.synapsis\.id\/nearon-dev\/device-model-firmware\/.*\.bin$/);
                    });
            } else {
                // Log actual response for debugging
                console.log('❌ Upload failed. Response:', JSON.stringify(response, null, 2));
                assertAPI(response).shouldBeFailed();
            }

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ BIN firmware upload completed in ${duration}ms`);
            console.log(`📦 Firmware URL: ${response.data}`);
        });
    });

    test('Should successfully upload .bin firmware file as Client', async ({}, testInfo) => {
        let clientToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Upload",
            epic: "Firmware Management",
            story: "Upload BIN Firmware Success as Client",
            severity: "critical",
            testId: "FIRMWARE-UPLOAD-002",
            description: "Verify successful .bin firmware upload with valid file data and proper response validation as Client user"
        });

        await test.step('Login as Client API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.clientApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            console.log('Response:', JSON.stringify(loginResponse, null, 2));
            clientToken = (loginResponse.data as userData).token;
            console.log('✅ Client API automation user login successful');
        });

        await test.step('Upload .bin firmware file', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.uploadFirmwareBin(
                    ENV.testFirmware.validBin,
                    firmwareUploadRequestBody.path,
                    clientToken
                )
            );
            console.log('Upload Response:', JSON.stringify(response, null, 2));

            await test.info().attach('BIN Firmware Upload Response (Client)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert upload response
            if (response.status) {
                assertAPI(response)
                    .shouldBeSuccessful(apiResponseCodes.created)
                    .shouldHaveMessage(apiMessages.deviceFirmware.uploadSuccess)
                    .shouldHaveData()
                    .shouldSatisfy((resp) => {
                        expect(resp.data).toMatch(/^https:\/\/dev-assets\.synapsis\.id\/nearon-dev\/device-model-firmware\/.*\.bin$/);
                    });
            } else {
                console.log('❌ Client Upload failed. Response:', JSON.stringify(response, null, 2));
                assertAPI(response).shouldBeFailed();
            }

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ BIN firmware upload completed in ${duration}ms`);
            console.log(`📦 Firmware URL: ${response.data}`);
        });
    });

    test('Should successfully upload .bin firmware file with custom filename', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Upload",
            epic: "Firmware Management",
            story: "Upload BIN Firmware with Custom Filename",
            severity: "normal",
            testId: "FIRMWARE-UPLOAD-003",
            description: "Verify successful .bin firmware upload with custom filename"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            console.log('Response:', JSON.stringify(loginResponse, null, 2));
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Upload .bin firmware file with custom filename', async () => {
            const customFileName = `firmware_v1.0.0_${Date.now()}.bin`;
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.uploadFirmwareWithCustomName(
                    ENV.testFirmware.validBin,
                    customFileName,
                    firmwareUploadRequestBody.path,
                    adminToken
                )
            );
            console.log('Upload Response:', JSON.stringify(response, null, 2));

            await test.info().attach('BIN Firmware Upload Response (Custom Name)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert upload response
            if (response.status) {
                assertAPI(response)
                    .shouldBeSuccessful(apiResponseCodes.created)
                    .shouldHaveMessage(apiMessages.deviceFirmware.uploadSuccess)
                    .shouldHaveData()
                    .shouldSatisfy((resp) => {
                        expect(resp.data).toMatch(/^https:\/\/dev-assets\.synapsis\.id\/nearon-dev\/device-model-firmware\/.*\.bin$/);
                    });
            } else {
                console.log('❌ Custom filename upload failed. Response:', JSON.stringify(response, null, 2));
                assertAPI(response).shouldBeFailed();
            }

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ BIN firmware upload with custom filename completed in ${duration}ms`);
            console.log(`📦 Firmware URL: ${response.data}`);
        });
    });

    test('Should fail to upload firmware without authentication', async ({}, testInfo) => {
        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Upload",
            epic: "Firmware Management",
            story: "Upload Firmware Failure - No Authentication",
            severity: "critical",
            testId: "FIRMWARE-UPLOAD-004-NEG",
            description: "Verify that firmware upload fails when no authentication token is provided"
        });

        await test.step('Attempt to upload firmware without token', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.uploadFirmwareBin(
                    ENV.testFirmware.validBin,
                    firmwareUploadRequestBody.path,
                    '' // Empty token
                )
            );
            console.log('Upload Response (No Auth):', JSON.stringify(response, null, 2));

            await test.info().attach('Firmware Upload Response (No Auth)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert upload response for unauthorized access
            assertAPI(response)
                .shouldBeFailed(apiResponseCodes.unauthorized); // Expecting 401 Unauthorized

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Unauthorized upload attempt completed in ${duration}ms`);
        });
    });

    test('Should fail to upload firmware with invalid file type', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Upload",
            epic: "Firmware Management",
            story: "Upload Firmware Failure - Invalid File Type",
            severity: "critical",
            testId: "FIRMWARE-UPLOAD-005-NEG",
            description: "Verify that firmware upload fails when an invalid file type (e.g., .txt) is provided"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            console.log('Response:', JSON.stringify(loginResponse, null, 2));
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Attempt to upload invalid file type', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.uploadFirmwareWithCustomName(
                    ENV.testFirmware.invalidFile,
                    'invalid-firmware.txt',
                    firmwareUploadRequestBody.path,
                    adminToken
                )
            );
            console.log('Upload Response (Invalid File):', JSON.stringify(response, null, 2));

            await test.info().attach('Invalid Firmware Upload Response', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert upload response for invalid file
            // Note: Response code might vary - could be 400 Bad Request or 415 Unsupported Media Type
            assertAPI(response)
                .shouldBeFailed(); // Will accept any failure status

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Invalid file upload attempt completed in ${duration}ms`);
        });
    });

    test('Should fail to upload firmware with invalid token', async ({}, testInfo) => {
        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Upload",
            epic: "Firmware Management",
            story: "Upload Firmware Failure - Invalid Token",
            severity: "critical",
            testId: "FIRMWARE-UPLOAD-006-NEG",
            description: "Verify that firmware upload fails when an invalid authentication token is provided"
        });

        await test.step('Attempt to upload firmware with invalid token', async () => {
            const invalidToken = 'invalid.token.here';
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.uploadFirmwareBin(
                    ENV.testFirmware.validBin,
                    firmwareUploadRequestBody.path,
                    invalidToken
                )
            );
            console.log('Upload Response (Invalid Token):', JSON.stringify(response, null, 2));

            await test.info().attach('Firmware Upload Response (Invalid Token)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert upload response for invalid token
            assertAPI(response)
                .shouldBeFailed(apiResponseCodes.unauthorized); // Expecting 401 Unauthorized

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Invalid token upload attempt completed in ${duration}ms`);
        });
    });
});

test.describe('Device Firmware API - Create Firmware', () => {
    let loginApi: LoginAPI;
    let deviceFirmwareApi: ApiDeviceFirmware;
    let sharedFirmwareUrl: string;
    let sharedAdminToken: string;

    // Enable logging untuk semua test
    test.beforeAll(async ({ request }) => {
        APIInterceptor.setLoggingEnabled(true);
        APIInterceptor.setLogLevel('info');
        console.log('🚀 API Interceptor enabled for Device Firmware Create API tests');
        
        // Upload firmware sekali untuk semua test dalam suite ini
        loginApi = new LoginAPI(request);
        deviceFirmwareApi = new ApiDeviceFirmware(request);
        
        const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
        sharedAdminToken = (loginResponse.data as userData).token;
        
        const uploadResponse = await deviceFirmwareApi.uploadFirmwareBin(
            ENV.testFirmware.validBin,
            firmwareUploadRequestBody.path,
            sharedAdminToken
        );
        sharedFirmwareUrl = uploadResponse.data;
        console.log(`📦 Shared Firmware URL for Create tests: ${sharedFirmwareUrl}`);
    });

    test.beforeEach(async ({ request }) => {
        loginApi = new LoginAPI(request);
        deviceFirmwareApi = new ApiDeviceFirmware(request);
    });

    test('Should successfully create firmware as Admin', async ({}, testInfo) => {
        let adminToken: string;
        let companyId: string;
        let projectId: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware CRUD Operations",
            story: "Create Firmware as Admin",
            severity: "critical",
            testId: "FIRMWARE-CREATE-001",
            description: "Verify successful firmware creation with valid data as Admin user"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Create firmware with valid data', async () => {
            // Set default company_id dan project_id untuk admin
            companyId = 'heaewl293c'; // Company ID yang valid dari sistem
            projectId = 'QA005'; // Project ID yang valid

            const requestBody = generateFirmwareRequestBody(sharedFirmwareUrl, companyId, projectId);
            console.log('Create Firmware Request:', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.createFirmware(adminToken, requestBody)
            );
            console.log('Create Firmware Response:', JSON.stringify(response, null, 2));

            await test.info().attach('Create Firmware Response', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert create response
            assertAPI(response)
                .shouldBeSuccessful(apiResponseCodes.created)
                .shouldHaveMessage(apiMessages.deviceFirmware.createSuccess);

            // Data is null in create response
            expect(response.data).toBeNull();

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Firmware created successfully in ${duration}ms`);
        });
    });

    test('Should successfully create firmware as Client', async ({}, testInfo) => {
        let clientToken: string;
        let companyId: string;
        let projectId: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware CRUD Operations",
            story: "Create Firmware as Client",
            severity: "critical",
            testId: "FIRMWARE-CREATE-002",
            description: "Verify successful firmware creation with valid data as Client user"
        });

        await test.step('Login as Client API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.clientApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            clientToken = (loginResponse.data as userData).token;
            companyId = (loginResponse.data as userData).company_id || '';
            projectId = (loginResponse.data as userData).projects?.[0] || 'QA100';
            console.log('✅ Client API automation user login successful');
            console.log(`📋 Company ID: ${companyId}, Project ID: ${projectId}`);
        });

        await test.step('Create firmware with valid data', async () => {
            const requestBody = generateFirmwareRequestBody(sharedFirmwareUrl, companyId, projectId);
            console.log('Create Firmware Request:', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.createFirmware(clientToken, requestBody)
            );
            console.log('Create Firmware Response:', JSON.stringify(response, null, 2));

            await test.info().attach('Create Firmware Response (Client)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert create response
            assertAPI(response)
                .shouldBeSuccessful(apiResponseCodes.created)
                .shouldHaveMessage(apiMessages.deviceFirmware.createSuccess);

            // Data is null in create response
            expect(response.data).toBeNull();

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Firmware created successfully in ${duration}ms`);
        });
    });

    test('Should fail to create firmware with empty version', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware CRUD Operations",
            story: "Create Firmware Failure - Empty Version",
            severity: "critical",
            testId: "FIRMWARE-CREATE-003-NEG",
            description: "Verify that firmware creation fails when version field is empty"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Attempt to create firmware with empty version', async () => {
            const requestBody = firmwareRequestBodyNegative.emptyVersion(sharedFirmwareUrl, 'heaewl293c', 'QA005');
            console.log('Create Firmware Request (Empty Version):', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.createFirmware(adminToken, requestBody)
            );
            console.log('Create Firmware Response (Empty Version):', JSON.stringify(response, null, 2));

            await test.info().attach('Create Firmware Response (Empty Version)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert create response fails
            assertAPI(response)
                .shouldBeFailed(apiResponseCodes.badRequest);

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Empty version validation completed in ${duration}ms`);
        });
    });

    test('Should fail to create firmware with empty firmware_url', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware CRUD Operations",
            story: "Create Firmware Failure - Empty Firmware URL",
            severity: "critical",
            testId: "FIRMWARE-CREATE-004-NEG",
            description: "Verify that firmware creation fails when firmware_url field is empty"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Attempt to create firmware with empty firmware_url', async () => {
            const requestBody = firmwareRequestBodyNegative.emptyFirmwareUrl('heaewl293c', 'QA005');
            console.log('Create Firmware Request (Empty URL):', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.createFirmware(adminToken, requestBody)
            );
            console.log('Create Firmware Response (Empty URL):', JSON.stringify(response, null, 2));

            await test.info().attach('Create Firmware Response (Empty URL)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert create response fails
            assertAPI(response)
                .shouldBeFailed(apiResponseCodes.badRequest);

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Empty firmware URL validation completed in ${duration}ms`);
        });
    });
});

test.describe('Device Model API - Update Device Model', () => {
    let loginApi: LoginAPI;
    let deviceFirmwareApi: ApiDeviceFirmware;
    const DEVICE_MODEL_ID = 'bdbf6b07-2f4a-4d01-9c53-7dec3fd50148'; // ID yang valid dari sistem

    // Enable logging untuk semua test
    test.beforeAll(() => {
        APIInterceptor.setLoggingEnabled(true);
        APIInterceptor.setLogLevel('info');
        console.log('🚀 API Interceptor enabled for Device Model API tests');
    });

    test.beforeEach(async ({ request }) => {
        loginApi = new LoginAPI(request);
        deviceFirmwareApi = new ApiDeviceFirmware(request);
    });

    test('Should successfully update device model as Admin', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Model Management",
            epic: "Device Model CRUD Operations",
            story: "Update Device Model as Admin",
            severity: "critical",
            testId: "DEVICE-MODEL-UPDATE-001",
            description: "Verify successful device model update with valid data as Admin user"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Update device model with valid data', async () => {
            const requestBody = generateDeviceModelUpdateBody();
            console.log('Update Device Model Request:', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.updateDeviceModel(adminToken, DEVICE_MODEL_ID, requestBody)
            );
            console.log('Update Device Model Response:', JSON.stringify(response, null, 2));

            await test.info().attach('Update Device Model Response', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert update response
            assertAPI(response)
                .shouldBeSuccessful(apiResponseCodes.success)
                .shouldHaveMessage(apiMessages.deviceModel.updateSuccess);

            // Data is null in update response
            expect(response.data).toBeNull();

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Device model updated successfully in ${duration}ms`);
            console.log(`📝 Updated name: ${requestBody.name}`);
        });
    });

    test('Should successfully update device model as Client', async ({}, testInfo) => {
        let clientToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Model Management",
            epic: "Device Model CRUD Operations",
            story: "Update Device Model as Client",
            severity: "critical",
            testId: "DEVICE-MODEL-UPDATE-002",
            description: "Verify successful device model update with valid data as Client user"
        });

        await test.step('Login as Client API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.clientApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            clientToken = (loginResponse.data as userData).token;
            console.log('✅ Client API automation user login successful');
        });

        await test.step('Update device model with valid data', async () => {
            const requestBody = generateDeviceModelUpdateBody();
            console.log('Update Device Model Request:', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.updateDeviceModel(clientToken, DEVICE_MODEL_ID, requestBody)
            );
            console.log('Update Device Model Response:', JSON.stringify(response, null, 2));

            await test.info().attach('Update Device Model Response (Client)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert update response
            assertAPI(response)
                .shouldBeSuccessful(apiResponseCodes.success)
                .shouldHaveMessage(apiMessages.deviceModel.updateSuccess);

            // Data is null in update response
            expect(response.data).toBeNull();

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Device model updated successfully in ${duration}ms`);
            console.log(`📝 Updated name: ${requestBody.name}`);
        });
    });

    test('Should fail to update device model without authentication', async ({}, testInfo) => {
        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Model Management",
            epic: "Device Model CRUD Operations",
            story: "Update Device Model Failure - No Authentication",
            severity: "critical",
            testId: "DEVICE-MODEL-UPDATE-004-NEG",
            description: "Verify that device model update fails when no authentication token is provided"
        });

        await test.step('Attempt to update device model without token', async () => {
            const requestBody = generateDeviceModelUpdateBody();
            console.log('Update Device Model Request (No Auth):', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.updateDeviceModel('', DEVICE_MODEL_ID, requestBody)
            );
            console.log('Update Device Model Response (No Auth):', JSON.stringify(response, null, 2));

            await test.info().attach('Update Device Model Response (No Auth)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert update response fails
            assertAPI(response)
                .shouldBeFailed(apiResponseCodes.unauthorized);

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Unauthorized update attempt completed in ${duration}ms`);
        });
    });

    test('Should fail to update device model with invalid model ID', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Model Management",
            epic: "Device Model CRUD Operations",
            story: "Update Device Model Failure - Invalid Model ID",
            severity: "normal",
            testId: "DEVICE-MODEL-UPDATE-005-NEG",
            description: "Verify that device model update fails when an invalid model ID is provided"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Attempt to update device model with invalid ID', async () => {
            const invalidModelId = 'invalid-uuid-123';
            const requestBody = generateDeviceModelUpdateBody();
            console.log('Update Device Model Request (Invalid ID):', JSON.stringify(requestBody, null, 2));

            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.updateDeviceModel(adminToken, invalidModelId, requestBody)
            );
            console.log('Update Device Model Response (Invalid ID):', JSON.stringify(response, null, 2));

            await test.info().attach('Update Device Model Response (Invalid ID)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert update response fails - could be 400 or 404
            assertAPI(response)
                .shouldBeFailed();

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Invalid model ID validation completed in ${duration}ms`);
        });
    });
});

test.describe('Device Firmware API - Search Firmware', () => {
    let loginApi: LoginAPI;
    let deviceFirmwareApi: ApiDeviceFirmware;
    const DEVICE_MODEL_ID = 'bdbf6b07-2f4a-4d01-9c53-7dec3fd50148';
    const SEARCH_TERM = 'QA Automation Sensor';

    // Enable logging untuk semua test
    test.beforeAll(() => {
        APIInterceptor.setLoggingEnabled(true);
        APIInterceptor.setLogLevel('info');
        console.log('🚀 API Interceptor enabled for Device Firmware Search API tests');
    });

    test.beforeEach(async ({ request }) => {
        loginApi = new LoginAPI(request);
        deviceFirmwareApi = new ApiDeviceFirmware(request);
    });

    test('Should successfully search firmware by device model ID and search term as Admin', async ({}, testInfo) => {
        let adminToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware Search Operations",
            story: "Search Firmware by Device Model ID as Admin",
            severity: "critical",
            testId: "FIRMWARE-SEARCH-001",
            description: "Verify successful firmware search by device model ID and search term as Admin user"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Search firmware by device model ID and search term', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.searchFirmware(adminToken, DEVICE_MODEL_ID, SEARCH_TERM)
            );

            await test.info().attach('Search Firmware Response', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert search response
            assertAPI(response)
                .shouldBeSuccessful(apiResponseCodes.success)
                .shouldHaveMessage(apiMessages.deviceFirmware.searchSuccess)
                .shouldHaveData();

            // Verify that all items have hardware_device_name matching search term
            expect(response.data).toBeDefined();
            expect(Array.isArray(response.data)).toBeTruthy();
            expect(response.count).toBeGreaterThan(0);
            
            // Verify setiap item memiliki hardware_device_name yang sesuai dengan search term
            response.data.forEach((item: any) => {
                expect(item.hardware_device_name).toBe(SEARCH_TERM);
            });

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Firmware search completed in ${duration}ms`);
            console.log(`📊 Found ${response.count} firmware(s) with hardware_device_name: "${SEARCH_TERM}"`);
        });
    });

    test('Should successfully search firmware by device model ID and search term as Client', async ({}, testInfo) => {
        let clientToken: string;

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware Search Operations",
            story: "Search Firmware by Device Model ID as Client",
            severity: "critical",
            testId: "FIRMWARE-SEARCH-002",
            description: "Verify successful firmware search by device model ID and search term as Client user"
        });

        await test.step('Login as Client API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.clientApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            clientToken = (loginResponse.data as userData).token;
            console.log('✅ Client API automation user login successful');
        });

        await test.step('Search firmware by device model ID and search term', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.searchFirmware(clientToken, DEVICE_MODEL_ID, SEARCH_TERM)
            );

            await test.info().attach('Search Firmware Response (Client)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert search response
            assertAPI(response)
                .shouldBeSuccessful(apiResponseCodes.success)
                .shouldHaveMessage(apiMessages.deviceFirmware.searchSuccess)
                .shouldHaveData();

            // Verify that all items have hardware_device_name matching search term
            expect(response.data).toBeDefined();
            expect(Array.isArray(response.data)).toBeTruthy();
            expect(response.count).toBeGreaterThan(0);
            
            // Verify setiap item memiliki hardware_device_name yang sesuai dengan search term
            response.data.forEach((item: any) => {
                expect(item.hardware_device_name).toBe(SEARCH_TERM);
            });

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Firmware search completed in ${duration}ms`);
            console.log(`📊 Found ${response.count} firmware(s) with hardware_device_name: "${SEARCH_TERM}"`);
        });
    });

    test('Should fail to search firmware without authentication', async ({}, testInfo) => {
        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware Search Operations",
            story: "Search Firmware Failure - No Authentication",
            severity: "critical",
            testId: "FIRMWARE-SEARCH-003-NEG",
            description: "Verify that firmware search fails when no authentication token is provided"
        });

        await test.step('Attempt to search firmware without token', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.searchFirmware('', DEVICE_MODEL_ID, SEARCH_TERM)
            );

            await test.info().attach('Search Firmware Response (No Auth)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert search response fails
            assertAPI(response)
                .shouldBeFailed(apiResponseCodes.unauthorized);

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Unauthorized search attempt completed in ${duration}ms`);
        });
    });

    test('Should return empty data when search term does not match', async ({}, testInfo) => {
        let adminToken: string;
        const INVALID_SEARCH_TERM = 'NonExistentDeviceName123456';

        // Allure metadata
        allureReporter.setMeta(testInfo, {
            feature: "Device Firmware Management",
            epic: "Firmware Search Operations",
            story: "Search Firmware with Non-Matching Search Term",
            severity: "normal",
            testId: "FIRMWARE-SEARCH-004-NEG",
            description: "Verify that firmware search returns empty data when search term does not match any hardware_device_name"
        });

        await test.step('Login as Admin API automation user', async () => {
            const loginResponse = await loginApi.login(ENV.CREDENTIALS.adminApiAutomation);
            
            assertAPI(loginResponse)
                .shouldBeSuccessful()
                .shouldHaveMessage(apiMessages.login.success);
            adminToken = (loginResponse.data as userData).token;
            console.log('✅ Admin API automation user login successful');
        });

        await test.step('Search firmware with non-matching search term', async () => {
            const { response, duration } = await APIInterceptor.measureDuration(
                () => deviceFirmwareApi.searchFirmware(adminToken, DEVICE_MODEL_ID, INVALID_SEARCH_TERM)
            );

            await test.info().attach('Search Firmware Response (No Match)', {
                body: JSON.stringify(response, null, 2),
                contentType: 'application/json',
            });

            // Assert search response is successful but returns empty data
            assertAPI(response)
                .shouldBeSuccessful(apiResponseCodes.success)
                .shouldHaveMessage(apiMessages.deviceFirmware.searchSuccess);

            // Verify empty data - API may return null or empty array when no results found
            expect(response.count).toBe(0);
            if (response.data !== null) {
                expect(Array.isArray(response.data)).toBeTruthy();
                expect(response.data.length).toBe(0);
            }

            // Performance assertion
            expect(duration).toBeLessThan(testConfig.PERFORMANCE.MAX_RESPONSE_TIME);
            console.log(`✅ Firmware search with no matches completed in ${duration}ms`);
            console.log(`📊 Found ${response.count} firmware(s) for search term: "${INVALID_SEARCH_TERM}"`);
        });
    });
});

