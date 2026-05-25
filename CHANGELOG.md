# 📝 CHANGELOG - BT05

## Version 1.0 - Mở Rộng Tính Năng Hiển Thị Sản Phẩm

### ✨ Tính Năng Mới

#### 1. Danh Mục Sản Phẩm (Category Products Page)

- **Route:** `/category/:categorySlug`
- **Page:** `CategoryProductsPage.jsx`
- Hiển thị tất cả sản phẩm của một danh mục cụ thể
- Phân trang đầy đủ (Previous/Next + Số trang)
- Sắp xếp: Mới nhất, Bán chạy, Giá (Thấp-Cao, Cao-Thấp), Đánh giá, Xem nhiều
- API: `GET /products/category/:categorySlug`

#### 2. Sản Phẩm Nổi Bật (Top Products Page)

- **Route:** `/top-products`
- **Page:** `TopProductsPage.jsx`
- Phần 1: 🔥 Top 10 Bán Chạy Nhất
- Phần 2: 👀 Top 10 Xem Nhiều Nhất
- Swiper Carousel với phân trang ngang
- Nút điều hướng: Prev/Next + Chỉ số trang
- APIs:
  - `GET /products/top/bestsellers`
  - `GET /products/top/mostviewed`

### 🔧 Backend Changes

**Models**

- `Product.model.js`: Thêm field `views: { type: Number, default: 0 }`

**Controllers**

- `product.controller.js`:
  - Cập nhật `getProductBySlug()` - Tự động increment `views` khi xem chi tiết
  - Thêm `getProductsByCategory()` - Lấy sản phẩm theo danh mục với phân trang
  - Thêm `getBestSellers()` - Top 10 sản phẩm bán chạy nhất
  - Thêm `getMostViewed()` - Top 10 sản phẩm xem nhiều nhất

**Routes**

- `api.js`:
  - `GET /products/category/:categorySlug` → getProductsByCategory
  - `GET /products/top/bestsellers` → getBestSellers
  - `GET /products/top/mostviewed` → getMostViewed

### 🎨 Frontend Changes

**New Pages**

- `CategoryProductsPage.jsx` - Danh mục sản phẩm
- `TopProductsPage.jsx` - Sản phẩm nổi bật

**Updated Pages**

- `HomePage.jsx`: Thêm nút "Sản Phẩm Nổi Bật" ở hero banner

**Updated Components**

- `Header.jsx`:
  - Thêm Danh mục dropdown menu
  - Thêm link "Sản phẩm Nổi Bật"
  - Load categories từ API

**Updated Files**

- `App.jsx`: Thêm 2 routes mới
- `api.js`: Thêm 3 API functions

### 📍 Navigation Updates

**Header Menu**

```
Logo | Search | Danh mục ▼ | Sản phẩm Nổi Bật | Đăng nhập
```

**Danh mục Dropdown**

```
- Điện thoại      → /category/dien-thoai
- Laptop          → /category/laptop
- Máy tính bảng   → /category/may-tinh-bang
- ...
```

**HomePage Links**

- Nút "Sản Phẩm Nổi Bật" → /top-products ✨

### 🔄 User Flow Mới

1. **Xem danh mục sản phẩm**
   - Header: Click "Danh mục" → Chọn danh mục
   - HomePage: Click "Xem tất cả" trong mỗi danh mục
   - Result: Trang CategoryProductsPage với phân trang

2. **Xem sản phẩm nổi bật**
   - Header: Click "Sản phẩm Nổi Bật"
   - HomePage: Click nút "Sản Phẩm Nổi Bật" ở hero banner
   - Result: Trang TopProductsPage với 2 carousel

3. **Tự động tăng lượt xem**
   - Khi xem chi tiết sản phẩm (`/product/:slug`)
   - Field `views` tăng lên 1
   - Sản phẩm được sắp xếp theo lượt xem trên CategoryProductsPage

### 📊 API Endpoints

| Method | Endpoint                           | Description                              |
| ------ | ---------------------------------- | ---------------------------------------- |
| GET    | `/products/category/:categorySlug` | Lấy sản phẩm theo danh mục               |
| GET    | `/products/top/bestsellers`        | Lấy top 10 bán chạy nhất                 |
| GET    | `/products/top/mostviewed`         | Lấy top 10 xem nhiều nhất                |
| GET    | `/products/:slug`                  | Chi tiết sản phẩm (cập nhật: tăng views) |

### 🎯 Query Parameters

**Category Products**

- `page=1` - Số trang (default: 1)
- `limit=12` - Số sản phẩm/trang (default: 12)
- `sort=newest` - Kiểu sắp xếp (newest/bestSeller/priceLow/priceHigh/rating/mostViewed)

**Best Sellers & Most Viewed**

- `page=1` - Số trang (default: 1)
- `limit=10` - Số sản phẩm/trang (default: 10)

### 🧪 Kiểm Tra

✅ Danh mục sản phẩm hiển thị đúng
✅ Phân trang hoạt động
✅ Sắp xếp hoạt động
✅ Top sản phẩm hiển thị đúng
✅ Swiper carousel hoạt động
✅ Lượt xem tăng lên khi xem chi tiết
✅ Header menu cập nhật
✅ Navigation hoạt động

### 📝 Notes

- Sử dụng Swiper v11+ để hiển thị carousel
- Categories được load từ API
- Responsive design: Mobile → Tablet → Desktop
- All routes protected by PrivateRoute (yêu cầu đăng nhập)

### 🔮 Future Improvements

- [ ] Lazy loading sản phẩm (Intersection Observer)
- [ ] Advanced filters cho category page (price, rating, etc.)
- [ ] Infinite scroll thay thế phân trang
- [ ] Caching sản phẩm (Redis)
- [ ] Sort recently viewed products
- [ ] Wishlist functionality
- [ ] Product comparison
