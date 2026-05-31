import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MenuCard from "@/components/Homepage/MenuCard"
import { buildPopularMenus } from "@/lib/data/homepage-cards"
import { getHomepageMenuRows } from "@/lib/data/queries"

export default async function MenusPage({
  searchParams,
}: {
  searchParams: Promise<{ regionID?: string }>
}) {
  const resolvedParams = await searchParams
  const regionID = resolvedParams.regionID ? Number(resolvedParams.regionID) : undefined
  const validRegionID = regionID && regionID > 0 ? regionID : undefined

  let rows = getHomepageMenuRows(2400, validRegionID)
  if (validRegionID && rows.length === 0) rows = getHomepageMenuRows(2400)
  const menus = buildPopularMenus(rows, 80)

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-3">
        <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Anasayfaya dön
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Tüm Popüler Menüler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Menüler kategorisinden gelen, gerçek görseli ve platform fiyatı olan popüler ürünleri karşılaştırın.
          </p>
        </div>
      </div>

      {menus.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Gösterilecek menü bulunamadı.
        </div>
      ) : (
        <div className="grid justify-items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menus.map((menu) => (
            <MenuCard key={menu.productID} {...menu} />
          ))}
        </div>
      )}
    </main>
  )
}
