import Link from "next/link"
import { Toaster } from "sonner"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex h-screen shrink-0">
        <div className="w-64 bg-zinc-200 border-r p-4 flex flex-col gap-5">
            <Link href="/admin" className="font-bold text-xl text-amber-700">Foodify</Link>

            <span className="font-bold mt-7">Main Tables:</span>
            <Link href="/admin/platforms">Platforms</Link>
            <Link href="/admin/restaurants">Restaurants</Link>
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/prices">Prices</Link>
            <Link href="/admin/details">Details</Link>

            <span className="font-bold mt-7">Other Tables:</span>
            <Link href="/admin/cities">Cities</Link>
            <Link href="/admin/districts">Districts</Link>
            <Link href="/admin/regions">Regions</Link>
            <Link href="/admin/restaurant-regions">Restaurant Regions</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/user-favs">User Favorites</Link>
        </div>



        <main className="p-8 flex-1 overflow-y-auto">
          <Toaster/>
          {children}
        </main>
    </div>
  )
}

export default layout
