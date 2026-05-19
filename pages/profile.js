document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const followOAButton = document.getElementById('follow-oa-button');
    const loginSection = document.getElementById('login-section');
    const userInfoSection = document.getElementById('user-info');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userId = document.getElementById('user-id');
    
    // Action buttons
    const savedArticlesBtn = document.getElementById('saved-articles-btn');
    const notificationsBtn = document.getElementById('notifications-btn');
    const feedbackBtn = document.getElementById('feedback-btn');
    const settingsBtn = document.getElementById('settings-btn');
    
    // =================== CẤU HỈN OA ID ===================
    // 
    // Để lấy OA ID của trường bạn:
    // 1. Truy cập: https://oa.zalo.me/
    // 2. Đăng nhập và tạo Official Account cho trường
    // 3. Vào Cài đặt > Thông tin cơ bản
    // 4. Copy OA ID (dạng số: 1234567890123456789)
    // 5. Thay thế 'YOUR_OA_ID_HERE' bằng OA ID thật
    //
    // Ví dụ: const OA_ID = '1234567890123456789';
    // 
    // ====================================================
    const OA_ID = '785749141891313000'; // ✅ ĐÃ CẬP NHẬT OA ID THẬT

    // Hàm hiển thị thông tin người dùng
    function showUserInfo(user) {
        userAvatar.src = user.avatar || 'https://placehold.co/100x100/005baa/FFFFFF?text=U';
        userName.textContent = user.name || 'Người dùng Zalo';
        userId.textContent = `ID: ${user.id || 'N/A'}`;
        loginSection.classList.add('hidden');
        userInfoSection.classList.remove('hidden');
    }

    // Hiển thị thông báo
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

    // Kiểm tra trạng thái đăng nhập khi tải trang
    if (window.zmp) {
        zmp.getInfo({
            success: (data) => {
                // Có thông tin app
                console.log('App info:', data);
            },
            fail: (error) => {
                console.log('Failed to get app info:', error);
            }
        });

        zmp.getUserInfo({
            success: (data) => {
                // Người dùng đã đăng nhập và cấp quyền
                showUserInfo(data.userInfo);
            },
            fail: (error) => {
                // Người dùng chưa đăng nhập hoặc chưa cấp quyền
                console.log('User not logged in:', error);
            }
        });
    }

    // Xử lý sự kiện nhấn nút Đăng nhập
    loginButton.addEventListener('click', () => {
        if (window.zmp) {
            zmp.login({
                success: () => {
                    // Đăng nhập thành công, lấy thông tin người dùng
                    zmp.getUserInfo({
                        success: (data) => {
                            showUserInfo(data.userInfo);
                            showToast(`Chào mừng ${data.userInfo.name}!`, 'success');
                        },
                        fail: (error) => {
                            console.log(error);
                            showToast('Không thể lấy thông tin người dùng. Vui lòng thử lại.', 'error');
                        }
                    });
                },
                fail: (error) => {
                    console.log(error);
                    showToast('Đăng nhập không thành công. Vui lòng thử lại.', 'error');
                }
            });
        } else {
            // Simulation for testing
            showUserInfo({
                name: 'Nguyễn Văn A',
                id: '123456789',
                avatar: 'https://placehold.co/100x100/005baa/FFFFFF?text=A'
            });
            showToast('Đăng nhập thành công (Demo)', 'success');
        }
    });
    
    // Xử lý sự kiện nhấn nút Quan tâm OA
    followOAButton.addEventListener('click', () => {
        if (OA_ID === 'YOUR_OA_ID_HERE') {
            showToast('Tính năng sẽ sớm được cập nhật', 'info');
            return;
        }
        
        if (window.zmp) {
            zmp.openOfficialAccount({
                id: OA_ID,
                success: (res) => { 
                    console.log('OA opened:', res);
                    showToast('Đã mở Official Account', 'success');
                },
                fail: (err) => { 
                    console.log('Failed to open OA:', err);
                    showToast('Không thể mở Official Account', 'error');
                }
            });
        }
    });

    // Bài viết đã lưu
    savedArticlesBtn.addEventListener('click', () => {
        showToast('Tính năng bài viết đã lưu sẽ sớm được cập nhật', 'info');
        // TODO: Implement saved articles functionality
    });

    // Thông báo
    notificationsBtn.addEventListener('click', () => {
        if (window.zmp) {
            zmp.showModal({
                title: 'Thông báo',
                content: 'Bạn có 3 thông báo mới:\n\n1. Ngày hội tuyển sinh 2025\n2. Lễ tốt nghiệp sắp diễn ra\n3. Hội thảo công nghệ 4.0',
                confirmText: 'Đóng',
                success: (res) => {
                    console.log('Modal result:', res);
                }
            });
        } else {
            alert('Bạn có 3 thông báo mới:\n\n1. Ngày hội tuyển sinh 2025\n2. Lễ tốt nghiệp sắp diễn ra\n3. Hội thảo công nghệ 4.0');
        }
    });

    // Góp ý & Phản hồi
    feedbackBtn.addEventListener('click', () => {
        if (window.zmp) {
            zmp.showModal({
                title: 'Góp ý & Phản hồi',
                content: 'Bạn có muốn gửi góp ý để cải thiện ứng dụng không?',
                confirmText: 'Gửi góp ý',
                cancelText: 'Hủy',
                success: (res) => {
                    if (res.confirm) {
                        showToast('Cảm ơn bạn đã góp ý! Chúng tôi sẽ xem xét.', 'success');
                    }
                }
            });
        } else {
            const feedback = prompt('Vui lòng nhập góp ý của bạn:');
            if (feedback) {
                showToast('Cảm ơn bạn đã góp ý!', 'success');
            }
        }
    });

    // Cài đặt
    settingsBtn.addEventListener('click', () => {
        if (window.zmp) {
            zmp.showActionSheet({
                actions: [
                    { text: 'Cài đặt thông báo', action: 'notifications' },
                    { text: 'Chế độ tối', action: 'dark_mode' },
                    { text: 'Ngôn ngữ', action: 'language' },
                    { text: 'Về chúng tôi', action: 'about' }
                ],
                success: (res) => {
                    const action = res.tapIndex;
                    switch (action) {
                        case 0:
                            showToast('Cài đặt thông báo', 'info');
                            break;
                        case 1:
                            showToast('Chế độ tối sẽ sớm được cập nhật', 'info');
                            break;
                        case 2:
                            showToast('Hiện tại chỉ hỗ trợ tiếng Việt', 'info');
                            break;
                        case 3:
                            showToast('NSG News v1.0.0\nCĐ Bách khoa Nam Sài Gòn', 'info');
                            break;
                    }
                }
            });
        } else {
            showToast('Cài đặt sẽ sớm được cập nhật', 'info');
        }
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== './profile.html') {
                e.preventDefault();
                if (window.zmp) {
                    zmp.navigateTo({
                        url: href
                    });
                } else {
                    window.location.href = href;
                }
            }
        });
    });
});

// Go back function
function goBack() {
    if (window.zmp) {
        zmp.navigateBack();
    } else {
        history.back();
    }
}
