// Kullanıcı profili güncelleme API'si
// PUT /api/auth/profile
// Gelen Veri: { userID, firstName, lastName, email, currentPassword, newPassword }
import { NextRequest, NextResponse } from "next/server"
import { getUserById, updateUser } from "@/lib/data/queries"

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { userID, firstName, lastName, email, currentPassword, newPassword } = body

    // Temel doğrulama
    if (!userID || !currentPassword) {
      return NextResponse.json({ error: "Kullanıcı ID ve Mevcut Şifre zorunludur" }, { status: 400 })
    }

    // Kullanıcıyı veritabanından bul
    const user = getUserById(userID)
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    // Mevcut şifre kontrolü (Demo için düz metin karşılaştırması)
    if (user.passwordHash !== currentPassword) {
      return NextResponse.json({ error: "Mevcut şifreniz hatalı" }, { status: 401 })
    }

    // Eğer yeni şifre gönderilmişse onu kullan, gönderilmemişse mevcut şifreyi koru
    const updatedPassword = newPassword && newPassword.length >= 6 ? newPassword : user.passwordHash

    // Veritabanını güncelle
    const updatedUser = updateUser(userID, {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      passwordHash: updatedPassword,
      lastRegionID: user.lastRegionID // Bölge şimdilik sabit kalıyor
    })

    // Şifreyi çıkararak yeni veriyi dön
    return NextResponse.json({
      userID: updatedUser.userID,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    })
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme sırasında bir hata oluştu" }, { status: 500 })
  }
}
