"use client";

import { Star, Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthModals } from "@/components/AuthModalContext";

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

const NavActions = () => {
  const router = useRouter()
  const { openLogin } = useAuthModals()

  const handleFavoritesClick = () => {
    // Favoriler kullaniciya ait veri oldugu icin misafir kullaniciyi once giris/kayit akisine aliyoruz.
    if (!hasStoredUser()) {
      openLogin()
      return
    }

    router.push("/profile?tab=favorites")
  }

  return (
    <div id="action-btns" className="flex items-center gap-1">
        <button type="button" id="favorites" onClick={handleFavoritesClick} className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 hover:text-primary">
          <Star className="w-5 h-5"/>
        </button>

        <button id="language" className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 hover:text-primary">
          <Languages className="w-5 h-5"/>
        </button>
    </div>
  )
}

export default NavActions
