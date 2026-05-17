import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      <h1 className="display-lg max-w-3xl text-balance">
        En sevdiğin yemekleri bul, fiyatları karşılaştır
      </h1>
      <p className="body-md mt-4 max-w-xl text-muted-foreground text-balance">
        Restoranları, menüleri ve platform fiyatlarını keşfet. En uygun fiyatı bul, siparişini ver.
      </p>

      <form
        action="/search"
        method="GET"
        className="relative mt-10 w-full max-w-xl"
      >
        <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          name="q"
          placeholder="Restoran veya ürün ara..."
          className="h-14 w-full rounded-full border-border/60 bg-card pl-14 pr-6 text-base shadow-sm focus-visible:shadow-md"
        />
      </form>
    </section>
  )
}

export default HeroSection
