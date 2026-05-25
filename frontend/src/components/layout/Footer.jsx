import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">📱 TechShop</h3>
          <p className="text-sm leading-relaxed">
            Chuyên cung cấp điện thoại, laptop, máy tính bảng chính hãng với giá tốt nhất thị trường.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Danh mục</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search?sort=newest" className="hover:text-orange-400 transition">Hàng mới về</Link></li>
            <li><Link to="/search?sort=bestSeller" className="hover:text-orange-400 transition">Bán chạy nhất</Link></li>
            <li><Link to="/search?isFeatured=true" className="hover:text-orange-400 transition">Sản phẩm nổi bật</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 TP. Hồ Chí Minh</li>
            <li>📞 0901 234 567</li>
            <li>✉️ techshop@example.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © 2026 TechShop. All rights reserved.
      </div>
    </footer>
  );
}
