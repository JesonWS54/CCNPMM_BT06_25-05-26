# 🚀 Quick Start - BT05

## Chuẩn Bị

### Yêu Cầu

- Node.js 16+
- MongoDB running locally (port 27017) hoặc remote
- Git

### Clone & Install

```bash
# Vào thư mục BT05
cd "d:\UTE\NAM III\Các CNMP mới\BT05"

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

---

## Chạy Project

### 1️⃣ Khởi Động Backend

```bash
cd backend
npm start
```

**Output:**

```
Server running on http://localhost:8080
MongoDB connected to mongodb://localhost:27017/techshop
```

### 2️⃣ Khởi Động Frontend (terminal khác)

```bash
cd frontend
npm run dev
```

**Output:**

```
  ➜  Local:   http://localhost:5173/
```

### 3️⃣ Mở trình duyệt

```
http://localhost:5173
```

---

## 🧪 Test Tính Năng Mới

### Feature 1: Danh Mục Sản Phẩm

**Cách 1: Từ Header**

1. Click "Danh mục ▼" ở Header
2. Chọn một danh mục (vd: "Điện thoại")
3. → Sẽ chuyển đến `/category/dien-thoai`

**Cách 2: Direct URL**

```
http://localhost:5173/category/dien-thoai
```

**Test Sắp Xếp:**

- Dropdown "Sắp xếp" → Chọn "Bán chạy nhất"
- Verify: URL thay đổi thành `?sort=bestSeller`

**Test Phân Trang:**

- Click "Tiếp →" hoặc số trang
- Verify: Sản phẩm khác nhau xuất hiện

---

### Feature 2: Sản Phẩm Nổi Bật

**Cách 1: Từ Header**

1. Click "Sản phẩm Nổi Bật" ở Header

**Cách 2: Từ HomePage**

1. Scroll lên đầu
2. Click nút "Sản Phẩm Nổi Bật" ở hero banner

**Cách 3: Direct URL**

```
http://localhost:5173/top-products
```

**Test Carousel:**

- Kéo sang trái/phải (Swiper)
- Click nút "‹" và "›" để chuyển
- Verify: Chỉ số trang cập nhật (01/05, etc.)

---

## 📊 Dữ Liệu Test

### Tạo Sample Data

Nếu database trống, chạy script seed:

```bash
cd backend
npm run seed
```

Hoặc import dữ liệu từ file MongoDB:

```bash
mongoimport --db techshop --collection products --file ./data/products.json
mongoimport --db techshop --collection categories --file ./data/categories.json
```

### Đăng Nhập Test

```
Email: test@example.com
Password: 123456
```

---

## 🐛 Troubleshooting

### Frontend không load

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection error

```
Error: MongoDB connection failed
→ Kiểm tra MongoDB running: mongosh
→ Hoặc config MONGO_URI ở .env
```

### Port 5173 đã được sử dụng

```bash
# Thay port
npm run dev -- --port 3000
```

### Port 8080 đã được sử dụng

```bash
# Thay port trong backend/.env
BACKEND_PORT=3001
```

---

## 📁 File Structure

```
BT05/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── product.model.js        (✏️ Updated: views field)
│   │   ├── controllers/
│   │   │   └── product.controller.js   (✏️ Updated: 3 methods)
│   │   ├── routes/
│   │   │   └── api.js                  (✏️ Updated: 3 routes)
│   │   └── ...
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                  (✏️ Updated: 3 functions)
│   │   ├── pages/
│   │   │   ├── CategoryProductsPage.jsx (✨ New)
│   │   │   ├── TopProductsPage.jsx     (✨ New)
│   │   │   ├── HomePage.jsx            (✏️ Updated)
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Header.jsx          (✏️ Updated)
│   │   │   └── ...
│   │   ├── App.jsx                     (✏️ Updated: 2 routes)
│   │   └── ...
│   └── package.json
│
├── IMPLEMENTATION_GUIDE.md              (📖 Chi tiết)
├── CHANGELOG.md                         (📝 Thay đổi)
└── README.md
```

---

## 🔗 Endpoints API

### Sản phẩm theo danh mục

```
GET http://localhost:8080/api/v1/products/category/dien-thoai?page=1&limit=12&sort=newest
```

**Response:**

```json
{
  "category": { "name": "Điện thoại", "slug": "dien-thoai" },
  "data": [...],
  "pagination": { "total": 45, "page": 1, "limit": 12, "totalPages": 4 }
}
```

### Top bán chạy nhất

```
GET http://localhost:8080/api/v1/products/top/bestsellers?page=1&limit=10
```

### Top xem nhiều nhất

```
GET http://localhost:8080/api/v1/products/top/mostviewed?page=1&limit=10
```

---

## 💡 Notes

- Tất cả routes yêu cầu JWT authentication (đăng nhập)
- Views counter tăng tự động khi xem chi tiết sản phẩm
- Danh mục được load động từ database
- Responsive design - hoạt động trên mobile/tablet/desktop

---

## 📞 Hỗ Trợ

Xem file `IMPLEMENTATION_GUIDE.md` để biết chi tiết về:

- API endpoints
- Query parameters
- Response format
- Frontend components
