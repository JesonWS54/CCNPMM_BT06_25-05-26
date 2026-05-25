import Cart from "../models/cart.model";
import Product from "../models/product.model";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name slug images price salePrice stock",
    );

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    const items = cart.items.map((item) => ({
      ...item.toObject(),
      subtotal: item.price * item.quantity,
    }));
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ items, total, updatedAt: cart.updatedAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity);
    if (!productId || qty < 1) {
      return res
        .status(400)
        .json({ message: "Số lượng sản phẩm không hợp lệ" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    const price = product.salePrice > 0 ? product.salePrice : product.price;

    if (!cart) {
      const newCart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: product._id,
            quantity: Math.min(qty, product.stock),
            price,
          },
        ],
      });
      return res.json({ message: "Đã thêm vào giỏ hàng", cart: newCart });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity = Math.min(
        product.stock,
        existingItem.quantity + qty,
      );
      existingItem.price = price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: Math.min(qty, product.stock),
        price,
      });
    }

    await cart.save();
    res.json({ message: "Giỏ hàng đã được cập nhật", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    await cart.save();
    res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.deleteOne({ user: req.user._id });
    res.json({ message: "Đã xóa giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
