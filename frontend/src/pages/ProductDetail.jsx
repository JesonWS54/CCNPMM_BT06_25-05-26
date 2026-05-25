import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { getProductDetailApi, addToCartApi } from "../api/api";
import ProductCard from "../components/product/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    try {
      await addToCartApi(product._id, quantity);
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Đã thêm vào giỏ hàng");
    } catch (err) {
      alert(err.response?.data?.message || "Thêm giỏ hàng thất bại");
    }
  };

  const handleBuyNow = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    try {
      await addToCartApi(product._id, quantity);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/checkout");
    } catch (err) {
      alert(err.response?.data?.message || "Thêm giỏ hàng thất bại");
    }
  };

  useEffect(() => {
    setLoading(true);
    setThumbsSwiper(null);
    getProductDetailApi(slug)
      .then((res) => {
        setProduct(res.data.product);
        setSimilar(res.data.similar);
        setQuantity(1);
      })
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-5xl mb-4">😕</p>
        <p>Không tìm thấy sản phẩm</p>
        <Link
          to="/"
          className="text-orange-500 hover:underline mt-4 inline-block"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  const displayPrice =
    product.salePrice > 0 ? product.salePrice : product.price;
  const discount =
    product.salePrice > 0
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-orange-500">
            Trang chủ
          </Link>
          <span>/</span>
          <Link
            to={`/search?category=${product.category?._id}`}
            className="hover:text-orange-500"
          >
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">
            {product.name}
          </span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ===== KHU VỰC HÌNH ẢNH + SWIPER ===== */}
          <div>
            {/* Ảnh chính */}
            <Swiper
              modules={[Navigation, Thumbs, FreeMode]}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              navigation
              className="rounded-xl overflow-hidden border border-gray-100 mb-3"
            >
              {product.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`${product.name} - ảnh ${i + 1}`}
                    className="w-full h-80 object-contain bg-white"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnail — chỉ hiện khi có nhiều hơn 1 ảnh */}
            {product.images.length > 1 && (
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
              >
                {product.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      alt={`thumb ${i + 1}`}
                      className="w-full h-20 object-contain border-2 rounded-lg cursor-pointer border-transparent hover:border-orange-400 transition"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* ===== THÔNG TIN SẢN PHẨM ===== */}
          <div className="space-y-5">
            {/* Danh mục */}
            <Link
              to={`/search?category=${product.category?._id}`}
              className="inline-block bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full hover:bg-orange-200 transition"
            >
              {product.category?.name}
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating & đã bán */}
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                ⭐ <strong>{product.rating}</strong>
                <span className="text-gray-400">
                  ({product.numReviews} đánh giá)
                </span>
              </span>
              <span className="text-gray-300">|</span>
              <span>
                Đã bán:{" "}
                <strong className="text-gray-700">{product.sold}</strong>
              </span>
            </div>

            {/* Giá */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-orange-500">
                  {displayPrice.toLocaleString("vi-VN")}₫
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-gray-400 line-through text-lg">
                      {product.price.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full font-bold">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  Tiết kiệm:{" "}
                  {(product.price - product.salePrice).toLocaleString("vi-VN")}₫
                </p>
              )}
            </div>

            {/* Tình trạng hàng */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm font-medium">
                Tình trạng:
              </span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full">
                  ✅ Còn hàng ({product.stock} sản phẩm)
                </span>
              ) : (
                <span className="text-red-500 font-semibold text-sm bg-red-50 px-3 py-1 rounded-full">
                  ❌ Hết hàng
                </span>
              )}
            </div>

            {/* Tăng giảm số lượng */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm font-medium">
                  Số lượng:
                </span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-xl font-bold bg-gray-100 hover:bg-gray-200 transition select-none"
                  >
                    −
                  </button>
                  <span className="px-5 py-2 font-semibold text-lg min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-4 py-2 text-xl font-bold bg-gray-100 hover:bg-gray-200 transition select-none"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  Tổng:{" "}
                  <strong className="text-orange-500">
                    {(displayPrice * quantity).toLocaleString("vi-VN")}₫
                  </strong>
                </span>
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-orange-100 hover:bg-orange-200 disabled:bg-gray-100
                           text-orange-600 disabled:text-gray-400 py-3 rounded-xl font-semibold transition"
              >
                🛒 Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300
                           text-white py-3 rounded-xl font-semibold transition shadow-md"
              >
                ⚡ Mua ngay
              </button>
            </div>

            {/* Mô tả */}
            {product.description && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Mô tả sản phẩm
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sản phẩm tương tự */}
        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Sản phẩm tương tự
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similar.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
