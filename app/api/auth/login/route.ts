import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { getUserByEmail, updateUserPassword } from "@/lib/data/queries"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: "Email ve sifre zorunludur" }, { status: 400 })
  }

  const user = getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: "Email veya sifre hatali" }, { status: 401 })
  }

  const passwordCheck = verifyPassword(password, user.passwordHash)
  if (!passwordCheck.valid) {
    return NextResponse.json({ error: "Email veya sifre hatali" }, { status: 401 })
  }

  // Eski duz metin sifreli kullanici basarili giris yaparsa kaydi otomatik hash formatina tasiyoruz.
  if (passwordCheck.needsRehash) {
    updateUserPassword(user.userID, hashPassword(password))
  }

  return NextResponse.json({
    userID: user.userID,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })
}
