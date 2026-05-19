// Test admin login và add user
console.log('🧪 Setting up admin login...');

// Set admin login
localStorage.setItem('admin_logged_in', 'true');
localStorage.setItem('admin_login_time', Date.now().toString());

console.log('✅ Admin login set');
console.log('🔄 Reloading page...');

// Reload page
window.location.reload();