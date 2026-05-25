import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHomepageApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/product/ProductCard";

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState({
    featured: [],
    newest: [],
    bestSellers: [],
    onSale: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomepageApi()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          {user && (
            <p className="text-orange-100 mb-3 text-lg">
              Chào mừng trở lại,{" "}
              <strong className="text-white">{user.name}</strong>! 👋
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Công Nghệ Đỉnh Cao
          </h1>
          <p className="text-xl text-orange-100 mb-8">
            Điện thoại • Laptop • Máy tính bảng chính hãng
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/search"
              className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition shadow-md"
            >
              Mua Ngay
            </Link>
            <Link
              to="/search?sort=bestSeller"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              Xem Bán Chạy
            </Link>
            <Link
              to="/top-products"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              Sản Phẩm Nổi Bật
            </Link>
          </div>
        </div>
      </section>

      {/* Thống kê nhanh */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-orange-500">1000+</p>
            <p className="text-sm text-gray-500">Sản phẩm</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">50K+</p>
            <p className="text-sm text-gray-500">Khách hàng</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">4.8⭐</p>
            <p className="text-sm text-gray-500">Đánh giá TB</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-14">
        <ProductSection
          title="🔥 Khuyến Mãi HOT"
          subtitle="Giảm giá đặc biệt — số lượng có hạn!"
          products={data.onSale}
          linkTo="/search?sort=newest"
        />
        <ProductSection
          title="✨ Hàng Mới Về"
          subtitle="Sản phẩm mới nhất vừa cập bến"
          products={data.newest}
          linkTo="/search?isNew=true"
        />
        <ProductSection
          title="🏆 Bán Chạy Nhất"
          subtitle="Được khách hàng yêu thích nhất tháng này"
          products={data.bestSellers}
          linkTo="/search?sort=bestSeller"
        />
        <ProductSection
          title="⭐ Sản Phẩm Nổi Bật"
          subtitle="Được tuyển chọn bởi đội ngũ chuyên gia"
          products={data.featured}
          linkTo="/search?isFeatured=true"
        />
      </div>
    </div>
  );
}

function ProductSection({ title, subtitle, products, linkTo }) {
  if (!products || products.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
        </div>
        <Link
          to={linkTo}
          className="text-orange-500 hover:text-orange-600 font-medium text-sm whitespace-nowrap"
        >
          Xem tất cả →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
