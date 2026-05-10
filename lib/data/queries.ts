import db from "./db";
import type { Restaurant, Platform } from "./types";

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



