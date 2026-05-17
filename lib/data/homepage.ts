const burgerImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww"
const pizzaImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60"
const donerImage = "https://images.unsplash.com/photo-1679845974782-5e0ed20182b6?w=800&auto=format&fit=crop&q=60"
const lahmacunImage = "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&auto=format&fit=crop&q=60"
const chickenImage = "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=60"
const kebabImage = "https://images.unsplash.com/photo-1632778149955-e80d8ce05e62?w=800&auto=format&fit=crop&q=60"
const friesImage = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=60"

export interface PopularRestaurants {
    name: string
    location: string
    image: string
    platforms: string[]
    rating?: number
    fee?: number
    id?: string
    deliveryTime?: string
    minCart?: number
    currency?: string
    isFavorited?: boolean
}

export interface PopularMenu {
  productName: string
  productID: number
  name: string
  location: string
  image: string
  platforms: string[]
  platformPrices: Record<string, number>
  rating?: number
  fee?: number
  deliveryTime?: string
  minCart?: number
  currency?: string
}

export const popularMenus: PopularMenu[] = [
  {
    productName: "Büyük Boy Pizza Mix Menü",
    productID: 1141,
    name: "Pizza City",
    location: "Merkez (Cumhuriyet Mah.)",
    image: pizzaImage,
    platforms: ["getir"],
    platformPrices: { getir: 750 },
    rating: 4.5,
    fee: 20,
    deliveryTime: "25-35",
    minCart: 200,
    currency: "₺",
  },
  {
    productName: "İkili Et Jumbo Dürüm Menü",
    productID: 1480,
    name: "Hot Döner",
    location: "Merkez (Üniversite Mah.)",
    image: pizzaImage,
    platforms: ["getir"],
    platformPrices: { getir: 920 },
    rating: 4.3,
    fee: 15,
    deliveryTime: "15-25",
    minCart: 150,
    currency: "₺",
  },
  {
    productName: "Cajun Mix Menü",
    productID: 1376,
    name: "Cajun Chicken House",
    location: "Merkez (Cumhuriyet 1. Bölge Mah.)",
    image: chickenImage,
    platforms: ["getir"],
    platformPrices: { getir: 340 },
    rating: 4.7,
    fee: 22,
    deliveryTime: "30-45",
    minCart: 350,
    currency: "₺",
  },
  {
    productName: "Fry Classic Burger Menü (90 g)",
    productID: 1554,
    name: "Fry Stop",
    location: "Merkez (Yeni 1. Bölge Mah.)",
    image: friesImage,
    platforms: ["getir"],
    platformPrices: { getir: 415 },
    rating: 4.1,
    fee: 15,
    deliveryTime: "15-20",
    minCart: 180,
    currency: "₺",
  },
  {
    productName: "2'li Cheese Menü",
    productID: 1793,
    name: "Burger Buffs",
    location: "Merkez (Çaydaçıra Mah.)",
    image: burgerImage,
    platforms: ["getir"],
    platformPrices: { getir: 870 },
    rating: 4.2,
    fee: 18,
    deliveryTime: "20-30",
    minCart: 250,
    currency: "₺",
  },
  {
    productName: "Gobit Ekmek Arası Et Döner Menü",
    productID: 1704,
    name: "Koçoğlu Elazığ Sofrası",
    location: "Merkez (Sürsürü Mah.)",
    image: pizzaImage,
    platforms: ["getir"],
    platformPrices: { getir: 400 },
    rating: 4.6,
    fee: 25,
    deliveryTime: "30-40",
    minCart: 300,
    currency: "₺",
  },
  {
    productName: "Combo Menü",
    productID: 1344,
    name: "Öykü İskenderun Ateşi",
    location: "Merkez (Yeni Mah.)",
    image: pizzaImage,
    platforms: ["getir"],
    platformPrices: { getir: 280 },
    rating: 4.4,
    deliveryTime: "20-30",
    minCart: 100,
    currency: "₺",
  },
  {
    productName: "Orta Boy Pizza Menü",
    productID: 1623,
    name: "Lahmacuncu",
    location: "Üniversite Mah.",
    image: lahmacunImage,
    platforms: ["getir"],
    platformPrices: { getir: 405 },
    rating: 4.4,
    fee: 12,
    deliveryTime: "20-30",
    minCart: 120,
    currency: "₺",
  },
]

export const popularRestaurants = [
  {
    name: "Pizza City",
    location: "Merkez (Cumhuriyet Mah.)",
    image: burgerImage,
    platforms: ["getir", "yemeksepeti", "ubereats"],
    rating: 4.5,
    fee: 20,
    deliveryTime: "25-35",
    minCart: 200,
    currency: "₺",
  },
  {
    name: "Hot Döner",
    location: "Merkez (Üniversite Mah.)",
    image: burgerImage,
    platforms: ["getir", "yemeksepeti"],
    rating: 4.3,
    fee: 15,
    deliveryTime: "15-25",
    minCart: 150,
    currency: "₺",
  },
  {
    name: "Koçoğlu Elazığ Sofrası",
    location: "Merkez (Sürsürü Mah.)",
    image: burgerImage,
    platforms: ["getir"],
    rating: 4.6,
    fee: 25,
    deliveryTime: "30-40",
    minCart: 300,
    currency: "₺",
  },
  {
    name: "Burger Buffs",
    location: "Merkez (Çaydaçıra Mah.)",
    image: burgerImage,
    platforms: ["getir", "ubereats"],
    rating: 4.2,
    fee: 18,
    deliveryTime: "20-30",
    minCart: 250,
    currency: "₺",
  },
  {
    name: "Lahmacuncu",
    location: "Üniversite Mah.",
    image: burgerImage,
    platforms: ["getir", "yemeksepeti"],
    rating: 4.4,
    fee: 12,
    deliveryTime: "20-30",
    minCart: 120,
    currency: "₺",
  },
  {
    name: "Fry Stop",
    location: "Merkez (Yeni 1. Bölge Mah.)",
    image: burgerImage,
    platforms: ["getir"],
    rating: 4.1,
    fee: 15,
    deliveryTime: "15-20",
    minCart: 180,
    currency: "₺",
  },
  {
    name: "Cajun Chicken House",
    location: "Merkez (Cumhuriyet 1. Bölge Mah.)",
    image: burgerImage,
    platforms: ["yemeksepeti", "ubereats"],
    rating: 4.7,
    fee: 22,
    deliveryTime: "30-45",
    minCart: 350,
    currency: "₺",
  },
  {
    name: "Hk Katık",
    location: "Merkez (Çaydaçıra Mah.)",
    image: burgerImage,
    platforms: ["getir"],
    deliveryTime: "20-30",
    minCart: 100,
    currency: "₺",
  },
]
