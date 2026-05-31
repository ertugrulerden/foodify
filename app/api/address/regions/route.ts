// Seçilen ilçeye göre mahalleleri (bölgeleri) dönen API endpoint'i
// GET /api/address/regions?districtID=1 → [{ regionID: 1, region: "Kadıköy Mah.", districtID: 1 }, ...]
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/data/db"
import type { Region } from "@/lib/data/types"

export async function GET(req: NextRequest) {
  const districtID = req.nextUrl.searchParams.get("districtID")
  if (!districtID) return NextResponse.json([])

  // Verilen districtID'ye ait mahalleleri getir
  const regions = db
    .prepare("SELECT * FROM region WHERE districtID = ? ORDER BY region")
    .all(Number(districtID)) as Region[]

  return NextResponse.json(regions)
}
