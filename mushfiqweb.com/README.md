<h1 align="center">mushfiqweb.com 🧑‍💻</h1>

<p align="center">
  A premium developer portfolio, blog, and snippets web application built with <strong>Next.js 15</strong>, <strong>Tailwind CSS</strong>, <strong>Contentlayer</strong>, and <strong>Supabase</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.1.2-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Database%20%26%20Realtime-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Contentlayer-MDX-F24E1E?style=flat-square&logo=markdown" alt="Contentlayer" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

---

## ✨ Features

- **🚀 Next.js 15 & React 19**: Built on the App Router architecture for optimized static rendering, code splitting, and server-side operations.
- **⚡ Real-time Metrics Engine**: Live views and post reaction counts powered by **Supabase Database** and **Supabase Realtime WebSockets** subscriptions.
- **❤️ Toggleable Binary Reactions**: User-friendly, single-click binary reaction toggles (Loves, Applauses, Bullseyes, Ideas) with filled/unfilled visual transitions. Tapping again undoes the action, instantly synchronizing across browsers.
- **👁️ Views Inflation Safeguard**: Browser-level views tracking restricts page view counts to increment at most once per browser session. List card widgets render view counts without modifying the stats database.
- **📝 MDX Blogging & Snippets**: Content managed via **Contentlayer** supporting advanced syntaxes, responsive layout containers, and reading time metrics.
- **🎨 Modern Dark Mode & Aesthetics**: Sleek dark mode toggling using Tailwind CSS, including fully optimized responsive layouts to prevent overlaps on mobile devices.
- **🎵 Spotify API Integration**: Displays current listening status or last played tracks in real-time.
- **💬 Giscus Comments**: Secure and GitHub-powered comments feed embedded directly on blog articles.
- **🤖 SEO Best Practices**: Fully automated XML sitemaps, semantic tag hierarchies, and metadata indexing setup.

---

## 🛠️ Tech Stack

- **Core**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Database & Realtime**: Supabase (PostgreSQL)
- **Content Engine**: Contentlayer2, MDX, Rehype plugins
- **Client Cache**: SWR (Stale-While-Revalidate) & SWR Mutation
- **Tooling**: pnpm, Husky, Prettier, ESLint

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory using the following keys:

```bash
# Supabase credentials (for DB connection and Realtime sockets)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Spotify Integration (Optional - for Spotify player)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# Giscus Comments (Optional - for blog comments)
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPOSITORY_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=

# Github Token (For Github API projects fetching)
GITHUB_API_TOKEN=
```

---

## 🚀 Getting Started

### 1. Install Dependencies

Ensure you have **Node.js** and **pnpm** installed, then run:

```bash
pnpm install
```

### 2. Database Setup

To run this project, make sure you set up a table named `stats` in your Supabase Postgres database with the following schema:

```sql
create table public.stats (
  type text not null,
  slug text not null,
  views bigint default 0 not null,
  loves bigint default 0 not null,
  applauses bigint default 0 not null,
  ideas bigint default 0 not null,
  bullseyes bigint default 0 not null,
  constraint stats_pkey primary key (type, slug)
);

-- Enable Realtime for the stats table
alter publication supabase_realtime add table stats;
```

Additionally, define the following PostgreSQL RPC function `increment_stats` to allow atomic updates:

```sql
create or replace function public.increment_stats(
  p_type text,
  p_slug text,
  p_views bigint default 0,
  p_loves bigint default 0,
  p_applauses bigint default 0,
  p_ideas bigint default 0,
  p_bullseyes bigint default 0
)
returns setof public.stats
language plpgsql
security definer
as $$
begin
  insert into public.stats (type, slug, views, loves, applauses, ideas, bullseyes)
  values (p_type, p_slug, p_views, p_loves, p_applauses, p_ideas, p_bullseyes)
  on conflict (type, slug)
  do update set
    views = public.stats.views + excluded.views,
    loves = public.stats.loves + excluded.loves,
    applauses = public.stats.applauses + excluded.applauses,
    ideas = public.stats.ideas + excluded.ideas,
    bullseyes = public.stats.bullseyes + excluded.bullseyes;

  return query
  select * from public.stats
  where type = p_type and slug = p_slug;
end;
$$;
```

### 3. Run Development Server

```bash
pnpm run dev
```

Open [http://localhost:3434](http://localhost:3434) with your browser to see the result.

### 4. Build for Production

To build the static HTML and optimized Next.js server bundle:

```bash
pnpm run build
```

---

## 📁 Project Structure

```
├── app/                  # Next.js App Router (pages and API endpoints)
├── components/           # Reusable UI React components
│   ├── blog/             # ViewsCounter, Reactions, and BlogMeta components
│   └── ui/               # Lower-level styling and container layouts
├── data/                 # MDX files for blog posts, authors, and configuration
├── hooks/                # Custom React hooks (realtime state, media query state)
├── layouts/              # MDX container and layout wrappers
├── scripts/              # Migration, feed, and post-build scripts
├── utils/                # Supabase helpers, sitemap compilers, and formatter utilities
└── public/               # Static assets (images, icons, resumes)
```
