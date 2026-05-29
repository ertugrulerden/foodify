"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Kullanıcının seçtiği adres bilgisini temsil eden tip
export interface AddressInfo {
  cityID: number
  cityName: string
  districtID: number
  districtName: string
  regionID: number
  regionName: string
}

// Context'te dışarıya sunulan değerler
interface AddressContextType {
  address: AddressInfo | null       // Seçili adres (yoksa null)
  setAddress: (a: AddressInfo) => void  // Adres kaydet (state + localStorage)
  clearAddress: () => void          // Adresi sil
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

// localStorage anahtarı
const STORAGE_KEY = "foodify_address"

// Tüm uygulamayı saran provider bileşeni
export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<AddressInfo | null>(null)

  // Sayfa ilk yüklendiğinde localStorage'dan adresi oku
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setAddressState(JSON.parse(saved))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Adres kaydet: hem state'i hem localStorage'ı güncelle
  const setAddress = (a: AddressInfo) => {
    setAddressState(a)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a))
  }

  // Adresi temizle
  const clearAddress = () => {
    setAddressState(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AddressContext.Provider value={{ address, setAddress, clearAddress }}>
      {children}
    </AddressContext.Provider>
  )
}

// Context'i kullanan hook — diğer bileşenlerden useAddress() ile erişilir
export function useAddress() {
  const ctx = useContext(AddressContext)
  if (!ctx) throw new Error("useAddress must be used within AddressProvider")
  return ctx
}
