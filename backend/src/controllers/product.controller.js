import Product from "../models/product.model";
import Category from "../models/category.model";

export const getHomepageProducts = async (req, res) => {
  try {
    const [featured, newest, bestSellers, onSale] = await Promise.all([
      Product.find({ isFeatured: true })
        .limit(8)
        .populate("category", "name slug"),
      Product.find({ isNew: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("category", "name slug"),
      Product.find()
        .sort({ sold: -1 })
        .limit(8)
        .populate("category", "name slug"),
      Product.find({ salePrice: { $gt: 0 } })
        .limit(8)
        .populate("category", "name slug"),
    ]);
    res.json({ featured, newest, bestSellers, onSale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = "newest",
      isNew,
      isFeatured,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isNew === "true") filter.isNew = true;
    if (isFeatured === "true") filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      bestSeller: { sold: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      rating: { rating: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category",
      "name slug",
    );
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // Increment views count
    product.views = (product.views || 0) + 1;
    await product.save();

    const similar = await Product.find({
      category: product.category._id,
      slug: { $ne: product.slug },
    })
      .limit(6)
      .select("name slug images price salePrice sold rating");

    res.json({ product, similar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12, sort = "newest" } = req.query;

    // Find category by slug
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    const sortMap = {
      newest: { createdAt: -1 },
      bestSeller: { sold: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      rating: { rating: -1 },
      mostViewed: { views: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments({ category: category._id });
    const products = await Product.find({ category: category._id })
      .populate("category", "name slug")
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      category: { name: category.name, slug: category.slug },
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments();
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ sold: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      title: "Sản Phẩm Bán Chạy Nhất",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMostViewed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments();
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ views: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      title: "Sản Phẩm Xem Nhiều Nhất",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
