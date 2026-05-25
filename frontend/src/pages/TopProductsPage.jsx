import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getBestSellersApi, getMostViewedApi } from "../api/api";
import ProductCard from "../components/product/ProductCard";

export default function TopProductsPage() {
  const [bestSellers, setBestSellers] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [loadingBest, setLoadingBest] = useState(false);
  const [loadingMost, setLoadingMost] = useState(false);

  useEffect(() => {
    setLoadingBest(true);
    getBestSellersApi({ page: 1, limit: 10 })
      .then((res) => setBestSellers(res.data.data))
      .finally(() => setLoadingBest(false));
  }, []);

  useEffect(() => {
    setLoadingMost(true);
    getMostViewedApi({ page: 1, limit: 10 })
      .then((res) => setMostViewed(res.data.data))
      .finally(() => setLoadingMost(false));
  }, []);

  const SectionHeader = ({ title, icon }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Khám phá những sản phẩm được ưa thích nhất
      </p>
    </div>
  );

  const ProductSection = ({ title, icon, products, loading }) => (
    <section className="mb-12">
      <SectionHeader title={title} icon={icon} />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-400 text-lg">Chưa có dữ liệu</p>
        </div>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: `.swiper-button-next-${title.replace(/\s+/g, "-")}`,
              prevEl: `.swiper-button-prev-${title.replace(/\s+/g, "-")}`,
            }}
            pagination={{
              el: `.swiper-pagination-${title.replace(/\s+/g, "-")}`,
              type: "fraction",
              formatFractionCurrent: (number) => `0${number}`.slice(-2),
              formatFractionTotal: (number) => `0${number}`.slice(-2),
            }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            className={`swiper-button-prev-${title.replace(/\s+/g, "-")} absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 lg:-translate-x-8 z-10 w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition`}
          >
            ‹
          </button>
          <button
            className={`swiper-button-next-${title.replace(/\s+/g, "-")} absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 lg:translate-x-8 z-10 w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition`}
          >
            ›
          </button>

          {/* Pagination */}
          <div
            className={`swiper-pagination-${title.replace(/\s+/g, "-")} text-center text-sm text-gray-500 mt-4`}
          />
        </div>
      )}
    </section>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Sản phẩm nổi bật</span>
        </nav>

        {/* Tiêu đề */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏆 Sản Phẩm Nổi Bật
          </h1>
          <p className="text-gray-500 text-lg">
            Những sản phẩm được yêu thích và xem xét nhiều nhất trên TechShop
          </p>
        </div>

        {/* Best Sellers Section */}
        <ProductSection
          title="Sản Phẩm Bán Chạy Nhất"
          icon="🔥"
          products={bestSellers}
          loading={loadingBest}
        />

        {/* Most Viewed Section */}
        <ProductSection
          title="Sản Phẩm Xem Nhiều Nhất"
          icon="👀"
          products={mostViewed}
          loading={loadingMost}
        />

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Khám phá thêm sản phẩm</h3>
          <p className="mb-6 opacity-90">
            Xem tất cả các danh mục sản phẩm trong cửa hàng của chúng tôi
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Tìm kiếm sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
