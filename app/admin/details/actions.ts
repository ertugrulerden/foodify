"use server"

import { revalidatePath } from "next/cache"
import { createDetail, updateDetail, deleteDetail } from "@/lib/data/queries"

export async function saveDetailAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const restaurantID = Number(formData.get("restaurantID"))
  const platformID = Number(formData.get("platformID"))
  const ratingValue = formData.get("rating")
  const rating = ratingValue === null || ratingValue === "" ? null : Number(ratingValue)
  const feeValue = formData.get("fee")
  const fee = feeValue === null || feeValue === "" ? null : Number(feeValue)
  const deliveryTime = (formData.get("deliveryTime") as string | null) || null
  const minCartValue = formData.get("minCart")
  const minCart = minCartValue === null || minCartValue === "" ? null : Number(minCartValue)
  const sourceLink = (formData.get("sourceLink") as string | null) || null
  try {
    if (id) {
      updateDetail(Number(id), { restaurantID, platformID, rating, fee, deliveryTime, minCart, sourceLink })
      revalidatePath("/admin/details")
      return { success: true, msg: "Updated" }
    }
    createDetail({ restaurantID, platformID, rating, fee, deliveryTime, minCart, sourceLink })
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
