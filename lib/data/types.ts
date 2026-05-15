export interface City {
    cityID: number
    city: string
}
export interface District {
    districtID: number
    district: string
    cityID: number
}
export interface Region {
    regionID: number
    region: string
    districtID: number
}
export interface Restaurant {
    restaurantID: number
    name: string
    regionID: number
    isActive: boolean
}
export interface Platform {
    platformID: number
    platform: string
}
export interface Product {
    productID: number
    restaurantID: number
    name: string
    image: string | null
    description: string | null
}
export interface Price {
    id: number
    productID: number
    platformID: number
    price: number
    lastUpdated: string
}
export interface Detail {
    id: number
    restaurantID: number
    platformID: number
    rating: number
    fee: number
}
export interface Campaign {
    id: number
    platformID: number
    restaurantID: number
    minCartAmount: number
    discountValue: number
    discountPercentage: number
    description: string
}
export interface User {
    userID: number
    email: string
    passwordHash: string
    lastRegionID: number
}
export interface UserFav {
    fav_id: number
    userID: number
    productID: number
}

interface TrendingProduct {
    name: string
    restaurantName: string
    description?: string
    image?: string
    platforms: { name: string; price: number }[]
}
interface PopularRestaurant {
    name: string
    image?: string
    platforms: string[]
    rating?: number
    fee?: number
}