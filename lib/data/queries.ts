import db from "./db";
import type { Restaurant, Platform, Product, Price, Detail, SearchResult, City, District, Region, RestaurantRegion, User, UserFav } from "./types";
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

export function getAllCities(): City[] {
    return db.prepare("SELECT * FROM city ORDER BY city").all() as City[]
}
export function getAllDistricts(): District[] {
    return db.prepare("SELECT * FROM district ORDER BY district").all() as District[]
}
export function getAllRegions(): Region[] {
    return db.prepare("SELECT * FROM region ORDER BY region").all() as Region[]
}
export function getAllRestaurantRegions(): RestaurantRegion[] {
    return db.prepare("SELECT rowid AS id, * FROM restaurantRegion").all() as RestaurantRegion[]
}
//RestaurantRegion
export function createRestaurantRegion(data: {restaurantID: number, regionID: number}): RestaurantRegion{
    const result = db.prepare("INSERT INTO restaurantRegion (restaurantID, regionID) VALUES (?, ?) RETURNING rowid AS id, *").get(data.restaurantID, data.regionID) as RestaurantRegion
    return result
}
export function updateRestaurantRegion(id: number, data: {restaurantID: number, regionID: number}): RestaurantRegion{
    return db.prepare("UPDATE restaurantRegion SET restaurantID = ?, regionID = ? WHERE rowid = ? RETURNING rowid AS id, *").get(data.restaurantID, data.regionID, id) as RestaurantRegion
}
export function deleteRestaurantRegion(id: number): void{
    db.prepare("DELETE FROM restaurantRegion WHERE rowid = ?").run(id)
}
export function getAllUsers(): User[] {
    return db.prepare("SELECT * FROM users ORDER BY email").all() as User[]
}
export function getAllUserFavs(): UserFav[] {
    return db.prepare("SELECT * FROM userFavs").all() as UserFav[]
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
        +' details.rating'
        +' FROM products'
        +' JOIN restaurants ON products.restaurantID = restaurants.restaurantID'
        +' JOIN prices ON products.productID = prices.productID'
        +' JOIN platforms ON prices.platformID = platforms.platformID'
        +' LEFT JOIN details ON restaurants.restaurantID = details.restaurantID AND platforms.platformID = details.platformID'
    if(conditions.length > 0){
        searchQuery += ' WHERE ' + conditions.join(" AND ")
    }
    if(sortBy){
            searchQuery += " ORDER BY prices.price DESC"
        }
    return db.prepare(searchQuery).all(...parameters) as SearchResult[]
    
}

//CrUD
// Platforms
export function createPlatform(name: string): Platform{
    return db.prepare("INSERT INTO platforms (platform) VALUES (?) RETURNING *").get(name) as Platform
}
export function updatePlatform(id: number, name: string): Platform{
    return db.prepare("UPDATE platforms SET platform = ? WHERE platformID = ? RETURNING *").get(name, id) as Platform
}
export function deletePlatform(id: number): void{
    db.prepare("DELETE FROM platforms WHERE platformID = ?").run(id)
}

//Restaurants
export function createRestaurant(name: string): Restaurant{
    return db.prepare("INSERT INTO restaurants (name) VALUES (?) RETURNING *").get(name) as Restaurant
}
export function updateRestaurant(id: number, name: string): Restaurant{
    return db.prepare("UPDATE restaurants SET name = ? WHERE restaurantID = ? RETURNING *").get(name, id) as Restaurant
}
export function deleteRestaurant(id: number): void{
    db.prepare("DELETE FROM restaurants WHERE restaurantID = ?").run(id)
}
//Products
export function createProduct(data: {restaurantID: number, name:string, image?:string|null, description?:string|null}): Product {
    return db.prepare("INSERT INTO products (restaurantID, name, image, description) VALUES (?, ?, ?, ?) RETURNING *").get(data.restaurantID, data.name, data.image??null, data.description??null) as Product
}
export function updateProduct(id: number, data: {restaurantID: number, name: string, image: string|null, description: string|null}): Product {
    return db.prepare("UPDATE products SET restaurantID = ?, name = ?, image = ?, description = ? WHERE productID = ? RETURNING *").get(data.restaurantID, data.name, data.image, data.description, id) as Product
}
export function deleteProduct(id: number): void{
    db.prepare("DELETE FROM products WHERE productID = ?").run(id)
}

