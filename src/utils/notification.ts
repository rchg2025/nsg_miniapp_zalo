/**
 * Hiển thị th�ng b�o thay thế cho alert()
 * Sử dụng window.alert nhưng với prefix "Th�ng b�o"
 * @param message Nội dung th�ng b�o
 * @param type Loại th�ng b�o: success, error, warning, info
 */
export const showNotification = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) => {
  const icon = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }[type];

  window.alert(`${icon} Th�ng b�o\n\n${message}`);
};

/**
 * Hiển thị th�ng b�o th�nh c�ng
 */
export const showSuccess = (message: string) => {
  showNotification(message, 'success');
};

/**
 * Hiển thị th�ng b�o lỗi
 */
export const showError = (message: string) => {
  showNotification(message, 'error');
};

/**
 * Hiển thị th�ng b�o cảnh b�o
 */
export const showWarning = (message: string) => {
  showNotification(message, 'warning');
};

/**
 * Hiển thị th�ng b�o th�ng tin
 */
export const showInfo = (message: string) => {
  showNotification(message, 'info');
};

/**
 * Hiển thị dialog x�c nhận (thay thế confirm())
 */
export const showConfirm = async (message: string, title: string = 'X�c nhận'): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.confirm(`${title}\n\n${message}`)) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
