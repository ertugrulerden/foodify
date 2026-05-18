
import Link from "next/link"
import { popularMenus } from "@/lib/data/homepage"
import MenuCard from "@/components/Homepage/MenuCard"
import ScrollableRow from "@/components/Homepage/ScrollableRow"

const PopularMenus = () => {
  return (
    <section className="pb-8">
      <div className="mb-5 flex items-center justify-between px-6">
        <h2 className="headline-lg">Popular Menus</h2>
        <h2 className="headline-lg">Popular Restaurants</h2>
        <Link href="/restaurants" className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>
      <ScrollableRow>
        {popularMenus.map((m) => (
          <MenuCard key={m.productID} {...m} />
        ))}
      </ScrollableRow>
    </section>
  )
}

export default PopularMenus
