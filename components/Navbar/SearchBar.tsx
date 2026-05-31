"use client"

import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { useAddress } from "@/components/AddressContext"
import { useAuthModals } from "@/components/AuthModalContext"
import AddressModal from "./AddressModal"
import { useState } from "react"

// SearchBar: Arama çubuğu
// Adres seçili değilse Welcome Modal açılır (AuthModalContext üzerinden).
const SearchBar = () => {
  const { address } = useAddress()
  const { openWelcome } = useAuthModals()
  const [addressOpen, setAddressOpen] = useState(false)

  // Form submit edildiğinde adres kontrolü yap
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!address) {
      e.preventDefault()
      // Adres seçili değilse Hoş Geldin modalını aç
      openWelcome()
    }
  }

  return (
    <>
      <form
        action="/search"
        method="GET"
        onSubmit={handleSubmit}
        className="relative flex w-full max-w-sm items-center"
      >
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Menü veya restoran ara"
          name="q"
          className="pl-10 h-10 w-full rounded-full bg-slate-100/80 border-transparent hover:bg-slate-200/50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all shadow-inner"
        />
        {/* Adres seçiliyse regionID'yi gizli input olarak forma ekle */}
        {address && (
          <input type="hidden" name="regionID" value={address.regionID} />
        )}
      </form>

      {/* Adres Seçimi Modalı (Henüz SearchBar içinde kaldı, yakında ayrılacak) */}
      <AddressModal open={addressOpen} onOpenChange={setAddressOpen} />
    </>
  )
}

export default SearchBar

