// Giriş yapma API endpoint'i
// POST /api/auth/login → { email, password }
// Başarılı: kullanıcı bilgilerini döner (passwordHash hariç)
// Hata: email/şifre yanlışsa 401 döner
import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/data/queries"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body

  // Basit doğrulama
  if (!email || !password) {
    return NextResponse.json({ error: "Email ve şifre zorunludur" }, { status: 400 })
  }

  // Email ile kullanıcıyı bul
  const user = getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: "Email veya şifre hatalı" }, { status: 401 })
  }

  // Şifre kontrolü (demo için düz metin karşılaştırma)
  // Production'da bcrypt.compare() kullanılmalıdır
  if (user.passwordHash !== password) {
    return NextResponse.json({ error: "Email veya şifre hatalı" }, { status: 401 })
  }

  // Hassas bilgiyi çıkarıp döndür
  return NextResponse.json({
    userID: user.userID,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })
}
