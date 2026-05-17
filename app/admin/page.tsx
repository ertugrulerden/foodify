import Link from "next/link"
import { getDashboardCounts } from "@/lib/data/queries"

const Page = () => {
  const counts = getDashboardCounts()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <CountCard href="/admin/restaurants" label="Restaurants" value={counts.restaurants} />
        <CountCard href="/admin/products" label="Products" value={counts.products} />
        <CountCard href="/admin/platforms" label="Platforms" value={counts.platforms} />
        <CountCard href="/admin/prices" label="Prices" value={counts.prices} />
        <CountCard href="/admin/users" label="Users" value={counts.users} />
        <CountCard href="/admin/cities" label="Cities" value={counts.cities} />
        <CountCard href="/admin/districts" label="Districts" value={counts.districts} />
        <CountCard href="/admin/regions" label="Regions" value={counts.regions} />
      </div>
    </div>
  )
}

const CountCard = ({ href, label, value }: { href: string; label: string; value: number }) => (
  <Link href={href} className="block rounded-xl border bg-card p-4 text-center hover:shadow-md transition-shadow">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </Link>
)

export default Page
