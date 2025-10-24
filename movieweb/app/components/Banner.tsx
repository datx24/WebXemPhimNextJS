"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Film {
  id: string;
  name: string;
  slug: string;
  poster_url: string;
  original_name: string;
  year: number;
  description: string;
}

export default function Banner() {
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    fetch("https://phim.nguonc.com/api/films/phim-moi-cap-nhat")
      .then((res) => res.json())
      .then((data) => {
        setFilm(data.items[0]);
      })
      .catch(console.error);
  }, []);

  if (!film) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">
      <Image
        src={film.poster_url}
        alt={film.name}
        fill
        className="object-cover brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-10 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">{film.name}</h2>
        <p className="text-sm sm:text-base text-gray-200 max-w-xl line-clamp-3">
          {film.description || "Không có mô tả."}
        </p>
        <div className="mt-5">
          <Link
            href={`/film/${film.slug}`}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            ▶ Xem ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
