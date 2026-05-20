/**
 * Utility functions for image handling
 */

/**
 * Chuyển đổi Google Drive URL sang URL hiển thị trực tiếp
 * Hỗ trợ: /file/d/ID/view, /open?id=ID, /uc?id=ID
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  // Extract FILE_ID from any Google Drive URL variant
  let fileId: string | null = null;
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (fileMatch) fileId = fileMatch[1];
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (!fileId && openMatch) fileId = openMatch[1];
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*[?&]id=([^&]+)/);
  if (!fileId && ucMatch) fileId = ucMatch[1];
  if (fileId) {
    // thumbnail endpoint serves image directly (no redirect, no auth wall)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000-h1000`;
  }
  return url;
}

/**
 * Tạo URL placeholder image với text tùy chỉnh
 * @param width - Chiều rộng ảnh
 * @param height - Chiều cao ảnh
 * @param text - Text hiển thị trên ảnh (mặc định: "Chưa có ảnh đại diện")
 * @param bgColor - Màu nền (hex không có #, mặc định: cccccc)
 * @param textColor - Màu chữ (hex không có #, mặc định: 666666)
 * @returns URL của placeholder image
 */
export function getPlaceholderImage(
  width: number = 800,
  height: number = 400,
  text: string = 'Chưa có ảnh đại diện',
  bgColor: string = 'e0e0e0',
  textColor: string = '757575'
): string {
  const encodedText = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
}

/**
 * Lấy ảnh từ object với fallback
 * @param item - Object chứa ảnh (có thể có image hoặc imageUrl)
 * @param fallbackText - Text hiển thị khi không có ảnh
 * @returns URL của ảnh hoặc placeholder
 */
export function getImageUrl(
  item: { image?: string; imageUrl?: string },
  fallbackText: string = 'Chưa có ảnh đại diện'
): string {
  const imageUrl = item.imageUrl || item.image;
  
  if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('/api/placeholder')) {
    return getPlaceholderImage(800, 400, fallbackText);
  }
  
  return convertGoogleDriveUrl(imageUrl);
}

/**
 * Xử lý lỗi khi load ảnh
 * @param event - Event từ onError của img tag
 * @param fallbackText - Text hiển thị khi lỗi
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackText: string = 'Chưa có ảnh đại diện'
): void {
  const img = event.currentTarget;
  img.src = getPlaceholderImage(800, 400, fallbackText);
}

/**
 * Validate URL của ảnh
 * @param url - URL cần validate
 * @returns true nếu URL hợp lệ
 */
export function isValidImageUrl(url?: string): boolean {
  if (!url) return false;
  
  // Kiểm tra URL hợp lệ
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
