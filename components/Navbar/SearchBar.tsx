import { Search } from "lucide-react"
import { Input } from "../ui/input"


const SearchBar = () => {
  return (

    <div id="search" className="flex w-full max-w-sm items-center">
        <Search className="relative left-7 h-6 w-6 text-muted-foreground" />
        <Input
            type="text" placeholder="Search menu or restaurant"
            className="pl-10 w-full rounded-full bg-slate-100 border-transparent focus-visible:ring-1 focus-visible:bg-white"
        />
    </div>

  )
}

export default SearchBar
