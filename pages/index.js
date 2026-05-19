document.addEventListener('DOMContentLoaded', function() {
    const newsList = document.getElementById('news-list');
    const searchBtn = document.getElementById('search-btn');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');
    const loadMoreBtn = document.getElementById('load-more');
    const loading = document.getElementById('loading');
    const categoryFilters = document.querySelectorAll('.category-filter');
    
    let allNews = [];
    let filteredNews = [];
    let currentCategory = 'all';
    let searchQuery = '';
    let displayedCount = 4;

    // Khởi tạo dữ liệu
    function initializeData() {
        allNews = getSampleNews();
        filteredNews = [...allNews];
        renderNews();
    }

    // Hàm để hiển thị tin tức
    function renderNews() {
        newsList.innerHTML = '';
        const newsToShow = filteredNews.slice(1, displayedCount + 1); // Bỏ qua item đầu tiên (banner)
        
        if (newsToShow.length === 0) {
            newsList.innerHTML = '<p class="text-center text-gray-500 py-8">Không tìm thấy tin tức nào.</p>';
            loadMoreBtn.style.display = 'none';
            return;
        }

        newsToShow.forEach(news => {
            const newsCard = createNewsCard(news);
            newsList.appendChild(newsCard);
        });

        // Hiển thị/ẩn nút "Xem thêm"
        loadMoreBtn.style.display = displayedCount < filteredNews.length - 1 ? 'block' : 'none';
    }

    // Tạo card tin tức
    function createNewsCard(news) {
        const newsCard = document.createElement('div');
        newsCard.className = 'bg-white rounded-lg shadow-md overflow-hidden flex cursor-pointer hover:shadow-lg transition-shadow';
        newsCard.onclick = () => viewNews(news.id);
        
        newsCard.innerHTML = `
            <img src="${news.imageUrl}" alt="${news.title}" class="w-1/3 h-24 object-cover">
            <div class="p-4 flex flex-col justify-between w-2/3">
                <div>
                    <span class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">${news.category}</span>
                    <h3 class="font-bold text-sm mt-2 mb-1 text-gray-800 line-clamp-2">${news.title}</h3>
                    <p class="text-gray-600 text-xs line-clamp-2">${news.excerpt}</p>
                </div>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                    <i class='bx bx-time mr-1'></i>
                    <span>23/09/2025</span>
                    <span class="ml-auto">
                        <i class='bx bx-heart mr-1'></i>
                        <span>12</span>
                    </span>
                </div>
            </div>
        `;
        
        return newsCard;
    }

    // Xử lý tìm kiếm
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        searchQuery = query;
        filterNews();
    }

    // Lọc tin tức theo category và search
    function filterNews() {
        filteredNews = allNews.filter(news => {
            const matchCategory = currentCategory === 'all' || news.category === currentCategory;
            const matchSearch = searchQuery === '' || 
                news.title.toLowerCase().includes(searchQuery) ||
                news.excerpt.toLowerCase().includes(searchQuery);
            return matchCategory && matchSearch;
        });
        
        displayedCount = 4;
        renderNews();
    }

    // Event listeners cho tìm kiếm
    searchBtn.addEventListener('click', function() {
        searchContainer.classList.toggle('hidden');
        if (!searchContainer.classList.contains('hidden')) {
            searchInput.focus();
        }
    });

    searchClose.addEventListener('click', function() {
        searchContainer.classList.add('hidden');
        searchInput.value = '';
        searchQuery = '';
        filterNews();
    });

    searchInput.addEventListener('input', function() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(handleSearch, 300);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Event listeners cho category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Cập nhật UI
            categoryFilters.forEach(f => {
                f.classList.remove('active', 'bg-blue-600', 'text-white');
                f.classList.add('bg-gray-200', 'text-gray-700');
            });
            this.classList.add('active', 'bg-blue-600', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // Cập nhật filter
            currentCategory = this.dataset.category;
            filterNews();
        });
    });

    // Load more tin tức
    loadMoreBtn.addEventListener('click', function() {
        loading.classList.remove('hidden');
        
        // Simulate loading
        setTimeout(() => {
            displayedCount += 4;
            renderNews();
            loading.classList.add('hidden');
        }, 500);
    });

    // Notification button
    document.getElementById('notification-btn').addEventListener('click', function() {
        if (window.zmp) {
            zmp.showToast({
                message: 'Bạn có 3 thông báo mới',
                type: 'info'
            });
        } else {
            alert('Bạn có 3 thông báo mới');
        }
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            
            if (page && page !== 'index') {
                if (window.zmp) {
                    zmp.navigateTo({
                        url: `./${page}.html`
                    });
                } else {
                    window.location.href = `./${page}.html`;
                }
            }
        });
    });

    // Khởi tạo
    initializeData();
});

// Function để xem chi tiết tin tức
function viewNews(newsId) {
    if (window.zmp) {
        zmp.navigateTo({
            url: `./detail.html?id=${newsId}`
        });
    } else {
        window.location.href = `./detail.html?id=${newsId}`;
    }
}

// Utility functions cho Zalo Mini App
if (window.zmp) {
    // Lấy thông tin user
    zmp.getInfo({
        success: (data) => {
            console.log('User info:', data);
            // Có thể sử dụng để cá nhân hóa nội dung
        },
        fail: (error) => {
            console.error('Error getting user info:', error);
        }
    });

    // Set up share functionality
    window.shareNews = function(newsId) {
        const news = getSampleNews().find(n => n.id === newsId);
        if (news) {
            zmp.share({
                type: 'link',
                data: {
                    title: news.title,
                    description: news.excerpt,
                    thumbnail: news.imageUrl,
                    path: `pages/detail?id=${newsId}`
                }
            });
        }
    };
}
