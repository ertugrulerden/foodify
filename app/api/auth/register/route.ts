// Kayıt olma API endpoint'i
// POST /api/auth/register → { firstName, lastName, email, password }
// Başarılı: kullanıcı bilgilerini döner (passwordHash hariç)
// Hata: email zaten kayıtlıysa 400 döner
import { NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/data/queries"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { firstName, lastName, email, password } = body

  // Basit doğrulama
  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Tüm alanlar zorunludur" }, { status: 400 })
  }

  // Email daha önce kayıtlı mı kontrol et
  const existing = getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: "Bu email adresi zaten kayıtlı" }, { status: 400 })
  }

  // Kullanıcıyı oluştur (demo için şifre düz metin olarak saklanıyor)
  // Production'da bcrypt/argon2 ile hashlenmelidir
  const user = createUser({
    firstName,
    lastName,
    email,
    passwordHash: password,
    lastRegionID: 1, // Varsayılan bölge, adres seçince güncellenecek
  })

  // Hassas bilgiyi çıkarıp döndür
  return NextResponse.json({
    userID: user.userID,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })
}
