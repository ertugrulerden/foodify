import { NextResponse } from "next/server"
import { getHomepageMenuRows, getHomepageRestaurantRows } from "@/lib/data/queries"
import { buildPopularMenus, buildPopularRestaurants } from "@/lib/data/homepage-cards"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const regionParam = searchParams.get("regionID")
    const regionID = regionParam ? Number(regionParam) : undefined
    const validRegionID = regionID && regionID > 0 ? regionID : undefined

    let restaurantRows = getHomepageRestaurantRows(240, validRegionID)
    let menuRows = getHomepageMenuRows(800, validRegionID)

    // Secili bolgede veri yoksa anasayfa bos kalmasin diye genel listeye donulur.
    if (validRegionID && restaurantRows.length === 0) restaurantRows = getHomepageRestaurantRows()
    if (validRegionID && menuRows.length === 0) menuRows = getHomepageMenuRows()

    return NextResponse.json({
      restaurants: buildPopularRestaurants(restaurantRows),
      menus: buildPopularMenus(menuRows),
    })
  } catch (error) {
    console.error("Homepage API error:", error)
    return NextResponse.json(
      { error: "Anasayfa verisi getirilemedi" },
      { status: 500 }
    )
  }
}
