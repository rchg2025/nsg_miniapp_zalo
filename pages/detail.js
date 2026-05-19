document.addEventListener('DOMContentLoaded', function() {
    const newsDetailContent = document.getElementById('news-detail-content');
    const headerTitle = document.getElementById('header-title');

    // Lấy id bài viết từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = parseInt(urlParams.get('id'), 10);

    const allNews = getSampleNews();
    const news = allNews.find(item => item.id === newsId);

    if (news) {
        headerTitle.textContent = news.category;
        renderNewsDetail(news);
        
        // Track view count
        trackView(newsId);
        
        // Load related news
        loadRelatedNews(news.category, newsId);
    } else {
        newsDetailContent.innerHTML = `
            <div class="text-center py-8">
                <i class='bx bx-error text-6xl text-red-500 mb-4'></i>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
                <p class="text-gray-600 mb-4">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <button onclick="goBack()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    <i class='bx bx-arrow-back mr-2'></i>Quay lại
                </button>
            </div>
        `;
    }

    function renderNewsDetail(news) {
        const currentDate = new Date().toLocaleDateString('vi-VN');
        const readingTime = Math.ceil(news.excerpt.length / 200); // Estimate reading time
        
        newsDetailContent.innerHTML = `
            <!-- Article Header -->
            <div class="mb-6">
                <h1 class="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight">${news.title}</h1>
                
                <!-- Article Meta -->
                <div class="flex flex-wrap items-center text-sm text-gray-500 mb-4 space-x-4">
                    <span class="flex items-center">
                        <i class='bx bxs-folder-open mr-1'></i> 
                        ${news.category}
                    </span>
                    <span class="flex items-center">
                        <i class='bx bxs-time mr-1'></i> 
                        ${currentDate}
                    </span>
                    <span class="flex items-center">
                        <i class='bx bx-time-five mr-1'></i> 
                        ${readingTime} phút đọc
                    </span>
                </div>

                <!-- Article Actions -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <div class="flex items-center space-x-4">
                        <button id="like-btn" class="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
                            <i class='bx bx-heart text-xl'></i>
                            <span id="like-count">12</span>
                        </button>
                        <button id="bookmark-btn" class="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                            <i class='bx bx-bookmark text-xl'></i>
                            <span>Lưu</span>
                        </button>
                        <span class="flex items-center space-x-1 text-gray-500">
                            <i class='bx bx-show text-xl'></i>
                            <span>${Math.floor(Math.random() * 1000) + 100}</span>
                        </span>
                    </div>
                    <button id="share-btn" class="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <i class='bx bx-share-alt'></i>
                        <span>Chia sẻ</span>
                    </button>
                </div>
            </div>

            <!-- Featured Image -->
            <div class="mb-6">
                <img src="${news.imageUrl.replace('400x250', '800x450')}" alt="${news.title}" class="w-full rounded-lg shadow-md">
            </div>

            <!-- Article Content -->
            <div class="prose max-w-none mb-8">
                <!-- Lead paragraph -->
                <p class="text-lg text-gray-700 font-medium mb-4 leading-relaxed">${news.excerpt}</p>
                
                <!-- Main content -->
                <div class="text-gray-800 leading-relaxed space-y-4">
                    <p>Đây là nội dung chi tiết của bài viết về "${news.title}". Trong một ứng dụng thực tế, nội dung này sẽ được lấy từ cơ sở dữ liệu hoặc hệ thống quản lý nội dung (CMS).</p>
                    
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
                    
                    <blockquote class="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50 italic text-gray-700 my-6">
                        "Giáo dục là vũ khí mạnh nhất mà bạn có thể sử dụng để thay đổi thế giới." - Nelson Mandela
                    </blockquote>
                    
                    <p>Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.</p>
                    
                    <p>Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.</p>
                    
                    <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">Tầm quan trọng của sự kiện</h3>
                    <p>Mauris ipsum nulla, egestas vel, sodales vel, consectetur in, felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In hac habitasse platea dictumst.</p>
                    
                    <ul class="list-disc pl-6 space-y-2 my-4">
                        <li>Tăng cường kết nối giữa nhà trường và sinh viên</li>
                        <li>Cung cấp thông tin cập nhật về các chương trình đào tạo</li>
                        <li>Tạo cơ hội giao lưu và học hỏi</li>
                        <li>Phát triển kỹ năng và kiến thức chuyên môn</li>
                    </ul>
                    
                    <p>Sed et enim vel tellus tempor faucibus. Aliquam erat volutpat. Suspendisse potenti. Vestibulum lacinia, massa eu sagittis iaculis, dui lacus vehicula enim, eu faucibus purus nunc a magna.</p>
                </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-8">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">#${news.category.toLowerCase()}</span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">#nsg</span>
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">#tintuc</span>
                <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">#sukien</span>
            </div>

            <!-- Related News -->
            <div id="related-news" class="border-t pt-8">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Bài viết liên quan</h3>
                <div id="related-news-list" class="space-y-4">
                    <!-- Related news will be loaded here -->
                </div>
            </div>
        `;

        // Add event listeners
        setupEventListeners(news);
    }

    function setupEventListeners(news) {
        const likeBtn = document.getElementById('like-btn');
        const bookmarkBtn = document.getElementById('bookmark-btn');
        const shareBtn = document.getElementById('share-btn');
        const likeCount = document.getElementById('like-count');

        let isLiked = false;
        let isBookmarked = false;

        // Like functionality
        likeBtn.addEventListener('click', function() {
            isLiked = !isLiked;
            const icon = this.querySelector('i');
            const count = parseInt(likeCount.textContent);
            
            if (isLiked) {
                icon.classList.remove('bx-heart');
                icon.classList.add('bxs-heart');
                this.classList.add('text-red-500');
                likeCount.textContent = count + 1;
                showToast('Đã thích bài viết', 'success');
            } else {
                icon.classList.remove('bxs-heart');
                icon.classList.add('bx-heart');
                this.classList.remove('text-red-500');
                likeCount.textContent = count - 1;
                showToast('Đã bỏ thích bài viết', 'info');
            }
        });

        // Bookmark functionality
        bookmarkBtn.addEventListener('click', function() {
            isBookmarked = !isBookmarked;
            const icon = this.querySelector('i');
            const text = this.querySelector('span');
            
            if (isBookmarked) {
                icon.classList.remove('bx-bookmark');
                icon.classList.add('bxs-bookmark');
                this.classList.add('text-blue-500');
                text.textContent = 'Đã lưu';
                showToast('Đã lưu bài viết', 'success');
            } else {
                icon.classList.remove('bxs-bookmark');
                icon.classList.add('bx-bookmark');
                this.classList.remove('text-blue-500');
                text.textContent = 'Lưu';
                showToast('Đã bỏ lưu bài viết', 'info');
            }
        });

        // Share functionality
        shareBtn.addEventListener('click', function() {
            if (window.zmp) {
                zmp.share({
                    type: 'link',
                    data: {
                        title: news.title,
                        description: news.excerpt,
                        thumbnail: news.imageUrl,
                        path: `pages/detail?id=${news.id}`
                    }
                });
            } else if (navigator.share) {
                navigator.share({
                    title: news.title,
                    text: news.excerpt,
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('Đã copy link bài viết', 'success');
                });
            }
        });
    }

    function trackView(newsId) {
        console.log(`Tracking view for news ID: ${newsId}`);
        // In a real app, send analytics data to your backend
    }

    function loadRelatedNews(category, currentId) {
        const relatedNewsList = document.getElementById('related-news-list');
        const allNews = getSampleNews();
        const relatedNews = allNews
            .filter(news => news.category === category && news.id !== currentId)
            .slice(0, 3);

        if (relatedNews.length === 0) {
            document.getElementById('related-news').style.display = 'none';
            return;
        }

        relatedNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'flex space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer';
            newsCard.onclick = () => {
                window.location.href = `./detail.html?id=${news.id}`;
            };
            
            newsCard.innerHTML = `
                <img src="${news.imageUrl}" alt="${news.title}" class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2">${news.title}</h4>
                    <p class="text-gray-600 text-xs mb-2 line-clamp-2">${news.excerpt}</p>
                    <div class="flex items-center text-xs text-gray-500">
                        <span class="mr-3">${news.category}</span>
                        <span>23/09/2025</span>
                    </div>
                </div>
            `;
            
            relatedNewsList.appendChild(newsCard);
        });
    }

    function showToast(message, type = 'info') {
        if (window.zmp) {
            zmp.showToast({
                message: message,
                type: type
            });
        } else {
            console.log(`Toast: ${message}`);
        }
    }
});

function goBack() {
    if (window.zmp) {
        zmp.navigateBack();
    } else {
        history.back();
    }
}
