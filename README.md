# Foodify

**Multi-platform food price comparison & analytics dashboard**

Search, compare, and track menu prices across Yemeksepeti, Uber Eats, GetirYemek, and MigrosYemek — all in one place. Foodify is a full-stack aggregator that combines an automated data pipeline with an interactive analytics dashboard.

## Overview

Foodify scrapes menu prices from major Turkish food delivery platforms, stores them in a normalized SQLite schema, and surfaces them through a Next.js dashboard with historical trends, geolocation-based filtering, and admin tooling.

- Automated data pipeline covering **26,000+ Turkish neighborhoods** with geolocation-based targeting and parallelized workers
- Normalized relational schema enabling historical price trend queries and full-text search
- Interactive dashboard with time-series visualizations for regional price tracking

## Tech Stack

| Layer     | Technologies                                                  |
|-----------|---------------------------------------------------------------|
| Frontend  | Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui  |
| Backend   | Next.js API routes, Server Functions                          |
| Database  | SQLite (better-sqlite3) — 12 tables                           |
| Scraping  | Python (Playwright, parallelized workers)                     |

## Database Schema

The system is built on a 12-table relational schema:

`platforms` → `restaurants` → `products` → `prices` → `details`  
`city` → `district` → `region` → `restaurantRegion`  
`users` → `userFavs`

Supporting location-based filtering, historical price queries, full-text product search, and user favorites.

## Getting Started

```bash
# Install dependencies
npm install

# Initialize database
node init-db.mjs

# Seed synthetic platform data
npm run seed:platforms

# Import Yemeksepeti backup data
npm run import:yemeksepeti

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (MainActivityArea)/     # Main user-facing pages
    page.tsx              # Home (Hero + Feed)
    search/               # Product search & price comparison
    restaurants/          # Restaurant listings
    menus/                # Menu views
    profile/              # User profile
  admin/                  # Admin management panel
  api/                    # API routes
components/               # Reusable React components
lib/                      # Utilities & database queries
public/                   # Static assets
```

## Features

- **Price Comparison** — See the same product's price across 4 platforms on a single card
- **Advanced Search** — Filter by product name, platform, price range, rating, and location
- **Location-Based Filtering** — Browse by city / district / region
- **Historical Trends** — Track how prices change over time with time-series visualizations
- **Favorites** — Save products for quick access
- **Admin Panel** — CRUD management for restaurants, products, prices, regions, and users
- **Automated Updates** — Periodic scraping keeps prices current

## Deployment

Deploy on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
npm run build
```

## License

Private use.
