/**
 * Hiển thị thông báo thay thế cho alert()
 * Sử dụng window.alert nhưng với prefix "Thông báo"
 * @param message Nội dung thông báo
 * @param type Loại thông báo: success, error, warning, info
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

  window.alert(`${icon} Thông báo\n\n${message}`);
};

/**
 * Hiển thị thông báo thành công
 */
export const showSuccess = (message: string) => {
  showNotification(message, 'success');
};

/**
 * Hiển thị thông báo lỗi
 */
export const showError = (message: string) => {
  showNotification(message, 'error');
};

/**
 * Hiển thị thông báo cảnh báo
 */
export const showWarning = (message: string) => {
  showNotification(message, 'warning');
};

/**
 * Hiển thị thông báo thông tin
 */
export const showInfo = (message: string) => {
  showNotification(message, 'info');
};

/**
 * Hiển thị dialog xác nhận (thay thế confirm())
 */
export const showConfirm = async (message: string, title: string = 'Xác nhận'): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.confirm(`${title}\n\n${message}`)) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
