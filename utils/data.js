// Trong một ứng dụng thực tế, dữ liệu này sẽ được lấy từ API
function getSampleNews() {
    return [
        {
            id: 0,
            title: 'Ngày hội tuyển sinh 2025 - Chắp cánh ước mơ tương lai',
            category: 'Sự kiện',
            imageUrl: 'https://placehold.co/800x450/005baa/FFFFFF?text=Ngày+hội+tuyển+sinh+2025',
            excerpt: 'Cơ hội gặp gỡ, tư vấn và định hướng nghề nghiệp trực tiếp từ các khoa. Đăng ký ngay để nhận nhiều ưu đãi hấp dẫn.',
            createdAt: '2025-09-23T10:00:00Z',
            author: 'Phòng Đào tạo',
            views: 1250,
            likes: 89
        },
        {
            id: 1,
            title: 'Lễ tốt nghiệp và trao bằng cử nhân thực hành năm 2025',
            category: 'Hoạt động',
            imageUrl: 'https://placehold.co/400x250/3498db/FFFFFF?text=Lễ+tốt+nghiệp+2025',
            excerpt: 'Buổi lễ trang trọng vinh danh các tân cử nhân đã hoàn thành xuất sắc chương trình học tại trường Cao đẳng Bách khoa Nam Sài Gòn.',
            createdAt: '2025-09-22T14:30:00Z',
            author: 'Ban Giám hiệu',
            views: 980,
            likes: 67
        },
        {
            id: 2,
            title: 'Khai giảng khóa mới - Chắp cánh ước mơ sinh viên',
            category: 'Đào tạo',
            imageUrl: 'https://placehold.co/400x250/2ecc71/FFFFFF?text=Lễ+khai+giảng',
            excerpt: 'Chào mừng các bạn tân sinh viên đến với ngôi nhà chung Bách khoa Nam Sài Gòn. Hành trình tri thức mới bắt đầu.',
            createdAt: '2025-09-21T08:00:00Z',
            author: 'Phòng Công tác sinh viên',
            views: 1180,
            likes: 95
        },
        {
            id: 3,
            title: 'Hội thảo Công nghệ 4.0 và cơ hội việc làm',
            category: 'Sự kiện',
            imageUrl: 'https://placehold.co/400x250/e74c3c/FFFFFF?text=Hội+thảo+Công+nghệ+4.0',
            excerpt: 'Cập nhật xu hướng công nghệ mới nhất và gặp gỡ các chuyên gia hàng đầu trong ngành. Khám phá cơ hội nghề nghiệp trong kỷ nguyên số.',
            createdAt: '2025-09-20T16:00:00Z',
            author: 'Khoa Công nghệ thông tin',
            views: 756,
            likes: 52
        },
        {
            id: 4,
            title: 'Giải bóng đá sinh viên SPC mở rộng năm 2025',
            category: 'Thể thao',
            imageUrl: 'https://placehold.co/400x250/f39c12/FFFFFF?text=Giải+bóng+đá+SPC',
            excerpt: 'Sân chơi lành mạnh, rèn luyện thể chất và tăng cường tinh thần đoàn kết cho sinh viên toàn trường.',
            createdAt: '2025-09-19T09:30:00Z',
            author: 'Đoàn Thanh niên',
            views: 623,
            likes: 43
        },
        {
            id: 5,
            title: 'Chương trình học bổng xuất sắc cho sinh viên nghèo vượt khó',
            category: 'Thông báo',
            imageUrl: 'https://placehold.co/400x250/9b59b6/FFFFFF?text=Học+bổng+sinh+viên',
            excerpt: 'Nhà trường trao tặng học bổng cho các sinh viên có hoàn cảnh khó khăn nhưng có thành tích học tập xuất sắc.',
            createdAt: '2025-09-18T11:00:00Z',
            author: 'Phòng Công tác sinh viên',
            views: 892,
            likes: 76
        },
        {
            id: 6,
            title: 'Workshop "Kỹ năng mềm cho sinh viên công nghệ"',
            category: 'Đào tạo',
            imageUrl: 'https://placehold.co/400x250/1abc9c/FFFFFF?text=Workshop+kỹ+năng+mềm',
            excerpt: 'Phát triển kỹ năng giao tiếp, làm việc nhóm và lãnh đạo cho sinh viên ngành công nghệ thông tin.',
            createdAt: '2025-09-17T13:15:00Z',
            author: 'Trung tâm Hỗ trợ sinh viên',
            views: 445,
            likes: 34
        },
        {
            id: 7,
            title: 'Triển lãm khoa học kỹ thuật sinh viên lần thứ 15',
            category: 'Sự kiện',
            imageUrl: 'https://placehold.co/400x250/34495e/FFFFFF?text=Triển+lãm+KHKT',
            excerpt: 'Sân chơi khoa học kỹ thuật dành cho sinh viên thể hiện tài năng và sáng tạo qua các dự án nghiên cứu.',
            createdAt: '2025-09-16T10:45:00Z',
            author: 'Phòng Khoa học - Công nghệ',
            views: 567,
            likes: 41
        },
        {
            id: 8,
            title: 'Lễ ký kết hợp tác với các doanh nghiệp công nghệ',
            category: 'Hoạt động',
            imageUrl: 'https://placehold.co/400x250/e67e22/FFFFFF?text=Ký+kết+hợp+tác',
            excerpt: 'Mở rộng cơ hội thực tập và việc làm cho sinh viên thông qua việc hợp tác với các công ty hàng đầu.',
            createdAt: '2025-09-15T15:20:00Z',
            author: 'Ban Giám hiệu',
            views: 721,
            likes: 58
        },
        {
            id: 9,
            title: 'Cuộc thi "Sinh viên 5 tốt" cấp trường năm học 2024-2025',
            category: 'Hoạt động',
            imageUrl: 'https://placehold.co/400x250/8e44ad/FFFFFF?text=Sinh+viên+5+tốt',
            excerpt: 'Vinh danh những sinh viên có thành tích xuất sắc về học tập, rèn luyện và hoạt động xã hội.',
            createdAt: '2025-09-14T12:00:00Z',
            author: 'Đoàn Thanh niên',
            views: 834,
            likes: 72
        }
    ];
}

