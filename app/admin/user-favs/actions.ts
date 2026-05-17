"use server"

import { revalidatePath } from "next/cache"
import { createUserFav, deleteUserFav } from "@/lib/data/queries"

export async function saveUserFavAction(prevState: unknown, formData: FormData) {
  const userID = Number(formData.get("userID"))
  const productID = Number(formData.get("productID"))
  try {
    createUserFav({ userID, productID })
    revalidatePath("/admin/user-favs")
    return { success: true, msg: "Created" }
  } catch {
    return { success: false, error: "Duplicate or data conflict" }
  }
}

export async function deleteUserFavAction(id: number) {
  try {
    deleteUserFav(id)
    revalidatePath("/admin/user-favs")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}
