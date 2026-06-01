// Adres modalinda kullanmak icin tum sehirleri donduruyor.
// Ornek: GET /api/address/cities
import { getAllCities } from "@/lib/data/queries"
import { NextResponse } from "next/server"

export async function GET() {
  const cities = getAllCities()
  return NextResponse.json(cities)
}
