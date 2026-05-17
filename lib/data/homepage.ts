const burgerImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww"

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
