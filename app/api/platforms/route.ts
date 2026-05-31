import {getAllPlatforms} from "@/lib/data/queries"

export async function GET(){
    const platforms = getAllPlatforms()
    return Response.json(platforms)
}
