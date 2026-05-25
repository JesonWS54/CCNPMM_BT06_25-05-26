# � BT06 - Ứng Dụng Bán Hàng Mở Rộng

**BT06** là phiên bản mở rộng của dự án bán hàng, bổ sung đầy đủ tính năng giỏ hàng, thanh toán COD và theo dõi đơn hàng.

**Ngôn ngữ:** JavaScript (Node.js + React)

**Backend:** Express.js + MongoDB

**Frontend:** React + Vite + Tailwind CSS

---

## ✨ Tính Năng Chính

### 1️⃣ Giỏ hàng (Cart)

- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ
- Lưu giỏ hàng trên backend bằng MongoDB
- Hiển thị tổng tiền và số lượng sản phẩm

### 2️⃣ Thanh toán đơn hàng COD

- Form checkout với địa chỉ giao hàng và số điện thoại
- Thanh toán COD bắt buộc
- Tạo đơn hàng từ giỏ hàng
- Xóa giỏ hàng sau khi đặt hàng thành công

### 3️⃣ Theo dõi đơn hàng và lịch sử

- Hiển thị lịch sử đơn hàng của người dùng
- Xem trạng thái đơn hàng hiện tại
- Hủy đơn trong vòng 30 phút kể từ khi tạo
- Nếu đơn đang ở trạng thái chuẩn bị, gửi yêu cầu hủy đơn

### 4️⃣ Trạng thái đơn hàng

- `pending` - Đơn hàng mới
- `confirmed` - Đã xác nhận
- `preparing` - Shop đang chuẩn bị hàng
- `shipping` - Đang giao hàng
- `delivered` - Đã giao thành công
- `cancelled` - Đã hủy đơn
- `cancel_requested` - Yêu cầu hủy đơn

---

## 🧩 Công Nghệ Sử Dụng

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- dotenv

### Frontend

- React 19
- React Router v7
- Vite
- Axios
- Tailwind CSS v4
- Swiper

---

## 📁 Cấu Trúc Chính

```
BT06/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── product.controller.js
│   │   │   └── category.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── product.model.js
│   │   │   ├── category.model.js
│   │   │   ├── cart.model.js
│   │   │   └── order.model.js
│   │   ├── routes/
│   │   │   └── api.js
│   │   ├── server.js
│   │   └── seed.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Header.jsx
│   │   │       └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── CategoryProductsPage.jsx
│   │   │   ├── TopProductsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🚀 Chạy Dự Án

### 1. Cài đặt dependencies

```bash
cd "d:\UTE\NAM III\Các CNMP mới\BT06\backend"
npm install

cd "d:\UTE\NAM III\Các CNMP mới\BT06\frontend"
npm install
```

### 2. Khởi động backend

```bash
cd "d:\UTE\NAM III\Các CNMP mới\BT06\backend"
npm start
```

### 3. Khởi động frontend

```bash
cd "d:\UTE\NAM III\Các CNMP mới\BT06\frontend"
npm run dev
```

### 4. Mở trình duyệt

```
http://localhost:5173
```

---

## 🧪 API Chính

### Auth

- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/profile` - Lấy profile (cần token)

### Products

- `GET /api/v1/products/home` - Dữ liệu trang chủ
- `GET /api/v1/products` - Lấy danh sách sản phẩm
- `GET /api/v1/products/:slug` - Chi tiết sản phẩm
- `GET /api/v1/products/category/:categorySlug` - Sản phẩm theo danh mục
- `GET /api/v1/products/top/bestsellers` - Top sản phẩm bán chạy
- `GET /api/v1/products/top/mostviewed` - Top sản phẩm xem nhiều

### Categories

- `GET /api/v1/categories` - Lấy danh mục sản phẩm

### Cart

- `GET /api/v1/cart` - Lấy giỏ hàng
- `POST /api/v1/cart` - Thêm/cập nhật giỏ hàng
- `DELETE /api/v1/cart/:productId` - Xóa sản phẩm khỏi giỏ
- `DELETE /api/v1/cart` - Xóa toàn bộ giỏ hàng

### Orders

- `POST /api/v1/orders` - Tạo đơn hàng
- `GET /api/v1/orders` - Lấy lịch sử đơn hàng
- `GET /api/v1/orders/:id` - Xem chi tiết đơn hàng
- `PATCH /api/v1/orders/:id/cancel` - Hủy đơn

---

## ✅ Hướng Dẫn Test Nhanh

### 1. Tạo tài khoản

- Vào `/register`
- Nhập tên, email và mật khẩu

### 2. Đăng nhập

- Vào `/login`

### 3. Thêm sản phẩm vào giỏ hàng

- Vào trang chi tiết sản phẩm
- Click `Thêm vào giỏ` hoặc `Mua ngay`

### 4. Kiểm tra giỏ hàng

- Vào `/cart`
- Chỉnh số lượng, xóa sản phẩm
- Click `Tiến hành thanh toán`

### 5. Thanh toán COD

- Điền địa chỉ và số điện thoại
- Click `Đặt hàng và thanh toán COD`

### 6. Xem đơn hàng

- Vào `/orders`
- Xem lịch sử và trạng thái
- Thử hủy đơn nếu còn hạn

---

## 📝 Ghi chú

- Giỏ hàng lưu trong **MongoDB**.
- Thanh toán hiện tại là **COD**.
- Ví điện tử chỉ hiển thị là **đang phát triển**.
- Trạng thái `confirmed` có thể chuyển tự động sau 30 phút.

---

## 🔮 Tương Lai

- [ ] Thêm hỗ trợ **ví điện tử**
- [ ] Cập nhật trạng thái đơn hàng **tự động thời gian thực**
- [ ] Tối ưu caching / **Redis**
- [ ] Thêm **thanh toán online**
- [ ] Thêm **wishlist**

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
