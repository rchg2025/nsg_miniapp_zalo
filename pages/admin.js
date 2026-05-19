document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const addNewsForm = document.getElementById('add-news-form');
    const imageUrlInput = document.getElementById('news-image-url');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const previewBtn = document.getElementById('preview-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const successModal = document.getElementById('success-modal');
    const closeSuccessModal = document.getElementById('close-success-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update button states
            tabBtns.forEach(b => {
                b.classList.remove('active', 'border-blue-600', 'text-blue-600');
                b.classList.add('border-transparent', 'text-gray-500');
            });
            this.classList.add('active', 'border-blue-600', 'text-blue-600');
            this.classList.remove('border-transparent', 'text-gray-500');
            
            // Show/hide content
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
            
            // Load specific content
            if (tabId === 'manage') {
                loadNewsList();
            } else if (tabId === 'stats') {
                loadStatistics();
            }
        });
    });

    // Image preview
    imageUrlInput.addEventListener('input', function() {
        const url = this.value.trim();
        if (url && isValidUrl(url)) {
            previewImg.src = url;
            imagePreview.classList.remove('hidden');
        } else {
            imagePreview.classList.add('hidden');
        }
    });

    // Preview button
    previewBtn.addEventListener('click', function() {
        const formData = new FormData(addNewsForm);
        const newsData = Object.fromEntries(formData.entries());
        
        if (!validateForm(newsData)) {
            showToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }
        
        showPreview(newsData);
    });

    // Form submission
    addNewsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const newsData = Object.fromEntries(formData.entries());
        
        if (!validateForm(newsData)) {
            showToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }
        
        submitNews(newsData);
    });

    // Character counter for excerpt
    const excerptInput = document.getElementById('news-excerpt');
    excerptInput.addEventListener('input', function() {
        const maxLength = 200;
        const current = this.value.length;
        const counter = this.parentElement.querySelector('.text-xs');
        
        if (current > maxLength) {
            this.value = this.value.substring(0, maxLength);
            counter.textContent = `Đã đạt giới hạn ${maxLength} ký tự`;
            counter.classList.add('text-red-500');
        } else {
            counter.textContent = `${current}/${maxLength} ký tự`;
            counter.classList.remove('text-red-500');
        }
    });

    // Close success modal
    closeSuccessModal.addEventListener('click', function() {
        successModal.classList.add('hidden');
    });

    // Refresh button
    refreshBtn.addEventListener('click', function() {
        this.querySelector('i').classList.add('animate-spin');
        setTimeout(() => {
            this.querySelector('i').classList.remove('animate-spin');
            showToast('Đã làm mới dữ liệu', 'success');
        }, 1000);
    });

    // Utility functions
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function validateForm(data) {
        return data.title && data.category && data.imageUrl && data.excerpt && data.content;
    }

    function showToast(message, type = 'info') {
        if (window.zmp) {
            zmp.showToast({
                message: message,
                type: type
            });
        } else {
            alert(message);
        }
    }

    function showLoading() {
        loadingOverlay.classList.remove('hidden');
    }

    function hideLoading() {
        loadingOverlay.classList.add('hidden');
    }

    function showPreview(newsData) {
        if (window.zmp) {
            zmp.showModal({
                title: 'Xem trước bài viết',
                content: `Tiêu đề: ${newsData.title}\n\nChuyên mục: ${newsData.category}\n\nMô tả: ${newsData.excerpt}\n\nNội dung: ${newsData.content.substring(0, 100)}...`,
                confirmText: 'Đóng'
            });
        } else {
            alert(`Xem trước:\n\nTiêu đề: ${newsData.title}\nChuyên mục: ${newsData.category}\nMô tả: ${newsData.excerpt}`);
        }
    }

    function submitNews(newsData) {
        showLoading();
        
        // Simulate API call
        setTimeout(() => {
            hideLoading();
            
            // Add ID and timestamp
            newsData.id = Date.now();
            newsData.createdAt = new Date().toISOString();
            
            console.log('Dữ liệu bài viết mới:', newsData);
            
            // ================== PHẦN DÀNH CHO BACKEND ==================
            //
            // Để kết nối với API backend của trường:
            // 1. Thay thế URL API dưới đây bằng endpoint thật
            // 2. Cấu hình authentication token
            // 3. Handle response và error properly
            //
            // Ví dụ:
            // fetch('https://api.nsg.edu.vn/articles', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': 'Bearer YOUR_API_TOKEN',
            //         'X-App-ID': 'YOUR_ZALO_APP_ID'
            //     },
            //     body: JSON.stringify(newsData)
            // })
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error(`HTTP error! status: ${response.status}`);
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     console.log('Article created:', data);
            //     successModal.classList.remove('hidden');
            //     addNewsForm.reset();
            //     imagePreview.classList.add('hidden');
            // })
            // .catch((error) => {
            //     console.error('Error creating article:', error);
            //     showToast('Đã có lỗi xảy ra khi đăng bài!', 'error');
            // });
            //
            // ==========================================================
            
            // Giả lập thành công
            successModal.classList.remove('hidden');
            addNewsForm.reset();
            imagePreview.classList.add('hidden');
            
        }, 1500);
    }

    function loadNewsList() {
        const newsList = document.getElementById('news-list');
        const sampleNews = getSampleNews();
        
        newsList.innerHTML = '';
        
        sampleNews.forEach((news, index) => {
            const newsItem = document.createElement('div');
            newsItem.className = 'p-4 hover:bg-gray-50';
            newsItem.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${news.imageUrl}" alt="${news.title}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800 text-sm">${news.title}</h3>
                        <p class="text-xs text-gray-600 mt-1">${news.category} • 23/09/2025</p>
                        <p class="text-xs text-gray-500 mt-1">${news.excerpt.substring(0, 80)}...</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="text-blue-600 hover:bg-blue-50 p-2 rounded" onclick="editNews(${news.id})">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="text-red-600 hover:bg-red-50 p-2 rounded" onclick="deleteNews(${news.id})">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </div>
            `;
            newsList.appendChild(newsItem);
        });
    }

    function loadStatistics() {
        const popularNews = document.getElementById('popular-news');
        const sampleNews = getSampleNews().slice(0, 5);
        
        popularNews.innerHTML = '';
        
        sampleNews.forEach((news, index) => {
            const newsItem = document.createElement('div');
            newsItem.className = 'flex items-center space-x-3 p-2 hover:bg-gray-50 rounded';
            newsItem.innerHTML = `
                <span class="text-lg font-bold text-gray-400">${index + 1}</span>
                <img src="${news.imageUrl}" alt="${news.title}" class="w-12 h-12 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-800 text-sm">${news.title}</h4>
                    <p class="text-xs text-gray-500">${Math.floor(Math.random() * 500) + 100} lượt xem</p>
                </div>
            `;
            popularNews.appendChild(newsItem);
        });
    }

    // Global functions
    window.editNews = function(id) {
        showToast(`Chỉnh sửa bài viết ID: ${id}`, 'info');
        // TODO: Implement edit functionality
    };

    window.deleteNews = function(id) {
        if (window.zmp) {
            zmp.showModal({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa bài viết này không?',
                confirmText: 'Xóa',
                cancelText: 'Hủy',
                success: (res) => {
                    if (res.confirm) {
                        showToast('Đã xóa bài viết', 'success');
                        loadNewsList();
                    }
                }
            });
        } else {
            if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
                showToast('Đã xóa bài viết', 'success');
                loadNewsList();
            }
        }
    };

    window.goBack = function() {
        if (window.zmp) {
            zmp.navigateBack();
        } else {
            history.back();
        }
    };
});
