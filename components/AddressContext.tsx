"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { repairTurkishText } from "@/lib/text/repair-turkish"

// Secili adres icin kullandigim ortak tip.
export interface AddressInfo {
  cityID: number
  cityName: string
  districtID: number
  districtName: string
  regionID: number
  regionName: string
}

// Uygulamanin adres bilgisini kullanmasi icin context degerleri.
interface AddressContextType {
  address: AddressInfo | null       // Secili adres yoksa null kalir.
  setAddress: (a: AddressInfo) => void  // Adresi state ve localStorage'a yazar.
  clearAddress: () => void          // Secili adresi temizler.
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

// Secili adres localStorage'da bu key ile tutulur.
const STORAGE_KEY = "foodify_address"

function repairAddressInfo(address: AddressInfo): AddressInfo {
  return {
    ...address,
    cityName: repairTurkishText(address.cityName),
    districtName: repairTurkishText(address.districtName),
    regionName: repairTurkishText(address.regionName),
  }
}

// Uygulama genelinde adres bilgisini saglayan provider.
export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<AddressInfo | null>(null)

  // Sayfa acilinca daha once secilmis adres varsa geri yuklenir.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const repaired = repairAddressInfo(JSON.parse(saved) as AddressInfo)
        setAddressState(repaired)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Adres secilince hem state hem localStorage guncellenir.
  const setAddress = (a: AddressInfo) => {
    const repaired = repairAddressInfo(a)
    setAddressState(repaired)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired))
  }

  // Adres silinince state ve localStorage temizlenir.
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

// Bilesenler adres bilgisine bu hook ile erisir.
export function useAddress() {
  const ctx = useContext(AddressContext)
  if (!ctx) throw new Error("useAddress must be used within AddressProvider")
  return ctx
}
