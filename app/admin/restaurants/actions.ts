"use server"

import { revalidatePath } from "next/cache"
import { createRestaurant, updateRestaurant, deleteRestaurant } from "@/lib/data/queries"

export async function createRestaurantAction(formData: FormData) {
  const name = formData.get("name") as string
  createRestaurant(name)
  revalidatePath("/admin/restaurants")
}

export async function updateRestaurantAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string
  updateRestaurant(id, name)
  revalidatePath("/admin/restaurants")
}

export async function deleteRestaurantAction(id: number) {
  deleteRestaurant(id)
  revalidatePath("/admin/restaurants")
}
