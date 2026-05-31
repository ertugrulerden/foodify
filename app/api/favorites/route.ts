import { NextRequest, NextResponse } from "next/server"
import { getUserFavProducts, toggleUserFav } from "@/lib/data/queries"

export async function GET(req: NextRequest) {
  const userID = req.nextUrl.searchParams.get("userID")
  if (!userID) return NextResponse.json({ error: "userID gerekli" }, { status: 400 })

  try {
    const favorites = getUserFavProducts(parseInt(userID, 10))
    return NextResponse.json(favorites)
  } catch {
    return NextResponse.json({ error: "Favoriler getirilemedi" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userID, productID } = body

    if (!userID || !productID) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
    }

    const result = toggleUserFav(userID, productID)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Favori işlemi başarısız" }, { status: 500 })
  }
}
