"use server"

import { revalidatePath } from "next/cache"
import { createPrice, updatePrice, deletePrice } from "@/lib/data/queries"

export async function savePriceAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const productID = Number(formData.get("productID"))
  const platformID = Number(formData.get("platformID"))
  const price = Number(formData.get("price"))
  try {
    if (id) {
      updatePrice(Number(id), { productID, platformID, price })
      revalidatePath("/admin/prices")
      return { success: true, msg: "Updated" }
    }
    createPrice({ productID, platformID, price })
    revalidatePath("/admin/prices")
    return { success: true, msg: "Created" }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deletePriceAction(id: number) {
  try {
    deletePrice(id)
    revalidatePath("/admin/prices")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
