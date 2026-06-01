"use client";

import { useState, useEffect } from "react";
import { Heart, Clock, MapPin, ShoppingBag, Star, Bike } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PopularRestaurants } from "@/lib/data/homepage";
import { getProductImageOrDefault } from "@/lib/data/images";
import { useAuthModals } from "@/components/AuthModalContext";
import { Button } from "@/components/ui/button";
import type { SearchResult } from "@/lib/data/types";

type StoredUser = { userID: number }

const PLATFORM_MAP: Record<string, { label: string; logo: string }> = {
	getir: { label: "Getir", logo: "/getir52.png" },
	yemeksepeti: { label: "Yemeksepeti", logo: "/yemeksepeti52.png" },
	ubereats: { label: "Uber Eats", logo: "/ubereats52.png" },
	migros: { label: "Migros", logo: "/migros52.png" },
};

function getStoredUser(): StoredUser | null {
  try {
    const storedUser = localStorage.getItem("foodify_user")
    if (!storedUser) return null
    const parsed = JSON.parse(storedUser) as Partial<StoredUser>
    return typeof parsed.userID === "number" ? { userID: parsed.userID } : null
  } catch {
    localStorage.removeItem("foodify_user")
    return null
  }
}

const MenuCard = ({
  id,
  productID,
  name,
  image,
  rating,
  location,
  fee,
  deliveryTime,
  minCart,
  platforms,
  currency = "₺",
  isFavorited = false,
  href,
  productName,
  platformPrices,
  platformLinks,
}: PopularRestaurants & { href?: string; productName?: string; platformPrices?: Record<string, number>; platformLinks?: Record<string, string>; productID?: number }) => {
  const router = useRouter()
  const { openLogin } = useAuthModals()
  const [favorited, setFavorited] = useState(isFavorited);
  const displayImage = getProductImageOrDefault(image)
  const displayPlatforms = Array.from(new Set(platforms))
  const formattedDeliveryTime = deliveryTime
    ? /(?:min|dk)/i.test(deliveryTime) ? deliveryTime : `${deliveryTime} dk`
    : null
  const formattedMinCart = minCart != null ? Math.round(minCart) : null

  useEffect(() => {
    const user = getStoredUser()
    if (user && productID) {
      // Kart yuklenince bu urunun favorilerde olup olmadigi kontrol edilir.
      fetch(`/api/favorites?userID=${user.userID}`)
        .then(res => res.json())
        .then((favs: SearchResult[]) => {
          if (Array.isArray(favs) && favs.some((f) => f.productID === productID)) {
            setFavorited(true)
          }
        })
        .catch(() => {})
    }
  }, [productID])

  const linkHref = href ?? (id ? `/restaurant/${id}` : null);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const user = getStoredUser()
    if (!user) {
      openLogin()
      return
    }
    if (!productID) return

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.userID, productID })
      })
      if (res.ok) {
        const data = await res.json()
        setFavorited(data.added)
      }
    } catch {
      console.error("Favori işlemi başarısız")
    }
  }

  const openPlatformLink = (e: React.MouseEvent, link?: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (link) window.open(link, "_blank", "noopener,noreferrer")
  }

  const card = (
    <div
      className="group shrink-0 w-64 h-full rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden transition-all 
      duration-200 hover:shadow-md active:scale-[0.98] active:shadow-sm cursor-pointer"
      role="article"
      onClick={() => {
        if (linkHref) router.push(linkHref)
      }}
    >
      <div className="relative h-36 w-full overflow-hidden bg-muted">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="256px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          size="icon-xs"
          variant="ghost"
          aria-label={favorited ? "Favorilerden çıkar" : "Favorilere ekle"}
          onClick={handleFavoriteClick}
          className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              favorited ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </Button>

        {rating != null && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
            <Star className="h-2.5 w-2.5 fill-white text-white" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex flex-col gap-0.5">
          {productName && (
            <p className="truncate text-s font-semibold text-foreground">{productName}</p>
          )}
          <p className="truncate text-xs text-muted-foreground">{name}</p>
          
          {location && (
            <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Bu bilgiler varsa tek satirda gosteriliyor, yoksa kartta yer kaplamiyor. */}
        <div className="flex items-center gap-2 overflow-hidden text-[11px] text-muted-foreground">
          {deliveryTime && (
            <span className="flex min-w-0 flex-1 items-center gap-1 truncate whitespace-nowrap">
              <Clock className="h-3 w-3 shrink-0" />
              {formattedDeliveryTime}
            </span>
          )}
          {fee != null && (
            <span className="flex min-w-0 flex-1 items-center gap-1 truncate whitespace-nowrap">
              <Bike className="h-3 w-3 shrink-0" />
              {fee === 0 ? "Ücretsiz" : `${currency}${fee}`}
            </span>
          )}
          {formattedMinCart != null && (
            <span className="flex min-w-0 flex-1 items-center gap-1 truncate whitespace-nowrap">
              <ShoppingBag className="h-3 w-3 shrink-0" />
              Min. {currency}{formattedMinCart}
            </span>
          )}
        </div>

        <div className="h-px bg-border/60" />

        <div className="space-y-2">
          {displayPlatforms.map((p) => {
            const platform = PLATFORM_MAP[p];
            if (!platform) return null;
            const price = platformPrices?.[p] ?? null
            const isBest = price !== null && price === Math.min(...Object.values(platformPrices ?? {}))
            const platformLink = platformLinks?.[p]
            const rowClassName = "flex w-full items-center justify-between text-left"
            const rowContent = (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 shrink-0 overflow-hidden rounded bg-white">
                    <Image
                      src={platform.logo}
                      alt={platform.label}
                      width={20}
                      height={20}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-xs">{platform.label}</span>
                </div>
                {price !== null && (
                  <span className={`text-xs font-medium ${isBest ? "text-green-600" : "text-muted-foreground"}`}>
                    <b>{price}TL</b>
                  </span>
                )}
              </>
            )
            return (
              platformLink ? (
                <button key={p} type="button" onClick={(e) => openPlatformLink(e, platformLink)} className={`${rowClassName} cursor-pointer hover:text-primary`}>
                  {rowContent}
                </button>
              ) : (
                <div key={p} className={`${rowClassName} cursor-default`}>
                  {rowContent}
                </div>
              )
            )
          })}
        </div>
      </div>
    </div>
  );

  return card;
};

export default MenuCard;
