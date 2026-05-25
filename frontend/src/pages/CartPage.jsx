import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCartApi, addToCartApi, removeCartItemApi } from "../api/api";

export default function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await getCartApi();
      setCart(res.data);
    } catch (err) {
      setCart({ items: [], total: 0 });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    setBusy(true);
    try {
      await addToCartApi(productId, quantity);
      window.dispatchEvent(new Event("cartUpdated"));
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật giỏ hàng thất bại");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (productId) => {
    setBusy(true);
    try {
      await removeCartItemApi(productId);
      window.dispatchEvent(new Event("cartUpdated"));
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Giỏ hàng của bạn
      </h1>

      {cart.items.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">Giỏ hàng đang trống.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.product.images?.[0] ||
                      "https://placehold.co/120x120?text=No+Image"
                    }
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-3xl border"
                  />
                  <div>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.product.category?.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Giá:{" "}
                      <strong>{item.price.toLocaleString("vi-VN")}₫</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 items-end">
                  <div className="flex items-center gap-2 border rounded-full overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                      disabled={busy || item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                      disabled={busy}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-right text-gray-700">
                    Thành tiền:{" "}
                    <strong>{item.subtotal.toLocaleString("vi-VN")}₫</strong>
                  </p>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-sm text-red-500 hover:text-red-600"
                    disabled={busy}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tổng đơn hàng
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Tổng tiền</span>
                <span className="font-semibold">
                  {cart.total.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Phương thức thanh toán mặc định: COD. (Có thể mở rộng ví điện tử
                sau.)
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-3xl font-semibold transition"
            >
              Tiến hành thanh toán
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
