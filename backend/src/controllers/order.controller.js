import Cart from "../models/cart.model";
import Order from "../models/order.model";
import Product from "../models/product.model";

const CONFIRM_MINUTES = 30;

const refreshOrderStatus = async (order) => {
  if (
    order.status === "pending" &&
    Date.now() - new Date(order.createdAt).getTime() >=
      CONFIRM_MINUTES * 60 * 1000
  ) {
    order.status = "confirmed";
    await order.save();
  }
  return order;
};

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phone, paymentMethod = "COD" } = req.body;

    if (!shippingAddress || !phone) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập thông tin giao hàng" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng đang trống" });
    }

    const items = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product) {
        return res
          .status(400)
          .json({ message: "Có sản phẩm không tồn tại trong giỏ hàng" });
      }
      if (item.quantity > product.stock) {
        return res
          .status(400)
          .json({ message: `Sản phẩm ${product.name} không đủ số lượng` });
      }

      const price = product.salePrice > 0 ? product.salePrice : product.price;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        quantity: item.quantity,
        price,
        subtotal,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      phone,
      paymentMethod,
      totalAmount,
    });

    // Cập nhật tồn kho
    await Promise.all(
      cart.items.map(async (item) => {
        const product = item.product;
        product.stock = Math.max(0, product.stock - item.quantity);
        product.sold += item.quantity;
        await product.save();
      }),
    );

    await Cart.deleteOne({ user: req.user._id });

    res.status(201).json({ message: "Đơn hàng được tạo thành công", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    const refreshed = await Promise.all(orders.map(refreshOrderStatus));
    res.json(refreshed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    await refreshOrderStatus(order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const ageMinutes =
      (Date.now() - new Date(order.createdAt).getTime()) / (60 * 1000);

    if (["delivered", "cancelled", "cancel_requested"].includes(order.status)) {
      return res.status(400).json({ message: "Không thể hủy đơn hàng này" });
    }

    if (ageMinutes <= CONFIRM_MINUTES) {
      order.status = "cancelled";
      await order.save();
      return res.json({ message: "Đơn hàng đã được hủy" });
    }

    if (order.status === "preparing") {
      order.status = "cancel_requested";
      await order.save();
      return res.json({ message: "Yêu cầu hủy đơn đã được gửi đến shop" });
    }

    return res.status(400).json({
      message:
        "Không thể hủy đơn hàng sau 30 phút hoặc khi đơn đã vào trạng thái giao hàng",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
