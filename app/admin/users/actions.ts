"use server"

import { revalidatePath } from "next/cache"
import { hashPassword } from "@/lib/auth/password"
import { createUser, updateUser, deleteUser, getUserById } from "@/lib/data/queries"

export async function saveUserAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const firstName = formData.get("firstName") as string || ""
  const lastName = formData.get("lastName") as string || ""
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const lastRegionID = Number(formData.get("lastRegionID"))
  try {
    if (id) {
      const existing = getUserById(Number(id))
      if (!existing) return { success: false, error: "User not found" }
      // Admin edit ekraninda sifre bos birakilirsa mevcut hash korunur.
      updateUser(Number(id), {
        firstName,
        lastName,
        email,
        passwordHash: password ? hashPassword(password) : existing.passwordHash,
        lastRegionID,
      })
      revalidatePath("/admin/users")
      return { success: true, msg: `Updated '${email}'` }
    }
    if (!password) return { success: false, error: "Password is required" }
    // Yeni admin kullanicisi olustururken sifre hashlenerek kaydedilir.
    createUser({ firstName, lastName, email, passwordHash: hashPassword(password), lastRegionID })
    revalidatePath("/admin/users")
    return { success: true, msg: `Created '${email}'` }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteUserAction(id: number) {
  try {
    deleteUser(id)
    revalidatePath("/admin/users")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
