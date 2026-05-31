import Link from "next/link"
import { popularMenus } from "@/lib/data/homepage"
import type { HomepageMenuCard } from "@/lib/data/homepage-cards"
import MenuCard from "@/components/Homepage/MenuCard"
import ScrollableRow from "@/components/Homepage/ScrollableRow"

const PopularMenus = ({ items, regionID }: { items?: HomepageMenuCard[]; regionID?: number }) => {
  const visibleItems = items && items.length > 0 ? items : popularMenus
  const allHref = regionID ? `/menus?regionID=${regionID}` : "/menus"

  return (
    <section className="pb-8">
      <div className="mb-5 flex items-center justify-between px-6">
        <h2 className="headline-lg">Popüler Menüler</h2>
        <Link href={allHref} className="text-sm font-medium text-primary hover:underline">
          Tümünü gör
        </Link>
      </div>
      <ScrollableRow>
        {visibleItems.map((m) => (
          <MenuCard key={m.productID} {...m} />
        ))}
      </ScrollableRow>
    </section>
  )
}

export default PopularMenus
