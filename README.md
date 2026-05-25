# 📱 BT05 - Mở Rộng Tính Năng Hiển Thị Sản Phẩm

**Repository:** BT05 - Tiếp tục từ BT04

**Ngôn ngữ:** JavaScript (Node.js + React)

**Cơ sở dữ liệu:** MongoDB

---

## ✨ Tính Năng Mới

### 1️⃣ Danh Mục Sản Phẩm (Category Products)

- 📍 **Route:** `/category/:categorySlug`
- 📊 Hiển thị **tất cả sản phẩm** của một danh mục
- 📄 **Phân trang đầy đủ** (Previous | 1 2 3 | Next)
- 🔀 **6 kiểu sắp xếp:** Mới nhất, Bán chạy, Giá↑, Giá↓, Đánh giá, Xem nhiều
- 📱 **Responsive:** 2 cols (mobile), 3 cols (tablet), 4 cols (desktop)

### 2️⃣ Sản Phẩm Nổi Bật (Top Products)

- 📍 **Route:** `/top-products`
- 🔥 **Section 1:** Top 10 Bán Chạy Nhất
- 👀 **Section 2:** Top 10 Xem Nhiều Nhất
- ↔️ **Carousel Horizontal** (Swiper)
- ⬅️➡️ Nút điều hướng + Chỉ số trang
- 📱 Responsive breakpoints: 1/2/3/4/5 cols

---

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

### Frontend

- **Framework:** React 19
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS v4.3
- **Carousel:** Swiper v11+

---

## 📊 Database Updates

### Product Model

```javascript
{
  // ... existing fields
  views: { type: Number, default: 0 }  // ✨ New
}
```

**Auto-increment:** Views tăng tự động khi xem chi tiết sản phẩm

---

## 🔌 API Endpoints

| Method  | Endpoint                           | Description            |
| ------- | ---------------------------------- | ---------------------- |
| **GET** | `/products/category/:categorySlug` | Sản phẩm theo danh mục |
| **GET** | `/products/top/bestsellers`        | Top 10 bán chạy nhất   |
| **GET** | `/products/top/mostviewed`         | Top 10 xem nhiều nhất  |
| **GET** | `/products/:slug`                  | Chi tiết (views++)     |

### Query Parameters

```
?page=1&limit=12&sort=newest
```

---

## 📁 New Files

### Backend

- ✏️ `backend/src/models/product.model.js` - views field
- ✏️ `backend/src/controllers/product.controller.js` - 3 new methods
- ✏️ `backend/src/routes/api.js` - 3 new routes

### Frontend

- ✨ `frontend/src/pages/CategoryProductsPage.jsx` - NEW
- ✨ `frontend/src/pages/TopProductsPage.jsx` - NEW
- ✏️ `frontend/src/api/api.js` - 3 new functions
- ✏️ `frontend/src/App.jsx` - 2 new routes
- ✏️ `frontend/src/pages/HomePage.jsx` - "Sản Phẩm Nổi Bật" button
- ✏️ `frontend/src/components/layout/Header.jsx` - Categories dropdown

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Start Backend

```bash
cd backend
npm start
```

### 3. Start Frontend (new terminal)

```bash
cd frontend
npm run dev
```

### 4. Open Browser

```
http://localhost:5173
```

---

## 🧪 Test Features

### Feature 1: Category Products

1. Header → Click "Danh mục ▼" → Select category
2. Test sorting, pagination
3. URL: `/category/dien-thoai?page=1&sort=newest`

### Feature 2: Top Products

1. Header → Click "Sản phẩm Nổi Bật"
2. Scroll carousel left/right
3. Click prev/next buttons
4. URL: `/top-products`

### Feature 3: Auto Views

1. View product detail (`/product/:slug`)
2. Check: views field increments
3. Product appears in "Most Viewed"

---

## 📖 Documentation

| File                      | Purpose                       |
| ------------------------- | ----------------------------- |
| `QUICK_START.md`          | 🚀 Hướng dẫn chạy project     |
| `IMPLEMENTATION_GUIDE.md` | 📖 Chi tiết tính năng & flow  |
| `API_REFERENCE.md`        | 🔌 API endpoints & parameters |
| `CHANGELOG.md`            | 📝 Danh sách thay đổi         |

---

## 🎯 User Flow

```
HomePage
├── Hero Banner (+ "Sản Phẩm Nổi Bật" button)
├── Product Sections (Featured, Newest, Best Sellers, On Sale)
└── Each section: "Xem tất cả" → FilterPage or CategoryPage

Header
├── Logo → HomePage
├── Search → SearchPage
├── Danh mục ▼ → /category/:slug
├── Sản phẩm Nổi Bật → /top-products
└── User Menu

/category/:slug (NEW)
├── Breadcrumb
├── Category Title
├── Sort Dropdown
├── Product Grid (Pagination)
└── Previous | 1 2 3 | Next

/top-products (NEW)
├── 🔥 Best Sellers Carousel (Horizontal Pagination)
└── 👀 Most Viewed Carousel (Horizontal Pagination)
```

---

## ✅ Features Checklist

- ✅ Category products page with pagination
- ✅ 6 sort options
- ✅ Top best sellers page
- ✅ Top most viewed page
- ✅ Swiper carousel with horizontal pagination
- ✅ Auto-increment views count
- ✅ Categories dropdown in header
- ✅ Navigation links
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Private routes (require login)

---

## 🔐 Security

- ✅ All product routes require JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API endpoints with middleware

---

## 📊 Database Example

```javascript
// Categories
[
  { name: "Điện thoại", slug: "dien-thoai" },
  { name: "Laptop", slug: "laptop" },
  { name: "Máy tính bảng", slug: "may-tinh-bang" },
][
  // Products
  {
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    price: 30000000,
    salePrice: 27500000,
    sold: 250,
    views: 5000,
    category: "dien-thoai",
  }
];
```

---

## 🔮 Future Enhancements

- [ ] Lazy loading (Intersection Observer)
- [ ] Advanced filters for categories
- [ ] Infinite scroll option
- [ ] Redis caching
- [ ] Product comparison
- [ ] Wishlist functionality
- [ ] Reviews & ratings
- [ ] Related products

---

## 📝 Notes

- Responsive breakpoints: 640px, 768px, 1024px, 1280px
- Swiper breakpoints: 1/2/3/4/5 products per view
- Pagination limit: 12 for categories, 10 for top products
- Categories loaded dynamically from database
- All timestamps in UTC

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📞 Support

- See `QUICK_START.md` for setup issues
- See `API_REFERENCE.md` for API questions
- See `IMPLEMENTATION_GUIDE.md` for feature details

---

## 📄 License

Educational Project - For Learning Purposes Only

**Tạo bởi:** BT05 Development Team  
**Ngày:** May 2026

---

## 📊 Project Stats

| Metric               | Count |
| -------------------- | ----- |
| New API Endpoints    | 3     |
| New Pages            | 2     |
| Updated Files        | 6     |
| Total Files Modified | 9     |
| Lines of Code Added  | ~500+ |

---

**✨ Project Status:** ✅ Complete & Ready for Testing
