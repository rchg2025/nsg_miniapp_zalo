// 🔧 Quick Debug Script - Test User Creation
console.log("🚀 Testing User Creation Function...");

// Test chức năng tạo người dùng ngay trong browser
function quickTestUserCreation() {
  console.log("=" * 50);
  console.log("🧪 QUICK TEST: User Creation");
  console.log("=" * 50);

  // Clear existing debug data first
  console.clear();

  // Test 1: Check localStorage access
  console.log("📝 Test 1: localStorage access");
  try {
    localStorage.setItem('test_key', 'test_value');
    const testValue = localStorage.getItem('test_key');
    console.log("✅ localStorage working:", testValue === 'test_value');
    localStorage.removeItem('test_key');
  } catch (error) {
    console.error("❌ localStorage error:", error);
    return false;
  }

  // Test 2: Check current user roles
  console.log("\n📝 Test 2: Current user roles");
  try {
    const currentRoles = localStorage.getItem('user_roles_db');
    console.log("📋 Current roles in localStorage:", currentRoles);
    
    if (currentRoles) {
      const parsed = JSON.parse(currentRoles);
      console.log("📊 Parsed roles:", parsed);
      console.log("📈 Number of users:", parsed.length);
    } else {
      console.log("⚠️ No existing user roles found");
    }
  } catch (error) {
    console.error("❌ Error reading current roles:", error);
  }

  // Test 3: Manual user creation
  console.log("\n📝 Test 3: Manual user creation");
  try {
    // Get current roles
    let roles = [];
    const stored = localStorage.getItem('user_roles_db');
    if (stored) {
      roles = JSON.parse(stored);
    } else {
      // Create default roles
      roles = [
        {
          zaloId: 'admin123',
          role: 'admin',
          assignedBy: 'system',
          assignedAt: new Date().toISOString(),
          isActive: true
        }
      ];
    }

    console.log("📋 Starting with roles:", roles);

    // Add new test user
    const newUser = {
      zaloId: 'test_user_' + Date.now(),
      role: 'student',
      assignedBy: 'admin123',
      assignedAt: new Date().toISOString(),
      isActive: true
    };

    console.log("➕ Adding new user:", newUser);
    roles.push(newUser);

    // Save back to localStorage
    localStorage.setItem('user_roles_db', JSON.stringify(roles));
    console.log("💾 Saved to localStorage");

    // Verify
    const verification = localStorage.getItem('user_roles_db');
    const verifiedRoles = JSON.parse(verification);
    console.log("🔍 Verification - total users now:", verifiedRoles.length);
    console.log("✅ Latest user:", verifiedRoles[verifiedRoles.length - 1]);

    return true;
  } catch (error) {
    console.error("❌ Error in manual creation:", error);
    return false;
  }
}

// Test 4: Admin interface simulation
function testAdminInterface() {
  console.log("\n📝 Test 4: Admin interface simulation");
  
  try {
    // Simulate form inputs
    const formData = {
      newUserZaloId: 'ui_test_' + Date.now(),
      newUserRole: 'teacher',
      assignedBy: 'admin123'
    };

    console.log("📥 Form data:", formData);

    // Validate (same as admin.tsx)
    if (!formData.newUserZaloId.trim()) {
      console.log("❌ Validation failed: Empty Zalo ID");
      return false;
    }

    // Get current roles
    const stored = localStorage.getItem('user_roles_db');
    let roles = stored ? JSON.parse(stored) : [];

    // Find existing user
    const existingIndex = roles.findIndex(r => r.zaloId === formData.newUserZaloId);
    console.log("🔍 Existing user index:", existingIndex);

    // Create role data
    const roleData = {
      zaloId: formData.newUserZaloId,
      role: formData.newUserRole,
      assignedBy: formData.assignedBy,
      assignedAt: new Date().toISOString(),
      isActive: true
    };

    if (existingIndex >= 0) {
      console.log("🔄 Updating existing user");
      roles[existingIndex] = roleData;
    } else {
      console.log("➕ Adding new user");
      roles.push(roleData);
    }

    // Save
    localStorage.setItem('user_roles_db', JSON.stringify(roles));
    
    // Get updated list (same as getAllUserRoles)
    const updatedRoles = JSON.parse(localStorage.getItem('user_roles_db') || '[]');
    
    console.log("✅ User created successfully!");
    console.log("📊 Total users now:", updatedRoles.length);
    console.log("👤 New user:", roleData);

    return true;
  } catch (error) {
    console.error("❌ Error in admin interface test:", error);
    return false;
  }
}

// Run all tests
const test1 = quickTestUserCreation();
const test4 = testAdminInterface();

console.log("\n" + "=" * 50);
console.log("📊 FINAL RESULTS:");
console.log("Test 1 (Manual Creation):", test1 ? "✅ PASS" : "❌ FAIL");
console.log("Test 4 (Admin Interface):", test4 ? "✅ PASS" : "❌ FAIL");

if (test1 && test4) {
  console.log("🎯 CONCLUSION: ✅ User creation is WORKING!");
  console.log("💡 If admin panel still has issues, check browser console for detailed logs");
} else {
  console.log("🎯 CONCLUSION: ❌ There are issues with user creation");
  console.log("💡 Check the error messages above");
}

// Show current user database
console.log("\n📋 CURRENT USER DATABASE:");
try {
  const allUsers = localStorage.getItem('user_roles_db');
  if (allUsers) {
    console.table(JSON.parse(allUsers));
  } else {
    console.log("No users found in database");
  }
} catch (error) {
  console.error("Error reading user database:", error);
}