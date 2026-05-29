"use client"

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Hoş Geldin Modalı — arama yapılmak istendiğinde ilk açılan ekran
// "Giriş Yap veya Üye Ol" → giriş/kayıt modallarını açar
// "Üye Olmadan Devam Et" → adres seçme modalını açar
interface WelcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginClick: () => void        // Giriş yap tıklanınca çağrılır
  onContinueAsGuest: () => void   // Üye olmadan devam et tıklanınca çağrılır
}

export default function WelcomeModal({ open, onOpenChange, onLoginClick, onContinueAsGuest }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-xl">Hoş Geldin</DialogTitle>
          <DialogDescription className="text-center">
            Sana en yakın restoranları ve teslimat sürelerini gösterebilmemiz için
          </DialogDescription>
        </DialogHeader>

        {/* Emoji/avatar alanı */}
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-4xl">
            🍔 🍕 👤 🍟 😋
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Giriş Yap / Üye Ol butonu — LoginModal'ı açar */}
          <Button className="w-full" size="lg" onClick={onLoginClick}>
            Giriş Yap veya Üye ol
          </Button>

          {/* Üye olmadan devam et — adres seçme modalını açar */}
          <Button
            variant="outline"
            className="w-full text-primary"
            size="lg"
            onClick={onContinueAsGuest}
          >
            Üye Olmadan Devam Et
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