//Prices
export function createPrice(data: {productID: number, platformID: number, price: number}): Price{
    return db.prepare("INSERT INTO prices (productID, platformID, price) VALUES (?, ?, ?) RETURNING *").get(data.productID, data.platformID, data.price) as Price
}
export function updatePrice(id: number, data: {productID: number, platformID: number, price: number}): Price{
    return db.prepare("UPDATE prices SET productID = ?, platformID = ?, price = ? WHERE id = ? RETURNING *").get(data.productID, data.platformID, data.price, id) as Price
}
export function deletePrice(id: number): void{
    db.prepare("DELETE FROM prices WHERE id = ?").run(id)
}

//Details
export function createDetail(data: {restaurantID: number, platformID: number, rating: number, fee: number}): Detail{
    return db.prepare("INSERT INTO details (restaurantID, platformID, rating, fee) VALUES (?, ?, ?, ?) RETURNING *").get(data.restaurantID, data.platformID, data.rating, data.fee) as Detail
}
export function updateDetail(id: number, data: {restaurantID: number, platformID: number, rating: number, fee: number}): Detail{
    return db.prepare("UPDATE details SET restaurantID = ?, platformID = ?, rating = ?, fee = ? WHERE id = ? RETURNING *").get(data.restaurantID, data.platformID, data.rating, data.fee, id) as Detail
}
export function deleteDetail(id: number): void{
    db.prepare("DELETE FROM details WHERE id = ?").run(id)
}

//City
export function createCity(city: string): City{
    return db.prepare("INSERT INTO city (city) VALUES (?) RETURNING *").get(city) as City
}
export function updateCity(id: number, city: string): City{
    return db.prepare("UPDATE city SET city = ? WHERE cityID = ? RETURNING *").get(city, id) as City
}
export function deleteCity(id: number): void{
    db.prepare("DELETE FROM city WHERE cityID = ?").run(id)
}

//District
export function createDistrict(data: {district: string, cityID: number}): District{
    return db.prepare("INSERT INTO district (district, cityID) VALUES (?, ?) RETURNING *").get(data.district, data.cityID) as District
}
export function updateDistrict(id: number, data: {district: string, cityID: number}): District{
    return db.prepare("UPDATE district SET district = ?, cityID = ? WHERE districtID = ? RETURNING *").get(data.district, data.cityID, id) as District
}
export function deleteDistrict(id: number): void{
    db.prepare("DELETE FROM district WHERE districtID = ?").run(id)
}

//Region
export function createRegion(data: {region: string, districtID: number}): Region{
    return db.prepare("INSERT INTO region (region, districtID) VALUES (?, ?) RETURNING *").get(data.region, data.districtID) as Region
}
export function updateRegion(id: number, data: {region: string, districtID: number}): Region{
    return db.prepare("UPDATE region SET region = ?, districtID = ? WHERE regionID = ? RETURNING *").get(data.region, data.districtID, id) as Region
}
export function deleteRegion(id: number): void{
    db.prepare("DELETE FROM region WHERE regionID = ?").run(id)
}

//Users
export function createUser(data: {email: string, passwordHash: string, lastRegionID: number}): User{
    return db.prepare("INSERT INTO users (email, passwordHash, lastRegionID) VALUES (?, ?, ?) RETURNING *").get(data.email, data.passwordHash, data.lastRegionID) as User
}
export function updateUser(id: number, data: {email: string, passwordHash: string, lastRegionID: number}): User{
    return db.prepare("UPDATE users SET email = ?, passwordHash = ?, lastRegionID = ? WHERE userID = ? RETURNING *").get(data.email, data.passwordHash, data.lastRegionID, id) as User
}
export function deleteUser(id: number): void{
    db.prepare("DELETE FROM users WHERE userID = ?").run(id)
}

//UserFavs
export function createUserFav(data: {userID: number, productID: number}): UserFav{
    return db.prepare("INSERT INTO userFavs (userID, productID) VALUES (?, ?) RETURNING *").get(data.userID, data.productID) as UserFav
}
export function deleteUserFav(favID: number): void{
    db.prepare("DELETE FROM userFavs WHERE favID = ?").run(favID)
}


export function getDashboardCounts() {
    return db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM restaurants) AS restaurants,
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM platforms) AS platforms,
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM city) AS cities,
        (SELECT COUNT(*) FROM district) AS districts,
        (SELECT COUNT(*) FROM region) AS regions,
        (SELECT COUNT(*) FROM prices) AS prices
    `).get() as {
      restaurants: number
      products: number
      platforms: number
      users: number
      cities: number
      districts: number
      regions: number
      prices: number
    }
}