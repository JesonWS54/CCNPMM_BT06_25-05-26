import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProductsApi, getCategoriesApi } from "../api/api";
import ProductCard from "../components/product/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "bestSeller", label: "Bán chạy nhất" },
  { value: "priceLow", label: "Giá: Thấp → Cao" },
  { value: "priceHigh", label: "Giá: Cao → Thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
];

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: "", max: "" },
  { label: "Dưới 5 triệu", min: "", max: 5000000 },
  { label: "5 – 15 triệu", min: 5000000, max: 15000000 },
  { label: "15 – 25 triệu", min: 15000000, max: 25000000 },
  { label: "25 – 40 triệu", min: 25000000, max: 40000000 },
  { label: "Trên 40 triệu", min: 40000000, max: "" },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get("search") || "");
  const debounceRef = useRef(null);

  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    isNew: searchParams.get("isNew") || "",
    isFeatured: searchParams.get("isFeatured") || "",
    page: searchParams.get("page") || "1",
  };

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    value ? p.set(key, value) : p.delete(key);
    p.set("page", "1");
    setSearchParams(p);
  };

  const setPriceRange = ({ min, max }) => {
    const p = new URLSearchParams(searchParams);
    min ? p.set("minPrice", min) : p.delete("minPrice");
    max ? p.set("maxPrice", max) : p.delete("maxPrice");
    p.set("page", "1");
    setSearchParams(p);
  };

  const resetFilters = () => setSearchParams({});

  const isActivePriceRange = (range) =>
    String(filters.minPrice) === String(range.min || "") &&
    String(filters.maxPrice) === String(range.max || "");

  // Sync input khi URL thay đổi từ bên ngoài (Header search)
  useEffect(() => {
    setInputValue(searchParams.get("search") || "");
  }, [searchParams.get("search")]);

  // Debounce: cập nhật URL sau 400ms khi người dùng ngừng gõ
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter("search", val.trim());
    }, 400);
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    for (const [k, v] of searchParams.entries()) params[k] = v;
    getProductsApi(params)
      .then((res) => {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  useEffect(() => {
    getCategoriesApi().then((res) => setCategories(res.data));
  }, []);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg">Bộ lọc</h3>
        <button
          onClick={resetFilters}
          className="text-xs text-orange-500 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Danh mục */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          Danh mục
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="cat"
              checked={!filters.category}
              onChange={() => updateFilter("category", "")}
              className="accent-orange-500"
            />
            <span className="text-sm text-gray-700">Tất cả</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cat"
                checked={filters.category === cat._id}
                onChange={() => updateFilter("category", cat._id)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          Khoảng giá
        </h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={isActivePriceRange(range)}
                onChange={() => setPriceRange(range)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bộ lọc khác */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          Loại sản phẩm
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isNew === "true"}
              onChange={(e) => updateFilter("isNew", e.target.checked ? "true" : "")}
              className="accent-orange-500"
            />
            <span className="text-sm text-gray-700">✨ Hàng mới về</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isFeatured === "true"}
              onChange={(e) => updateFilter("isFeatured", e.target.checked ? "true" : "")}
              className="accent-orange-500"
            />
            <span className="text-sm text-gray-700">⭐ Sản phẩm nổi bật</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Tìm kiếm sản phẩm</span>
        </nav>

        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Thanh tìm kiếm + sắp xếp */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Tìm kiếm real-time */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Gõ để tìm sản phẩm..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Sắp xếp */}
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                {/* Nút filter mobile */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
                >
                  🔧 Lọc
                </button>
              </div>
            </div>

            {/* Kết quả */}
            <p className="text-gray-500 mb-4 text-sm">
              Tìm thấy{" "}
              <strong className="text-gray-800">{pagination.total || 0}</strong>{" "}
              sản phẩm
            </p>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white rounded-2xl">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium text-gray-500 mb-2">
                  Không tìm thấy sản phẩm
                </p>
                <p className="text-sm mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button
                  onClick={resetFilters}
                  className="text-orange-500 hover:underline font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}

            {/* Phân trang */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => updateFilter("page", page)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition border ${
                        Number(filters.page) === page
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-700 hover:bg-orange-50 border-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Bộ lọc</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl font-semibold"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
