"use client"

import { MapPin } from "lucide-react"
import { useState } from "react"
import { useAddress } from "@/components/AddressContext"
import AddressModal from "./AddressModal"

// Navbar'da secili adresi gosterir ve adres modalini acar.
const LocationSelector = () => {
  const { address } = useAddress()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* Tiklaninca adres modalini acar */}
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 text-sm bg-slate-100/80 hover:bg-slate-200 transition-all rounded-full px-4 py-2 border border-slate-200/50 shadow-sm cursor-pointer whitespace-nowrap"
      >
        <MapPin className="h-4 w-4 text-primary shrink-0" />
        {address ? (
          // Adres seciliyse mahalle ve ilce bilgisi gosterilir.
          <span className="truncate max-w-[200px]">
            {address.regionName} / {address.districtName}
          </span>
        ) : (
          // Adres yoksa placeholder gosterilir.
          <span className="text-muted-foreground">Adres Seçin</span>
        )}
      </button>

      {/* Adres secme modali */}
      <AddressModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}

export default LocationSelector
