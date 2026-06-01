// Secilen sehre gore ilceleri donduruyor.
// Ornek: GET /api/address/districts?cityID=1
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/data/db"
import type { District } from "@/lib/data/types"

export async function GET(req: NextRequest) {
  const cityID = req.nextUrl.searchParams.get("cityID")
  if (!cityID) return NextResponse.json([])

  // Verilen cityID'ye ait ilceler getirilir.
  const districts = db
    .prepare("SELECT * FROM district WHERE cityID = ? ORDER BY district")
    .all(Number(cityID)) as District[]

  return NextResponse.json(districts)
}
