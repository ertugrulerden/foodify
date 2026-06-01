"use client"

import React, { createContext, useContext, useState } from "react"
import LoginModal from "./Navbar/LoginModal"
import RegisterModal from "./Navbar/RegisterModal"
import WelcomeModal from "./Navbar/WelcomeModal"
import AddressModal from "./Navbar/AddressModal"

type AuthUser = { userID: number; firstName: string; lastName: string; email: string }

type AuthModalContextType = {
  openWelcome: () => void
  openLogin: () => void
  openRegister: () => void
  openAddress: () => void
  closeAll: () => void
  onAuthSuccess: (user: AuthUser) => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)

  const openWelcome = () => setWelcomeOpen(true)
  const openLogin = () => {
    setWelcomeOpen(false)
    setRegisterOpen(false)
    setAddressOpen(false)
    setLoginOpen(true)
  }
  const openRegister = () => {
    setWelcomeOpen(false)
    setLoginOpen(false)
    setAddressOpen(false)
    setRegisterOpen(true)
  }
  const openAddress = () => {
    setWelcomeOpen(false)
    setLoginOpen(false)
    setRegisterOpen(false)
    setAddressOpen(true)
  }
  const closeAll = () => {
    setWelcomeOpen(false)
    setLoginOpen(false)
    setRegisterOpen(false)
    setAddressOpen(false)
  }

  const onAuthSuccess = (user: AuthUser) => {
    localStorage.setItem("foodify_user", JSON.stringify(user))
    // Giris/kayit sonrasi misafir adresi temizlenir, kullanici kendi DB adreslerini gorur.
    localStorage.removeItem("foodify_address")
    localStorage.removeItem("foodify_guest_addresses")
    setWelcomeOpen(false)
    setLoginOpen(false)
    setRegisterOpen(false)
    window.dispatchEvent(new Event("storage"))
    // Giris/kayit sonrasi adres zorunlu oldugu icin adres modalini aciyorum.
    setAddressOpen(true)
  }

  return (
    <AuthModalContext.Provider value={{ openWelcome, openLogin, openRegister, openAddress, closeAll, onAuthSuccess }}>
      {children}

      <WelcomeModal
        open={welcomeOpen}
        onOpenChange={setWelcomeOpen}
        onLoginClick={openLogin}
        onContinueAsGuest={openAddress}
      />

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={openRegister}
        onLoginSuccess={onAuthSuccess}
      />

      <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={openLogin}
        onRegisterSuccess={onAuthSuccess}
      />

      <AddressModal open={addressOpen} onOpenChange={setAddressOpen} />
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
