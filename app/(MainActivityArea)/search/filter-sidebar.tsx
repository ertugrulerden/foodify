"use client"
import {useRouter , useSearchParams} from "next/navigation"
import type {Platform} from "@/lib/data/types"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function FilterSidebar({ platforms }: {
  platforms: Platform[]
  
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedPlatforms = searchParams.get("platforms")?.split(",") ?? []

    function updateURL(newPlatforms?:string[],newMinPrice?:string,newMaxPrice?:string,sortBy?:string)

    {
        const url  = new URLSearchParams(searchParams.toString())
        const q = searchParams.get("q")
        const platform = newPlatforms ?? selectedPlatforms

        if(q){
            url.set("q",q)
        }
        if(platform.length > 0){
            url.set("platforms",platform.join(","))
        }
        else{
            url.delete("platforms")
        }
       
        if(newMinPrice !== undefined){
            if(newMinPrice === ""){
                url.delete("minPrice")
            }else{
                url.set("minPrice",newMinPrice)
            }
        } 
        
        if(newMaxPrice !== undefined){
           if(newMaxPrice === ""){
            url.delete("maxPrice")
            }else{
                url.set("maxPrice",newMaxPrice)
            } 
        }
        if(sortBy !== undefined){
            if(sortBy ===""){
            url.delete("sortBy")
            }else{
                url.set("sortBy",sortBy)
            }
        }
        router.push(`/search?${url.toString()}`)

    }
    const handlePlatformChange = (platformName: string)=>{
    const updated = selectedPlatforms.includes(platformName) ?
    selectedPlatforms.filter(p => p!== platformName) : [...selectedPlatforms,platformName]
    updateURL(updated)
    }
    function resetFilters(){
        updateURL([],"","","")
    }
    return (
        <div className="w-72 border p-4 rounded shrink-0 sticky top-5 h-full">
            <h2 className="font-bold mb-2">Platformlar</h2>
            <div>
                {platforms.map((p)=>(
                    <label key={p.platformID} className="flex items-center gap-2 
                    py-0.5 cursor-pointer hover:text-foreground transition-colors">
                    
                    <input  type="checkbox" className="accent-green-600 h-4 w-4 rounded border-gray-300 cursor-pointer"
                            name="platform" 
                            value={p.platform}
                            checked={selectedPlatforms.includes(p.platform)}
                            onChange={()=> handlePlatformChange(p.platform)}

                   /><span className="text-sm">{p.platform}</span></label>
                ))} 
            </div>
            <h2 className="font-bold mt-4 mb-2">Fiyat Aralığı</h2>
            <div className="flex gap-2">
                <input  type="number" placeholder="Min"
                        value={searchParams.get("minPrice") ?? ""}
                        onChange={(e)=> updateURL(undefined,e.target.value,undefined,undefined)}
                        className="border p-1 w-full rounded"
                /> 
                <span className="self-center">-</span>
                <input type="number" placeholder="Max"
                value={searchParams.get("maxPrice") ?? ""}
                onChange={(e) => updateURL(undefined,undefined,e.target.value,undefined)}
                className="border p-1 w-full rounded"
                />

            </div>
            <div className="mt-4 w-full bg-red-500 text-white p-2 rounded text-center">
                <button className="w-full text-white font-bold" onClick={() => resetFilters()}>Filtreleri Sıfırla</button>
            </div>

        </div>)       
        
    
}


