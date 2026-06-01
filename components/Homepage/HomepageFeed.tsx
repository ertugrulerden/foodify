"use client"

import { useEffect, useState } from "react"
import { useAddress } from "@/components/AddressContext"
import PopularMenus from "@/components/Homepage/PopularMenus"
import PopularRestaurants from "@/components/Homepage/PopularRestaurants"
import type { HomepageMenuCard, HomepageRestaurantCard } from "@/lib/data/homepage-cards"

type HomepagePayload = {
  restaurants: HomepageRestaurantCard[]
  menus: HomepageMenuCard[]
}

export default function HomepageFeed() {
  const { address } = useAddress()
  const [payload, setPayload] = useState<HomepagePayload | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const params = address?.regionID ? `?regionID=${address.regionID}` : ""

    // Adres degisince anasayfadaki populer listeler tekrar yuklenir.
    fetch(`/api/homepage${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: HomepagePayload) => setPayload(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        console.error("Anasayfa verisi getirilemedi", error)
      })

    return () => controller.abort()
  }, [address?.regionID])

  return (
    <>
      <PopularRestaurants items={payload?.restaurants} regionID={address?.regionID} />
      <PopularMenus items={payload?.menus} regionID={address?.regionID} />
    </>
  )
}
