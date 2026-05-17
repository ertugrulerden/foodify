import db from "./db";
import type { Restaurant, Platform, Product, Price, Detail, SearchResult } from "./types";
export function getAllRestaurants(): Restaurant[]{
    const getAllRest = db.prepare("SELECT * FROM restaurants")
    const restaurants = getAllRest.all() as Restaurant[]
    return restaurants
}

export function getAllPlatforms(): Platform[] {
    const getAllPlat = db.prepare("SELECT * FROM platforms")
    const platforms = getAllPlat.all() as Platform[]
    return platforms
}

export function getAllProducts(): Product[] {
    return db.prepare("SELECT * FROM products ORDER BY name").all() as Product[]
}

export function getAllPrices(): Price[] {
    return db.prepare("SELECT * FROM prices ORDER BY productID").all() as Price[]
}

export function getAllDetails(): Detail[] {
    return db.prepare("SELECT * FROM details ORDER BY restaurantID").all() as Detail[]
}


export function searchProducts(query?:string,platforms?:string[],minPrice?:number,
                                maxPrice?:number,sortBy?:number):SearchResult[]{
    const conditions : string[] = []
    const parameters : unknown[] = []
    if(query){
        conditions.push("products.name LIKE ?")
        parameters.push(`%${query}%`)
    }
    if(platforms && platforms.length > 0){
        conditions.push(`platforms.platform IN (${platforms.map(()=> "?").join(", ")})`)
        parameters.push(...platforms)
    }

    if(minPrice && minPrice >= 0){
        conditions.push("prices.price >= ?")
        parameters.push(`${minPrice}`)
    }
    if(maxPrice && maxPrice >= 0){
        conditions.push("prices.price <= ?")
        parameters.push(`${maxPrice}`)
    }

    let searchQuery = 'SELECT'
                        +' products.name AS productName,'
                        +' restaurants.name AS restaurantName,'
                        +' platforms.platform,'
                        +' prices.price,'
                        +' products.image,'
                        +' products.description,'
                        +' details.fee,'
                        +' details.rating,'
                        +' regions.region AS address'
                        +' FROM products'
                        +' JOIN restaurants ON products.restaurantID = restaurants.restaurantID'
                        +' JOIN prices ON products.productID = prices.productID'
                        +' JOIN platforms ON prices.platformID = platforms.platformID'
                        +' LEFT JOIN restaurantregion ON restaurants.restaurantID = restaurantregion.restaurantID'
                        +' LEFT JOIN regions ON restaurantregion.regionID = regions.regionID'
                        +' LEFT JOIN details ON restaurants.restaurantID = details.restaurantID AND platforms.platformID = details.platformID'
    if(conditions.length > 0){
        searchQuery += ' WHERE ' + conditions.join(" AND ")
    }
    if(sortBy){
            searchQuery += " ORDER BY prices.price DESC"
        }
    return db.prepare(searchQuery).all(...parameters) as SearchResult[]
    
} 
