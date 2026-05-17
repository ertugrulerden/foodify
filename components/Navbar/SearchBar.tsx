import { Search } from "lucide-react"
import { Input } from "../ui/input"


const SearchBar = () => {
  return (
    <form action="/search" method="GET" className="relative flex w-full max-w-sm items-center">
      <Search className="absolute left-3 h-5 w-5 text-muted-foreground pointer-events-none" />
      <Input
        type="text" placeholder="Search menu or restaurant"
        name="q"
        className="pl-10 w-fulsl rounded-full bg-slate-100 border-transparent focus-visible:ring-1 focus-visible:bg-white"
      />
    </form>
  )
}

export default SearchBar
