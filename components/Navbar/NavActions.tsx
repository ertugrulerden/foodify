import { Star, Bell, Languages } from "lucide-react";
import Link from "next/link";

const NavActions = () => {
  return (
    <div id="action-btns" className="flex items-center gap-1">
        <Link href="/profile?tab=favorites" id="favorites" className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 hover:text-primary">
          <Star className="w-5 h-5"/>
        </Link>

        <Link href="/profile?tab=notifications" id="notifications" className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 hover:text-primary relative">
          <Bell className="w-5 h-5"/>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </Link>

        <button id="language" className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 hover:text-primary">
          <Languages className="w-5 h-5"/>
        </button>
    </div>
  )
}

export default NavActions
