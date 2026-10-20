<div align="center">

# 📷 photos.mushfiqweb.com

### Visual Journal, Moments & Stories through the Lens of Mushfiqur Rahman Shishir

[![Live Demo](https://img.shields.io/badge/Live_Site-photos.mushfiqweb.com-10b981?style=for-the-badge&logo=google-chrome&logoColor=white)](https://photos.mushfiqweb.com)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Ready-purple?style=for-the-badge&logo=pwa&logoColor=white)](https://photos.mushfiqweb.com)

<p align="center">
  A high-performance photography showcase web application designed and built with Next.js 15 (App Router), React 19, and Tailwind CSS.
  <br />
  Aesthetically aligned with <a href="https://mushfiqweb.com"><b>mushfiqweb.com</b></a> — featuring ambient glows, canvas matrix rain, progressive blurry-to-sharp image loading, rich EXIF trays, background caching, and full offline PWA support.
</p>

</div>

---

## ✨ Features

### 📸 Dynamic Masonry Showcase & Visual Journal
- **Curated Multi-Genre Categories:** Instant client-side filtering across `Street & Life`, `Nature & Flora`, `Portraits`, `Concerts & Music`, `Urban & Architecture`, and `Monochrome`.
- **Aspect-Ratio Preserved Masonry:** Images render in their authentic camera dimensions without awkward cropping or layout shifts.
- **Evocative Editorial Captions:** Every photo has been visually analyzed and paired with a human-crafted title and rich description rather than raw camera codes.

### ⚡ Progressive Blurry-to-Sharp Loading (LQIP)
- **Zero Layout Shifts:** Each photo includes an inline base64 Low-Quality Image Placeholder (`blurDataURL`).
- **Smooth Blur Transition:** When navigating or loading images, Next.js transitions smoothly from a progressive blur into razor-sharp high resolution.

### 🔍 Fullscreen Lightbox & EXIF Inspection
- **Keyboard Navigation:** Full keyboard support — press `←` (Previous), `→` (Next), `Esc` (Close), and `I` (Toggle EXIF Tray).
- **Background Pre-fetching:** Automatically pre-fetches the next and previous photos in the background for instant navigation.
- **Detailed Camera Metadata:** Displays camera make and model, focal length, aperture, shutter speed, ISO rating, metering mode, and capture date extracted from original EXIF headers.

### 💾 Offline Support & Client CacheStorage
- **Background Pre-Cache:** On first visit, a lightweight background worker downloads and stores photos into the browser's `CacheStorage` (`photos-cache-v1`).
- **Service Worker (`public/sw.js`):** Cache-first strategy for all media assets with network fallback.
- **Offline Indicator:** A clean floating notification alerts the user when they are browsing offline with full cached access.

### 🎨 Exact Design Alignment with `mushfiqweb.com`
- **Matrix Rain Canvas:** Interactive canvas matrix rain with customizable speed, character sets (KMS Tech, Binary, Katakana), and visibility toggle.
- **Signature Visual Accents:** Tilted grid background, subtle grit texture overlay, Metis lowercase hover underline animations, and `#1f1f1f` dark mode token.
- **Ambient Spotify Glows:** Header green glow, footer red ambient accent, and live Spotify Now Playing status bar.

### 🌐 SEO & Structured Data
- OpenGraph & Twitter Card support with custom `og-image.png`.
- Schema.org JSON-LD structured data (`Person`, `ImageGallery`, `WebSite`).
- Dynamic `sitemap.ts` and `robots.ts` auto-generated for optimal search engine indexing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) with Typography & Forms plugins |
| **Modals & Transitions** | [@headlessui/react](https://headlessui.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Fetching** | [SWR](https://swr.vercel.app/) (Spotify API polling) |
| **Image Processing** | Python 3 + [Pillow (PIL)](https://python-pillow.org/) (EXIF extraction & LQIP generation) |
| **Caching & PWA** | Service Worker API + CacheStorage |

---

## 📂 Project Structure

```text
photos.mushfiqweb.com/
├── app/
│   ├── api/spotify/          # Spotify Now Playing API route & auth client
│   ├── about/                # About page (bio, gear, photography journey)
│   ├── globals.css           # Global Tailwind directives, fonts & animations
│   ├── layout.tsx            # Root layout with theme providers & matrix canvas
│   ├── page.tsx              # Home page with hero & photo grid
│   ├── robots.ts             # Robots.txt route handler
│   ├── seo.tsx               # SEO metadata configuration
│   ├── sitemap.ts            # Dynamic sitemap generator
│   └── theme-providers.tsx   # Next-themes dark/light mode provider
├── components/
│   ├── footer/               # Footer with Spotify status & KMS Tech badge
│   ├── gallery/              # Gallery components:
│   │   ├── background-photo-cache.tsx  # Pre-loads photos into CacheStorage
│   │   ├── filter-bar.tsx              # Interactive category pill filters
│   │   ├── load-more-button.tsx        # Dynamic pagination loader
│   │   ├── photo-card.tsx              # Masonry card with hover overlay
│   │   ├── photo-grid.tsx              # Masonry grid coordinator
│   │   └── photo-lightbox.tsx          # Fullscreen modal with EXIF tray
│   ├── header/               # Full-width navbar, logo & matrix settings
│   └── ui/                   # Reusable UI primitives (Matrix, Grid, Offline)
├── data/
│   ├── photos-db.json        # Compiled photo database (EXIF, blurDataURLs)
│   ├── photos.ts             # Photo interfaces, categories & helpers
│   ├── navigation.ts         # Navigation items
│   └── site-metadata.ts      # Site configuration & social links
├── public/
│   ├── assets/photos/        # Original full-resolution photography
│   ├── og-image.png          # OpenGraph social share card
│   ├── sw.js                 # Service worker for offline caching
│   └── manifest.json         # PWA web app manifest
└── scripts/
    └── generate_photos_db.py # Python script for EXIF & LQIP generation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.18+ or v20+ (tested on Node v26.5)
- **Package Manager:** `pnpm` (recommended), `npm`, or `yarn`
- **Python:** 3.8+ (for photo database generation)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mushfiqweb/photos.mushfiqweb.com.git
   cd photos.mushfiqweb.com
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   # Spotify API credentials (optional, for live Now Playing status)
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Compilation & Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Starts the Next.js local development server. |
| `pnpm compile` | Runs TypeScript typechecking (`tsc --noEmit`) to verify compilation. |
| `pnpm lint` | Runs Next.js ESLint checks. |
| `python scripts/generate_photos_db.py` | Scans `public/assets/photos`, extracts EXIF data, generates base64 LQIP `blurDataURL`s, and rebuilds `data/photos-db.json`. |

> [!NOTE]
> For this repository's development workflow, compile verification is performed via `pnpm compile` (`tsc --noEmit`).

---

## 📸 Adding New Photos

To add or update photos in the showcase:

1. Place high-resolution JPEG images into `public/assets/photos/`.
2. Open [`scripts/generate_photos_db.py`](scripts/generate_photos_db.py) and add the corresponding title, category, and visual description to `PHOTO_METADATA`.
3. Run the generation script:
   ```bash
   python scripts/generate_photos_db.py
   ```
4. Verify compilation:
   ```bash
   pnpm compile
   ```

---

## 👤 Author

**Mushfiqur Rahman Shishir**
- 🌐 Website: [mushfiqweb.com](https://www.mushfiqweb.com)
- 📸 Photography: [photos.mushfiqweb.com](https://photos.mushfiqweb.com)
- 💼 LinkedIn: [@mushfiqweb](https://www.linkedin.com/in/mushfiqweb)
- 🐙 GitHub: [@mushfiqweb](https://github.com/mushfiqweb)
- 🐦 X (Twitter): [@mushfiqweb](https://x.com/mushfiqweb)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
*All photography images in `public/assets/photos/` are © Mushfiqur Rahman Shishir. All rights reserved.*
