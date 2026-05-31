"use server"

import { revalidatePath } from "next/cache"
import { createRestaurant, updateRestaurant, deleteRestaurant } from "@/lib/data/queries"

export async function saveRestaurantAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const name = formData.get("name") as string
  const isActive = formData.get("isActive") === "on"
  try {
    if (id) {
      updateRestaurant(Number(id), name, isActive)
      revalidatePath("/admin/restaurants")
      return { success: true, msg: `Updated '${name}'` }
    }
    createRestaurant(name, isActive)
    revalidatePath("/admin/restaurants")
    return { success: true, msg: `Created '${name}'` }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteRestaurantAction(id: number) {
  try {
    deleteRestaurant(id)
    revalidatePath("/admin/restaurants")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
