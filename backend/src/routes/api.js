import express from "express";
import { register, login, getProfile } from "../controllers/auth.controller";
import {
  getHomepageProducts,
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  getBestSellers,
  getMostViewed,
} from "../controllers/product.controller";
import { getCategories } from "../controllers/category.controller";
import { protect } from "../middleware/auth.middleware";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/order.controller";

const router = express.Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/profile", protect, getProfile);

// Cart
router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.delete("/cart/:productId", protect, removeFromCart);
router.delete("/cart", protect, clearCart);

// Orders
router.post("/orders", protect, createOrder);
router.get("/orders", protect, getOrders);
router.get("/orders/:id", protect, getOrderById);
router.patch("/orders/:id/cancel", protect, cancelOrder);

// Products
router.get("/products/home", getHomepageProducts);
router.get("/products/category/:categorySlug", getProductsByCategory);
router.get("/products/top/bestsellers", getBestSellers);
router.get("/products/top/mostviewed", getMostViewed);
router.get("/products", getProducts);
router.get("/products/:slug", getProductBySlug);

// Categories
router.get("/categories", getCategories);

export default router;
