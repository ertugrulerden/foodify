import { NextRequest, NextResponse } from "next/server"
import { getUserAddresses, createUserAddress, deleteUserAddress } from "@/lib/data/queries"

export async function GET(req: NextRequest) {
  const userID = req.nextUrl.searchParams.get("userID")
  if (!userID) return NextResponse.json({ error: "userID gerekli" }, { status: 400 })

  try {
    const addresses = getUserAddresses(parseInt(userID, 10))
    return NextResponse.json(addresses)
  } catch (error) {
    return NextResponse.json({ error: "Adresler getirilemedi" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userID, regionID, title, detail } = body

    if (!userID || !regionID || !title) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 })
    }

    const newAddress = createUserAddress({ userID, regionID, title, detail })
    return NextResponse.json(newAddress)
  } catch (error) {
    return NextResponse.json({ error: "Adres eklenemedi" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const addressID = req.nextUrl.searchParams.get("addressID")
  if (!addressID) return NextResponse.json({ error: "addressID gerekli" }, { status: 400 })

  try {
    deleteUserAddress(parseInt(addressID, 10))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Adres silinemedi" }, { status: 500 })
  }
}
