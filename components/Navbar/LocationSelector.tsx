"use client"

import { MapPin } from "lucide-react"
import { useState } from "react"
import { useAddress } from "@/components/AddressContext"
import AddressModal from "./AddressModal"

// LocationSelector: Navbar'da adres gösterimi + adres seçme modalını tetikler
// Adres seçiliyse → mahalle/ilçe bilgisini gösterir
// Adres seçili değilse → "Adres Seçin" placeholder gösterir
const LocationSelector = () => {
  const { address } = useAddress()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* Tıklanınca adres modalı açılır */}
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 text-sm hover:bg-accent rounded-md px-2 py-1.5 transition-colors cursor-pointer"
      >
        <MapPin className="h-4 w-4 text-primary shrink-0" />
        {address ? (
          // Adres seçiliyse: mahalle ve ilçe bilgisini göster
          <span className="truncate max-w-[200px]">
            {address.regionName} / {address.districtName}
          </span>
        ) : (
          // Adres seçili değilse: placeholder
          <span className="text-muted-foreground">Adres Seçin</span>
        )}
      </button>

      {/* Adres seçme modalı */}
      <AddressModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}

export default LocationSelector
