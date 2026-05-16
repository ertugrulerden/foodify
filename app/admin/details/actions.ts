"use server"

import { revalidatePath } from "next/cache"
import { createDetail, updateDetail, deleteDetail } from "@/lib/data/queries"

export async function createDetailAction(formData: FormData) {
  const restaurantID = Number(formData.get("restaurantID"))
  const platformID = Number(formData.get("platformID"))
  const rating = Number(formData.get("rating"))
  const fee = Number(formData.get("fee"))
  createDetail({ restaurantID, platformID, rating, fee })
  revalidatePath("/admin/details")
}

export async function updateDetailAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const restaurantID = Number(formData.get("restaurantID"))
  const platformID = Number(formData.get("platformID"))
  const rating = Number(formData.get("rating"))
  const fee = Number(formData.get("fee"))
  updateDetail(id, { restaurantID, platformID, rating, fee })
  revalidatePath("/admin/details")
}

export async function deleteDetailAction(id: number) {
  deleteDetail(id)
  revalidatePath("/admin/details")
}
