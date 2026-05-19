// =============================================================
// 🔧 CẤU HỈN THẬT CHO NSG NEWS MINI APP
// =============================================================
// ✅ Đã cập nhật với App ID và OA ID thật
// App ID: 2339092643147762779
// OA ID: 785749141891313000

const NSG_CONFIG = {
    // ✅ Zalo Mini App Configuration - ĐÃ CẬP NHẬT
    zalo: {
        APP_ID: '2339092643147762779',
        OA_ID: '785749141891313000',
        APP_SECRET: 'YOUR_APP_SECRET_HERE', // Lấy từ Developer Console
        PERMISSIONS: ['id', 'name', 'picture']
    },
    
    // API Configuration
    api: {
        baseUrl: {
            development: 'https://dev-api.nsg.edu.vn',
            staging: 'https://staging-api.nsg.edu.vn',
            production: 'https://api.nsg.edu.vn'
        },
        endpoints: {
            articles: '/api/articles',
            categories: '/api/categories',
            users: '/api/users',
            upload: '/api/upload'
        },
        timeout: 15000
    },
    
    // School Information
    school: {
        name: 'Trường Cao đẳng Bách khoa Nam Sài Gòn',
        shortName: 'BKNSG',
        website: 'https://nsg.edu.vn',
        email: 'info@nsg.edu.vn',
        colors: {
            primary: '#005baa',
            secondary: '#0066cc'
        }
    },
    
    // App Settings
    app: {
        version: '1.0.0',
        environment: 'development', // development | staging | production
        debug: true,
        features: {
            userLogin: true,
            pushNotifications: true,
            analytics: true,
            shareContent: true
        }
    }
};

// Helper functions
NSG_CONFIG.getApiUrl = function() {
    return this.api.baseUrl[this.app.environment];
};

NSG_CONFIG.getEndpoint = function(name) {
    return this.getApiUrl() + this.api.endpoints[name];
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NSG_CONFIG;
} else if (typeof window !== 'undefined') {
    window.NSG_CONFIG = NSG_CONFIG;
}

// Usage examples:
console.log('✅ NSG Config loaded successfully!');
console.log('📱 App ID:', NSG_CONFIG.zalo.APP_ID);
console.log('📢 OA ID:', NSG_CONFIG.zalo.OA_ID);
console.log('🌐 API URL:', NSG_CONFIG.getApiUrl());