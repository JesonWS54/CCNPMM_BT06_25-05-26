import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const discount =
    product.salePrice > 0
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;

  const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0] || "https://placehold.co/400x300?text=No+Image"}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.isNew && discount === 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            MỚI
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-base">Hết hàng</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors flex-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 flex-wrap mb-1">
          <span className="text-orange-500 font-bold text-sm">
            {displayPrice.toLocaleString("vi-VN")}₫
          </span>
          {discount > 0 && (
            <span className="text-gray-400 text-xs line-through">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>⭐ {product.rating}</span>
          <span>Đã bán {product.sold}</span>
        </div>
      </div>
    </Link>
  );
}
