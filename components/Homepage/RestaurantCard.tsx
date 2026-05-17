"use client";

import { useState } from "react";
import { Heart, Clock, MapPin, ShoppingBag, Star, Bike } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PopularRestaurants } from "@/lib/data/homepage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PLATFORM_MAP: Record<string, { label: string; logo: string }> = {
  getir: { label: "Getir", logo: "/getir52.png" },
  yemeksepeti: { label: "Yemeksepeti", logo: "/yemeksepeti52.png" },
  ubereats: { label: "Uber Eats", logo: "/ubereats52.png" },
  migros: { label: "Migros", logo: "/migros52.png" },
};

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
}: PopularRestaurants & { href?: string }) => {
  const [favorited, setFavorited] = useState(isFavorited);

  const linkHref = href ?? (id ? `/restaurant/${id}` : null);

  const card = (
    <div
      className="group shrink-0 w-64 rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98] active:shadow-sm cursor-pointer"
      role="article"
    >
      <div className="relative h-36 w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <Button
          size="icon-xs"
          variant="ghost"
          aria-label={favorited ? "Favorilerden çıkar" : "Favorilere ekle"}
          onClick={(e) => {
            e.preventDefault();
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

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
          {deliveryTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              {deliveryTime} dk
            </span>
          )}
          {fee != null && (
            <span className="flex items-center gap-1">
              <Bike className="h-3 w-3 shrink-0" />
              {fee === 0 ? "Ücretsiz" : `${currency}${fee}`}
            </span>
          )}
          {minCart != null && (
            <span className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3 shrink-0" />
              Min. {currency}{minCart}
            </span>
          )}
        </div>

        <div className="h-px bg-border/60" />

        <div className="flex items-center gap-1.5">
          {platforms.map((p) => {
            const platform = PLATFORM_MAP[p];
            if (!platform) return null;
            return (
              <div
                key={p}
                title={platform.label}
                className="h-6 w-6 shrink-0 overflow-hidden rounded-md bg-white"
              >
                <Image
                  src={platform.logo}
                  alt={platform.label}
                  width={24}
                  height={24}
                  className="h-full w-full object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (linkHref) {
    return <Link href={linkHref} className="block">{card}</Link>;
  }

  return card;
};

export default RestaurantCard;