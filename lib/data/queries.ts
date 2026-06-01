import db from "./db";
import type { Restaurant, Platform, Product, Price, Detail, SearchResult, City, District, Region, RestaurantRegion, User, UserFav, UserAddressWithLocation } from "./types";
import { isStandaloneNonListableProductName } from "./product-filters"
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

export function getSearchPlatforms(): Platform[] {
    // Aramada sadece gercek linkli platformlar ve isaretlenmis demo platformlar gorunur.
    return db.prepare(`
        SELECT DISTINCT platforms.*
        FROM platforms
        JOIN details ON details.platformID = platforms.platformID
        WHERE (details.sourceLink IS NOT NULL AND TRIM(details.sourceLink) != '')
           OR details.isSynthetic = 1
        ORDER BY platforms.platform
    `).all() as Platform[]
}

export function getAllProducts(): Product[] {
    return db.prepare("SELECT * FROM products ORDER BY name").all() as Product[]
}

export function getAllPrices(): Price[] {
    return db.prepare("SELECT * FROM prices ORDER BY productID").all() as Price[]
}

export function getAdminPriceRows(limit = 500): (Price & { productName: string, platformName: string })[] {
    // Fiyat tablosu cok buyudugu icin admin ekraninda son kayitlardan bir ozet gosterilir.
    return db.prepare(`
        SELECT prices.*, products.name AS productName, platforms.platform AS platformName
        FROM prices
        JOIN products ON products.productID = prices.productID
        JOIN platforms ON platforms.platformID = prices.platformID
        ORDER BY prices.id DESC
        LIMIT ?
    `).all(limit) as (Price & { productName: string, platformName: string })[]
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

function fullAddressSelect(regionID?: number) {
    if (regionID && regionID > 0) {
        return "(SELECT city.city || ' / ' || district.district || ' - ' || region.region FROM region JOIN district ON region.districtID = district.districtID JOIN city ON district.cityID = city.cityID WHERE region.regionID = ?) AS address"
    }

    return "(SELECT city.city || ' / ' || district.district || ' - ' || region.region FROM restaurantregion rr JOIN region ON rr.regionID = region.regionID JOIN district ON region.districtID = district.districtID JOIN city ON district.cityID = city.cityID WHERE rr.restaurantID = restaurants.restaurantID LIMIT 1) AS address"
}

const nonListableProductCondition = "products.name NOT LIKE '%Poşet%' AND products.name NOT LIKE '%Poset%'"
const validDisplayPriceCondition = "prices.price >= 10"

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

// Arama fonksiyonu: metin, platform, fiyat ve adres filtresini tek sorguda toplar.
// Rating urunden degil restoran-platform detayindan geliyor.
export function searchProducts(query?:string,platforms?:string[],minPrice?:number,
                                maxPrice?:number,sortBy?:number,
                                regionID?:number):SearchResult[]{
    const conditions : string[] = []
    const selectParameters : unknown[] = []
    const parameters : unknown[] = []
    if(query){
        conditions.push("products.name LIKE ?")
        parameters.push(`%${query}%`)
    }
    conditions.push(nonListableProductCondition)
    // Scrape hatasi olan 0-1 TL gibi fiyatlari aramada gostermiyorum.
    conditions.push(validDisplayPriceCondition)
    conditions.push("((details.sourceLink IS NOT NULL AND TRIM(details.sourceLink) != '') OR details.isSynthetic = 1)")
    if(platforms && platforms.length > 0){
        conditions.push(`platforms.platform IN (${platforms.map(()=> "?").join(", ")})`)
        parameters.push(...platforms)
    }

    if(minPrice !== undefined && minPrice >= 0){
        conditions.push("prices.price >= ?")
        parameters.push(minPrice)
    }
    if(maxPrice !== undefined && maxPrice >= 0){
        conditions.push("prices.price <= ?")
        parameters.push(maxPrice)
    }
    // Adres secildiyse sadece o bolgedeki restoranlar getirilir.
    if(regionID && regionID > 0){
        conditions.push("EXISTS (SELECT 1 FROM restaurantregion rr WHERE rr.restaurantID = restaurants.restaurantID AND rr.regionID = ?)")
        parameters.push(regionID)
    }

    const addressSelect = fullAddressSelect(regionID)
    if (regionID && regionID > 0) selectParameters.push(regionID)

    let searchQuery = 'SELECT products.productID, restaurants.restaurantID, products.name AS productName, restaurants.name AS restaurantName,'
                        +' platforms.platform,'
                        +' prices.price,'
                        +' products.image,'
                        +' products.description,'
                        +' details.fee,'
                        +' details.deliveryTime,'
                        +' details.minCart,'
                        +' details.sourceLink,'
                        +' details.rating,'
                        +` ${addressSelect}`
                        +' FROM products'
                        +' JOIN restaurants ON products.restaurantID = restaurants.restaurantID'
                        +' JOIN prices ON products.productID = prices.productID'
                        +' JOIN platforms ON prices.platformID = platforms.platformID'
                        +' LEFT JOIN details ON restaurants.restaurantID = details.restaurantID AND platforms.platformID = details.platformID'
    if(conditions.length > 0){
        searchQuery += ' WHERE ' + conditions.join(" AND ")
    }
    // sortBy=1 fiyat azalan, diger durumda fiyat artan. Sayfa hizli kalsin diye sonucu sinirliyorum.
    searchQuery += sortBy === 1 ? " ORDER BY prices.price DESC" : " ORDER BY prices.price ASC"
    searchQuery += " LIMIT 300"
    return db.prepare(searchQuery).all(...selectParameters, ...parameters) as SearchResult[]
    
}

// CRUD islemleri
// Platformlar
export function createPlatform(name: string): Platform{
    return db.prepare("INSERT INTO platforms (platform) VALUES (?) RETURNING *").get(name) as Platform
}
export function updatePlatform(id: number, name: string): Platform{
    return db.prepare("UPDATE platforms SET platform = ? WHERE platformID = ? RETURNING *").get(name, id) as Platform
}
export function deletePlatform(id: number): void{
    db.prepare("DELETE FROM platforms WHERE platformID = ?").run(id)
}

// Restoranlar
export function createRestaurant(name: string, isActive = true): Restaurant{
    return db.prepare("INSERT INTO restaurants (name, isActive) VALUES (?, ?) RETURNING *").get(name, isActive ? 1 : 0) as Restaurant
}
export function updateRestaurant(id: number, name: string, isActive: boolean): Restaurant{
    // Admin panelindeki aktif/pasif secimini isActive alanina yaziyorum.
    return db.prepare("UPDATE restaurants SET name = ?, isActive = ? WHERE restaurantID = ? RETURNING *").get(name, isActive ? 1 : 0, id) as Restaurant
}
export function deleteRestaurant(id: number): void{
    db.prepare("DELETE FROM restaurants WHERE restaurantID = ?").run(id)
}
// Urunler
export function createProduct(data: {restaurantID: number, name:string, image?:string|null, description?:string|null}): Product {
    return db.prepare("INSERT INTO products (restaurantID, name, image, description) VALUES (?, ?, ?, ?) RETURNING *").get(data.restaurantID, data.name, data.image??null, data.description??null) as Product
}
export function updateProduct(id: number, data: {restaurantID: number, name: string, image: string|null, description: string|null}): Product {
    return db.prepare("UPDATE products SET restaurantID = ?, name = ?, image = ?, description = ? WHERE productID = ? RETURNING *").get(data.restaurantID, data.name, data.image, data.description, id) as Product
}
export function deleteProduct(id: number): void{
    // Urun silinmeden once kategori baglantilari temizlenir.
    db.prepare("DELETE FROM productCategories WHERE productID = ?").run(id)
    db.prepare("DELETE FROM products WHERE productID = ?").run(id)
}

// Fiyatlar
export function createPrice(data: {productID: number, platformID: number, price: number}): Price{
    return db.prepare("INSERT INTO prices (productID, platformID, price) VALUES (?, ?, ?) RETURNING *").get(data.productID, data.platformID, data.price) as Price
}
export function updatePrice(id: number, data: {productID: number, platformID: number, price: number}): Price{
    return db.prepare("UPDATE prices SET productID = ?, platformID = ?, price = ? WHERE id = ? RETURNING *").get(data.productID, data.platformID, data.price, id) as Price
}
export function deletePrice(id: number): void{
    db.prepare("DELETE FROM prices WHERE id = ?").run(id)
}

// Restoran-platform detaylari
export function createDetail(data: {restaurantID: number, platformID: number, rating: number | null, fee: number | null, deliveryTime?: string | null, minCart?: number | null, sourceLink?: string | null}): Detail{
    return db.prepare("INSERT INTO details (restaurantID, platformID, rating, fee, deliveryTime, minCart, sourceLink) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *").get(data.restaurantID, data.platformID, data.rating, data.fee, data.deliveryTime ?? null, data.minCart ?? null, data.sourceLink ?? null) as Detail
}
export function updateDetail(id: number, data: {restaurantID: number, platformID: number, rating: number | null, fee: number | null, deliveryTime?: string | null, minCart?: number | null, sourceLink?: string | null}): Detail{
    return db.prepare("UPDATE details SET restaurantID = ?, platformID = ?, rating = ?, fee = ?, deliveryTime = ?, minCart = ?, sourceLink = ? WHERE id = ? RETURNING *").get(data.restaurantID, data.platformID, data.rating, data.fee, data.deliveryTime ?? null, data.minCart ?? null, data.sourceLink ?? null, id) as Detail
}
export function deleteDetail(id: number): void{
    db.prepare("DELETE FROM details WHERE id = ?").run(id)
}

// Sehirler
export function createCity(city: string): City{
    return db.prepare("INSERT INTO city (city) VALUES (?) RETURNING *").get(city) as City
}
export function updateCity(id: number, city: string): City{
    return db.prepare("UPDATE city SET city = ? WHERE cityID = ? RETURNING *").get(city, id) as City
}
export function deleteCity(id: number): void{
    db.prepare("DELETE FROM city WHERE cityID = ?").run(id)
}

// Ilceler
export function createDistrict(data: {district: string, cityID: number}): District{
    return db.prepare("INSERT INTO district (district, cityID) VALUES (?, ?) RETURNING *").get(data.district, data.cityID) as District
}
export function updateDistrict(id: number, data: {district: string, cityID: number}): District{
    return db.prepare("UPDATE district SET district = ?, cityID = ? WHERE districtID = ? RETURNING *").get(data.district, data.cityID, id) as District
}
export function deleteDistrict(id: number): void{
    db.prepare("DELETE FROM district WHERE districtID = ?").run(id)
}

// Mahalle / bolge
export function createRegion(data: {region: string, districtID: number}): Region{
    return db.prepare("INSERT INTO region (region, districtID) VALUES (?, ?) RETURNING *").get(data.region, data.districtID) as Region
}
export function updateRegion(id: number, data: {region: string, districtID: number}): Region{
    return db.prepare("UPDATE region SET region = ?, districtID = ? WHERE regionID = ? RETURNING *").get(data.region, data.districtID, id) as Region
}
export function deleteRegion(id: number): void{
    db.prepare("DELETE FROM region WHERE regionID = ?").run(id)
}

// Kullanicilar
// Yeni kullanici olusturma
export function createUser(data: {firstName: string, lastName: string, email: string, passwordHash: string, lastRegionID: number}): User{
    return db.prepare("INSERT INTO users (firstName, lastName, email, passwordHash, lastRegionID) VALUES (?, ?, ?, ?, ?) RETURNING *").get(data.firstName, data.lastName, data.email, data.passwordHash, data.lastRegionID) as User
}
// Kullanici bilgilerini guncelleme
export function updateUser(id: number, data: {firstName: string, lastName: string, email: string, passwordHash: string, lastRegionID: number}): User{
    return db.prepare("UPDATE users SET firstName = ?, lastName = ?, email = ?, passwordHash = ?, lastRegionID = ? WHERE userID = ? RETURNING *").get(data.firstName, data.lastName, data.email, data.passwordHash, data.lastRegionID, id) as User
}
export function updateUserPassword(id: number, passwordHash: string): User{
    return db.prepare("UPDATE users SET passwordHash = ? WHERE userID = ? RETURNING *").get(passwordHash, id) as User
}
export function deleteUser(id: number): void{
    db.prepare("DELETE FROM users WHERE userID = ?").run(id)
}
// Giris yaparken email ile kullaniciyi buluyorum.
export function getUserByEmail(email: string): User | undefined {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined
}
// Profil islemlerinde ID ile kullaniciyi buluyorum.
export function getUserById(id: number): User | undefined {
    return db.prepare("SELECT * FROM users WHERE userID = ?").get(id) as User | undefined
}

// Favoriler
export function createUserFav(data: {userID: number, productID: number}): UserFav{
    return db.prepare("INSERT INTO userFavs (userID, productID) VALUES (?, ?) RETURNING *").get(data.userID, data.productID) as UserFav
}
export function deleteUserFav(favID: number): void{
    db.prepare("DELETE FROM userFavs WHERE favID = ?").run(favID)
}

export function toggleUserFav(userID: number, productID: number): { added: boolean } {
    const existing = db.prepare("SELECT * FROM userFavs WHERE userID = ? AND productID = ?").get(userID, productID) as UserFav | undefined
    if (existing) {
        db.prepare("DELETE FROM userFavs WHERE favID = ?").run(existing.favID)
        return { added: false }
    } else {
        db.prepare("INSERT INTO userFavs (userID, productID) VALUES (?, ?)").run(userID, productID)
        return { added: true }
    }
}

export function getUserFavProducts(userID: number): import('./types').SearchResult[] {
    const query = `
        SELECT products.productID, restaurants.restaurantID, products.name AS productName, restaurants.name AS restaurantName,
               platforms.platform, prices.price, products.image, products.description,
               details.fee, details.deliveryTime, details.minCart, details.sourceLink, details.rating,
               ${fullAddressSelect()} 
        FROM userFavs
        JOIN products ON userFavs.productID = products.productID
        JOIN restaurants ON products.restaurantID = restaurants.restaurantID
        JOIN prices ON products.productID = prices.productID
        JOIN platforms ON prices.platformID = platforms.platformID
        LEFT JOIN details ON restaurants.restaurantID = details.restaurantID AND platforms.platformID = details.platformID
        WHERE userFavs.userID = ? AND ${nonListableProductCondition} AND ${validDisplayPriceCondition}
    `
    return db.prepare(query).all(userID) as import('./types').SearchResult[]
}

export function getHomepageMenuRows(limit = 800, regionID?: number): SearchResult[] {
    // Populer menulerde urun adina degil, scrape'den gelen kategori bilgisine bakilir.
    const regionFilter = regionID && regionID > 0
        ? "AND EXISTS (SELECT 1 FROM restaurantregion rr WHERE rr.restaurantID = restaurants.restaurantID AND rr.regionID = ?)"
        : ""
    const params: unknown[] = []
    if (regionID && regionID > 0) params.push(regionID)
    if (regionID && regionID > 0) params.push(regionID)
    params.push(limit)

    const rows = db.prepare(`
        SELECT products.productID, restaurants.restaurantID, products.name AS productName, restaurants.name AS restaurantName,
               platforms.platform, prices.price, products.image, products.description,
               details.fee, details.deliveryTime, details.minCart, details.sourceLink, details.rating,
               ${fullAddressSelect(regionID)}
        FROM products
        JOIN restaurants ON products.restaurantID = restaurants.restaurantID
        JOIN prices ON products.productID = prices.productID
        JOIN platforms ON prices.platformID = platforms.platformID
        JOIN productCategories ON productCategories.productID = products.productID
        JOIN categories ON categories.categoryID = productCategories.categoryID
        LEFT JOIN details ON restaurants.restaurantID = details.restaurantID AND platforms.platformID = details.platformID
        WHERE restaurants.isActive = 1
          AND categories.normalizedName IN ('menuler', 'menu')
          AND products.image IS NOT NULL
          AND TRIM(products.image) != ''
          AND prices.price >= 100
          AND ${nonListableProductCondition}
          ${regionFilter}
        ORDER BY COALESCE(details.rating, 0) DESC, prices.price ASC
        LIMIT ?
    `).all(...params) as SearchResult[]

    return rows.filter((row) => !isStandaloneNonListableProductName(row.productName))
}

export function getHomepageRestaurantRows(limit = 220, regionID?: number): SearchResult[] {
    // Populer restoran karti urun degil restoran odakli calisiyor.
    const regionFilter = regionID && regionID > 0
        ? "AND EXISTS (SELECT 1 FROM restaurantregion rr WHERE rr.restaurantID = restaurants.restaurantID AND rr.regionID = ?)"
        : ""
    const params: unknown[] = []
    if (regionID && regionID > 0) params.push(regionID)
    if (regionID && regionID > 0) params.push(regionID)
    params.push(limit)

    return db.prepare(`
        SELECT 0 AS productID, restaurants.restaurantID, '' AS productName, restaurants.name AS restaurantName,
               platforms.platform, 0 AS price,
               COALESCE(restaurants.image, (SELECT products.image FROM products WHERE products.restaurantID = restaurants.restaurantID AND products.image IS NOT NULL AND TRIM(products.image) != '' LIMIT 1)) AS image,
               NULL AS description,
               details.fee, details.deliveryTime, details.minCart, details.sourceLink, details.rating,
               ${fullAddressSelect(regionID)}
        FROM restaurants
        JOIN details ON restaurants.restaurantID = details.restaurantID
        JOIN platforms ON details.platformID = platforms.platformID
        WHERE restaurants.isActive = 1
          AND (
            restaurants.image IS NOT NULL
            OR EXISTS (SELECT 1 FROM products WHERE products.restaurantID = restaurants.restaurantID AND products.image IS NOT NULL AND TRIM(products.image) != '')
          )
          ${regionFilter}
        ORDER BY COALESCE(details.rating, 0) DESC, restaurants.restaurantID ASC
        LIMIT ?
    `).all(...params) as SearchResult[]
}

// Kullanici adresleri
export function getUserAddresses(userID: number): UserAddressWithLocation[] {
    return db.prepare(`
        SELECT ua.*, 
               r.region as _regionName, 
               d.district as _districtName, d.districtID,
               c.city as _cityName, c.cityID
        FROM userAddresses ua
        JOIN region r ON ua.regionID = r.regionID
        JOIN district d ON r.districtID = d.districtID
        JOIN city c ON d.cityID = c.cityID
        WHERE ua.userID = ?
    `).all(userID) as UserAddressWithLocation[]
}
export function createUserAddress(data: {userID: number, regionID: number, title: string, detail: string | null}): import('./types').UserAddress {
    return db.prepare("INSERT INTO userAddresses (userID, regionID, title, detail) VALUES (?, ?, ?, ?) RETURNING *").get(data.userID, data.regionID, data.title, data.detail) as import('./types').UserAddress
}
export function deleteUserAddress(addressID: number): void {
    db.prepare("DELETE FROM userAddresses WHERE addressID = ?").run(addressID)
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
