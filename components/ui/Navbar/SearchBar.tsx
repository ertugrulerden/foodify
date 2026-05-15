import { Search } from "lucide-react"
import { Input } from "../input"


const SearchBar = () => {
  return (

    <div id="search" className="flex max-w-md items-center">
        <Search className="relative left-7 h-6 w-6 text-muted-foreground" />
        <Input
            type="text" placeholder="Search menu or restaurant"
            className="pl-10 rounded-full bg-slate-100 border-transparent focus-visible:ring-1 focus-visible:bg-white"
        />
    </div>

  )
}

export default SearchBar