// Hàm lấy tin tức theo category
function getNewsByCategory(category) {
    const allNews = getSampleNews();
    if (category === 'all') {
        return allNews;
    }
    return allNews.filter(news => news.category === category);
}

// Hàm tìm kiếm tin tức
function searchNews(query) {
    const allNews = getSampleNews();
    const searchQuery = query.toLowerCase();
    return allNews.filter(news => 
        news.title.toLowerCase().includes(searchQuery) ||
        news.excerpt.toLowerCase().includes(searchQuery) ||
        news.category.toLowerCase().includes(searchQuery)
    );
}

// Hàm lấy tin tức liên quan
function getRelatedNews(categoryId, currentNewsId, limit = 3) {
    const allNews = getSampleNews();
    const currentNews = allNews.find(news => news.id === currentNewsId);
    if (!currentNews) return [];
    
    return allNews
        .filter(news => news.category === currentNews.category && news.id !== currentNewsId)
        .slice(0, limit);
}

// Hàm lấy tin tức phổ biến (theo lượt xem)
function getPopularNews(limit = 5) {
    const allNews = getSampleNews();
    return allNews
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
}

// Hàm lấy tin tức mới nhất
function getLatestNews(limit = 5) {
    const allNews = getSampleNews();
    return allNews
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
}

// Hàm lấy danh sách categories
function getCategories() {
    const allNews = getSampleNews();
    const categories = [...new Set(allNews.map(news => news.category))];
    return categories.map(category => ({
        name: category,
        count: allNews.filter(news => news.category === category).length
    }));
}

// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Hàm format thời gian tương đối
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Hôm qua';
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} tuần trước`;
    } else {
        const months = Math.floor(diffDays / 30);
        return `${months} tháng trước`;
    }
}

// Hàm tính thời gian đọc ước tính
function calculateReadingTime(content) {
    const wordsPerMinute = 200; // Tốc độ đọc trung bình
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSampleNews,
        getNewsByCategory,
        searchNews,
        getRelatedNews,
        getPopularNews,
        getLatestNews,
        getCategories,
        formatDate,
        formatRelativeTime,
        calculateReadingTime
    };
}
