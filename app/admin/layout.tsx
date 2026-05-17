import Link from "next/link"
import { Toaster } from "sonner"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex h-screen shrink-0">
        <div className="w-64 bg-zinc-200 border-r p-4 flex flex-col gap-5">
            <Link href="/admin" className="font-bold text-xl text-amber-700">Foodify</Link>

            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 mt-7">Main Tables</span>
            <Link href="/admin/platforms" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Platforms</Link>
            <Link href="/admin/restaurants" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Restaurants</Link>
            <Link href="/admin/products" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Products</Link>
            <Link href="/admin/prices" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Prices</Link>
            <Link href="/admin/details" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Details</Link>

            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 mt-7">Other Tables</span>
            <Link href="/admin/cities" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Cities</Link>
            <Link href="/admin/districts" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Districts</Link>
            <Link href="/admin/regions" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Regions</Link>
            <Link href="/admin/restaurant-regions" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Restaurant Regions</Link>
            <Link href="/admin/users" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">Users</Link>
            <Link href="/admin/user-favs" className="px-3 py-1.5 rounded-md hover:bg-zinc-300/50 active:bg-zinc-400/50 transition-colors">User Favorites</Link>
        </div>



        <main className="p-8 flex-1 overflow-y-auto">
          <Toaster/>
          {children}
        </main>
    </div>
  )
}

export default layout
