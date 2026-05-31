import { NextResponse } from "next/server"
import { getHomepageMenuRows, getHomepageRestaurantRows } from "@/lib/data/queries"
import { buildPopularMenus, buildPopularRestaurants } from "@/lib/data/homepage-cards"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const regionParam = searchParams.get("regionID")
  const regionID = regionParam ? Number(regionParam) : undefined
  const validRegionID = regionID && regionID > 0 ? regionID : undefined

  let restaurantRows = getHomepageRestaurantRows(240, validRegionID)
  let menuRows = getHomepageMenuRows(800, validRegionID)

  // Secilen bolgede veri yoksa anasayfayi bos birakmamak icin genel populer veriye duseriz.
  if (validRegionID && restaurantRows.length === 0) restaurantRows = getHomepageRestaurantRows()
  if (validRegionID && menuRows.length === 0) menuRows = getHomepageMenuRows()

  return NextResponse.json({
    restaurants: buildPopularRestaurants(restaurantRows),
    menus: buildPopularMenus(menuRows),
  })
}
