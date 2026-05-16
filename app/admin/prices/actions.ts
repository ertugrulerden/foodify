"use server"

import { revalidatePath } from "next/cache"
import { createPrice, updatePrice, deletePrice } from "@/lib/data/queries"

export async function createPriceAction(formData: FormData) {
  const productID = Number(formData.get("productID"))
  const platformID = Number(formData.get("platformID"))
  const price = Number(formData.get("price"))
  createPrice({ productID, platformID, price })
  revalidatePath("/admin/prices")
}

export async function updatePriceAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const productID = Number(formData.get("productID"))
  const platformID = Number(formData.get("platformID"))
  const price = Number(formData.get("price"))
  updatePrice(id, { productID, platformID, price })
  revalidatePath("/admin/prices")
}

export async function deletePriceAction(id: number) {
  deletePrice(id)
  revalidatePath("/admin/prices")
}
