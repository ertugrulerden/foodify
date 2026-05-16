"use server"

import { revalidatePath } from "next/cache"
import { createUserFav, deleteUserFav } from "@/lib/data/queries"

export async function createUserFavAction(formData: FormData) {
  const userID = Number(formData.get("userID"))
  const productID = Number(formData.get("productID"))
  createUserFav({ userID, productID })
  revalidatePath("/admin/user-favs")
}

export async function deleteUserFavAction(formData: FormData) {
  const favID = Number(formData.get("favID"))
  deleteUserFav(favID)
  revalidatePath("/admin/user-favs")
}
