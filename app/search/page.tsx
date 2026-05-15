"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { SearchResult } from "@/lib/data/types"
export default function SearchPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  useEffect(() => {
    fetch(`/api/search?${searchParams.toString()}`)
      .then(res => res.json())
      .then(data => setResults(data))
  }, [searchParams])
  return (
    <div>
      {results.map((r, i) => (
        <div key={i}>
          <h3>{r.productName}</h3>
          <p>{r.restaurantName} - {r.platform}: {r.price}TL</p>
        </div>
      ))}
    </div>
  )
}