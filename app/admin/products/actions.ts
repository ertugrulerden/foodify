"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/data/queries"

export async function createProductAction(formData: FormData) {
  const restaurantID = Number(formData.get("restaurantID"))
  const name = formData.get("name") as string
  const image = formData.get("image") as string | null
  const description = formData.get("description") as string | null
  createProduct({ restaurantID, name, image, description })
  revalidatePath("/admin/products")
}

export async function updateProductAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const restaurantID = Number(formData.get("restaurantID"))
  const name = formData.get("name") as string
  const image = formData.get("image") as string | null
  const description = formData.get("description") as string | null
  updateProduct(id, { restaurantID, name, image, description })
  revalidatePath("/admin/products")
}

export async function deleteProductAction(id: number) {
  deleteProduct(id)
  revalidatePath("/admin/products")
}
