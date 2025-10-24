"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim() === "") return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        🎬 MovieApp
      </h1>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Tìm phim..."
          className="px-3 py-2 rounded text-black w-64"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Tìm kiếm
        </button>
      </form>
    </header>
  );
}
