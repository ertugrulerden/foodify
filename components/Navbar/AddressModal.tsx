"use client"

import { useState, useEffect } from "react"
import { useAddress } from "@/components/AddressContext"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Plus, Home, Trash2 } from "lucide-react"
import type { City, District, Region, UserAddress } from "@/lib/data/types"

interface AddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddressModal({ open, onOpenChange }: AddressModalProps) {
  const { setAddress } = useAddress()

  // Ekran Durumu: 'list' (Kayıtlı Adresler) veya 'add' (Yeni Adres Ekleme Formu)
  const [view, setView] = useState<'list' | 'add'>('list')
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

  // Kullanıcı Durumu
  const [user, setUser] = useState<{ userID: number } | null>(null)

  // Yeni Adres Form Verileri
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [title, setTitle] = useState("")
  const [detail, setDetail] = useState("")

  // Modal her açıldığında adresleri getir
  useEffect(() => {
    if (open) {
      setView('list')
      fetchAddresses()
    }
  }, [open])

  // Adresleri DB'den (Giriş yaptıysa) veya LocalStorage'dan (Misafirse) çek
  const fetchAddresses = async () => {
    setLoading(true)
    const storedUser = localStorage.getItem("foodify_user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
        const res = await fetch(`/api/address/user-addresses?userID=${parsed.userID}`)
        if (res.ok) {
          const data = await res.json()
          setSavedAddresses(data)
        }
      } catch (e) {
        console.error("Adresler çekilemedi")
      }
    } else {
      setUser(null)
      // Misafir adresleri
      const guestAddresses = localStorage.getItem("foodify_guest_addresses")
      if (guestAddresses) {
        setSavedAddresses(JSON.parse(guestAddresses))
      } else {
        setSavedAddresses([])
      }
    }
    setLoading(false)
  }

  // Şehirleri API'den yükle (Yeni adres eklenecekse)
  useEffect(() => {
    if (view === 'add' && cities.length === 0) {
      fetch("/api/address/cities")
        .then(r => r.json())
        .then(data => setCities(data))
    }
  }, [view])

  useEffect(() => {
    if (!selectedCity) { setDistricts([]); return }
    setSelectedDistrict("")
    setSelectedRegion("")
    setRegions([])
    fetch(`/api/address/districts?cityID=${selectedCity}`)
      .then(r => r.json())
      .then(data => setDistricts(data))
  }, [selectedCity])

  useEffect(() => {
    if (!selectedDistrict) { setRegions([]); return }
    setSelectedRegion("")
    fetch(`/api/address/regions?districtID=${selectedDistrict}`)
      .then(r => r.json())
      .then(data => setRegions(data))
  }, [selectedDistrict])

  const isFormValid = selectedCity && selectedDistrict && selectedRegion && title.trim() !== ""

  // Yeni Adresi Kaydet (DB'ye veya LocalStorage'a)
  const handleSaveNewAddress = async () => {
    if (!isFormValid) return
    
    const city = cities.find(c => c.cityID === Number(selectedCity))
    const district = districts.find(d => d.districtID === Number(selectedDistrict))
    const region = regions.find(r => r.regionID === Number(selectedRegion))
    if (!city || !district || !region) return

    let newAddress: any = {
      addressID: Date.now(), // LocalStorage için geçici ID
      regionID: region.regionID,
      title,
      detail,
      // Extralar
      _regionName: region.region,
      _districtName: district.district,
      _cityName: city.city,
      cityID: city.cityID,
      districtID: district.districtID
    }

    if (user) {
      // Veritabanına kaydet
      try {
        const res = await fetch("/api/address/user-addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userID: user.userID,
            regionID: region.regionID,
            title,
            detail
          })
        })
        if (res.ok) {
          const created = await res.json()
          newAddress = { ...newAddress, addressID: created.addressID }
          setSavedAddresses(prev => [...prev, newAddress])
        }
      } catch (error) {
        console.error("Adres kaydedilemedi")
      }
    } else {
      // Misafir: LocalStorage'a kaydet
      const updated = [...savedAddresses, newAddress]
      localStorage.setItem("foodify_guest_addresses", JSON.stringify(updated))
      setSavedAddresses(updated)
    }

    // Eklenen adresi hemen seçili yap ve kapat
    handleSelectAddress(newAddress)
  }

  // Bir adres seçildiğinde context'i güncelle ve kapat
  const handleSelectAddress = (addr: any) => {
    setAddress({
      cityID: addr.cityID || 0, 
      cityName: addr._cityName || "Seçilen İl",
      districtID: addr.districtID || 0, 
      districtName: addr._districtName || "Seçilen İlçe",
      regionID: addr.regionID, 
      regionName: addr._regionName || addr.title,
    })
    onOpenChange(false)
  }

  const handleDeleteClick = (e: React.MouseEvent, addressID: number) => {
    e.stopPropagation() // Adres seçimini tetiklememesi için
    setAddressToDelete(addressID)
  }

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return
    
    if (user) {
      try {
        const res = await fetch(`/api/address/user-addresses?addressID=${addressToDelete}`, { method: 'DELETE' })
        if (res.ok) {
          setSavedAddresses(prev => prev.filter(a => a.addressID !== addressToDelete))
        }
      } catch (error) {
        console.error("Adres silinemedi")
      }
    } else {
      const updated = savedAddresses.filter((a: any) => a.addressID !== addressToDelete)
      localStorage.setItem("foodify_guest_addresses", JSON.stringify(updated))
      setSavedAddresses(updated)
    }
    setAddressToDelete(null)
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        
        {view === 'list' && (
          <>
            <DialogHeader>
              <DialogTitle>Teslimat Adresleri</DialogTitle>
              <DialogDescription>
                Sipariş vermek istediğiniz adresi seçin veya yeni ekleyin.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 max-h-[300px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center text-sm text-muted-foreground">Yükleniyor...</div>
              ) : savedAddresses.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-4 border rounded-lg border-dashed">
                  Henüz kayıtlı bir adresiniz yok.
                </div>
              ) : (
                savedAddresses.map((addr: any) => (
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
                          {addr._regionName ? `${addr._regionName}, ${addr._districtName}/${addr._cityName}` : 'Kayıtlı Bölge ID: ' + addr.regionID}
                        </p>
                        {addr.detail && <p className="text-xs text-muted-foreground mt-0.5">{addr.detail}</p>}
                      </div>
                    </div>
                    {/* Silme Butonu */}
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
              <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setView('add')}>
                <Plus className="w-4 h-4" /> Yeni Adres Ekle
              </Button>
            </DialogFooter>
          </>
        )}

        {view === 'add' && (
          <>
            <DialogHeader>
              <DialogTitle>Yeni Adres Ekle</DialogTitle>
              <DialogDescription>
                Sana en yakın restoranları gösterebilmemiz için adresini seç.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Adres Başlığı</Label>
                <Input placeholder="Ev, İş, Okul vb." value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">İl</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger><SelectValue placeholder="Seç" /></SelectTrigger>
                    <SelectContent>
                      {cities.map(c => (<SelectItem key={c.cityID} value={String(c.cityID)}>{c.city}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">İlçe</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedCity}>
                    <SelectTrigger><SelectValue placeholder="Seç" /></SelectTrigger>
                    <SelectContent>
                      {districts.map(d => (<SelectItem key={d.districtID} value={String(d.districtID)}>{d.district}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Mahalle</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion} disabled={!selectedDistrict}>
                    <SelectTrigger><SelectValue placeholder="Seç" /></SelectTrigger>
                    <SelectContent>
                      {regions.map(r => (<SelectItem key={r.regionID} value={String(r.regionID)}>{r.region}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Açık Adres (Opsiyonel)</Label>
                <Input placeholder="Sokak, Bina No, Daire No" value={detail} onChange={(e) => setDetail(e.target.value)} />
              </div>
            </div>

            <DialogFooter className="flex sm:justify-between">
              <Button type="button" variant="ghost" onClick={() => setView('list')}>
                İptal
              </Button>
              <Button onClick={handleSaveNewAddress} disabled={!isFormValid}>
                Kaydet ve Seç
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
    
    <AlertDialog open={!!addressToDelete} onOpenChange={(isOpen) => !isOpen && setAddressToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Adresi Sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu teslimat adresini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDeleteAddress} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}


