"use client"
import { useState } from "react"
import {useRouter , useSearchParams} from "next/navigation"
import type {Platform} from "@/lib/data/types"
import { Slider } from "@/components/ui/slider"

export function FilterSidebar({ platforms }: {
  platforms: Platform[]
  
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedPlatforms = searchParams.get("platforms")?.split(",") ?? []
    const [localRating, setLocalRating] = useState(Number(searchParams.get("minRating") ?? "0"))

    function updateURL(newPlatforms?:string[],newMinPrice?:string,newMaxPrice?:string,sortBy?:string,newMinRating?:string)

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
        if(newMinRating !== undefined){
            if(newMinRating === "" || newMinRating === "0"){
                url.delete("minRating")
            }else{
                url.set("minRating",newMinRating)
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
        updateURL([],"","","","")
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
            <h2 className="font-bold mt-4 mb-2">Minimum Puan</h2>
            <div className="flex items-center gap-3">
                <Slider
                    min={0}
                    max={5}
                    step={0.1}
                    value={[localRating]}
                    onValueChange={(val) => setLocalRating(val[0])}
                    onValueCommit={(val) => updateURL(undefined,undefined,undefined,undefined,val[0].toString())}
                    className="flex-1"
                />
                <span className="text-sm font-medium w-8 text-center">{localRating}</span>
            </div>
            <div className="mt-4 w-full bg-red-500 text-white p-2 rounded text-center">
                <button className="w-full text-white font-bold" onClick={() => resetFilters()}>Filtreleri Sıfırla</button>
            </div>

        </div>)       
        
    
}


