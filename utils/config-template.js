// =============================================================
// 🔧 FILE CẤU HỈN TỔNG HỢP CHO NSG NEWS MINI APP
// =============================================================
// 
// Hướng dẫn sử dụng:
// 1. Copy file này thành config.js trong thư mục utils/
// 2. Cập nhật tất cả các ID và URL thật
// 3. Import vào các file cần thiết
// 4. KHÔNG commit file này lên Git (thêm vào .gitignore)
//

// =============================================================
// 🆔 ZALO MINI APP CONFIGURATION
// =============================================================

const ZALO_CONFIG = {
    // ✅ App ID thật của NSG News Mini App
    APP_ID: '2339092643147762779',
    
    // App Secret (chỉ sử dụng trong backend)
    APP_SECRET: 'YOUR_ZALO_APP_SECRET_HERE',
    
    // ✅ Official Account ID thật của NSG 
    OA_ID: '785749141891313000',
    
    // Redirect URI cho login callback
    REDIRECT_URI: 'https://your-domain.com/callback',
    
    // Scope permissions
    PERMISSIONS: ['id', 'name', 'picture']
};

// =============================================================
// 🌐 API CONFIGURATION  
// =============================================================

const API_CONFIG = {
    // Base URL của API backend
    BASE_URL: {
        development: 'https://dev-api.nsg.edu.vn',
        staging: 'https://staging-api.nsg.edu.vn', 
        production: 'https://api.nsg.edu.vn'
    },
    
    // API endpoints
    ENDPOINTS: {
        articles: '/api/articles',
        categories: '/api/categories',
        users: '/api/users',
        upload: '/api/upload',
        analytics: '/api/analytics'
    },
    
    // API Keys
    API_KEY: 'YOUR_API_KEY_HERE',
    
    // Timeout settings
    TIMEOUT: 15000
};

// =============================================================
// 🏫 SCHOOL INFORMATION
// =============================================================

const SCHOOL_CONFIG = {
    name: 'Trường Cao đẳng Bách khoa Nam Sài Gòn',
    shortName: 'NSG',
    website: 'https://nsg.edu.vn',
    email: 'info@nsg.edu.vn',
    phone: '028-xxxx-xxxx',
    address: 'Địa chỉ trường học',
    
    // Social media
    social: {
        facebook: 'https://facebook.com/nsg.edu.vn',
        youtube: 'https://youtube.com/nsg.edu.vn',
        zalo: 'https://zalo.me/nsg.edu.vn'
    },
    
    // Branding
    colors: {
        primary: '#005baa',
        secondary: '#0066cc',
        accent: '#1976d2'
    },
    
    logo: {
        url: 'https://nsg.edu.vn/assets/logo.png',
        alt: 'Logo NSG'
    }
};

// =============================================================
// 📊 ANALYTICS CONFIGURATION
// =============================================================

const ANALYTICS_CONFIG = {
    // Google Analytics
    googleAnalytics: {
        trackingId: 'GA_TRACKING_ID',
        enabled: true
    },
    
    // Facebook Pixel
    facebookPixel: {
        pixelId: 'FB_PIXEL_ID', 
        enabled: true
    },
    
    // Custom analytics
    customAnalytics: {
        endpoint: 'https://analytics.nsg.edu.vn/track',
        enabled: true
    }
};

// =============================================================
// ⚙️ APP SETTINGS
// =============================================================

const APP_SETTINGS = {
    // Environment
    environment: 'development', // development | staging | production
    
    // Debug mode
    debug: true,
    
    // App version
    version: '1.0.0',
    
    // Features flags
    features: {
        userLogin: true,
        pushNotifications: true,
        analytics: true,
        shareContent: true,
        offlineMode: false
    },
    
    // Pagination
    pagination: {
        articlesPerPage: 10,
        maxLoadMore: 50
    },
    
    // Cache settings
    cache: {
        articles: 5 * 60 * 1000, // 5 minutes
        userProfile: 30 * 60 * 1000, // 30 minutes
        categories: 60 * 60 * 1000 // 1 hour
    }
};

// =============================================================
// 🔐 SECURITY SETTINGS
// =============================================================

const SECURITY_CONFIG = {
    // Rate limiting
    rateLimit: {
        requests: 100,
        windowMs: 15 * 60 * 1000 // 15 minutes
    },
    
    // Content Security Policy
    csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", "https://api.nsg.edu.vn"]
    },
    
    // Allowed domains
    allowedDomains: [
        'nsg.edu.vn',
        'www.nsg.edu.vn',
        'api.nsg.edu.vn'
    ]
};

// =============================================================
// 📱 DEVICE & PLATFORM SETTINGS
// =============================================================

const PLATFORM_CONFIG = {
    // Supported platforms
    platforms: ['zalo', 'web', 'mobile'],
    
    // Responsive breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    
    // PWA settings
    pwa: {
        enabled: true,
        name: 'NSG News',
        shortName: 'NSG',
        backgroundColor: '#005baa',
        themeColor: '#005baa'
    }
};

// =============================================================
// 📤 EXPORT CONFIGURATION
// =============================================================

// Tự động detect environment
function getCurrentEnvironment() {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return 'development';
        } else if (hostname.includes('staging') || hostname.includes('dev')) {
            return 'staging';
        } else {
            return 'production';
        }
    }
    return 'development';
}

// Export configuration object
const CONFIG = {
    environment: getCurrentEnvironment(),
    zalo: ZALO_CONFIG,
    api: API_CONFIG,
    school: SCHOOL_CONFIG,
    analytics: ANALYTICS_CONFIG,
    app: APP_SETTINGS,
    security: SECURITY_CONFIG,
    platform: PLATFORM_CONFIG,
    
    // Helper functions
    getApiUrl() {
        return this.api.BASE_URL[this.environment];
    },
    
    getEndpoint(name) {
        return this.getApiUrl() + this.api.ENDPOINTS[name];
    },
    
    isProduction() {
        return this.environment === 'production';
    },
    
    isDevelopment() {
        return this.environment === 'development';
    }
};

// =============================================================
// 🚀 USAGE EXAMPLES
// =============================================================

/*
// Sử dụng trong các file JavaScript:

// 1. Import config
import CONFIG from '../utils/config.js';

// 2. Sử dụng Zalo config
const oaId = CONFIG.zalo.OA_ID;

// 3. Gọi API
const apiUrl = CONFIG.getEndpoint('articles');
fetch(apiUrl, {
    headers: {
        'Authorization': `Bearer ${CONFIG.api.API_KEY}`
    }
});

// 4. Check environment
if (CONFIG.isDevelopment()) {
    console.log('Running in development mode');
}

// 5. Get school info
document.title = CONFIG.school.name;
*/

// =============================================================
// 💡 NOTES & TODO
// =============================================================

/*
TODO:
1. ✅ Tạo Zalo Developer Account
2. ✅ Lấy App ID và App Secret  
3. ✅ Tạo Official Account và lấy OA ID
4. ⏳ Cấu hình domain whitelist
5. ⏳ Setup backend API
6. ⏳ Configure analytics
7. ⏳ Test trên staging environment
8. ⏳ Deploy to production

SECURITY NOTES:
- KHÔNG bao giờ commit App Secret lên Git
- Sử dụng environment variables cho production
- Validate tất cả inputs từ user
- Implement rate limiting cho API
- Sử dụng HTTPS cho tất cả requests
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}