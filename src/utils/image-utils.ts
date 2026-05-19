/**
 * Utility functions for image handling
 */

/**
 * Tạo URL placeholder image với text t�y chỉnh
 * @param width - Chiều rộng ảnh
 * @param height - Chiều cao ảnh
 * @param text - Text hiển thị tr�n ảnh (mặc định: "Chưa c� ảnh đại diện")
 * @param bgColor - M�u nền (hex kh�ng c� #, mặc định: cccccc)
 * @param textColor - M�u chữ (hex kh�ng c� #, mặc định: 666666)
 * @returns URL của placeholder image
 */
export function getPlaceholderImage(
  width: number = 800,
  height: number = 400,
  text: string = 'Chưa c� ảnh đại diện',
  bgColor: string = 'e0e0e0',
  textColor: string = '757575'
): string {
  const encodedText = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
}

/**
 * Lấy ảnh từ object với fallback
 * @param item - Object chứa ảnh (c� thể c� image hoặc imageUrl)
 * @param fallbackText - Text hiển thị khi kh�ng c� ảnh
 * @returns URL của ảnh hoặc placeholder
 */
export function getImageUrl(
  item: { image?: string; imageUrl?: string },
  fallbackText: string = 'Chưa c� ảnh đại diện'
): string {
  const imageUrl = item.imageUrl || item.image;
  
  if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('/api/placeholder')) {
    return getPlaceholderImage(800, 400, fallbackText);
  }
  
  return imageUrl;
}

/**
 * Xử l� lỗi khi load ảnh
 * @param event - Event từ onError của img tag
 * @param fallbackText - Text hiển thị khi lỗi
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackText: string = 'Chưa c� ảnh đại diện'
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
