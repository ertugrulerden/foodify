"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Üye Ol Modalı
// Ad, Soyad, Email, Şifre, Şifre Tekrar alanları
// Kayıt başarılı olunca otomatik giriş yapılır
interface RegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin: () => void   // "Giriş yap" tıklanınca çağrılır
  onRegisterSuccess: (user: { userID: number; firstName: string; lastName: string; email: string }) => void
}

export default function RegisterModal({ open, onOpenChange, onSwitchToLogin, onRegisterSuccess }: RegisterModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Üye ol butonuna basılınca
  const handleRegister = async () => {
    setError("")
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      setError("Tüm alanlar zorunludur")
      return
    }
    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor")
      return
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız")
        return
      }
      // Kayıt başarılı — otomatik giriş yap
      onRegisterSuccess(data)
      onOpenChange(false)
      // Formu temizle
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setPasswordConfirm("")
    } catch {
      setError("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Üye Ol</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hata mesajı */}
          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          {/* Ad ve Soyad yan yana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="reg-firstname">Ad</Label>
              <Input
                id="reg-firstname"
                placeholder="Ad"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-lastname">Soyad</Label>
              <Input
                id="reg-lastname"
                placeholder="Soyad"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Şifre */}
          <div className="space-y-1">
            <Label htmlFor="reg-password">Şifre</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="En az 6 karakter"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Şifre Tekrar */}
          <div className="space-y-1">
            <Label htmlFor="reg-password-confirm">Şifre Tekrar</Label>
            <Input
              id="reg-password-confirm"
              type="password"
              placeholder="Şifrenizi tekrar girin"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
            />
          </div>

          {/* Üye Ol butonu */}
          <Button className="w-full" onClick={handleRegister} disabled={loading}>
            {loading ? "Kayıt yapılıyor..." : "Üye Ol"}
          </Button>

          {/* Giriş yap linki */}
          <p className="text-sm text-center text-muted-foreground">
            Zaten üye misiniz?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Giriş yap
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
