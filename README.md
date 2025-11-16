# 🎬 RoPhim - Website Xem Phim Online

[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> 🌟 **RoPhim** là một trang web xem phim online hiện đại, được xây dựng bằng Next.js với giao diện đẹp mắt và trải nghiệm người dùng tuyệt vời. Cập nhật liên tục các bộ phim mới nhất với chất lượng HD và phụ đề tiếng Việt.

## ✨ Tính Năng Chính

### 🎯 Trang Chủ
- **Banner Phim Mới Nhất**: Hiển thị phim mới cập nhật với thông tin chi tiết
- **Phim Đang Chiếu**: Carousel tự động với điều hướng mượt mà
- **Top Phim Hàn Quốc & Trung Quốc**: Danh sách phim phổ biến theo quốc gia
- **Responsive Design**: Tương thích hoàn hảo trên mọi thiết bị

### 🔍 Tìm Kiếm & Bộ Lọc
- **Tìm Kiếm Thông Minh**: Tìm phim theo tên, diễn viên
- **Bộ Lọc Nâng Cao**:
  - 📂 Danh mục: Phim Lẻ, Phim Bộ, TV Shows, Phim Đang Chiếu
  - 🎭 Thể loại: Hành Động, Hài, Kinh Dị, Lãng Mạn, v.v.
  - 🌍 Quốc gia: Hàn Quốc, Trung Quốc, Việt Nam, Âu Mỹ, v.v.
  - 📅 Năm phát hành: Từ 2004 đến 2025
- **Phân Trang**: Điều hướng dễ dàng qua hàng nghìn bộ phim

### 🎬 Chi Tiết Phim
- **Thông Tin Đầy Đủ**: Tên phim, đạo diễn, diễn viên, mô tả
- **Poster & Banner**: Hình ảnh chất lượng cao
- **Danh Sách Tập**: Điều hướng tập phim với giao diện đẹp mắt
- **Metadata**: Thể loại, quốc gia, năm sản xuất

### ▶️ Xem Phim
- **Player Tích Hợp**: Sử dụng iframe với chất lượng cao
- **Danh Sách Tập**: Chuyển tập nhanh chóng
- **Responsive Player**: Tự động điều chỉnh kích thước
- **Thông Tin Phim**: Hiển thị trong khi xem

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Next.js 16**: Framework React với App Router
- **React 19**: Thư viện UI hiện đại
- **TypeScript**: Type safety và IntelliSense
- **Tailwind CSS 4**: Styling utility-first

### UI/UX
- **Lucide React**: Icon library đẹp mắt
- **Heroicons**: Bộ icon bổ sung
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Hỗ trợ chế độ tối

### API & Data
- **API Proxy**: Proxy qua Next.js rewrites
- **External API**: Tích hợp với phim.nguonc.com
- **Image Optimization**: Next.js Image component
- **Caching**: ISR và revalidation

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js >= 18.0.0
- npm hoặc yarn hoặc pnpm

### Các Bước Cài Đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/your-username/ro-phim.git
   cd ro-phim
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   yarn install
   # hoặc
   pnpm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   # hoặc
   pnpm dev
   ```

4. **Mở trình duyệt**
   - Truy cập [http://localhost:3000](http://localhost:3000)

### Build cho Production

```bash
npm run build
npm start
```

## 📁 Cấu Trúc Dự Án

```
movieweb/
├── app/                          # Next.js App Router
│   ├── components/               # React Components
│   │   ├── Banner.tsx           # Banner phim mới nhất
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Footer component
│   │   ├── MovieCard.tsx        # Card hiển thị phim
│   │   └── MiniMovieCard.tsx    # Card nhỏ cho carousel
│   ├── film/[slug]/             # Chi tiết phim
│   │   └── page.tsx
│   ├── search/                  # Trang tìm kiếm
│   │   └── page.tsx
│   ├── watch/[slug]/            # Trang xem phim
│   │   └── page.tsx
│   ├── utils/                   # Utilities
│   │   └── constants.ts         # Constants (genres, countries, years)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Trang chủ
├── public/                      # Static assets
│   ├── RoPhim.png              # Logo
│   └── ...                      # Other images
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

## 🔧 API Endpoints

Dự án sử dụng API proxy để kết nối với phim.nguonc.com:

### Phim
- `GET /api/films/phim-moi-cap-nhat` - Phim mới cập nhật
- `GET /api/films/danh-sach/:category` - Danh sách theo danh mục
- `GET /api/films/the-loai/:genre` - Phim theo thể loại
- `GET /api/films/quoc-gia/:country` - Phim theo quốc gia
- `GET /api/films/nam-phat-hanh/:year` - Phim theo năm
- `GET /api/films/search?keyword=:keyword` - Tìm kiếm phim

### Chi Tiết
- `GET /api/film/:slug` - Chi tiết phim và danh sách tập

## 🎨 Giao Diện & Trải Nghiệm

### Design System
- **Color Palette**: Gradient vàng-đen với accent màu vàng
- **Typography**: Geist Sans & Geist Mono fonts
- **Spacing**: Consistent spacing với Tailwind
- **Animations**: Smooth transitions và hover effects

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large**: > 1280px

### Performance
- **Image Optimization**: Next.js Image với lazy loading
- **Code Splitting**: Automatic với Next.js
- **Caching**: ISR cho dữ liệu phim
- **Bundle Analysis**: Optimized bundle size


### Coding Standards
- Sử dụng TypeScript cho type safety
- Follow ESLint rules
- Viết commit messages rõ ràng
- Test trên multiple devices

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên Hệ

- **Email**: xuandat475@gmail.com
- **Website**: [ro-phim.vercel.app](https://web-xem-phim-next-js-81w3.vercel.app/)
- **GitHub**: [github.com/your-username/ro-phim](https://github.com/datx24/WebXemPhimNextJS)

---

<div align="center">

**Made with ❤️ by datx24**

⭐ Nếu bạn thích dự án này, hãy cho chúng tôi một ngôi sao!

[🌐 Truy cập Website](https://web-xem-phim-next-js-81w3.vercel.app/) • [📧 Liên Hệ](xuandat475@gmail.com) • [🐛 Báo Lỗi](xuandat475@gmail.com)

</div>
