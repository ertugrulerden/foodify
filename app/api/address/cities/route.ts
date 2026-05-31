// Tüm şehirleri dönen API endpoint'i
// GET /api/address/cities → [{ cityID: 1, city: "Elazığ" }, ...]
import { getAllCities } from "@/lib/data/queries"
import { NextResponse } from "next/server"

export async function GET() {
  const cities = getAllCities()
  return NextResponse.json(cities)
}
