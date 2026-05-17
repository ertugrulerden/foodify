import { searchProducts, getAllPlatforms } from "@/lib/data/queries"
import type { SearchResult, Platform } from "@/lib/data/types"
import {FilterSidebar} from "./filter-sidebar"

export default async function SearchPage({
	searchParams
}: {
	searchParams: Promise<{
		q?: string; platforms?: string;
		minPrice?: string; maxPrice?: string; sortBy?: string
	}>
}) {
	const resolvedParams = await searchParams
	const results = await searchProducts(resolvedParams.q,
		resolvedParams.platforms?.split(","),
		resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
		resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
		resolvedParams.sortBy ? Number(resolvedParams.sortBy) : undefined)
	const platforms = getAllPlatforms()

	function grouping(data: SearchResult[]) {
		const groups: {
			restaurantName: string; productName: string; image: string | null;
							address:string ;avgRating:number;
			platforms: { name: string; price: number; bestPrice?: boolean }[];
		}[] = []
		data.forEach((r) => {
			const existing = groups.find(g => g.restaurantName === r.restaurantName &&
				r.productName === g.productName)

			if (existing) {
				existing.platforms.push({ name: r.platform, price: r.price })
				
			} else {
				groups.push({
					restaurantName: r.restaurantName,
					productName: r.productName,
					image: r.image,
					address: r.address || "Bilinmeyen Konum",
					avgRating: r.avgRating ?? 0 ,
					platforms: [{ name: r.platform, price: r.price }]
				})
			}
		})
		groups.forEach((g) => {
			g.platforms.sort((a, b) => a.price - b.price)
			g.platforms[0].bestPrice = true
			const restoranSatirlari = data.filter(r => r.restaurantName === g.restaurantName && r.productName === g.productName);
   			const puanliSatirlar = restoranSatirlari.filter(r => r.rating);
    		g.avgRating = puanliSatirlar.length > 0 ? Number((puanliSatirlar.reduce((sum, r) => sum + r.rating, 0) / puanliSatirlar.length).toFixed(1)) : 0;
    
		}
		
		)
		if (resolvedParams.sortBy === "0") {
    		groups.sort((a, b) => a.platforms[0].price - b.platforms[0].price)
		} else if (resolvedParams.sortBy === "1") {
    		groups.sort((a, b) => b.platforms[0].price - a.platforms[0].price)
		} else if (resolvedParams.sortBy === "2"){
			groups.sort((a,b) =>  b.avgRating - a.avgRating)
		}
		return groups
	}
	const groups = grouping(results)
	return (
		<div className="flex">
			<FilterSidebar platforms={platforms} />
			<h2>{groups.length} Sonuç Bulundu</h2>	
			{groups.map((item,index)=>
				<div key={index}>
					<span>{item.restaurantName}</span>
					<h3>{item.productName}</h3>
		
					{item.platforms.map((platform,pindex)=>
					<div key={pindex}>
						<span>{platform.name}</span>
						<span className={platform.bestPrice ? "text-green-600 font-bold":""}>
							{platform.price}</span>
						
					</div>)}
			</div>)}
		</div>
	)

}
