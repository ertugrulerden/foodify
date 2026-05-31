import Link from "next/link"
import { popularRestaurants } from "@/lib/data/homepage"
import type { HomepageRestaurantCard } from "@/lib/data/homepage-cards"
import RestaurantCard from "@/components/Homepage/RestaurantCard"
import ScrollableRow from "@/components/Homepage/ScrollableRow"

const PopularRestaurants = ({ items, regionID }: { items?: HomepageRestaurantCard[]; regionID?: number }) => {
  const visibleItems = items && items.length > 0 ? items : popularRestaurants
  const allHref = regionID ? `/restaurants?regionID=${regionID}` : "/restaurants"

  return (
    <section className="pb-8">
      <div className="mb-5 flex items-center justify-between px-6">
        <h2 className="headline-lg">Popüler Restoranlar</h2>
        <Link href={allHref} className="text-sm font-medium text-primary hover:underline">
          Tümünü gör
        </Link>
      </div>
      <ScrollableRow>
        {visibleItems.map((r) => (
          <RestaurantCard key={"id" in r ? r.id : r.name} {...r} />
        ))}
      </ScrollableRow>
    </section>
  )
}

export default PopularRestaurants
