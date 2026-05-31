import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RestaurantCard from "@/components/Homepage/RestaurantCard"
import { buildPopularRestaurants } from "@/lib/data/homepage-cards"
import { getHomepageRestaurantRows } from "@/lib/data/queries"

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ regionID?: string }>
}) {
  const resolvedParams = await searchParams
  const regionID = resolvedParams.regionID ? Number(resolvedParams.regionID) : undefined
  const validRegionID = regionID && regionID > 0 ? regionID : undefined

  let rows = getHomepageRestaurantRows(1200, validRegionID)
  if (validRegionID && rows.length === 0) rows = getHomepageRestaurantRows(1200)
  const restaurants = buildPopularRestaurants(rows, 80)

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-3">
        <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Anasayfaya dön
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Tüm Popüler Restoranlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seçili adrese uygun, rating değeri yüksek restoranları tek ekranda inceleyin.
          </p>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Gösterilecek restoran bulunamadı.
        </div>
      ) : (
        <div className="grid justify-items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
      )}
    </main>
  )
}
