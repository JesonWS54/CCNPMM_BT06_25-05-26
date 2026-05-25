# 🔌 API Reference - BT05

## Base URL

```
http://localhost:8080/api/v1
```

## Authentication

Tất cả endpoints (ngoại trừ `/auth/*`) yêu cầu JWT token:

```
Authorization: Bearer <token>
```

---

## 📂 Products API

### 1. Lấy Sản Phẩm Theo Danh Mục

**Endpoint**

```http
GET /products/category/:categorySlug
```

**Query Parameters**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Số trang |
| limit | number | 12 | Sản phẩm/trang |
| sort | string | newest | Kiểu sắp xếp |

**Sort Options**

- `newest` - Mới nhất (createdAt DESC)
- `bestSeller` - Bán chạy nhất (sold DESC)
- `priceLow` - Giá thấp → cao (price ASC)
- `priceHigh` - Giá cao → thấp (price DESC)
- `rating` - Đánh giá cao nhất (rating DESC)
- `mostViewed` - Xem nhiều nhất (views DESC)

**Example**

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8080/api/v1/products/category/dien-thoai?page=1&limit=12&sort=newest"
```

**Response (200 OK)**

```json
{
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Điện thoại",
    "slug": "dien-thoai"
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "iPhone 15 Pro Max",
      "slug": "iphone-15-pro-max",
      "description": "Flagship smartphone...",
      "price": 30000000,
      "salePrice": 27500000,
      "images": [
        "https://example.com/iphone15-1.jpg",
        "https://example.com/iphone15-2.jpg"
      ],
      "stock": 45,
      "sold": 250,
      "views": 5000,
      "isNew": true,
      "isFeatured": true,
      "rating": 4.8,
      "numReviews": 145,
      "category": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Điện thoại",
        "slug": "dien-thoai"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T15:45:00Z"
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

**Error Response (404 Not Found)**

```json
{
  "message": "Không tìm thấy danh mục"
}
```

---

### 2. Lấy Top 10 Sản Phẩm Bán Chạy Nhất

**Endpoint**

```http
GET /products/top/bestsellers
```

**Query Parameters**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Số trang |
| limit | number | 10 | Sản phẩm/trang |

**Example**

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8080/api/v1/products/top/bestsellers?page=1&limit=10"
```

**Response (200 OK)**

```json
{
  "title": "Sản Phẩm Bán Chạy Nhất",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "iPhone 15 Pro Max",
      "slug": "iphone-15-pro-max",
      "price": 30000000,
      "salePrice": 27500000,
      "images": ["https://example.com/iphone15-1.jpg"],
      "stock": 45,
      "sold": 1250,
      "views": 12000,
      "rating": 4.8,
      "category": {
        "name": "Điện thoại",
        "slug": "dien-thoai"
      }
    }
    // ... 9 sản phẩm khác
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
```

---

### 3. Lấy Top 10 Sản Phẩm Xem Nhiều Nhất

**Endpoint**

```http
GET /products/top/mostviewed
```

**Query Parameters**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Số trang |
| limit | number | 10 | Sản phẩm/trang |

**Example**

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8080/api/v1/products/top/mostviewed?page=1&limit=10"
```

**Response (200 OK)**

```json
{
  "title": "Sản Phẩm Xem Nhiều Nhất",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Samsung Galaxy S24 Ultra",
      "slug": "samsung-galaxy-s24-ultra",
      "price": 28000000,
      "salePrice": 25500000,
      "images": ["https://example.com/s24-1.jpg"],
      "stock": 60,
      "sold": 800,
      "views": 25000,
      "rating": 4.7,
      "category": {
        "name": "Điện thoại",
        "slug": "dien-thoai"
      }
    }
    // ... 9 sản phẩm khác
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

### 4. Lấy Chi Tiết Sản Phẩm (Updated)

**Endpoint**

```http
GET /products/:slug
```

**Note:** Endpoint này đã được cập nhật - khi gọi, nó sẽ tự động tăng field `views` lên 1.

**Example**

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8080/api/v1/products/iphone-15-pro-max"
```

**Response (200 OK)**

```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "iPhone 15 Pro Max",
    "slug": "iphone-15-pro-max",
    "description": "Flagship smartphone từ Apple...",
    "price": 30000000,
    "salePrice": 27500000,
    "images": ["..."],
    "stock": 45,
    "sold": 250,
    "views": 5001,
    "isNew": true,
    "isFeatured": true,
    "rating": 4.8,
    "numReviews": 145,
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Điện thoại",
      "slug": "dien-thoai"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  },
  "similar": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "images": ["..."],
      "price": 27000000,
      "salePrice": 25000000,
      "sold": 180,
      "rating": 4.7
    }
    // ... 5 sản phẩm tương tự khác
  ]
}
```

---

## 🔄 Common Query Patterns

### Lấy 12 sản phẩm mới nhất của danh mục "Laptop"

```
GET /products/category/laptop?page=1&limit=12&sort=newest
```

### Lấy top 5 bán chạy nhất (page 2)

```
GET /products/top/bestsellers?page=2&limit=5
```

### Lấy top 20 xem nhiều nhất

```
GET /products/top/mostviewed?limit=20
```

### Sắp xếp theo giá thấp → cao

```
GET /products/category/dien-thoai?sort=priceLow
```

---

## ✅ HTTP Status Codes

| Status | Meaning                              |
| ------ | ------------------------------------ |
| 200    | OK - Request thành công              |
| 400    | Bad Request - Request không hợp lệ   |
| 401    | Unauthorized - Cần JWT token         |
| 404    | Not Found - Tài nguyên không tồn tại |
| 500    | Server Error - Lỗi server            |

---

## 🔐 Authentication

### Đăng Nhập

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**

```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Sử dụng Token

Thêm header cho tất cả requests:

```
Authorization: Bearer <token từ login>
```

---

## 📊 Response Format

### Success Response

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

### Error Response

```json
{
  "message": "Error description"
}
```

---

## 🧪 Test với Postman

1. **Đăng nhập:**

   ```
   POST http://localhost:8080/api/v1/auth/login
   Body (JSON):
   {
     "email": "test@example.com",
     "password": "123456"
   }
   ```

2. **Copy token từ response**

3. **Set Authorization:**
   - Type: Bearer Token
   - Token: <paste token từ bước 2>

4. **Test endpoints:**
   ```
   GET http://localhost:8080/api/v1/products/category/dien-thoai
   GET http://localhost:8080/api/v1/products/top/bestsellers
   GET http://localhost:8080/api/v1/products/top/mostviewed
   ```

---

## 📈 Pagination Example

**Request:**

```
GET /products/category/dien-thoai?page=2&limit=10
```

**Response:**

```json
{
  "pagination": {
    "total": 45,
    "page": 2,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Calculation:**

- Total items: 45
- Items per page: 10
- Total pages: ceil(45/10) = 5
- Current page: 2
- Skip: (2-1) \* 10 = 10 items
- Items returned: 10 (từ item 11-20)

---

## 🔍 Filtering & Sorting

### Danh mục sản phẩm hỗ trợ:

- ✅ Phân trang (page, limit)
- ✅ Sắp xếp (6 options)
- ❌ Filter (price, rating, etc.) - Có thể thêm sau

### Best Sellers & Most Viewed hỗ trợ:

- ✅ Phân trang (page, limit)
- ❌ Custom sort (tự động sort theo sold/views)

---

## 📝 Notes

- Views tăng tự động khi gọi GET `/products/:slug`
- Danh mục phải tồn tại để endpoint category hoạt động
- Pagination là 1-based (page 1, 2, 3...)
- Limit tối đa nên là 100 để tránh lỗi
