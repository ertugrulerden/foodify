"use client"
import { useSearchParams,useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { SearchResult , Platform} from "@/lib/data/types"
export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [results, setResults] = useState<SearchResult[]>([])
  const [platforms , setPlatforms] = useState<Platform[]>([])
  const [selectedPlatforms , setSelectedPlatforms] = useState<string[]>([])
  const [minPrice , setMinPrice] = useState("")
  const [maxPrice , setMaxPrice] = useState("")
  const [sortBy , setSortBy] = useState(0)
  useEffect(() => {
    fetch(`/api?${searchParams.toString()}`)
      .then(res => res.json())
      .then(data => setResults(data))
  }, [searchParams])
  useEffect(() => {
    fetch("/api/platforms")
      .then(res => res.json())
      .then(data => setPlatforms(data))
  }, [])
  function updateURL(yeniPlatformlar?:string[],newMinPrice?:string,newMaxPrice?:string){
    const params = new URLSearchParams()
    const q = searchParams.get("q")
    if(q){
      params.set("q",q)
    }
    if((yeniPlatformlar ?? selectedPlatforms).length > 0){
      params.set("platforms",(yeniPlatformlar ?? selectedPlatforms).join(","))
    }
    if(newMinPrice ?? minPrice){
      params.set("minPrice",newMinPrice ?? minPrice)
    }
    if(newMaxPrice ?? maxPrice){
      params.set("maxPrice",newMaxPrice ?? maxPrice)
    }
    if(sortBy){
      params.set("sortBy",sortBy.toString())
    }
    router.push(`/search?${params.toString()}`)

  }
  function resetFilters(){
    setSelectedPlatforms([])
    setMinPrice("")
    setMaxPrice("")
    setSortBy(0)
    updateURL([])
  }
  function grouping(data:SearchResult[]){
      const groups: { productName: string; restaurantName: string; image: string | null; 
        platforms:{ name: string; price: number; bestPrice?: boolean }[] }[] = []

      data.forEach((r)=>{
        const exitsGroup = groups.find(g => g.productName === r.productName && 
                                      g.restaurantName === r.restaurantName)
              if(exitsGroup){
                exitsGroup.platforms.push({name:r.platform , price:r.price})
              }else{
                groups.push({
                  productName : r.productName,
                  restaurantName: r.restaurantName,
                  image : r.image,
                  platforms: [{name:r.platform,price:r.price}]
                })
              }
      })
      groups.forEach(g=>{
        g.platforms.sort((a,b) => a.price - b.price)
        g.platforms[0].bestPrice = true
      })
      return groups

  }
    return (
    <div className="p-4">      
      {/* ALT: İki kolon */}
      <div className="flex gap-6">
        <div className="w-72 border p-4 rounded">
          <h1 className="font-bold mt-4 mb-2">Filtreler</h1>
          <h2 className="font-bold mt-4 mb-2">Platform</h2> 
          {platforms.map((p) => (
            <label key={p.platformID} className="flex items-center gap-2">
              <input type="checkbox"
              checked={selectedPlatforms.includes(p.platform)}
              onChange={() =>{
                const yeniListe = selectedPlatforms.includes(p.platform)
                  ? selectedPlatforms.filter(x => x !== p.platform)
                  : [...selectedPlatforms, p.platform]
                setSelectedPlatforms(yeniListe)
                updateURL(yeniListe)
              }} />
              {p.platform}
            </label>
          ))}
          <h2 className="font-bold mt-4 mb-2">Fiyat Aralığı:</h2>
          <div className="flex gap-2">
         <input type="text" inputMode="numeric" placeholder="Min" value={minPrice} 
            onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); setMinPrice(val); updateURL(undefined,val,undefined); }}
            className="border p-1 w-full rounded" /> 
            <input type="text" inputMode="numeric" placeholder="Max" value={maxPrice}
            onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); setMaxPrice(val); updateURL(undefined,undefined,val); }}
            className="border p-1 w-full rounded" />

          </div>
          <div className="mt-4 w-full bg-red-500 text-white p-2 rounded">
            <button className="w-full text-white font-bold" onClick={resetFilters}>Filtreleri Sıfırla</button>
          </div>
        </div>
         <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-sm text-gray-500">{results.length} Sonuç Bulundu</h1>
            <select className="border p-1 rounded" value={sortBy} onChange={(e) => { setSortBy(Number(e.target.value)); updateURL() }}>
              <option value="0">Fiyat: Artan</option>
              <option value="1">Fiyat: Azalan</option>
            </select>
          </div>
          {grouping(results).map((g, i) => (
            <div className="border p-3 mb-2 rounded" key={i}>
              <h3 className="font-bold">{g.restaurantName}</h3>
              <p className="text-sm text-gray-600 mb-2">{g.productName}</p>
              {g.platforms.map((p, j) => (
                <div key={j} className="flex justify-between items-center">
                  <span>{p.name}</span>
                  <span className={p.bestPrice ? "text-green-600 font-bold" : ""}>
                    {p.price}TL {p.bestPrice ? "⭐" : ""}
                  </span>
                </div>
              ))}
            </div>
          ))}
          </div>
      </div>
    </div>
  )
}