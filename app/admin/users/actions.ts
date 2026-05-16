"use server"

import { revalidatePath } from "next/cache"
import { createUser, updateUser, deleteUser } from "@/lib/data/queries"

export async function createUserAction(formData: FormData) {
  const email = formData.get("email") as string
  const passwordHash = formData.get("passwordHash") as string
  const lastRegionID = Number(formData.get("lastRegionID"))
  createUser({ email, passwordHash, lastRegionID })
  revalidatePath("/admin/users")
}

export async function updateUserAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const email = formData.get("email") as string
  const passwordHash = formData.get("passwordHash") as string
  const lastRegionID = Number(formData.get("lastRegionID"))
  updateUser(id, { email, passwordHash, lastRegionID })
  revalidatePath("/admin/users")
}

export async function deleteUserAction(id: number) {
  deleteUser(id)
  revalidatePath("/admin/users")
}
