import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { getUserById, updateUser } from "@/lib/data/queries"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { userID, firstName, lastName, email, currentPassword, newPassword } = body

    if (!userID || !currentPassword) {
      return NextResponse.json({ error: "Kullanici ID ve mevcut sifre zorunludur" }, { status: 400 })
    }

    const user = getUserById(userID)
    if (!user) {
      return NextResponse.json({ error: "Kullanici bulunamadi" }, { status: 404 })
    }

    const passwordCheck = verifyPassword(currentPassword, user.passwordHash)
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: "Mevcut sifreniz hatali" }, { status: 401 })
    }

    // Yeni sifre varsa hashlenir, yoksa eski duz metin kayit hash formatina cekilir.
    const updatedPassword = newPassword && newPassword.length >= 6
      ? hashPassword(newPassword)
      : passwordCheck.needsRehash
        ? hashPassword(currentPassword)
        : user.passwordHash

    const updatedUser = updateUser(userID, {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      passwordHash: updatedPassword,
      lastRegionID: user.lastRegionID,
    })

    return NextResponse.json({
      userID: updatedUser.userID,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    })
  } catch {
    return NextResponse.json({ error: "Guncelleme sirasinda bir hata olustu" }, { status: 500 })
  }
}
