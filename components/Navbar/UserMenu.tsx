"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useAuthModals } from "@/components/AuthModalContext"

// UserMenu: Kullanıcı menüsü bileşeni
const UserMenu = () => {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null)
  const { openLogin, openRegister } = useAuthModals()

  // Bileşen yüklendiğinde ve storage event'lerinde localStorage'ı kontrol et
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("foodify_user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          console.error("Kullanıcı bilgisi okunamadı")
        }
      } else {
        setUser(null)
      }
    }
    
    checkUser()
    window.addEventListener("storage", checkUser)
    return () => window.removeEventListener("storage", checkUser)
  }, [])

  // Çıkış yap: localStorage'dan sil ve sayfayı yenile
  const handleLogout = () => {
    // Cikis sonrasi secili adres ekranda kalmasin; tekrar adres secmesi istenir.
    localStorage.removeItem("foodify_user")
    localStorage.removeItem("foodify_address")
    localStorage.removeItem("foodify_guest_addresses")
    window.location.href = "/" // Anasayfaya yönlendir ve yenile
  }

  // Giriş yapılmamışsa (Misafir Menüsü)
  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1.5 rounded-full transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-slate-200">
                <User className="h-4 w-4 text-slate-500" />
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Hoş Geldiniz</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={openLogin}>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Giriş Yap</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={openRegister}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Üye Ol</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Kullanıcının ad ve soyadının baş harflerini al
  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1.5 rounded-full transition-colors">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profilim</span>
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
