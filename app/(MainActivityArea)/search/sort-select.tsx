"use client"
import { useRouter, useSearchParams } from "next/navigation"

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sortBy = searchParams.get("sortBy") ?? "0"

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const url = new URLSearchParams(searchParams.toString())
    url.set("sortBy", e.target.value)
    router.push(`/search?${url.toString()}`)
  }

  return (
    <select className="border p-1 rounded" value={sortBy} onChange={handleChange}>
      <option value="0">Fiyat: Artan</option>
      <option value="1">Fiyat: Azalan</option>
      <option value="2">Puana Göre</option>
    </select>
  )
}
