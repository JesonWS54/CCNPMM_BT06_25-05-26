# BT05 - Hướng Dẫn Triển Khai Tính Năng Mới

## 📝 Tổng Quan

Bài tập BT05 mở rộng từ BT04 với hai tính năng chính:

1. **Hiển thị sản phẩm theo danh mục** với phân trang (pagination)
2. **Hiển thị top 10 sản phẩm** (bán chạy nhất & xem nhiều nhất) với phân trang theo chiều ngang

---

## 🎯 Tính Năng 1: Danh Mục Sản Phẩm với Phân Trang

### 📋 Mô Tả

- Hiển thị **tất cả sản phẩm** của một danh mục cụ thể
- Hỗ trợ **phân trang** (12 sản phẩm/trang)
- Cho phép **sắp xếp** theo: Mới nhất, Bán chạy, Giá, Đánh giá, Xem nhiều nhất
- Breadcrumb navigation và tiêu đề danh mục

### 🔧 Backend (API)

#### Endpoint Mới

```
GET /api/v1/products/category/:categorySlug?page=1&limit=12&sort=newest
```

#### Tham Số Query

- `page` (default: 1) - Số trang
- `limit` (default: 12) - Số sản phẩm/trang
- `sort` (default: newest) - Kiểu sắp xếp
  - `newest` - Mới nhất
  - `bestSeller` - Bán chạy nhất
  - `priceLow` - Giá thấp → cao
  - `priceHigh` - Giá cao → thấp
  - `rating` - Đánh giá cao nhất
  - `mostViewed` - Xem nhiều nhất

#### Response

```json
{
  "category": {
    "name": "Điện thoại",
    "slug": "dien-thoai"
  },
  "data": [
    {
      "_id": "...",
      "name": "iPhone 15",
      "slug": "iphone-15",
      "price": 25000000,
      "salePrice": 22000000,
      "images": ["..."],
      "sold": 150,
      "rating": 4.8,
      "stock": 10,
      "category": { "name": "Điện thoại", "slug": "dien-thoai" }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

#### Controller Method

File: `backend/src/controllers/product.controller.js`

```javascript
export const getProductsByCategory = async (req, res) => {
  // Lấy sản phẩm theo danh mục với phân trang
};
```

### 🎨 Frontend

#### Page Component

File: `frontend/src/pages/CategoryProductsPage.jsx`

**Features:**

- Sắp xếp sản phẩm theo nhiều tiêu chí
- Phân trang (Previous | 1 2 3 4 | Next)
- Breadcrumb navigation
- Lưới sản phẩm responsive (2 cols mobile, 3 cols tablet, 4 cols desktop)

#### Route

```javascript
<Route path="/category/:categorySlug" element={<CategoryProductsPage />} />
```

#### Cách Sử Dụng

- **URL:** `/category/dien-thoai?page=1&sort=newest`
- **Link từ Header:** Danh mục dropdown menu
- **Link từ HomePage:** "Xem tất cả" trong mỗi danh mục

#### API Call

```javascript
import { getProductsByCategoryApi } from "../api/api";

