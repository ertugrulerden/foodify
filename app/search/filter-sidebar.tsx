"use client"
import {useRouter , useSearchParams} from "next/navigation"
import type {Platform} from "@/lib/data/types"

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
        <div>
            <h2>Platformlar</h2>
            <div>
                {platforms.map((p)=>(
                    <label key = {p.platformID}>
                    <input  type="checkbox" 
                            name="platform" 
                            value={p.platform}
                            checked={selectedPlatforms.includes(p.platform)}
                            onChange={()=> handlePlatformChange(p.platform)}

                   /><span>{p.platform}</span></label>
                ))} 
            </div>
            <h2>Fiyat Aralığı</h2>
            <div>
                <input  type="number" placeholder="Min"
                        value={searchParams.get("minPrice") ?? ""}
                        onChange = {(e)=> updateURL(undefined,e.target.value,undefined,undefined)}
                
                /> - 
                <input type="number" placeholder="Max"
                value={searchParams.get("maxPrice") ?? ""}
                onChange = {(e) => updateURL(undefined,undefined,e.target.value,undefined)}
                />

            </div>
            <button onClick={() => resetFilters()}>Filtreleri Sıfırla</button>



        </div>)       
        
    
}


