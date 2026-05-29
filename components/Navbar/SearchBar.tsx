"use client"

import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { useAddress } from "@/components/AddressContext"
import { useState } from "react"
import AddressModal from "./AddressModal"

// SearchBar: Arama çubuğu
// Adres seçili değilse → arama yaptırmaz, adres modalını açar
// Adres seçiliyse → regionID'yi gizli input olarak ekler ve aramayı çalıştırır
const SearchBar = () => {
  const { address } = useAddress()
  const [modalOpen, setModalOpen] = useState(false)

  // Form submit edildiğinde adres kontrolü yap
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!address) {
      // Adres seçilmemişse formu durdur ve modalı aç
      e.preventDefault()
      setModalOpen(true)
    }
    // Adres seçiliyse form normal çalışır (GET /search?q=...&regionID=...)
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
          className="pl-10 w-full rounded-full bg-slate-100 border-transparent focus-visible:ring-1 focus-visible:bg-white"
        />
        {/* Adres seçiliyse regionID'yi gizli input olarak forma ekle */}
        {address && (
          <input type="hidden" name="regionID" value={address.regionID} />
        )}
      </form>

      {/* Adres seçili değilken arama yapılırsa açılan modal */}
      <AddressModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}

export default SearchBar
