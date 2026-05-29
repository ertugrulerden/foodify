// Seçilen şehre göre ilçeleri dönen API endpoint'i
// GET /api/address/districts?cityID=1 → [{ districtID: 1, district: "Merkez", cityID: 1 }, ...]
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/data/db"
import type { District } from "@/lib/data/types"

export async function GET(req: NextRequest) {
  const cityID = req.nextUrl.searchParams.get("cityID")
  if (!cityID) return NextResponse.json([])

  // Verilen cityID'ye ait ilçeleri getir
  const districts = db
    .prepare("SELECT * FROM district WHERE cityID = ? ORDER BY district")
    .all(Number(cityID)) as District[]

  return NextResponse.json(districts)
}
