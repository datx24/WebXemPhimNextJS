"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

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
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Đang tải...
      </div>
    );
  }

  // Lấy năm, thể loại, quốc gia
  const namSanXuat = film.category?.["3"]?.list?.[0]?.name || "Chưa rõ";
  const theLoai = film.category?.["2"]?.list?.map((c: any) => c.name).join(", ") || "Chưa rõ";
  const quocGia = film.category?.["4"]?.list?.map((c: any) => c.name).join(", ") || "Chưa rõ";

  return (
    <div className="relative w-full h-[75vh] overflow-hidden rounded-2xl shadow-2xl transition-all duration-700">
      {/* Ảnh nền */}
      <Image
        src={film.poster_url}
        alt={film.name}
        fill
        priority
        className="object-cover object-center brightness-[0.55] transition-transform duration-700 hover:scale-105"
      />

      {/* Lớp phủ gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      {/* Nội dung chữ */}
      <div className="absolute bottom-0 left-0 p-8 sm:p-16 text-white max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 drop-shadow-lg">
          {film.name}
        </h1>
        <p className="text-lg text-gray-300 italic mb-2">
          {film.original_name} • {namSanXuat}
        </p>

        <p className="text-sm text-gray-200 mb-2">
          <span className="font-semibold">Thể loại:</span> {theLoai}
        </p>
        <p className="text-sm text-gray-200 mb-4">
          <span className="font-semibold">Quốc gia:</span> {quocGia}
        </p>

        <p className="text-base text-gray-200 max-w-2xl line-clamp-4 leading-relaxed mb-6">
          {film.description || "Không có mô tả."}
        </p>

        <Link
          href={`/film/${film.slug}`}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold text-lg transition-transform duration-300 hover:scale-105"
        >
          ▶ Xem ngay
        </Link>
      </div>
    </div>
  );
}
