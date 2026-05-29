"use client"

import { useState, useEffect } from "react"
import { useAddress } from "@/components/AddressContext"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { City, District, Region } from "@/lib/data/types"

// Props: modal açık/kapalı durumu ve kapatma fonksiyonu dışarıdan kontrol edilir
interface AddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddressModal({ open, onOpenChange }: AddressModalProps) {
  const { setAddress } = useAddress()

  // Dropdown verileri — API'den çekilecek
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [regions, setRegions] = useState<Region[]>([])

  // Kullanıcının seçtiği değerler
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")

  // Modal açıldığında şehirleri yükle
  useEffect(() => {
    if (open) {
      fetch("/api/address/cities")
        .then(r => r.json())
        .then(data => setCities(data))
    }
  }, [open])

  // Şehir seçilince → ilçeleri yükle, önceki seçimleri sıfırla
  useEffect(() => {
    if (!selectedCity) { setDistricts([]); return }
    setSelectedDistrict("")
    setSelectedRegion("")
    setRegions([])
    fetch(`/api/address/districts?cityID=${selectedCity}`)
      .then(r => r.json())
      .then(data => setDistricts(data))
  }, [selectedCity])

  // İlçe seçilince → mahalleleri yükle, önceki mahalle seçimini sıfırla
  useEffect(() => {
    if (!selectedDistrict) { setRegions([]); return }
    setSelectedRegion("")
    fetch(`/api/address/regions?districtID=${selectedDistrict}`)
      .then(r => r.json())
      .then(data => setRegions(data))
  }, [selectedDistrict])

  // 3 alan da seçilmeden kaydet butonu aktif olmaz
  const isValid = selectedCity && selectedDistrict && selectedRegion

  // Kaydet butonuna basılınca: Context'e ve localStorage'a yaz, modalı kapat
  const handleSave = () => {
    if (!isValid) return
    const city = cities.find(c => c.cityID === Number(selectedCity))
    const district = districts.find(d => d.districtID === Number(selectedDistrict))
    const region = regions.find(r => r.regionID === Number(selectedRegion))
    if (!city || !district || !region) return

    setAddress({
      cityID: city.cityID,
      cityName: city.city,
      districtID: district.districtID,
      districtName: district.district,
      regionID: region.regionID,
      regionName: region.region,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Teslimat Adresi Belirle</DialogTitle>
          <DialogDescription>
            Sana en yakın restoranları gösterebilmemiz için adresini seç.
          </DialogDescription>
        </DialogHeader>

        {/* Adres Bilgileri — 3 cascading dropdown */}
        <div className="space-y-4">
          <p className="text-sm font-medium">Adres Bilgileri</p>
          <div className="grid grid-cols-3 gap-3">

            {/* İl Seçimi */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">İl</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="İl seçin" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => (
                    <SelectItem key={c.cityID} value={String(c.cityID)}>
                      {c.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* İlçe Seçimi — şehir seçilmeden disabled */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">İlçe</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedCity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="İlçe seçin" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(d => (
                    <SelectItem key={d.districtID} value={String(d.districtID)}>
                      {d.district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mahalle Seçimi — ilçe seçilmeden disabled */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Mahalle</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion} disabled={!selectedDistrict}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mahalle seçin" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(r => (
                    <SelectItem key={r.regionID} value={String(r.regionID)}>
                      {r.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!isValid} className="w-full">
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
