import {NextRequest} from "next/server"
import {getAllPlatforms} from "@/lib/data/queries"

export async function GET(request:NextRequest){
    const platforms = getAllPlatforms()
    return Response.json(platforms)
}