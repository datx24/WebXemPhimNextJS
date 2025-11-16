"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search as SearchIcon, Tv, Film, Play, Calendar, Globe, Clock } from "lucide-react";
import { GENRES, COUNTRIES, YEARS } from "../utils/constants";

interface Movie {
  slug?: string;
  name?: string;
  poster_url?: string;
  time?: string;
  quality?: string;
}

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menu dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && showSearchResults) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, [showSearchResults]);

  // Fetch search results on keyword change
  useEffect(() => {
    if (keyword.length >= 1) {
      fetchSearch();
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [keyword]);

  const fetchSearch = async () => {
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/films/search?keyword=${encodeURIComponent(keyword)}&limit=5&no-store`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSearchResults(data.items || data.data?.items || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
    setKeyword("");
    setShowSearchResults(false);
  };

  // Click danh mục chính
  const handleNavigateCategory = (category: string) => {
    router.push(`/search?category=${category}`);
  };

  // Click dropdown item
  const handleNavigateParam = (param: string, value: string) => {
    router.push(`/search?${param}=${value}`);
    setOpenDropdown(null);
  };

  // Toggle dropdown
  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const DropdownTrigger = ({ id, children, icon: Icon }: { id: string; children: string; icon: React.ComponentType<{ className?: string }> }) => (
    <button
      onClick={() => toggleDropdown(id)}
      className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:text-yellow-400 transition-all duration-200 font-medium group relative z-50"
    >
      <Icon className="w-4 h-4" />
      {children}
      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === id ? 'rotate-180' : ''} ml-1`} />
    </button>
  );

  const renderDropdownItems = (items: any[], id: string, columns = 3) => (
    <div
      ref={dropdownRef}
      className={`absolute left-0 top-full mt-2 w-96 bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 max-h-96 overflow-y-auto animate-fadeIn z-[1000] py-2`}
      style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}
    >
      <div className={`grid grid-cols-3 gap-2 p-3`}>
        {items.map((item, index) => (
          <button
            key={item.slug || item}
            onClick={() => handleNavigateParam(id, item.slug || String(item))}
            className="block text-left px-3 py-2 rounded-lg hover:bg-gray-700/80 hover:text-yellow-300 transition-all duration-150 text-sm truncate whitespace-nowrap"
          >
            {item.label || item}
          </button>
        ))}
      </div>
    </div>
  );

  const handleResultClick = () => {
    setShowSearchResults(false);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black/50 text-white px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-2xl backdrop-blur-sm border-b border-yellow-500/20 relative z-50">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer mb-4 md:mb-0"
        onClick={() => router.push("/")}
      >
        <Image src="/RoPhim.png" alt="RoPhim" width={133} height={40} className="hover:scale-105 transition-transform duration-200" />
      </div>

      {/* Menu chính */}
      <nav className="flex items-center flex-wrap justify-center gap-1 md:gap-2 mb-4 md:mb-0 relative z-40">
        <button
          onClick={() => handleNavigateCategory("tv-shows")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:text-yellow-400 transition-all duration-200 font-medium group"
        >
          <Tv className="w-4 h-4" />
          TV Show
        </button>
        <button
          onClick={() => handleNavigateCategory("phim-le")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:text-yellow-400 transition-all duration-200 font-medium group"
        >
          <Film className="w-4 h-4" />
          Phim Lẻ
        </button>
        <button
          onClick={() => handleNavigateCategory("phim-bo")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:text-yellow-400 transition-all duration-200 font-medium group"
        >
          <Play className="w-4 h-4" />
          Phim Bộ
        </button>
        <button
          onClick={() => handleNavigateCategory("phim-dang-chieu")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:text-yellow-400 transition-all duration-200 font-medium group"
        >
          <Clock className="w-4 h-4" />
          Phim Đang Chiếu
        </button>

        {/* Dropdown Thể loại */}
        <div className="relative">
          <DropdownTrigger id="genre" icon={Globe}>
            Thể loại
          </DropdownTrigger>
          {openDropdown === "genre" && renderDropdownItems(GENRES, "genre", 3)}
        </div>

        {/* Dropdown Quốc gia */}
        <div className="relative">
          <DropdownTrigger id="country" icon={Globe}>
            Quốc gia
          </DropdownTrigger>
          {openDropdown === "country" && renderDropdownItems(COUNTRIES, "country", 3)}
        </div>

        {/* Dropdown Năm */}
        <div className="relative">
          <DropdownTrigger id="year" icon={Calendar}>
            Năm
          </DropdownTrigger>
          {openDropdown === "year" && renderDropdownItems(YEARS, "year", 3)}
        </div>
      </nav>

      {/* Ô tìm kiếm */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full md:w-auto max-w-md relative"
      >
        <div ref={searchRef} className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm phim, diễn viên..."
            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all duration-200 text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
          >
            Tìm
          </button>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 w-full mt-1 bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 max-h-80 overflow-y-auto z-[1000] animate-fadeIn">
              {searchLoading ? (
                <div className="p-4 text-center text-gray-400 text-sm">Đang tìm kiếm...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <Link
                    key={movie.slug}
                    href={`/film/${movie.slug}`}
                    className="block"
                    onClick={handleResultClick}
                  >
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-700/80 transition-colors duration-150">
                      <img
                        src={movie.poster_url || "/placeholder-poster.jpg"}
                        alt={movie.name}
                        className="w-12 h-16 flex-shrink-0 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                          {movie.name}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-1">{movie.time || "N/A"}</p>
                        <p className="text-xs text-yellow-400 font-medium">{movie.quality || "HD"}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-center text-gray-400 text-sm">Không tìm thấy kết quả.</p>
              )}
            </div>
          )}
        </div>
      </form>
    </header>
  );
}