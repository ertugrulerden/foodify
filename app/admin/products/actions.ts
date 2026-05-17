"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/data/queries"

export async function saveProductAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const restaurantID = Number(formData.get("restaurantID"))
  const name = formData.get("name") as string
  const image = formData.get("image") as string | null
  const description = formData.get("description") as string | null
  try {
    if (id) {
      updateProduct(Number(id), { restaurantID, name, image, description })
      revalidatePath("/admin/products")
      return { success: true, msg: `Updated '${name}'` }
    }
    createProduct({ restaurantID, name, image, description })
    revalidatePath("/admin/products")
    return { success: true, msg: `Created '${name}'` }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteProductAction(id: number) {
  try {
    deleteProduct(id)
    revalidatePath("/admin/products")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
