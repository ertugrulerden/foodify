import db from "./db";
import type { Restaurant, Platform, Product, Price, Detail } from "./types";

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



