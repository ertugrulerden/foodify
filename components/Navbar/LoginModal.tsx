"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Giris formu. Email ve sifre ile kullaniciyi oturuma aliyor.
interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToRegister: () => void   // Uye ol formuna gecmek icin.
  onLoginSuccess: (user: { userID: number; firstName: string; lastName: string; email: string }) => void
}

export default function LoginModal({ open, onOpenChange, onSwitchToRegister, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Giris formu gonderilince API'ye istek atiyorum.
  const handleLogin = async () => {
    setError("")
    if (!email || !password) {
      setError("Email ve şifre zorunludur")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Giriş başarısız")
        return
      }
      // Giris basariliysa kullanici bilgisini ust akisa veriyorum.
      onLoginSuccess(data)
      onOpenChange(false)
      // Formu sifirliyorum.
      setEmail("")
      setPassword("")
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
          <DialogTitle className="text-center text-xl">Giriş Yap</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hata mesaji */}
          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Sifre */}
          <div className="space-y-1">
            <Label htmlFor="login-password">Şifre</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Giris butonu */}
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>

          {/* Uye ol formuna gecis */}
          <p className="text-sm text-center text-muted-foreground">
            Üye değil misiniz?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Üye ol
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
