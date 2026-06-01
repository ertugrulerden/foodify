// Secilen ilceye gore mahalleleri/bolgeleri donduruyor.
// Ornek: GET /api/address/regions?districtID=1
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/data/db"
import type { Region } from "@/lib/data/types"

export async function GET(req: NextRequest) {
  const districtID = req.nextUrl.searchParams.get("districtID")
  if (!districtID) return NextResponse.json([])

  // Verilen districtID'ye ait mahalleler getirilir.
  const regions = db
    .prepare("SELECT * FROM region WHERE districtID = ? ORDER BY region")
    .all(Number(districtID)) as Region[]

  return NextResponse.json(regions)
}
