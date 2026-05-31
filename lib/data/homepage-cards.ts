import type { SearchResult } from "./types"
import { isUsableProductImage } from "./images"

export type HomepageMenuCard = {
  productID: number
  productName: string
  name: string
  location: string
  image: string
  platforms: string[]
  platformPrices: Record<string, number>
  platformLinks: Record<string, string>
  rating?: number
  fee?: number
  deliveryTime?: string
  minCart?: number
}

export type HomepageRestaurantCard = {
  id: string
  name: string
  location: string
  image: string
  platforms: string[]
  platformLinks: Record<string, string>
  rating?: number
  fee?: number
  deliveryTime?: string
  minCart?: number
}

export const platformMap: Record<string, string> = {
  Yemeksepeti: "yemeksepeti",
  "Uber Eats": "ubereats",
  GetirYemek: "getir",
  MigrosYemek: "migros",
  "Migros Yemek": "migros",
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined
}

function sortByRatingThenPrice<T extends { rating?: number; platformPrices?: Record<string, number> }>(items: T[]) {
  return [...items].sort((a, b) => {
    const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0)
    if (ratingDiff !== 0) return ratingDiff

    const aPrice = Math.min(...Object.values(a.platformPrices ?? { fallback: Number.MAX_SAFE_INTEGER }))
    const bPrice = Math.min(...Object.values(b.platformPrices ?? { fallback: Number.MAX_SAFE_INTEGER }))
    return aPrice - bPrice
  })
}

export function buildPopularMenus(rows: SearchResult[], limit = 12): HomepageMenuCard[] {
  const groups = new Map<number, HomepageMenuCard & { ratings: number[] }>()

  rows.forEach((row) => {
    if (!isUsableProductImage(row.image)) return
    const key = platformMap[row.platform] || row.platform.toLowerCase()
    const existing = groups.get(row.productID)

    if (existing) {
      if (!existing.platforms.includes(key)) existing.platforms.push(key)
      existing.platformPrices[key] = row.price
      if (row.sourceLink) existing.platformLinks[key] = row.sourceLink
      if (row.rating != null) existing.ratings.push(row.rating)
      return
    }

    groups.set(row.productID, {
      productID: row.productID,
      productName: row.productName,
      name: row.restaurantName,
      location: row.address || "Bilinmeyen Konum",
      image: row.image,
      platforms: [key],
      platformPrices: { [key]: row.price },
      platformLinks: row.sourceLink ? { [key]: row.sourceLink } : {},
      fee: row.fee ?? undefined,
      deliveryTime: row.deliveryTime ?? undefined,
      minCart: row.minCart ?? undefined,
      ratings: row.rating != null ? [row.rating] : [],
    })
  })

  // Populer menuler rating'i yuksek restoranlardan, gercek gorseli ve guncel fiyat bilgisi olan urunlerden secilir.
  return sortByRatingThenPrice(
    Array.from(groups.values()).map(({ ratings, ...menu }) => ({
      ...menu,
      rating: average(ratings),
    }))
  ).slice(0, limit)
}

export function buildPopularRestaurants(rows: SearchResult[], limit = 12): HomepageRestaurantCard[] {
  const groups = new Map<number, HomepageRestaurantCard & { ratings: number[] }>()

  rows.forEach((row) => {
    if (!isUsableProductImage(row.image)) return
    const key = platformMap[row.platform] || row.platform.toLowerCase()
    const existing = groups.get(row.restaurantID)

    if (existing) {
      if (!existing.platforms.includes(key)) existing.platforms.push(key)
      if (row.sourceLink) existing.platformLinks[key] = row.sourceLink
      if (row.rating != null) existing.ratings.push(row.rating)
      return
    }

    groups.set(row.restaurantID, {
      id: String(row.restaurantID),
      name: row.restaurantName,
      location: row.address || "Bilinmeyen Konum",
      image: row.image,
      platforms: [key],
      platformLinks: row.sourceLink ? { [key]: row.sourceLink } : {},
      fee: row.fee ?? undefined,
      deliveryTime: row.deliveryTime ?? undefined,
      minCart: row.minCart ?? undefined,
      ratings: row.rating != null ? [row.rating] : [],
    })
  })

  // Restoranlar bolge icinde rating'e gore siralanir; 5.0 olanlar dogal olarak en uste gelir.
  return Array.from(groups.values())
    .map(({ ratings, ...restaurant }) => ({ ...restaurant, rating: average(ratings) }))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit)
}
