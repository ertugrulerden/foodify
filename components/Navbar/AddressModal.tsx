"use client"

import { useCallback, useEffect, useState } from "react"
import { useAddress } from "@/components/AddressContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Home, Trash2 } from "lucide-react"
import type { City, District, Region, UserAddress, UserAddressWithLocation } from "@/lib/data/types"
import { repairTurkishText } from "@/lib/text/repair-turkish"

interface AddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SavedAddress = UserAddress & Partial<Omit<UserAddressWithLocation, keyof UserAddress>>
type StoredUser = { userID: number }

function repairSavedAddress(address: SavedAddress): SavedAddress {
  return {
    ...address,
    _cityName: address._cityName ? repairTurkishText(address._cityName) : address._cityName,
    _districtName: address._districtName ? repairTurkishText(address._districtName) : address._districtName,
    _regionName: address._regionName ? repairTurkishText(address._regionName) : address._regionName,
  }
}

function repairCity(city: City): City {
  return { ...city, city: repairTurkishText(city.city) }
}

function repairDistrict(district: District): District {
  return { ...district, district: repairTurkishText(district.district) }
}

function repairRegion(region: Region): Region {
  return { ...region, region: repairTurkishText(region.region) }
}

export default function AddressModal({ open, onOpenChange }: AddressModalProps) {
  const { address, setAddress, clearAddress } = useAddress()

  const [view, setView] = useState<"list" | "add">("list")
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [loading, setLoading] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)
  const [user, setUser] = useState<StoredUser | null>(null)

  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [title, setTitle] = useState("")
  const [detail, setDetail] = useState("")

  // Giris yapmis kullanicida adresler DB'den, misafirde localStorage'dan okunur.
  const fetchAddresses = useCallback(async () => {
    setLoading(true)
    const storedUser = localStorage.getItem("foodify_user")

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as StoredUser
        setUser(parsed)
        const res = await fetch(`/api/address/user-addresses?userID=${parsed.userID}`)
        if (res.ok) {
          const data = await res.json() as UserAddressWithLocation[]
          setSavedAddresses(data.map(repairSavedAddress))
          if (data.length === 0) setView("add")
        }
      } catch {
        console.error("Adresler getirilemedi")
      } finally {
        setLoading(false)
      }
      return
    }

    setUser(null)
    const guestAddresses = localStorage.getItem("foodify_guest_addresses")
    const parsedGuestAddresses = guestAddresses ? (JSON.parse(guestAddresses) as SavedAddress[]).map(repairSavedAddress) : []
    localStorage.setItem("foodify_guest_addresses", JSON.stringify(parsedGuestAddresses))
    setSavedAddresses(parsedGuestAddresses)
    if (parsedGuestAddresses.length === 0) setView("add")
    setLoading(false)
  }, [])

  useEffect(() => {
    if (open) {
      setView("list")
      fetchAddresses()
    }
  }, [open, fetchAddresses])

  useEffect(() => {
    if (view === "add" && cities.length === 0) {
      fetch("/api/address/cities")
        .then((r) => r.json())
        .then((data: City[]) => setCities(data.map(repairCity)))
    }
  }, [view, cities.length])

  useEffect(() => {
    if (!selectedCity) {
      setDistricts([])
      return
    }
    setSelectedDistrict("")
    setSelectedRegion("")
    setRegions([])
    fetch(`/api/address/districts?cityID=${selectedCity}`)
      .then((r) => r.json())
      .then((data: District[]) => setDistricts(data.map(repairDistrict)))
  }, [selectedCity])

  useEffect(() => {
    if (!selectedDistrict) {
      setRegions([])
      return
    }
    setSelectedRegion("")
    fetch(`/api/address/regions?districtID=${selectedDistrict}`)
      .then((r) => r.json())
      .then((data: Region[]) => setRegions(data.map(repairRegion)))
  }, [selectedDistrict])

  const isFormValid = selectedCity && selectedDistrict && selectedRegion && title.trim() !== ""

  const handleSelectAddress = (addr: SavedAddress) => {
    // Secilen adres global context'e yazilir; arama sayfasi regionID ile filtreleme yapabilir.
    setAddress({
      cityID: addr.cityID || 0,
      cityName: addr._cityName || "Secilen Il",
      districtID: addr.districtID || 0,
      districtName: addr._districtName || "Secilen Ilce",
      regionID: addr.regionID,
      regionName: addr._regionName || addr.title,
    })
    onOpenChange(false)
  }

  const handleSaveNewAddress = async () => {
    if (!isFormValid) return

    const city = cities.find((c) => c.cityID === Number(selectedCity))
    const district = districts.find((d) => d.districtID === Number(selectedDistrict))
    const region = regions.find((r) => r.regionID === Number(selectedRegion))
    if (!city || !district || !region) return

    let newAddress: SavedAddress = {
      addressID: Date.now(),
      userID: user?.userID ?? 0,
      regionID: region.regionID,
      title,
      detail,
      _regionName: region.region,
      _districtName: district.district,
      _cityName: city.city,
      cityID: city.cityID,
      districtID: district.districtID,
    }

    if (user) {
      try {
        const res = await fetch("/api/address/user-addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: user.userID, regionID: region.regionID, title, detail }),
        })
        if (res.ok) {
          const created = await res.json() as UserAddress
          newAddress = { ...newAddress, addressID: created.addressID, userID: created.userID }
          setSavedAddresses((prev) => [...prev, newAddress])
        }
      } catch {
        console.error("Adres kaydedilemedi")
      }
    } else {
      const updated = [...savedAddresses, newAddress]
      localStorage.setItem("foodify_guest_addresses", JSON.stringify(updated))
      setSavedAddresses(updated)
    }

    handleSelectAddress(newAddress)
  }

  const handleDeleteClick = (e: React.MouseEvent, addressID: number) => {
    e.stopPropagation()
    setAddressToDelete(addressID)
  }

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return
    const deletedAddress = savedAddresses.find((a) => a.addressID === addressToDelete)

    if (user) {
      try {
        const res = await fetch(`/api/address/user-addresses?addressID=${addressToDelete}`, { method: "DELETE" })
        if (res.ok) {
          setSavedAddresses((prev) => prev.filter((a) => a.addressID !== addressToDelete))
        }
      } catch {
        console.error("Adres silinemedi")
      }
    } else {
      const updated = savedAddresses.filter((a) => a.addressID !== addressToDelete)
      localStorage.setItem("foodify_guest_addresses", JSON.stringify(updated))
      setSavedAddresses(updated)
    }

    if (deletedAddress && address?.regionID === deletedAddress.regionID) {
      // Secili adres silinirse foodify_address temizlenir; anasayfa tekrar genel populer listeye duser.
      clearAddress()
    }
    setAddressToDelete(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          {view === "list" && (
            <>
              <DialogHeader>
                <DialogTitle>Teslimat Adresleri</DialogTitle>
                <DialogDescription>Siparis vermek istediginiz adresi secin veya yeni ekleyin.</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4 max-h-[300px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="text-center text-sm text-muted-foreground">Yukleniyor...</div>
                ) : savedAddresses.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4 border rounded-lg border-dashed">
                    Henuz kayitli bir adresiniz yok.
                  </div>
                ) : (
                  savedAddresses.map((addr) => (
                    <div
                      key={addr.addressID}
                      onClick={() => handleSelectAddress(addr)}
                      className="flex items-start justify-between p-3 border rounded-lg hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-100 p-2 rounded-full text-slate-500 shrink-0">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{addr.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {addr._regionName ? `${addr._regionName}, ${addr._districtName}/${addr._cityName}` : `Kayitli Bolge ID: ${addr.regionID}`}
                          </p>
                          {addr.detail && <p className="text-xs text-muted-foreground mt-0.5">{addr.detail}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={(e) => handleDeleteClick(e, addr.addressID)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <DialogFooter className="sm:justify-start">
                <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setView("add")}>
                  <Plus className="w-4 h-4" /> Yeni Adres Ekle
                </Button>
              </DialogFooter>
            </>
          )}

          {view === "add" && (
            <>
              <DialogHeader>
                <DialogTitle>Yeni Adres Ekle</DialogTitle>
                <DialogDescription>Sana en yakin restoranlari gosterebilmemiz icin adresini sec.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Adres Basligi</Label>
                  <Input placeholder="Ev, Is, Okul vb." value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Il</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger><SelectValue placeholder="Sec" /></SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => <SelectItem key={c.cityID} value={String(c.cityID)}>{c.city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Ilce</Label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedCity}>
                      <SelectTrigger><SelectValue placeholder="Sec" /></SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => <SelectItem key={d.districtID} value={String(d.districtID)}>{d.district}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Mahalle</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion} disabled={!selectedDistrict}>
                      <SelectTrigger><SelectValue placeholder="Sec" /></SelectTrigger>
                      <SelectContent>
                        {regions.map((r) => <SelectItem key={r.regionID} value={String(r.regionID)}>{r.region}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Acik Adres (Opsiyonel)</Label>
                  <Input placeholder="Sokak, Bina No, Daire No" value={detail} onChange={(e) => setDetail(e.target.value)} />
                </div>
              </div>

              <DialogFooter className="flex sm:justify-between">
                <Button type="button" variant="ghost" onClick={() => setView("list")}>Iptal</Button>
                <Button onClick={handleSaveNewAddress} disabled={!isFormValid}>Kaydet ve Sec</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!addressToDelete} onOpenChange={(isOpen) => !isOpen && setAddressToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adresi Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu teslimat adresini silmek istediginize emin misiniz? Bu islem geri alinamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Iptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAddress} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
