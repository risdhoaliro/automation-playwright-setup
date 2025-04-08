import { Page, Locator } from '@playwright/test';

export const elements_rbac = {
    // Menu dan Navigation
    privacySecurityMenu: "//img[@alt='Privacy & Security']",
    rbacMenu: "//h5[normalize-space(text())='Role Bassed Access Control']",
    
    // Role List Page
    addNewRoleButton: "//button[contains(.,'Add New Role')]",
    roleNameColumn: "//th[contains(text(),'Role Name')]",
    actionColumn: "//th[contains(text(),'Action')]",
    
    // Add New Role Modal
    addNewRoleModal: "//div[contains(@class,'modal')]//h2[text()='Add New Role']",
    roleNameInput: "input[placeholder='Role Name']",
    closeModalButton: "button[aria-label='Close']",
    
    // Permission Toggles
    selectAllPermissionToggle: "//div[text()='Select All Permission']//following-sibling::div//input[@type='checkbox']",
    
    // Secret Key Section
    selectAllSecretKeyToggle: "//div[text()='Select All Secret Key']//following-sibling::div//input[@type='checkbox']",
    viewAllSecretKeyToggle: "//div[text()='View All Secret Key']//following-sibling::div//input[@type='checkbox']",
    createSecretKeyToggle: "//div[text()='Create Secret Key']//following-sibling::div//input[@type='checkbox']",
    deleteSecretKeyToggle: "//div[text()='Delete Secret Key']//following-sibling::div//input[@type='checkbox']",
    editSecretKeyToggle: "//div[text()='Edit Secret Key']//following-sibling::div//input[@type='checkbox']",
    viewSecretKeyToggle: "//div[text()='View Secret Key']//following-sibling::div//input[@type='checkbox']",
    
    // Project Management
    selectAllProjectManagementToggle: "//div[text()='Select All Project Management Access']//following-sibling::div//input[@type='checkbox']",
    
    // Action Buttons
    saveButton: "//button[text()='Save']",
    cancelButton: "//button[text()='Cancel']",
    
    // Success Messages
    successMessage: "//div[contains(@class,'success-message')]"
};
