import {NextRequest} from "next/server"
import {searchProducts} from "@/lib/data/queries"


export async function GET(request:NextRequest){
    const q = request.nextUrl.searchParams.get("q")
    const platformsStr = request.nextUrl.searchParams.get("platforms")
    const minPriceStr = request.nextUrl.searchParams.get("minPrice")
    const maxPriceStr = request.nextUrl.searchParams.get("maxPrice")
    const sortByStr = request.nextUrl.searchParams.get("sortBy")

    const results = searchProducts(q || undefined,
        platformsStr ? platformsStr.split(",") : undefined,
        minPriceStr ? Number(minPriceStr) : undefined,
        maxPriceStr ? Number(maxPriceStr) : undefined,
        sortByStr ? Number(sortByStr) : undefined
    )
    return Response.json(results)
}

