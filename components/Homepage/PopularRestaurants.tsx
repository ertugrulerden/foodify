
import Link from "next/link"
import { popularRestaurants } from "@/lib/data/homepage"
import RestaurantCard from "@/components/Homepage/RestaurantCard"
import ScrollableRow from "@/components/Homepage/ScrollableRow"

const PopularRestaurants = () => {
  return (
    <section className="pb-8">
      <div className="mb-5 flex items-center justify-between px-6">
        <h2 className="headline-lg">Popular Restaurants</h2>
        <Link href="/restaurants" className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>
      <ScrollableRow>
        {popularRestaurants.map((r) => (
          <RestaurantCard key={r.name} {...r} />
        ))}
      </ScrollableRow>
    </section>
  )
}

export default PopularRestaurants
