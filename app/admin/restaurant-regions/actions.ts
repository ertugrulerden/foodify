"use server"

import { revalidatePath } from "next/cache"
import { createRestaurantRegion, deleteRestaurantRegion } from "@/lib/data/queries"

export async function createRestaurantRegionAction(formData: FormData) {
  const restaurantID = Number(formData.get("restaurantID"))
  const regionID = Number(formData.get("regionID"))
  createRestaurantRegion({ restaurantID, regionID })
  revalidatePath("/admin/restaurant-regions")
}

export async function deleteRestaurantRegionAction(formData: FormData) {
  const restaurantID = Number(formData.get("restaurantID"))
  const regionID = Number(formData.get("regionID"))
  deleteRestaurantRegion(restaurantID, regionID)
  revalidatePath("/admin/restaurant-regions")
}
