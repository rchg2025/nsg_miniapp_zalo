# ✅ TRANG CHỦ - CẤU TRÚC HOÀN CHỈNH

## 📱 **CẤU TRÚC TRANG CHỦ:**

### **7 PHẦN CHÍNH:**

```
┌────────────────────────────────────┐
│ 1. Slide Banner Sự kiện (Top)     │ ← Auto slide 4s
├────────────────────────────────────┤
│ 2. Thống kê nhanh (4 cards)       │ ← Click → Navigate
├────────────────────────────────────┤
│ 3. Chuyên mục (6 icons)           │ ← Click → Navigate
├────────────────────────────────────┤
│ 4. Ngành đào tạo (4 cards)        │ ← Click → Detail
├────────────────────────────────────┤
│ 5. Thông báo (3 items)            │ ← Click → Detail
├────────────────────────────────────┤
│ 6. Tin tức (3 items)              │ ← Click → Detail
├────────────────────────────────────┤
│ 7. Sự kiện (3 items)              │ ← Click → Detail
└────────────────────────────────────┘
```

---

## 🎯 **CHI TIẾT TỪNG PHẦN:**

### **1. 📸 Slide Banner Sự kiện**
```tsx
<EventSlider events={newsData.events} onEventClick={handleNewsClick} />
```

**Tính năng:**
- ✅ Hiển thị 5 sự kiện nổi bật
- ✅ Auto slide mỗi 4 giây
- ✅ Dots indicator
- ✅ Gradient overlay
- ✅ Click → Xem chi tiết sự kiện
- ✅ Image với fallback placeholder

**Navigation:**
- Click banner → `/news/{id}` (Chi tiết sự kiện)

---

### **2. 📊 Thống kê nhanh (4 Cards)**
```tsx
<StatsSection stats={stats} />
```

**4 Card:**

#### **a) 🎓 Ngành đào tạo**
- Hiển thị: Số lượng ngành active
- Click → `/majors` (Danh sách ngành)

#### **b) 📰 Tin tức**
- Hiển thị: Số tin tức published
- Click → `/news?category=tin-tuc`

#### **c) 📢 Thông báo**
- Hiển thị: Số thông báo published
- Click → `/news?category=thong-bao`

#### **d) 👥 Đăng ký TS**
- Hiển thị: "Mở" hoặc status
- Click → `/admission-registration` (Form đăng ký)

**Màu sắc:**
- Ngành: `bg-blue-500`
- Tin tức: `bg-green-500`
- Thông báo: `bg-red-500`
- Đăng ký: `bg-purple-500`

---

### **3. 🔖 Chuyên mục (6 Icons)**
```tsx
<QuickMenuSection />
```

**6 Menu:**

| Icon | Label | Route | Color |
|------|-------|-------|-------|
| 📝 | Tin tức | `/news?category=tin-tuc` | Blue |
| 📢 | Thông báo | `/news?category=thong-bao` | Red |
| 🎉 | Sự kiện | `/news?category=su-kien` | Purple |
| 🎓 | Ngành học | `/majors` | Green |
| 📋 | Đăng ký | `/admission-registration` | Orange |
| 👤 | Cá nhân | `/profile` | Gray |

**Layout:** Grid 3 cột x 2 hàng

---

### **4. 📚 Ngành đào tạo (4 Cards)**
```tsx
<MajorsSection majors={majors} />
```

**Hiển thị:**
- 4 ngành đầu tiên (active)
- Mỗi card: Name, Code, Icon letter
- Gradient background: Blue 400 → Blue 600

**Navigation:**
- Click card → `/majors/{id}` (Chi tiết ngành)
- Click "Xem tất cả" → `/majors` (Danh sách đầy đủ)

---

### **5. 📢 Thông báo (3 Items Compact)**
```tsx
<NewsCompactSection
  title="Thông báo"
  icon="📢"
  color="text-red-600"
  news={newsData.announcements}
  onSeeAll={() => navigate('/news?category=thong-bao')}
  onNewsClick={handleNewsClick}
/>
```

**Hiển thị:**
- 3 thông báo mới nhất
- Layout: Image (80x80) + Title + Date
- Red color theme

**Navigation:**
- Click item → `/news/{id}` (Chi tiết)
- Click "Xem tất cả" → `/news?category=thong-bao`

---

### **6. 📰 Tin tức (3 Items Compact)**
```tsx
<NewsCompactSection
  title="Tin tức"
  icon="📰"
  color="text-blue-600"
  news={newsData.news}
  onSeeAll={() => navigate('/news?category=tin-tuc')}
  onNewsClick={handleNewsClick}
/>
```

**Hiển thị:**
- 3 tin tức mới nhất
- Layout: Image (80x80) + Title + Date
- Blue color theme

**Navigation:**
- Click item → `/news/{id}` (Chi tiết)
- Click "Xem tất cả" → `/news?category=tin-tuc`

---

### **7. 🎉 Sự kiện (3 Items Compact)**
```tsx
<NewsCompactSection
  title="Sự kiện"
  icon="🎉"
  color="text-purple-600"
  news={newsData.events}
  onSeeAll={() => navigate('/news?category=su-kien')}
  onNewsClick={handleNewsClick}
/>
```

**Hiển thị:**
- 3 sự kiện mới nhất
- Layout: Image (80x80) + Title + Date
- Purple color theme

