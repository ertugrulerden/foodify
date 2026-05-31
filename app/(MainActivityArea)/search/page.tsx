import { searchProducts, getSearchPlatforms } from "@/lib/data/queries"
import type { SearchResult } from "@/lib/data/types"
import { FilterSidebar } from "./filter-sidebar"
import MenuCard from "@/components/Homepage/MenuCard"

type GroupedSearchResult = {
  productID: number
  restaurantID: number
  restaurantName: string
  productName: string
  image: string | null
  address: string
  rating: number | null
  fee: number | null
  deliveryTime: string | null
  minCart: number | null
  platforms: { name: string; price: number; sourceLink: string | null; rating: number | null; fee: number | null; deliveryTime: string | null; minCart: number | null; bestPrice?: boolean }[]
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    platforms?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    regionID?: string
  }>
}) {
  const resolvedParams = await searchParams
  const results = searchProducts(
    resolvedParams.q,
    resolvedParams.platforms?.split(",").filter(Boolean),
    resolvedParams.minPrice !== undefined ? Number(resolvedParams.minPrice) : undefined,
    resolvedParams.maxPrice !== undefined ? Number(resolvedParams.maxPrice) : undefined,
    resolvedParams.sortBy !== undefined ? Number(resolvedParams.sortBy) : undefined,
    resolvedParams.regionID !== undefined ? Number(resolvedParams.regionID) : undefined
  )
  const platforms = getSearchPlatforms()

  // Ayni urunun farkli platform fiyatlarini tek kartta gostermek icin satirlari grupluyoruz.
  function grouping(data: SearchResult[]): GroupedSearchResult[] {
    const groups: GroupedSearchResult[] = []
    data.forEach((r) => {
      const existing = groups.find((g) => g.productID === r.productID)
      const platformDetail = { name: r.platform, price: r.price, sourceLink: r.sourceLink, rating: r.rating, fee: r.fee, deliveryTime: r.deliveryTime, minCart: r.minCart }

      if (existing) {
        const existingPlatformIndex = existing.platforms.findIndex((p) => p.name === r.platform)
        // Ayni urun/platform tekrar gelirse kartta duplicate logo olusmasin; daha dusuk fiyatli satiri koruyoruz.
        if (existingPlatformIndex >= 0) {
          if (r.price < existing.platforms[existingPlatformIndex].price) {
            existing.platforms[existingPlatformIndex] = platformDetail
          }
        } else {
          existing.platforms.push(platformDetail)
        }
      } else {
        groups.push({
          productID: r.productID,
          restaurantID: r.restaurantID,
          restaurantName: r.restaurantName,
          productName: r.productName,
          image: r.image,
          address: r.address || "Bilinmeyen Konum",
          rating: r.rating,
          fee: r.fee,
          deliveryTime: r.deliveryTime,
          minCart: r.minCart,
          platforms: [platformDetail],
        })
      }
    })

    groups.forEach((g) => {
      g.platforms.sort((a, b) => a.price - b.price)
      if (g.platforms[0]) g.platforms[0].bestPrice = true
      const ratings = g.platforms.map((p) => p.rating).filter((value): value is number => value != null)
      const cheapestPlatform = g.platforms[0]
      // Platform rating'leri restoran detayindan gelir; birden fazla platform varsa kartta ortalamasi gosterilir.
      g.rating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : null
      g.fee = cheapestPlatform?.fee ?? null
      g.deliveryTime = cheapestPlatform?.deliveryTime ?? null
      g.minCart = cheapestPlatform?.minCart ?? null
    })

    // Kart seviyesinde siralama en iyi platform fiyatina gore yapiliyor.
    if ((resolvedParams.sortBy ?? "0") === "1") {
      groups.sort((a, b) => b.platforms[0].price - a.platforms[0].price)
    } else {
      groups.sort((a, b) => a.platforms[0].price - b.platforms[0].price)
    }

    return groups
  }

  const groups = grouping(results)
  const platformMap: Record<string, string> = {
    Yemeksepeti: "yemeksepeti",
    "Uber Eats": "ubereats",
    GetirYemek: "getir",
    MigrosYemek: "migros",
    "Migros Yemek": "migros",
  }

  return (
    <div className="flex gap-6 p-4">
      <FilterSidebar platforms={platforms} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm text-gray-500">{groups.length} Sonuc Bulundu</h2>
        </div>
        <div className="flex flex-wrap gap-2 justify-start">
          {groups.map((item) => {
            const prices: Record<string, number> = {}
            const links: Record<string, string> = {}
            item.platforms.forEach((p) => {
              const key = platformMap[p.name] || p.name.toLowerCase()
              prices[key] = p.price
              if (p.sourceLink) links[key] = p.sourceLink
            })

            return (
              <div key={`${item.restaurantID}-${item.productID}`} className="flex-[1_1_220px] max-w-[300px]">
                <MenuCard
                  id={String(item.restaurantID)}
                  productID={item.productID}
                  name={item.restaurantName}
                  location={item.address}
                  image={item.image ?? "/placeholder.svg"}
                  rating={item.rating ?? undefined}
                  fee={item.fee ?? undefined}
                  deliveryTime={item.deliveryTime ?? undefined}
                  minCart={item.minCart ?? undefined}
                  platforms={item.platforms.map((p) => platformMap[p.name] || p.name.toLowerCase())}
                  productName={item.productName}
                  platformPrices={prices}
                  platformLinks={links}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
