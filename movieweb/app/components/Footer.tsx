"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Cột 1: Giới thiệu */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">PhimHD</h2>
          <p className="text-sm leading-6 text-gray-400">
            Trang web xem phim miễn phí, cập nhật liên tục các bộ phim mới nhất
            với chất lượng HD và phụ đề tiếng Việt.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Liên kết nhanh</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/phim-le" className="hover:text-yellow-400 transition">
                Phim Lẻ
              </Link>
            </li>
            <li>
              <Link href="/phim-bo" className="hover:text-yellow-400 transition">
                Phim Bộ
              </Link>
            </li>
            <li>
              <Link href="/the-loai" className="hover:text-yellow-400 transition">
                Thể Loại
              </Link>
            </li>
            <li>
              <Link href="/quoc-gia" className="hover:text-yellow-400 transition">
                Quốc Gia
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Liên hệ</h2>
          <p className="text-sm text-gray-400">
            📧 Email: <a href="mailto:support@phimhd.com" className="hover:text-yellow-400">support@phimhd.com</a>
          </p>
          <p className="text-sm text-gray-400">
            📞 Hotline: <a href="tel:0123456789" className="hover:text-yellow-400">0123 456 789</a>
          </p>
          <div className="flex space-x-4 mt-3">
            <Link href="https://facebook.com" target="_blank" className="hover:text-yellow-400">Facebook</Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-yellow-400">YouTube</Link>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-5">
        © {new Date().getFullYear()} PhimHD. All rights reserved.
      </div>
    </footer>
  );
}
