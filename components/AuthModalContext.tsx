"use client"

import React, { createContext, useContext, useState } from "react"
import LoginModal from "./Navbar/LoginModal"
import RegisterModal from "./Navbar/RegisterModal"
import WelcomeModal from "./Navbar/WelcomeModal"

type AuthModalContextType = {
  openWelcome: () => void
  openLogin: () => void
  openRegister: () => void
  closeAll: () => void
  onAuthSuccess: (user: any) => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const openWelcome = () => setWelcomeOpen(true)
  const openLogin = () => {
    setWelcomeOpen(false)
    setRegisterOpen(false)
    setLoginOpen(true)
  }
  const openRegister = () => {
    setWelcomeOpen(false)
    setLoginOpen(false)
    setRegisterOpen(true)
  }
  const closeAll = () => {
    setWelcomeOpen(false)
    setLoginOpen(false)
    setRegisterOpen(false)
  }

  // Giriş başarılı olunca çalışan ortak fonksiyon
  const onAuthSuccess = (user: { userID: number; firstName: string; lastName: string; email: string }) => {
    localStorage.setItem("foodify_user", JSON.stringify(user))
    closeAll()
    // Sayfayı yenile ki UserMenu gibi bileşenler localStorage'daki yeni değeri alsın
    window.dispatchEvent(new Event("storage"))
    window.location.reload()
  }

  return (
    <AuthModalContext.Provider value={{ openWelcome, openLogin, openRegister, closeAll, onAuthSuccess }}>
      {children}
      
      {/* 1. Hoş Geldin Modalı */}
      <WelcomeModal
        open={welcomeOpen}
        onOpenChange={setWelcomeOpen}
        onLoginClick={openLogin}
        onContinueAsGuest={closeAll} // Sadece modalları kapatır, asıl adres açma işi tetiklenen yerden yapılabilir
      />

      {/* 2. Giriş Modalı */}
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={openRegister}
        onLoginSuccess={onAuthSuccess}
      />

      {/* 3. Kayıt Modalı */}
      <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={openLogin}
        onRegisterSuccess={onAuthSuccess}
      />
    </AuthModalContext.Provider>
  )
}

export function useAuthModals() {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error("useAuthModals must be used within an AuthModalProvider")
  }
  return context
}
