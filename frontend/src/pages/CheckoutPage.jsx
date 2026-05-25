import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCartApi, createOrderApi } from "../api/api";

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const res = await getCartApi();
      setCart(res.data);
    } catch (err) {
      setCart({ items: [], total: 0 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      return alert("Vui lòng nhập thông tin giao hàng");
    }

    setBusy(true);
    try {
      await createOrderApi({
        shippingAddress,
        phone,
        paymentMethod,
      });
      window.dispatchEvent(new Event("cartUpdated"));
      alert(
        "Đơn hàng của bạn đã được tạo. Vui lòng theo dõi trạng thái đơn hàng.",
      );
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Thanh toán thất bại");
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
        Thanh toán đơn hàng
      </h1>

      {cart.items.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Giỏ hàng của bạn hiện đang trống.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            Quay lại mua sắm
          </button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Địa chỉ giao hàng
              </h2>
              <label className="block mb-4">
                <span className="text-gray-700">Địa chỉ</span>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  rows={4}
                  placeholder="Nhập địa chỉ nhận hàng"
                />
              </label>
              <label className="block mb-4">
                <span className="text-gray-700">Số điện thoại</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Nhập số điện thoại liên hệ"
                />
              </label>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-3xl border border-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="h-4 w-4 accent-orange-500"
                  />
                  <div>
                    <div className="font-semibold">
                      Thanh toán khi nhận hàng (COD)
                    </div>
                    <p className="text-sm text-gray-500">
                      Thanh toán bằng tiền mặt hoặc thẻ khi nhận hàng.
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-3xl border border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed">
                  <input type="radio" disabled className="h-4 w-4" />
                  <div>
                    <div className="font-semibold">
                      Ví điện tử (đang phát triển)
                    </div>
                    <p className="text-sm text-gray-500">
                      Tùy chọn ví điện tử sẽ có trong bản cập nhật tiếp theo.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4">
                  <img
                    src={
                      item.product.images?.[0] ||
                      "https://placehold.co/80x80?text=No+Image"
                    }
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-3xl border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                    <p className="text-sm text-orange-600 font-semibold mt-1">
                      {item.subtotal.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4 text-gray-700">
              <div className="flex justify-between mb-3">
                <span>Tổng sản phẩm</span>
                <span>{cart.items.length}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Thành tiền</span>
                <span>{cart.total.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-3xl font-semibold transition disabled:cursor-not-allowed disabled:bg-orange-300"
              disabled={busy}
            >
              Đặt hàng và thanh toán COD
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
