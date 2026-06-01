"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { Platform } from "@/lib/data/types"
import { Separator } from "@/components/ui/separator"
import { RotateCcw } from "lucide-react"
import Image from "next/image"

export function FilterSidebar({ platforms }: { platforms: Platform[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlatforms = searchParams.get("platforms")?.split(",").filter(Boolean) ?? []
  const currentSort = searchParams.get("sortBy") ?? "0"
  const currentRating = searchParams.get("minRating") ?? ""

  // Filtreler URL'de tutuldugu icin sayfa yenilense de secimler kaybolmaz.
  function updateURL(newPlatforms?: string[], newMinPrice?: string, newMaxPrice?: string, sortBy?: string, minRating?: string) {
    const url = new URLSearchParams(searchParams.toString())
    const platform = newPlatforms ?? selectedPlatforms

    if (platform.length > 0) {
      url.set("platforms", platform.join(","))
    } else {
      url.delete("platforms")
    }

    if (newMinPrice !== undefined) {
      if (newMinPrice === "") url.delete("minPrice")
      else url.set("minPrice", newMinPrice)
    }

    if (newMaxPrice !== undefined) {
      if (newMaxPrice === "") url.delete("maxPrice")
      else url.set("maxPrice", newMaxPrice)
    }

    if (sortBy !== undefined) {
      if (sortBy === "") url.delete("sortBy")
      else url.set("sortBy", sortBy)
    }

    if (minRating !== undefined) {
      if (minRating === "") url.delete("minRating")
      else url.set("minRating", minRating)
    }

    const queryString = url.toString()
    router.push(queryString ? `/search?${queryString}` : "/search")
  }

  function handlePlatformChange(platformName: string) {
    const updated = selectedPlatforms.includes(platformName)
      ? selectedPlatforms.filter((p) => p !== platformName)
      : [...selectedPlatforms, platformName]
    updateURL(updated)
  }

  function resetFilters() {
    updateURL([], "", "", "", "")
  }

  const platformLogos: Record<string, string> = {
    Yemeksepeti: "/yemeksepeti52.png",
    "Uber Eats": "/ubereats52.png",
    GetirYemek: "/getir52.png",
    // DB'de bu platform adi bosluksuz geldigi icin logo burada eslenir.
    MigrosYemek: "/migros52.png",
    "Migros Yemek": "/migros52.png",
  }

  return (
    <div className="w-72 border p-4 rounded shrink-0 sticky top-5 h-full bg-white shadow-sm">
      <h2 className="font-bold mb-3 text-slate-800">Siralama</h2>
      <div className="flex flex-col gap-2.5 mb-5">
        <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group">
          <input type="radio" name="sortBy" value="0" className="accent-primary w-4 h-4 cursor-pointer" checked={currentSort === "0"} onChange={(e) => updateURL(undefined, undefined, undefined, e.target.value)} />
          <span className="text-sm font-medium text-slate-600 group-hover:text-primary">Fiyat: Artan</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group">
          <input type="radio" name="sortBy" value="1" className="accent-primary w-4 h-4 cursor-pointer" checked={currentSort === "1"} onChange={(e) => updateURL(undefined, undefined, undefined, e.target.value)} />
          <span className="text-sm font-medium text-slate-600 group-hover:text-primary">Fiyat: Azalan</span>
        </label>
      </div>

      <Separator className="my-5" />

      <h2 className="font-bold mb-3 text-slate-800">Platformlar</h2>
      <div className="flex flex-col gap-3">
        {platforms.map((p) => (
          <label key={p.platformID} className="flex items-center gap-3 py-1 cursor-pointer hover:text-primary transition-colors group">
            <input
              type="checkbox"
              className="accent-primary h-4 w-4 rounded border-slate-300 cursor-pointer"
              name="platform"
              value={p.platform}
              checked={selectedPlatforms.includes(p.platform)}
              onChange={() => handlePlatformChange(p.platform)}
            />
            {platformLogos[p.platform] && (
              <Image src={platformLogos[p.platform]} alt={p.platform} width={24} height={24} className="rounded-md object-contain" />
            )}
            <span className="text-sm font-medium text-slate-600 group-hover:text-primary">{p.platform}</span>
          </label>
        ))}
      </div>

      <Separator className="my-5" />

      <h2 className="font-bold mb-3 text-slate-800">Puan</h2>
      <div className="flex flex-col gap-2.5 mb-5">
        {[
          { value: "", label: "Tumu" },
          { value: "4.5", label: "4.5 ve uzeri" },
          { value: "4", label: "4.0 ve uzeri" },
          { value: "3.5", label: "3.5 ve uzeri" },
        ].map((option) => (
          <label key={option.value || "all"} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group">
            <input
              type="radio"
              name="minRating"
              value={option.value}
              className="accent-primary w-4 h-4 cursor-pointer"
              checked={currentRating === option.value}
              onChange={(e) => updateURL(undefined, undefined, undefined, undefined, e.target.value)}
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-primary">{option.label}</span>
          </label>
        ))}
      </div>

      <Separator className="my-5" />

      <h2 className="font-bold mb-3 text-slate-800">Fiyat Araligi</h2>
      <div className="flex gap-2 items-center">
        <div className="relative w-full">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">TL</span>
          <input
            type="number"
            placeholder="Min"
            value={searchParams.get("minPrice") ?? ""}
            onChange={(e) => updateURL(undefined, e.target.value, undefined, undefined)}
            className="border border-slate-200 pl-8 pr-2 py-1.5 w-full rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <span className="text-slate-300 font-bold">-</span>
        <div className="relative w-full">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">TL</span>
          <input
            type="number"
            placeholder="Max"
            value={searchParams.get("maxPrice") ?? ""}
            onChange={(e) => updateURL(undefined, undefined, e.target.value, undefined)}
            className="border border-slate-200 pl-8 pr-2 py-1.5 w-full rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      <div className="mt-6">
        <button className="w-full text-white bg-slate-800 hover:bg-slate-900 font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2" onClick={resetFilters}>
          <RotateCcw className="w-4 h-4" />
          Filtreleri Sifirla
        </button>
      </div>
    </div>
  )
}
