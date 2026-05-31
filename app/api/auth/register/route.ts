import { hashPassword } from "@/lib/auth/password"
import { createUser, getUserByEmail } from "@/lib/data/queries"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { firstName, lastName, email, password } = body

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Tum alanlar zorunludur" }, { status: 400 })
  }

  const existing = getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: "Bu email adresi zaten kayitli" }, { status: 400 })
  }

  const user = createUser({
    firstName,
    lastName,
    email,
    // Yeni kullanicilar icin sifre artik veritabanina hashlenmis olarak yaziliyor.
    passwordHash: hashPassword(password),
    lastRegionID: 1,
  })

  return NextResponse.json({
    userID: user.userID,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })
}
