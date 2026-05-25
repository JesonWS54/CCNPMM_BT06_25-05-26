import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getProductsByCategoryApi } from "../api/api";
import ProductCard from "../components/product/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "bestSeller", label: "Bán chạy nhất" },
  { value: "priceLow", label: "Giá: Thấp → Cao" },
  { value: "priceHigh", label: "Giá: Cao → Thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "mostViewed", label: "Xem nhiều nhất" },
];

export default function CategoryProductsPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "newest";
  const limit = 12;

  const updatePage = (newPage) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", newPage);
    setSearchParams(p);
  };

  const updateSort = (newSort) => {
    const p = new URLSearchParams(searchParams);
    p.set("sort", newSort);
    p.set("page", "1");
    setSearchParams(p);
  };

  useEffect(() => {
    setLoading(true);
    getProductsByCategoryApi(categorySlug, {
      page,
      limit,
      sort,
    })
      .then((res) => {
        setProducts(res.data.data);
        setCategory(res.data.category);
        setPagination(res.data.pagination);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [categorySlug, page, sort]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          {category && (
            <>
              <span className="text-gray-800 font-medium">{category.name}</span>
            </>
          )}
        </nav>

        {/* Tiêu đề */}
        {category && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {category.name}
            </h1>
            <p className="text-gray-500">
              Tìm thấy{" "}
              <strong className="text-gray-800">{pagination.total || 0}</strong>{" "}
              sản phẩm
            </p>
          </div>
        )}

        {/* Sắp xếp */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-5 flex items-center justify-between">
          <span className="text-gray-700 font-medium">Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Danh sách sản phẩm */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-medium text-gray-500 mb-2">
              Danh mục này trống
            </p>
            <Link
              to="/"
              className="inline-block text-orange-500 hover:underline font-medium"
            >
              Quay lại trang chủ
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* Phân trang */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 flex-wrap mb-8">
                {/* Nút Previous */}
                {Number(page) > 1 && (
                  <button
                    onClick={() => updatePage(Number(page) - 1)}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-orange-50 transition"
                  >
                    ← Trước
                  </button>
                )}

                {/* Số trang */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => updatePage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition border ${
                      Number(page) === p
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-700 hover:bg-orange-50 border-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {/* Nút Next */}
                {Number(page) < pagination.totalPages && (
                  <button
                    onClick={() => updatePage(Number(page) + 1)}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-orange-50 transition"
                  >
                    Tiếp →
                  </button>
                )}
              </div>
            )}

            {/* Thông tin phân trang */}
            <div className="text-center text-sm text-gray-500">
              Trang <strong>{page}</strong> /{" "}
              <strong>{pagination.totalPages}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
