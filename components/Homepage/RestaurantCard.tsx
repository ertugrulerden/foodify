"use client";

import { useState } from "react";
import { Heart, Clock, MapPin, ShoppingBag, Star, Bike } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PopularRestaurants } from "@/lib/data/homepage";
import { getProductImageOrDefault } from "@/lib/data/images";
import { useAuthModals } from "@/components/AuthModalContext";
import { Button } from "@/components/ui/button";

const PLATFORM_MAP: Record<string, { label: string; logo: string }> = {
  getir: { label: "Getir", logo: "/getir52.png" },
  yemeksepeti: { label: "Yemeksepeti", logo: "/yemeksepeti52.png" },
  ubereats: { label: "Uber Eats", logo: "/ubereats52.png" },
  migros: { label: "Migros", logo: "/migros52.png" },
};

function hasStoredUser() {
  try {
    const storedUser = localStorage.getItem("foodify_user")
    if (!storedUser) return false
    const parsed = JSON.parse(storedUser) as { userID?: unknown }
    return typeof parsed.userID === "number"
  } catch {
    localStorage.removeItem("foodify_user")
    return false
  }
}

const RestaurantCard = ({
  id,
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
  platformLinks,
}: PopularRestaurants & { href?: string }) => {
  const router = useRouter()
  const { openLogin } = useAuthModals()
  const [favorited, setFavorited] = useState(isFavorited);
  const displayImage = getProductImageOrDefault(image)
  const displayPlatforms = Array.from(new Set(platforms))
  const formattedDeliveryTime = deliveryTime
    ? /(?:min|dk)/i.test(deliveryTime) ? deliveryTime : `${deliveryTime} dk`
    : null
  const formattedMinCart = minCart != null ? Math.round(minCart) : null

  const linkHref = href ?? (id ? `/restaurant/${id}` : null);
  const openPlatformLink = (e: React.MouseEvent, link?: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (link) window.open(link, "_blank", "noopener,noreferrer")
  }

  const card = (
    <div
      className="group shrink-0 w-64 rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98] active:shadow-sm cursor-pointer"
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!hasStoredUser()) {
              openLogin()
              return
            }
            setFavorited(!favorited);
          }}
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
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          {location && (
            <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Teslim suresi, ucret ve min sepet varsa tek satirda kalir; eksik veri hic basilmaz. */}
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

        <div className="flex items-center gap-1.5">
          {displayPlatforms.map((p) => {
            const platform = PLATFORM_MAP[p];
            if (!platform) return null;
            const platformLink = platformLinks?.[p]
            return (
              <button
                key={p}
                type="button"
                title={platformLink ? `${platform.label} sayfasina git` : platform.label}
                onClick={(e) => openPlatformLink(e, platformLink)}
                className={cn(
                  "h-6 w-6 shrink-0 overflow-hidden rounded-md bg-white",
                  platformLink ? "cursor-pointer hover:ring-2 hover:ring-primary/20" : "cursor-default"
                )}
                disabled={!platformLink}
              >
                <Image
                  src={platform.logo}
                  alt={platform.label}
                  width={24}
                  height={24}
                  className="h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return card;
};

export default RestaurantCard;
