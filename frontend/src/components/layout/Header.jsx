import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProductsApi, getCategoriesApi, getCartApi } from "../../api/api";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const categoryRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load categories
  useEffect(() => {
    getCategoriesApi()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const loadCartCount = async () => {
    try {
      const res = await getCartApi();
      setCartCount(res.data.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener("cartUpdated", loadCartCount);
    return () => window.removeEventListener("cartUpdated", loadCartCount);
  }, []);

  // Live search với debounce 350ms
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (search.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoadingSuggest(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await getProductsApi({ search: search.trim(), limit: 6 });
        setSuggestions(res.data.data || []);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggest(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setShowDropdown(false);
    navigate(`/search?search=${encodeURIComponent(search.trim())}`);
  };

  const handleSelectSuggestion = (product) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/product/${product.slug}`);
  };

  const handleViewAll = () => {
    setShowDropdown(false);
    navigate(`/search?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="bg-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold whitespace-nowrap shrink-0">
          📱 TechShop
        </Link>

        {/* Search với dropdown */}
        <div ref={wrapperRef} className="flex-1 max-w-xl relative">
          <form onSubmit={handleSearch}>
            <div className="flex bg-white rounded-xl overflow-hidden shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                placeholder="Tìm sản phẩm... (gõ ít nhất 2 ký tự)"
                className="flex-1 px-4 py-2.5 text-gray-800 outline-none text-sm"
              />
              {loadingSuggest ? (
                <div className="px-4 flex items-center">
                  <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <button
                  type="submit"
                  className="px-4 bg-orange-600 hover:bg-orange-700 transition text-white font-medium"
                >
                  🔍
                </button>
              )}
            </div>
          </form>

          {/* Dropdown gợi ý */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {suggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Không tìm thấy sản phẩm nào
                </div>
              ) : (
                <>
                  {suggestions.map((product) => {
                    const price =
                      product.salePrice > 0 ? product.salePrice : product.price;
                    const discount =
                      product.salePrice > 0
                        ? Math.round(
                            (1 - product.salePrice / product.price) * 100,
                          )
                        : 0;
                    return (
                      <button
                        key={product._id}
                        onClick={() => handleSelectSuggestion(product)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition text-left border-b border-gray-50 last:border-0"
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg shrink-0 border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.category?.name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-orange-500">
                            {price.toLocaleString("vi-VN")}₫
                          </p>
                          {discount > 0 && (
                            <span className="text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  <button
                    onClick={handleViewAll}
                    className="w-full px-4 py-2.5 text-sm text-orange-500 font-medium hover:bg-orange-50 transition text-center border-t border-gray-100"
                  >
                    Xem tất cả kết quả cho "{search}" →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-3 text-sm whitespace-nowrap">
          <Link
            to="/search"
            className="hover:text-orange-200 transition hidden sm:block"
          >
            Sản phẩm
          </Link>

          {/* Categories Dropdown */}
          <div ref={categoryRef} className="relative group hidden md:block">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="hover:text-orange-200 transition py-3 flex items-center gap-1"
            >
              Danh mục <span className="text-xs">▼</span>
            </button>
            {showCategoryMenu && (
              <div className="absolute right-0 top-full mt-0 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden min-w-48 z-40">
                {categories.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    Đang tải...
                  </div>
                ) : (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setShowCategoryMenu(false)}
                      className="block px-4 py-2.5 hover:bg-orange-50 transition text-sm"
                    >
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            to="/top-products"
            className="hover:text-orange-200 transition hidden sm:block"
          >
            Sản phẩm Nổi Bật
          </Link>

          <Link to="/cart" className="hover:text-orange-200 transition">
            Giỏ hàng{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>

          <Link
            to="/orders"
            className="hover:text-orange-200 transition hidden sm:block"
          >
            Đơn hàng
          </Link>

          {user ? (
            <>
              <span className="hidden md:block">👤 {user.name}</span>
              <button
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-orange-500 font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-50 transition"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