**Navigation:**
- Click item → `/news/{id}` (Chi tiết)
- Click "Xem tất cả" → `/news?category=su-kien`

---

## 🗺️ **NAVIGATION MAP:**

### **Từ Trang chủ có thể đi đến:**

```
TRANG CHỦ (/)
├── /news/{id} ............ Chi tiết tin tức/sự kiện/thông báo
├── /news?category=tin-tuc ............ Danh sách tin tức
├── /news?category=thong-bao .......... Danh sách thông báo
├── /news?category=su-kien ............ Danh sách sự kiện
├── /majors ....................... Danh sách ngành học
├── /majors/{id} .................. Chi tiết ngành học
├── /admission-registration ....... Form đăng ký tuyển sinh
└── /profile ...................... Trang cá nhân
```

---

## 📦 **ĐỒNG BỘ DỮ LIỆU:**

### **Dual-Key Strategy:**

```javascript
// Tin tức
adminNewsList (Admin write) → app_news_data (App read)

// Ngành học
adminMajorsList (Admin write) → app_majors_data (App read)
```

### **Auto Sync:**
```typescript
useEffect(() => {
  const loadData = () => {
    // 1. Ưu tiên adminNewsList
    if (adminNews) {
      allNews = JSON.parse(adminNews);
      // Đồng bộ sang app_news_data
      localStorage.setItem('app_news_data', adminNews);
    }
    
    // 2. Ưu tiên adminMajorsList
    if (adminMajors) {
      allMajors = JSON.parse(adminMajors);
      // Đồng bộ sang app_majors_data
      localStorage.setItem('app_majors_data', adminMajors);
    }
  };
  
  // Listen for changes
  window.addEventListener('storage', handleStorageChange);
}, []);
```

---

## 🎨 **COMPONENTS:**

### **1. EventSlider**
- Auto slide 4 giây
- Dots indicator
- Gradient overlay
- Touch/click to view detail

### **2. StatsSection**
- 4 cards clickable
- Color-coded
- Navigate to specific pages

### **3. QuickMenuSection**
- 6 menu items
- Icon + label
- 3x2 grid layout

### **4. MajorsSection**
- 4 major cards
- Click to detail
- "Xem tất cả" button

### **5. NewsCompactSection**
- Reusable component
- Title, icon, color configurable
- 3 items with image + title + date
- "Xem tất cả" button

---

## 🔍 **FILTER & CATEGORY:**

### **News categories:**
- `tin-tuc` → Tin tức
- `thong-bao` → Thông báo
- `su-kien` → Sự kiện

### **Filter logic:**
```typescript
const events = allNews.filter(n => 
  n.category === 'su-kien' && n.status === 'published'
);

const news = allNews.filter(n => 
  n.category === 'tin-tuc' && n.status === 'published'
);

const announcements = allNews.filter(n => 
  n.category === 'thong-bao' && n.status === 'published'
);
```

---

## 🖼️ **IMAGE HANDLING:**

### **Safe image display:**
```typescript
import { getImageUrl, handleImageError } from "@/utils/image-utils";

<img
  src={getImageUrl(item, item.title)}
  alt={item.title}
  onError={(e) => handleImageError(e, item.title)}
/>
```

**Fallback:**
- Nếu không có image → Placeholder với text
- onError → Thay bằng placeholder

---

## ✅ **CHECKLIST HOÀN THÀNH:**

### **UI Components:**
✅ Slide banner sự kiện (Auto 4s)  
✅ Thống kê 4 cards (Clickable)  
✅ Chuyên mục 6 icons (Clickable)  
✅ Ngành đào tạo 4 cards (Clickable)  
✅ Thông báo 3 items (Compact)  
✅ Tin tức 3 items (Compact)  
✅ Sự kiện 3 items (Compact)  

### **Navigation:**
✅ Tất cả cards/items đều clickable  
✅ Navigate đúng route  
✅ Query params cho category  
✅ "Xem tất cả" buttons  

### **Data Sync:**
✅ Load từ adminNewsList → app_news_data  
✅ Load từ adminMajorsList → app_majors_data  
✅ Auto sync khi admin thay đổi  
✅ Storage event listener  

### **Styling:**
✅ Color-coded sections  
✅ Responsive grid layouts  
✅ Hover effects  
✅ Gradient backgrounds  
✅ Shadow effects  

---

## 🚀 **TESTING:**

### **Test data:**
Chạy `seed-demo-data.js` để có:
- 11 tin tức (4 tin-tuc, 3 thong-bao, 4 su-kien)
- 6 ngành học
- Tất cả có status = 'published'

### **Test navigation:**
1. Click slide banner → Chi tiết sự kiện
2. Click stats cards → Trang tương ứng
3. Click menu icons → Trang tương ứng
4. Click major cards → Chi tiết ngành
5. Click news items → Chi tiết tin
6. Click "Xem tất cả" → Danh sách đầy đủ

---

## 🎉 **HOÀN THÀNH!**

Trang chủ đã có:
✅ **7 phần hoàn chỉnh**  
✅ **Tất cả navigation hoạt động**  
✅ **Data sync từ admin**  
✅ **Image fallback an toàn**  
✅ **Responsive design**  
✅ **Color-coded sections**  

**Sẵn sàng sử dụng!** 🚀