const response = await getProductsByCategoryApi("dien-thoai", {
  page: 1,
  limit: 12,
  sort: "newest",
});
```

---

## 🎯 Tính Năng 2: Top Sản Phẩm (Best Sellers & Most Viewed)

### 📋 Mô Tả

- Hiển thị **10 sản phẩm bán chạy nhất**
- Hiển thị **10 sản phẩm xem nhiều nhất**
- Phân trang **theo chiều ngang** (Swiper carousel)
- Điều hướng: nút prev/next + chỉ số trang
- 2 phần riêng biệt trên một trang

### 🔧 Backend (API)

#### Endpoints Mới

```
GET /api/v1/products/top/bestsellers?page=1&limit=10
GET /api/v1/products/top/mostviewed?page=1&limit=10
```

#### Tham Số Query

- `page` (default: 1) - Số trang
- `limit` (default: 10) - Số sản phẩm/trang

#### Response

```json
{
  "title": "Sản Phẩm Bán Chạy Nhất",
  "data": [
    {
      "_id": "...",
      "name": "iPhone 15",
      "slug": "iphone-15",
      "price": 25000000,
      "salePrice": 22000000,
      "images": ["..."],
      "sold": 500,
      "views": 10000,
      "rating": 4.8,
      "category": { "name": "Điện thoại" }
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
```

#### Controller Methods

File: `backend/src/controllers/product.controller.js`

```javascript
export const getBestSellers = async (req, res) => {
  // Lấy 10 sản phẩm bán chạy nhất
};

export const getMostViewed = async (req, res) => {
  // Lấy 10 sản phẩm xem nhiều nhất
};
```

#### Model Changes

File: `backend/src/models/product.model.js`

- Thêm trường `views: { type: Number, default: 0 }`
- Tự động tăng `views` khi xem chi tiết sản phẩm

### 🎨 Frontend

#### Page Component

File: `frontend/src/pages/TopProductsPage.jsx`

**Features:**

- **2 phần chính:**
  1. 🔥 Sản Phẩm Bán Chạy Nhất
  2. 👀 Sản Phẩm Xem Nhiều Nhất
- **Swiper Carousel** với điều hướng ngang
  - Nút prev/next (< >)
  - Chỉ số trang (01/05)
  - Responsive breakpoints:
    - 1 col (mobile)
    - 2 cols (640px)
    - 3 cols (768px)
    - 4 cols (1024px)
    - 5 cols (1280px)

#### Route

```javascript
<Route path="/top-products" element={<TopProductsPage />} />
```

#### Cách Sử Dụng

- **URL:** `/top-products`
- **Link từ HomePage:** Nút "Sản Phẩm Nổi Bật" (hero banner)
- **Link từ Header:** "Sản phẩm Nổi Bật" (menu)

#### API Calls

```javascript
import { getBestSellersApi, getMostViewedApi } from "../api/api";

// Lấy best sellers
const bestSellers = await getBestSellersApi({ page: 1, limit: 10 });

// Lấy most viewed
const mostViewed = await getMostViewedApi({ page: 1, limit: 10 });
```

---

## 🔄 Navigation Updates

### Header Changes

- **Danh mục Dropdown** - Hiển thị tất cả danh mục, link đến category page
- **Sản phẩm Nổi Bật** - Link đến `/top-products`

### HomePage Changes

- Thêm nút **"Sản Phẩm Nổi Bật"** ở hero banner
- Liên kết đến `/top-products`

### Routing Updates (App.jsx)

```javascript
<Route path="/category/:categorySlug" element={<CategoryProductsPage />} />
<Route path="/top-products" element={<TopProductsPage />} />
```

---

## 📊 Flow Đã Triển Khai

```
HomePage
├── Hero Banner
│   ├── "Mua Ngay" → /search
│   ├── "Xem Bán Chạy" → /search?sort=bestSeller
│   └── "Sản Phẩm Nổi Bật" → /top-products ✨
├── Khuyến Mãi HOT → /search?sort=newest
├── Hàng Mới Về → /search?isNew=true
├── Bán Chạy Nhất → /search?sort=bestSeller
└── Sản Phẩm Nổi Bật → /search?isFeatured=true

Header
├── Logo → /
├── Search → SearchPage
├── Danh mục ▼ → /category/:categorySlug ✨
├── Sản phẩm Nổi Bật → /top-products ✨
└── Đăng nhập/Đăng xuất

TopProductsPage (/top-products) ✨
├── 🔥 Sản Phẩm Bán Chạy Nhất (Swiper Carousel)
│   └── Phân trang ngang
└── 👀 Sản Phẩm Xem Nhiều Nhất (Swiper Carousel)
    └── Phân trang ngang

CategoryProductsPage (/category/:categorySlug) ✨
├── Breadcrumb
├── Tiêu đề danh mục
├── Sắp xếp (dropdown)
└── Lưới sản phẩm + Phân trang
```

---

## 🛠 File Thay Đổi

### Backend

- ✏️ `backend/src/models/product.model.js` - Thêm `views` field
- ✏️ `backend/src/controllers/product.controller.js` - Thêm 3 methods mới
- ✏️ `backend/src/routes/api.js` - Thêm 3 routes mới

### Frontend

- ✏️ `frontend/src/api/api.js` - Thêm 3 API functions
- ✏️ `frontend/src/App.jsx` - Thêm 2 routes mới
- ✏️ `frontend/src/pages/HomePage.jsx` - Thêm link "Sản Phẩm Nổi Bật"
- ✏️ `frontend/src/components/layout/Header.jsx` - Thêm danh mục dropdown + link
- ✨ `frontend/src/pages/CategoryProductsPage.jsx` - Page mới
- ✨ `frontend/src/pages/TopProductsPage.jsx` - Page mới

---

## 🧪 Testing

### Test Danh Mục Sản Phẩm

1. Click "Danh mục" ở Header → Chọn danh mục
2. Verify: Hiển thị tất cả sản phẩm của danh mục
3. Test sắp xếp: Chọn các option sắp xếp
4. Test phân trang: Click các số trang
5. Verify URL: `/category/dien-thoai?page=1&sort=newest`

### Test Top Sản Phẩm

1. Click "Sản Phẩm Nổi Bật" ở Header hoặc HomePage
2. Verify: Hiển thị 2 phần (Best Sellers & Most Viewed)
3. Test Swiper: Scroll ngang, click prev/next
4. Verify: Chỉ số trang cập nhật (01/05, etc.)
5. Verify URL: `/top-products`

### Test View Increment

1. Xem chi tiết sản phẩm (`/product/:slug`)
2. Check: `views` field tăng lên
3. Verify: Sản phẩm xem nhiều nhất cập nhật

---

## 📌 Ghi Chú

- Lazy loading có thể được thêm vào sau bằng Intersection Observer
- Caching có thể được thêm để tối ưu hóa hiệu suất
- Filter advanced cho category page có thể được thêm (giá, rating, v.v.)
- Infinite scroll có thể là lựa chọn thay thế cho phân trang
