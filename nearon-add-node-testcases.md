# Test Cases: Add New Nearon Node - Positive & Negative Scenarios

## 📋 Test Information
- **Feature**: Device Catalog - Add New Nearon Node
- **Test Suite**: Nearon Settings v1.0.0
- **Figma Reference**: [Nearon Settings Design](https://www.figma.com/design/FcAnPPlFv8oFEUnSaJcHzA/-Nearon-Settings----Nearon-Catalog-v-1.0.0)
- **Created Date**: November 8, 2025
- **Test Environment**: Staging/Production
- **Browser Support**: Chrome, Firefox, Safari, Edge

## 🎯 Test Coverage
- **Screen Flow**: 5 screens (Modal → Form → Validation → Completion → Success)
- **Positive Cases**: 7 test cases
- **Negative Cases**: 12 test cases
- **Total Test Cases**: 19

---

## ✅ POSITIVE TEST CASES

### **PTC001 - Complete Add New Node Success Flow**
| Field | Details |
|-------|---------|
| **Test ID** | PTC001 |
| **Priority** | High |
| **Type** | End-to-End |
| **Execution Time** | 5-7 minutes |

**Objective**: Verify complete happy path from modal trigger to success confirmation

**Pre-conditions**:
- User logged in with admin/editor permission
- Navigate to Device Catalog page
- System is in normal operational state

**Test Data**:
```
Product Name: "Master Node MN-001"
Category: "Environmental Sensors"
Device Type: "Gateway"
Application: "NearonIoT"
Description: "High-performance master node for IoT monitoring"
Image: Valid CCTV image file (JPG/PNG, <5MB)
```

**Test Steps**:
1. **Modal Trigger** (Screen: 14349-54632)
   - Click "Add Product" button
   - Verify blanket overlay appears with opacity
   
2. **Form Display** (Screen: 14349-54713)
   - Verify "Add New Nearon Node" modal opens
   - Check all form fields are visible and accessible
   
3. **Data Entry** (Screen: 14349-54673 & 14349-54891)
   - Fill Product Name: "Master Node MN-001"
   - Select Category: "Environmental Sensors"
   - Select Device Type: "Gateway"
   - Select Application: "NearonIoT"
   - Enter Description: "High-performance master node for IoT monitoring"
   - Upload valid image file
   
4. **Form Submission**
   - Verify Save button becomes enabled
   - Click "Save" button
   - Observe loading state
   
5. **Success Confirmation** (Screen: 14349-54971)
   - Verify success page displays
   - Click "View All Nodes"
   - Verify redirect to Device Catalog

**Expected Results**:
- ✅ Modal overlay appears with smooth animation
- ✅ Form displays with all required fields
- ✅ Data input accepted without validation errors
- ✅ Save button enabled after required fields filled
- ✅ Success message: "Nearon Node created successfully"
- ✅ New node appears in Device Catalog list
- ✅ Node has "Active" status
- ✅ All input data saved correctly

**Pass Criteria**: All expected results achieved without errors

---

### **PTC002 - Add Node with Minimal Required Data**
| Field | Details |
|-------|---------|
| **Test ID** | PTC002 |
| **Priority** | Medium |
| **Type** | Functional |
| **Execution Time** | 3-4 minutes |

**Objective**: Verify node creation with only required fields

**Test Data**:
```
Product Name: "Basic Node BN-001"
Category: "Industrial Sensors"
Device Type: "Node"
Application: [Leave default/empty]
Description: [Leave empty]
Image: [No upload]
```

**Test Steps**:
1. Open "Add New Nearon Node" modal
2. Fill only required fields:
   - Product Name: "Basic Node BN-001"
   - Category: Select "Industrial Sensors"
   - Device Type: Select "Node"
3. Leave optional fields empty
4. Submit form

**Expected Results**:
- ✅ Form submits successfully with minimal data
- ✅ Success message appears
- ✅ Node saved with default values for optional fields
- ✅ No validation errors occur

---

### **PTC003 - Add Node with All Optional Fields**
| Field | Details |
|-------|---------|
| **Test ID** | PTC003 |
| **Priority** | Medium |
| **Type** | Functional |
| **Execution Time** | 4-5 minutes |

**Objective**: Verify all fields (required + optional) can be filled

**Test Data**:
```
Product Name: "Premium Node PN-001"
Category: "Safety Sensors"
Device Type: "Gateway"
Application: "Surveillance"
Description: "Premium node with advanced monitoring capabilities and real-time analytics for comprehensive surveillance operations"
Image: High-quality CCTV image (2MB)
```

**Test Steps**:
1. Open modal and fill all fields including optional ones
2. Upload high-quality image
3. Submit form

**Expected Results**:
- ✅ All data saved correctly
- ✅ Full description displays in node details
- ✅ Uploaded image appears as node thumbnail
- ✅ Success flow completes normally

---

### **PTC004 - Form Navigation & Keyboard Interaction**
| Field | Details |
|-------|---------|
| **Test ID** | PTC004 |
| **Priority** | Low |
| **Type** | Accessibility |
| **Execution Time** | 6-8 minutes |

**Objective**: Verify keyboard navigation and accessibility compliance

**Test Steps**:
1. Open modal using keyboard (Enter on Add button)
2. Navigate using Tab key through all fields
3. Fill form using keyboard only:
   - Type in text fields
   - Use arrow keys for dropdown selection
   - Use Space/Enter for dropdown actions
4. Submit using Enter key

**Expected Results**:
- ✅ Tab order is logical and intuitive
- ✅ Focus indicators clearly visible
- ✅ Dropdowns operable with keyboard
- ✅ Form submittable via keyboard
- ✅ Screen reader compatible (if tested)

---

### **PTC005 - Multiple Node Creation Workflow**
| Field | Details |
|-------|---------|
| **Test ID** | PTC005 |
| **Priority** | Low |
| **Type** | Workflow |
| **Execution Time** | 8-10 minutes |

**Objective**: Verify multiple consecutive node creation

**Test Steps**:
1. Create first node (complete flow)
2. From success page, click "Add Another Node"
3. Create second node with different data
4. From success page, click "View All Nodes"
5. Verify both nodes appear in list

**Expected Results**:
- ✅ "Add Another Node" opens clean form
- ✅ Previous data doesn't carry over
- ✅ Multiple nodes created in single session
- ✅ All nodes appear in catalog list
- ✅ No performance degradation

---

## ❌ NEGATIVE TEST CASES

### **NTC001 - Required Field Validation**
| Field | Details |
|-------|---------|
| **Test ID** | NTC001 |
| **Priority** | High |
| **Type** | Validation |
| **Execution Time** | 4-5 minutes |

**Objective**: Verify validation for empty required fields

**Test Steps**:
1. Open "Add New Nearon Node" modal
2. Leave all required fields empty
3. Attempt to submit form
4. Test individual field validation:
   - Submit with empty Product Name
   - Submit with no Category selected
   - Submit with no Device Type selected

**Expected Results**:
- ❌ Save button remains disabled when required fields empty
- ❌ Error messages appear:
  - "Product Name is required"
  - "Please select a category"
  - "Please select device type"
- ❌ Form cannot be submitted
- ❌ Error styling (red border) on empty required fields
- ❌ Focus automatically moves to first error field

---

### **NTC002 - Invalid Data Format Validation**
| Field | Details |
|-------|---------|
| **Test ID** | NTC002 |
| **Priority** | High |
| **Type** | Validation |
| **Execution Time** | 6-8 minutes |

**Objective**: Verify validation for incorrect data formats

**Invalid Test Data**:
```
Product Name Tests:
- Special characters: "Node@#$%^&*()"
- Numbers only: "12345"
- Too long: "Very long product name that exceeds maximum character limit for this field and should trigger validation error"
- SQL injection: "'; DROP TABLE nodes; --"

Description Tests:
- Extremely long: [500+ characters]
- Script tags: "<script>alert('test')</script>"
```

**Test Steps**:
1. Test each invalid Product Name format
2. Test invalid Description content
3. Attempt to submit with each invalid input

**Expected Results**:
- ❌ Error: "Product name can only contain letters, numbers, and spaces"
- ❌ Error: "Product name must be at least 3 characters"
- ❌ Error: "Maximum 50 characters allowed"
- ❌ Error: "Description cannot exceed 500 characters"
- ❌ Input sanitization prevents script injection
- ❌ Form cannot submit with invalid data

---

### **NTC003 - Duplicate Product Name Validation**
| Field | Details |
|-------|---------|
| **Test ID** | NTC003 |
| **Priority** | High |
| **Type** | Business Logic |
| **Execution Time** | 5-6 minutes |

**Objective**: Verify prevention of duplicate product names

**Test Steps**:
1. Create node with Product Name: "Test Node TN-001"
2. Attempt to create another node with same Product Name
3. Submit form

**Expected Results**:
- ❌ Error: "Product name already exists. Please choose a different name"
- ❌ Form cannot be submitted
- ❌ Real-time validation when typing existing name
- ❌ Suggestion for alternative names (optional)

---

### **NTC004 - File Upload Validation**
| Field | Details |
|-------|---------|
| **Test ID** | NTC004 |
| **Priority** | Medium |
| **Type** | File Validation |
| **Execution Time** | 7-9 minutes |

**Objective**: Verify image upload validation

**Invalid File Test Cases**:
```
File Type Tests:
- .txt file
- .exe file  
- .pdf file

File Size Tests:
- Image > 5MB
- Corrupted image file

Security Tests:
- Double extension (.jpg.exe)
- File with script content
```

**Test Steps**:
1. Test each invalid file type
2. Test oversized files
3. Test malicious files

**Expected Results**:
- ❌ Error: "Only JPG, PNG, and SVG files are allowed"
- ❌ Error: "File size cannot exceed 5MB"
- ❌ Error: "Invalid or corrupted file"
- ❌ File upload rejected and not processed
- ❌ Security validation prevents malicious uploads

---

### **NTC005 - Network & Server Error Scenarios**
| Field | Details |
|-------|---------|
| **Test ID** | NTC005 |
| **Priority** | Medium |
| **Type** | Error Handling |
| **Execution Time** | 8-10 minutes |

**Objective**: Verify error handling for network issues

**Test Scenarios**:
1. **Network Timeout**: Disconnect network during form submission
2. **Server Error**: Simulate 500 Internal Server Error
3. **Rate Limiting**: Submit multiple forms rapidly

**Expected Results**:
- ❌ Error: "Network connection lost. Please check your connection and try again"
- ❌ Error: "Server error occurred. Please try again later"
- ❌ Error: "Too many requests. Please wait before trying again"
- ❌ Retry button available
- ❌ Form data preserved for retry
- ❌ Loading state with timeout handling

---

### **NTC006 - Permission & Authorization Errors**
| Field | Details |
|-------|---------|
| **Test ID** | NTC006 |
| **Priority** | Medium |
| **Type** | Security |
| **Execution Time** | 6-8 minutes |

**Objective**: Verify error handling for permission issues

**Test Scenarios**:
1. **Insufficient Permissions**: Login as read-only user
2. **Session Expired**: Let session expire during form fill
3. **Concurrent Modification**: Two users create same name simultaneously

**Expected Results**:
- ❌ Error: "You don't have permission to add new nodes"
- ❌ Redirect to login or permission denied page
- ❌ Error: "Session expired. Please login again"
- ❌ Error: "Conflict detected. Please refresh and try again"
- ❌ Graceful handling without data loss

---

### **NTC007 - Form State & Data Integrity Errors**
| Field | Details |
|-------|---------|
| **Test ID** | NTC007 |
| **Priority** | Low |
| **Type** | Edge Cases |
| **Execution Time** | 8-10 minutes |

**Objective**: Verify error handling for form state issues

**Test Scenarios**:
1. **Browser Refresh**: Refresh during form fill
2. **Multiple Tabs**: Open same form in multiple tabs
3. **Storage Limits**: Fill with extremely large data

**Expected Results**:
- ❌ Warning: "You have unsaved changes. Are you sure you want to leave?"
- ❌ Form data recovery from localStorage (if implemented)
- ❌ Error: "Form is open in another tab"
- ❌ Error: "Storage limit exceeded"
- ❌ Graceful degradation without crash

---

### **NTC008 - UI/UX Edge Cases**
| Field | Details |
|-------|---------|
| **Test ID** | NTC008 |
| **Priority** | Low |
| **Type** | UI Behavior |
| **Execution Time** | 6-8 minutes |

**Objective**: Verify edge cases for UI behavior

**Test Scenarios**:
1. **Rapid Clicking**: Double-click Save button rapidly
2. **Modal Interactions**: Click outside modal with unsaved changes
3. **Dropdown Edge Cases**: Various dropdown interaction patterns

**Expected Results**:
- ❌ Prevent double submission with button disable
- ❌ Confirmation: "You have unsaved changes. Discard changes?"
- ❌ Modal remains responsive on different screen sizes
- ❌ Dropdown behavior consistent across interaction methods
- ❌ No UI glitches or broken states

---

## 📊 Test Execution Summary

### **Test Statistics**
| Category | Positive | Negative | Total | Priority |
|----------|----------|----------|-------|----------|
| Core Flow | 2 | 3 | 5 | High |
| Validation | 1 | 4 | 5 | High |
| Data Handling | 2 | 2 | 4 | Medium |
| Edge Cases | 2 | 3 | 5 | Low |
| **Total** | **7** | **12** | **19** | - |

### **Execution Priority**
**High Priority (Must Execute)**:
- PTC001, NTC001, NTC002, NTC003

**Medium Priority (Should Execute)**:
- PTC002, PTC003, NTC004, NTC005, NTC006

**Low Priority (Nice to Have)**:
- PTC004, PTC005, NTC007, NTC008

### **Time Estimation**
- **Positive Cases**: 26-34 minutes
- **Negative Cases**: 45-61 minutes
- **Total Execution Time**: 71-95 minutes (~1.5-2 hours)

### **Environment Requirements**
- **Test Data**: Valid and invalid datasets prepared
- **User Accounts**: Admin, Editor, Read-only roles
- **Network Tools**: For simulating network errors
- **File Samples**: Various file types and sizes for upload testing
- **Browser Matrix**: Chrome, Firefox, Safari, Edge

### **Pass/Fail Criteria**
- **Pass**: All expected results achieved, no critical bugs
- **Fail**: Any expected result not met, critical functionality broken
- **Blocked**: Cannot execute due to environment/dependency issues

---

## 📝 Test Execution Notes

### **Before Testing**:
- [ ] Verify test environment is stable
- [ ] Prepare all test data and files
- [ ] Ensure user accounts have correct permissions
- [ ] Clear browser cache and cookies

### **During Testing**:
- [ ] Record actual results for each step
- [ ] Take screenshots for failed test cases
- [ ] Note any deviations from expected behavior
- [ ] Document any new bugs discovered

### **After Testing**:
- [ ] Update test case status (Pass/Fail/Blocked)
- [ ] Log defects in bug tracking system
- [ ] Prepare test execution report
- [ ] Recommend areas for improvement

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Next Review**: After each release cycle
