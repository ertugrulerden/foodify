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
    isActive: boolean
    sourceHash: string | null
    image: string | null
}
export interface RestaurantRegion{
    id: number
    restaurantID: number
    regionID: number
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
    rating: number | null
    fee: number | null
    deliveryTime: string | null
    minCart: number | null
    sourceLink: string | null
    isSynthetic: number
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
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    lastRegionID: number
}
export interface UserFav {
    favID: number
    userID: number
    productID: number
}
export interface UserAddress {
    addressID: number
    userID: number
    regionID: number
    title: string
    detail: string | null
}
export interface UserAddressWithLocation extends UserAddress {
    _regionName: string
    _districtName: string
    districtID: number
    _cityName: string
    cityID: number
}
export interface SearchResult {
    productID: number
    restaurantID: number
    productName:string
    restaurantName: string
    platform:string
    price: number
    fee:(number | null)
    deliveryTime: string | null
    minCart: number | null
    sourceLink: string | null
    address:(string | null)
    rating: number | null
    image:(string | null)
    description:(string | null)
}


