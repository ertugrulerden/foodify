"use server"

import { revalidatePath } from "next/cache"
import { createDetail, updateDetail, deleteDetail } from "@/lib/data/queries"

export async function saveDetailAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const restaurantID = Number(formData.get("restaurantID"))
  const platformID = Number(formData.get("platformID"))
  const rating = Number(formData.get("rating"))
  const fee = Number(formData.get("fee"))
  try {
    if (id) {
      updateDetail(Number(id), { restaurantID, platformID, rating, fee })
      revalidatePath("/admin/details")
      return { success: true, msg: "Updated" }
    }
    createDetail({ restaurantID, platformID, rating, fee })
    revalidatePath("/admin/details")
    return { success: true, msg: "Created" }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteDetailAction(id: number) {
  try {
    deleteDetail(id)
    revalidatePath("/admin/details")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
