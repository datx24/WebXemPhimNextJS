"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "./components/Banner";
import MiniMovieCard from "./components/MiniMovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  slug?: string;
  name?: string;
  poster_url?: string;
  time?: string;
  quality?: string;
  rating?: number;
  episodes?: string;
  details?: string;
  english_name?: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [koreanMovies, setKoreanMovies] = useState<Movie[]>([]);
  const [chineseMovies, setChineseMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [koreanCurrentSlide, setKoreanCurrentSlide] = useState(0);
  const [chineseCurrentSlide, setChineseCurrentSlide] = useState(0);
  const [autoSlideInterval, setAutoSlideInterval] = useState<NodeJS.Timeout | null>(null);
  const [koreanAutoSlideInterval, setKoreanAutoSlideInterval] = useState<NodeJS.Timeout | null>(null);
  const [chineseAutoSlideInterval, setChineseAutoSlideInterval] = useState<NodeJS.Timeout | null>(null);
  const moviesPerSlide = 5;
  const totalSlides = Math.ceil((movies.length || 0) / moviesPerSlide);
  const koreanTotalSlides = Math.ceil((koreanMovies.length || 0) / moviesPerSlide);
  const chineseTotalSlides = Math.ceil((chineseMovies.length || 0) / moviesPerSlide);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [ongoingRes, koreanRes, chineseRes] = await Promise.all([
          fetch("/api/films/danh-sach/phim-dang-chieu?limit=10&no-store"),
          fetch("/api/films/quoc-gia/han-quoc?limit=10&no-store"),
          fetch("/api/films/quoc-gia/trung-quoc?limit=10&no-store"),
        ]);

        // Check each response
        if (!ongoingRes.ok) throw new Error(`Ongoing fetch failed: ${ongoingRes.status}`);
        if (!koreanRes.ok) throw new Error(`Korean fetch failed: ${koreanRes.status}`);
        if (!chineseRes.ok) throw new Error(`Chinese fetch failed: ${chineseRes.status}`);

        const [ongoingData, koreanData, chineseData] = await Promise.all([
          parseJsonSafely(ongoingRes),
          parseJsonSafely(koreanRes),
          parseJsonSafely(chineseRes),
        ]);

        setMovies(ongoingData.items || ongoingData.data?.items || []);
        setKoreanMovies(koreanData.items || koreanData.data?.items || []);
        setChineseMovies(chineseData.items || chineseData.data?.items || []);
      } catch (err) {
        console.error("Fetch movies error:", err);
        // Set empty arrays on error to avoid breaking the UI
        setMovies([]);
        setKoreanMovies([]);
        setChineseMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const parseJsonSafely = async (response: Response) => {
      try {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          return {};
        }
        return await response.json();
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr);
        return {};
      }
    };

    fetchMovies();
  }, []);

  // Auto-slide logic for ongoing movies
  useEffect(() => {
    if (movies.length > 0 && totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev: number) => (prev + 1) % totalSlides);
      }, 4000); // Slide every 4 seconds
      setAutoSlideInterval(interval);
      return () => clearInterval(interval);
    }
  }, [movies.length, totalSlides]);

  // Auto-slide logic for Korean movies
  useEffect(() => {
    if (koreanMovies.length > 0 && koreanTotalSlides > 1) {
      const interval = setInterval(() => {
        setKoreanCurrentSlide((prev: number) => (prev + 1) % koreanTotalSlides);
      }, 4000);
      setKoreanAutoSlideInterval(interval);
      return () => clearInterval(interval);
    }
  }, [koreanMovies.length, koreanTotalSlides]);

  // Auto-slide logic for Chinese movies
  useEffect(() => {
    if (chineseMovies.length > 0 && chineseTotalSlides > 1) {
      const interval = setInterval(() => {
        setChineseCurrentSlide((prev: number) => (prev + 1) % chineseTotalSlides);
      }, 4000);
      setChineseAutoSlideInterval(interval);
      return () => clearInterval(interval);
    }
  }, [chineseMovies.length, chineseTotalSlides]);

  // Pause auto-slide on hover for ongoing movies
  useEffect(() => {
    return () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    };
  }, [autoSlideInterval]);

  // Pause auto-slide on hover for Korean movies
  useEffect(() => {
    return () => {
      if (koreanAutoSlideInterval) clearInterval(koreanAutoSlideInterval);
    };
  }, [koreanAutoSlideInterval]);

  // Pause auto-slide on hover for Chinese movies
  useEffect(() => {
    return () => {
      if (chineseAutoSlideInterval) clearInterval(chineseAutoSlideInterval);
    };
  }, [chineseAutoSlideInterval]);

  const handlePrev = (setter: React.Dispatch<React.SetStateAction<number>>, total: number) => {
    setter((prev: number) => (prev - 1 + total) % total);
  };

  const handleNext = (setter: React.Dispatch<React.SetStateAction<number>>, total: number) => {
    setter((prev: number) => (prev + 1) % total);
  };

  const handleDotClick = (index: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(index);
  };

  const renderCarousel = (moviesList: Movie[], currentSlideState: number, totalSlidesState: number, setter: React.Dispatch<React.SetStateAction<number>>, autoInterval: NodeJS.Timeout | null, setAutoInterval: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>) => (
    <div className="relative">
      <div 
        className="overflow-hidden rounded-2xl"
        onMouseEnter={() => autoInterval && clearInterval(autoInterval)}
        onMouseLeave={() => {
          if (moviesList.length > 0 && totalSlidesState > 1) {
            const interval = setInterval(() => {
              setter((prev: number) => (prev + 1) % totalSlidesState);
            }, 4000);
            setAutoInterval(interval);
          }
        }}
      >
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlideState * 100}%)` }}
        >
          {Array.from({ length: totalSlidesState }).map((_, slideIndex) => (
            <div key={slideIndex} className="flex shrink-0 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full px-4">
                {moviesList
                  .slice(slideIndex * moviesPerSlide, (slideIndex + 1) * moviesPerSlide)
                  .map((movie) => (
                    <MiniMovieCard key={movie.slug} movie={movie} />
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {totalSlidesState > 1 && (
        <>
          <button
            onClick={() => handlePrev(setter, totalSlidesState)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNext(setter, totalSlidesState)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlidesState > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlidesState }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index, setter)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentSlideState === index
                  ? "bg-yellow-500 scale-125"
                  : "bg-gray-400 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderSection = (title: string, moviesList: Movie[], linkHref: string, useCarousel: boolean = false, carouselProps?: {
    currentSlide: number;
    totalSlides: number;
    setter: React.Dispatch<React.SetStateAction<number>>;
    autoInterval: NodeJS.Timeout | null;
    setAutoInterval: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
  }) => (
    <section className="w-full max-w-8xl mx-auto py-4">
      <div className="bg-gradient-to-r from-gray-900/10 via-transparent to-gray-900/10 rounded-3xl p-8 shadow-2xl border border-gray-200/20 dark:border-gray-700/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white drop-shadow-lg">
            {title}
          </h2>
          <Link
            href={linkHref}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 whitespace-nowrap"
          >
            Xem thêm
          </Link>
        </div>
        
        {moviesList.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p>Không có dữ liệu lúc này.</p>
          </div>
        ) : useCarousel && carouselProps ? (
          renderCarousel(moviesList, carouselProps.currentSlide, carouselProps.totalSlides, carouselProps.setter, carouselProps.autoInterval, carouselProps.setAutoInterval)
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {moviesList.map((movie) => (
              <MiniMovieCard key={movie.slug} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Banner />
        
        {/* Phim Đang Chiếu Section */}
        <section className="w-full max-w-8xl mx-auto py-4">
          <div className="bg-gradient-to-r from-gray-900/10 via-transparent to-gray-900/10 rounded-3xl p-8 shadow-2xl border border-gray-200/20 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white drop-shadow-lg">
                Phim Đang Chiếu
              </h2>

              <Link
                href="/search?category=phim-dang-chieu"
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 whitespace-nowrap"
              >
                Xem thêm
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p>Đang tải phim...</p>
                </div>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <p>Không có phim đang chiếu lúc này.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Carousel Container */}
                <div 
                  className="overflow-hidden rounded-2xl"
                  onMouseEnter={() => autoSlideInterval && clearInterval(autoSlideInterval)}
                  onMouseLeave={() => {
                    if (movies.length > 0 && totalSlides > 1) {
                      const interval = setInterval(() => {
                        setCurrentSlide((prev: number) => (prev + 1) % totalSlides);
                      }, 4000);
                      setAutoSlideInterval(interval);
                    }
                  }}
                >
                  <div 
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                      <div key={slideIndex} className="flex shrink-0 w-full">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full px-4">
                          {movies
                            .slice(slideIndex * moviesPerSlide, (slideIndex + 1) * moviesPerSlide)
                            .map((movie) => (
                              <MiniMovieCard key={movie.slug} movie={movie} />
                            ))
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={() => handlePrev(setCurrentSlide, totalSlides)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleNext(setCurrentSlide, totalSlides)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index, setCurrentSlide)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          currentSlide === index
                            ? "bg-yellow-500 scale-125"
                            : "bg-gray-400 hover:bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Top 10 Phim Hàn Quốc Section */}
        {renderSection("Top 10 Phim Hàn Quốc", koreanMovies, "/search?country=han-quoc", true, {
          currentSlide: koreanCurrentSlide,
          totalSlides: koreanTotalSlides,
          setter: setKoreanCurrentSlide,
          autoInterval: koreanAutoSlideInterval,
          setAutoInterval: setKoreanAutoSlideInterval
        })}

        {/* Top 10 Phim Trung Quốc Section */}
        {renderSection("Top 10 Phim Trung Quốc", chineseMovies, "/search?country=trung-quoc", true, {
          currentSlide: chineseCurrentSlide,
          totalSlides: chineseTotalSlides,
          setter: setChineseCurrentSlide,
          autoInterval: chineseAutoSlideInterval,
          setAutoInterval: setChineseAutoSlideInterval
        })}
      </main>
    </div>
  );
}