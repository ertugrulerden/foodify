"use server"

import { revalidatePath } from "next/cache"
import { createRestaurantRegion, updateRestaurantRegion, deleteRestaurantRegion } from "@/lib/data/queries"

export async function saveRestaurantRegionAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const restaurantID = Number(formData.get("restaurantID"))
  const regionID = Number(formData.get("regionID"))
  try {
    if (id) {
      updateRestaurantRegion(Number(id), { restaurantID, regionID })
      revalidatePath("/admin/restaurant-regions")
      return { success: true, msg: "Updated" }
    }
    createRestaurantRegion({ restaurantID, regionID })
    revalidatePath("/admin/restaurant-regions")
    return { success: true, msg: "Created" }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteRestaurantRegionAction(id: number) {
  try {
    deleteRestaurantRegion(id)
    revalidatePath("/admin/restaurant-regions")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}
