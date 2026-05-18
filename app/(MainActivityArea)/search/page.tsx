import { searchProducts, getAllPlatforms } from "@/lib/data/queries"
import type { SearchResult, Platform } from "@/lib/data/types"
import {FilterSidebar} from "./filter-sidebar"
import {SortSelect} from "./sort-select"
import MenuCard from "@/components/Homepage/MenuCard"
import Navbar from "@/components/Navbar/Navbar"

export default async function SearchPage({
	searchParams
}: {
	searchParams: Promise<{
		q?: string; platforms?: string;
		minPrice?: string; maxPrice?: string; sortBy?: string; minRating?: string
	}>
}) {
	const resolvedParams = await searchParams
	const results = await searchProducts(resolvedParams.q,
		resolvedParams.platforms?.split(","),
		resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
		resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
		resolvedParams.sortBy ? Number(resolvedParams.sortBy) : undefined,
		resolvedParams.minRating ? Number(resolvedParams.minRating) : undefined)
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
		const sortByValue = resolvedParams.sortBy ?? "0"
		if (sortByValue === "0") {
    		groups.sort((a, b) => a.platforms[0].price - b.platforms[0].price)
		} else if (sortByValue === "1") {
    		groups.sort((a, b) => b.platforms[0].price - a.platforms[0].price)
		} else if (sortByValue === "2"){
			groups.sort((a,b) =>  b.avgRating - a.avgRating)
		}
		return groups
	}
	const groups = grouping(results)
	return (
		<>
		
		<div className="flex gap-6 p-4">
			<FilterSidebar platforms={platforms} />
			<div className="flex-1">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-sm text-gray-500">{groups.length} Sonuç Bulundu</h2>
					<SortSelect />
				</div>
				<div className="flex flex-wrap gap-6 justify-start">
				{groups.map((item,index)=>{
					const platformMap: Record<string, string> = {
						"Yemeksepeti": "yemeksepeti",
						"Uber Eats": "ubereats",
						"GetirYemek": "getir",
						"MigrosYemek":"migros"
					}
					const prices: Record<string, number> = {}
					item.platforms.forEach(p => {
						const key = platformMap[p.name] || p.name.toLowerCase()
						prices[key] = p.price
					})
					return (
					<div key={index} className="flex-[1_1_220px] max-w-[300px]" >
					<MenuCard
						name={item.restaurantName}
						location={item.address}
						image={item.image ?? "/placeholder.svg"}
						rating={item.avgRating}
						platforms={item.platforms.map(p => platformMap[p.name] || p.name.toLowerCase())}
						productName={item.productName}
						platformPrices={prices}
					/>
					</div>)})}
				</div>
			</div>
		</div>
		</>
	)

}
