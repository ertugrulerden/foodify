"use server"

import { revalidatePath } from "next/cache"
import { createUser, updateUser, deleteUser } from "@/lib/data/queries"

export async function saveUserAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const email = formData.get("email") as string
  const passwordHash = formData.get("passwordHash") as string
  const lastRegionID = Number(formData.get("lastRegionID"))
  try {
    if (id) {
      updateUser(Number(id), { email, passwordHash, lastRegionID })
      revalidatePath("/admin/users")
      return { success: true, msg: `Updated '${email}'` }
    }
    createUser({ email, passwordHash, lastRegionID })
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
