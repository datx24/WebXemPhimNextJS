"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Tag, MapPin, ChevronRight } from "lucide-react";

interface FilmDetail {
  id: string;
  name: string;
  slug: string;
  poster_url: string;
  original_name: string;
  description: string;
  category: Record<string, any>;
}

export default function Banner() {
  const [film, setFilm] = useState<FilmDetail | null>(null);

  useEffect(() => {
    // Bước 1: Lấy phim mới nhất
    fetch("https://phim.nguonc.com/api/films/phim-moi-cap-nhat")
      .then((res) => res.json())
      .then((data) => {
        const slug = data.items[0].slug;
        // Bước 2: Lấy chi tiết phim theo slug
        fetch(`https://phim.nguonc.com/api/film/${slug}`)
          .then((res) => res.json())
          .then((detailData) => setFilm(detailData.movie))
          .catch(console.error);
      })
      .catch(console.error);
  }, []);

  if (!film) {
    return (
      <div className="relative w-full h-[75vh] overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-yellow-400 rounded-full animate-ping"></div>
          </div>
          <div className="text-xl font-semibold text-white/80 tracking-wide">Đang tải phim mới nhất...</div>
        </div>
      </div>
    );
  }

  // Lấy năm, thể loại, quốc gia
  const namSanXuat = film.category?.["3"]?.list?.[0]?.name || "Chưa rõ";
  const theLoai = film.category?.["2"]?.list?.map((c: any) => c.name).join(", ") || "Chưa rõ";
  const quocGia = film.category?.["4"]?.list?.map((c: any) => c.name).join(", ") || "Chưa rõ";

  return (
    <div className="relative w-full h-[75vh] overflow-hidden rounded-3xl shadow-2xl group transition-all duration-700 hover:shadow-3xl">
      {/* Ảnh nền với hiệu ứng zoom nhẹ */}
      <Image
        src={film.poster_url}
        alt={film.name}
        fill
        priority
        className="object-cover object-center transition-transform duration-700 group-hover:scale-110 brightness-[0.4] contrast-125"
      />

      {/* Lớp phủ gradient cải tiến */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />

      {/* Nội dung chữ với animation fade-in */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16 text-white z-20 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          {/* Tiêu đề chính */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-white to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
            {film.name}
          </h1>

          {/* Thông tin phụ */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-200">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Calendar className="w-4 h-4" />
              <span>{film.original_name} • {namSanXuat}</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Tag className="w-4 h-4" />
              <span>{theLoai}</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="w-4 h-4" />
              <span>{quocGia}</span>
            </div>
          </div>

          {/* Mô tả */}
          <p className="text-base sm:text-lg text-gray-100 mb-8 leading-relaxed max-w-2xl line-clamp-3">
            {film.description || "Không có mô tả."}
          </p>

          {/* Nút CTA */}
          <Link
            href={`/film/${film.slug}`}
            className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu"
          >
            ▶ Xem ngay
            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Thêm CSS cho animation (có thể đặt trong globals.css hoặc inline)
const styles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
`;

// Để thêm styles, bạn có thể import vào _app hoặc globals.css
// Hoặc sử dụng <style jsx global>{styles}</style> nếu dùng styled-jsx