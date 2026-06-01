"use client"

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Adres yokken arama yapilmak istenirse ilk bu ekran aciliyor.
// Kullanici buradan giris/kayit veya misafir devam akisini seciyor.
interface WelcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginClick: () => void        // Giris/kayit ekranina gecer.
  onContinueAsGuest: () => void   // Misafir adres akisini baslatir.
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

        {/* Ustteki karşilama ikonu */}
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-4xl">
            🍔 🍕 👤 🍟 😋
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Giris/kayit akisini acar */}
          <Button className="w-full" size="lg" onClick={onLoginClick}>
            Giriş Yap veya Üye ol
          </Button>

          {/* Misafir olarak adres secimine gecer */}
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
