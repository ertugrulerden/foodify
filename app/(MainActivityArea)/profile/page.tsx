"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Heart, Settings, LogOut, Home, Trash2, Plus } from "lucide-react"
import type { SearchResult, UserAddress } from "@/lib/data/types"
import AddressModal from "@/components/Navbar/AddressModal"
import MenuCard from "@/components/Homepage/MenuCard"
import { useAddress } from "@/components/AddressContext"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { address, clearAddress } = useAddress()
  const tabParam = searchParams.get("tab")

  const [user, setUser] = useState<{ userID: number; firstName: string; lastName: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  
  const [message, setMessage] = useState({ text: "", type: "" })
  const [saving, setSaving] = useState(false)

  const [activeTab, setActiveTab] = useState("settings")
  
  // URL'deki tab parametresine gore aktif sekmeyi ayarliyorum.
  useEffect(() => {
    if (tabParam && ["settings", "addresses", "favorites"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])
  
  // Adres icin kullandigim state'ler
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

  // Favoriler icin kullandigim state'ler
  const [favorites, setFavorites] = useState<SearchResult[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("foodify_user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
        setFirstName(parsed.firstName)
        setLastName(parsed.lastName)
        setEmail(parsed.email)
      } catch {
        console.error("Kullanıcı bilgisi okunamadı")
      }
    } else {
      router.push("/")
    }
    setLoading(false)
  }, [router])

  // Adres sekmesine gecilince veya modal kapaninca adresleri yeniliyorum.
  useEffect(() => {
    if (activeTab === "addresses" && user?.userID && !addressModalOpen) {
      setLoadingAddresses(true)
      fetch(`/api/address/user-addresses?userID=${user.userID}`)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        })
        .then(data => setAddresses(data))
        .catch(() => {})
        .finally(() => setLoadingAddresses(false))
    }
  }, [activeTab, user?.userID, addressModalOpen])

  // Favoriler sekmesine gecilince favoriler yuklenir.
  useEffect(() => {
    if (activeTab === "favorites" && user?.userID) {
      setLoadingFavorites(true)
      fetch(`/api/favorites?userID=${user.userID}`)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        })
        .then(data => setFavorites(data))
        .catch(() => {})
        .finally(() => setLoadingFavorites(false))
    }
  }, [activeTab, user?.userID])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: "", type: "" })
    
    if (!user?.userID || !currentPassword) {
      setMessage({ text: "Güncelleme için mevcut şifrenizi girmelisiniz.", type: "error" })
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.userID,
          firstName,
          lastName,
          email,
          currentPassword,
          newPassword
        }),
      })
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setMessage({ text: data.error || "Güncelleme başarısız", type: "error" })
        return
      }
      const data = await res.json()

      localStorage.setItem("foodify_user", JSON.stringify(data))
      setUser(data)
      setCurrentPassword("")
      setNewPassword("")
      setMessage({ text: "Profilin başarıyla güncellendi!", type: "success" })
      
      setTimeout(() => setMessage({ text: "", type: "" }), 3000)
    } catch {
      setMessage({ text: "Sunucu bağlantı hatası.", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = (addressID: number) => {
    setAddressToDelete(addressID)
  }

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return
    const deletedAddress = addresses.find((a) => a.addressID === addressToDelete)
    try {
      const res = await fetch(`/api/address/user-addresses?addressID=${addressToDelete}`, { method: 'DELETE' })
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.addressID !== addressToDelete))
        if (deletedAddress && address?.regionID === deletedAddress.regionID) {
          // Secili adres profil tarafindan silinirse aktif adres de temizlenir.
          clearAddress()
        }
      }
    } catch {
      console.error("Adres silinemedi")
    } finally {
      setAddressToDelete(null)
    }
  }

  const handleLogout = () => {
    // Profilde cikis yapinca navbar ile ayni temizlik yapiliyor.
    localStorage.removeItem("foodify_user")
    localStorage.removeItem("foodify_address")
    localStorage.removeItem("foodify_guest_addresses")
    window.location.href = "/"
  }

  const tabs = [
    { id: "settings", label: "Ayarlar ve Profil", icon: Settings },
    { id: "addresses", label: "Kayıtlı Adreslerim", icon: MapPin },
    { id: "favorites", label: "Favorilerim", icon: Heart },
  ]

  if (loading || !user) {
    return <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">Yükleniyor...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Profilim</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 shrink-0 space-y-2">
          <div className="bg-slate-50 p-4 rounded-xl border mb-6 flex items-center gap-4">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
              {user.firstName?.charAt(0).toUpperCase() || ""}{user.lastName?.charAt(0).toUpperCase() || ""}
            </div>
            <div className="truncate">
              <p className="font-semibold truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </nav>
        </div>

        <div className="w-full md:w-3/4">
          {activeTab === "settings" && (
            <Card className="border-0 shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50 pb-6">
                <CardTitle className="text-xl">Profil ve Ayarlar</CardTitle>
                <CardDescription>
                  Kişisel bilgilerinizi ve şifrenizi buradan güncelleyebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                  {message.text && (
                    <div className={`p-3 text-sm rounded-md ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-700'}`}>
                      {message.text}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Adresi</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <hr className="my-6 border-slate-200" />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Güvenlik Doğrulaması</h3>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mevcut Şifre (Zorunlu)</Label>
                      <Input id="currentPassword" type="password" placeholder="Değişiklik yapmak için şifrenizi girin" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Yeni Şifre (Opsiyonel)</Label>
                      <Input id="newPassword" type="password" placeholder="Şifrenizi değiştirmek istemiyorsanız boş bırakın" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />
                    </div>
                  </div>

                  <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                    {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "addresses" && (
            <Card className="border-0 shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50 pb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Kayıtlı Adreslerim</CardTitle>
                  <CardDescription>Siparişleriniz için kaydettiğiniz adresler.</CardDescription>
                </div>
                <Button onClick={() => setAddressModalOpen(true)} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Yeni Adres Ekle
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingAddresses ? (
                  <p className="text-muted-foreground text-sm">Yükleniyor...</p>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                    Henüz adres kaydetmediniz. Ana sayfadan veya arama çubuğu üzerinden adres ekleyebilirsiniz.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.addressID} className="p-4 border rounded-xl relative group hover:border-primary transition-colors">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(addr.addressID)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 mb-2">
                          <Home className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold">{addr.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">Bölge ID: {addr.regionID}</p>
                        {addr.detail && <p className="text-sm text-slate-500">{addr.detail}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "favorites" && (
            <Card className="border-0 shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50 pb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Favorilerim</CardTitle>
                  <CardDescription>Beğendiğiniz ürünler ve restoranlar.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingFavorites ? (
                  <p className="text-muted-foreground text-sm">Yükleniyor...</p>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                    Henüz favorilere eklediğiniz bir ürün yok. Arama sonuçlarındaki kalp simgesine tıklayarak ürünleri buraya ekleyebilirsiniz.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 justify-start">
                    {favorites.map((fav, index) => (
                      <div key={index} className="flex-[1_1_220px] max-w-[250px]">
                        <MenuCard
                          id={String(fav.restaurantID)}
                          productID={fav.productID}
                          name={fav.restaurantName}
                          location={fav.address ?? ""}
                          image={fav.image ?? "/placeholder.svg"}
                          rating={fav.rating ?? undefined}
                          fee={fav.fee ?? undefined}
                          deliveryTime={fav.deliveryTime ?? undefined}
                          minCart={fav.minCart ?? undefined}
                          platforms={[fav.platform.toLowerCase()]}
                          productName={fav.productName}
                          platformPrices={{ [fav.platform.toLowerCase()]: fav.price }}
                          platformLinks={fav.sourceLink ? { [fav.platform.toLowerCase()]: fav.sourceLink } : {}}
                          isFavorited={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
      
      {/* Yeni adres ekleme modali */}
      <AddressModal open={addressModalOpen} onOpenChange={setAddressModalOpen} />

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
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">Yükleniyor...</div>}>
      <ProfileContent />
    </Suspense>
  )
}
