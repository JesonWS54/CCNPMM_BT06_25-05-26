import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrdersApi, cancelOrderApi } from "../api/api";

const statusMap = {
  pending: { label: "Đơn hàng mới", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  preparing: {
    label: "Shop đang chuẩn bị hàng",
    color: "bg-orange-100 text-orange-800",
  },
  shipping: { label: "Đang giao hàng", color: "bg-sky-100 text-sky-800" },
  delivered: {
    label: "Đã giao thành công",
    color: "bg-green-100 text-green-800",
  },
  cancelled: { label: "Đã hủy đơn", color: "bg-red-100 text-red-800" },
  cancel_requested: {
    label: "Yêu cầu hủy đã gửi",
    color: "bg-pink-100 text-pink-800",
  },
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await getOrdersApi();
      setOrders(res.data);
    } catch (err) {
      setOrders([]);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    setBusyId(orderId);
    try {
      await cancelOrderApi(orderId);
      alert("Yêu cầu đã được gửi. Vui lòng kiểm tra trạng thái đơn hàng.");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Hủy đơn thất bại");
    } finally {
      setBusyId(null);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Lịch sử đơn hàng
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Bạn chưa có đơn hàng nào.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.pending;
            const canCancel = ["pending", "confirmed", "preparing"].includes(
              order.status,
            );
            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Mã đơn hàng: {order._id}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.product}
                        className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50"
                      >
                        <img
                          src={
                            item.image ||
                            "https://placehold.co/80x80?text=No+Image"
                          }
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-3xl border"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            x{item.quantity}
                          </p>
                          <p className="text-sm text-orange-600 font-semibold mt-1">
                            {item.subtotal.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 rounded-3xl border border-gray-200 p-5 bg-white">
                    <div className="text-sm text-gray-500">
                      <p>Phương thức: {order.paymentMethod}</p>
                      <p>Địa chỉ: {order.shippingAddress}</p>
                      <p>SĐT: {order.phone}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between font-semibold text-gray-900">
                      <span>Tổng tiền</span>
                      <span>{order.totalAmount.toLocaleString("vi-VN")}₫</span>
                    </div>
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-3xl font-semibold transition"
                        disabled={busyId === order._id}
                      >
                        {order.status === "preparing"
                          ? "Gửi yêu cầu hủy đơn"
                          : "Hủy đơn"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
