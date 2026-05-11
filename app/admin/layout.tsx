import Link from "next/link"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex h-screen">
        <div className="w-64 bg-zinc-200 border-r p-4 flex flex-col gap-5">
            <Link href="/admin">Foodify</Link>

            <Link href="/admin/platforms">Platforms</Link>
            <Link href="/admin/restaurants">Restaurants</Link>
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/prices">Prices</Link>
            <Link href="/admin/details">Details</Link>

        </div>

        <main className="p-8">{children}</main>
    </div>
  )
}

export default layout
