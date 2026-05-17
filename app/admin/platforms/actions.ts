"use server"

import { revalidatePath } from "next/cache"
import { createPlatform, updatePlatform, deletePlatform } from "@/lib/data/queries"

export async function createPlatformAction(formData: FormData) {
  const name = formData.get("name") as string
  createPlatform(name)
  revalidatePath("/admin/platforms")
}

export async function updatePlatformAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string
  updatePlatform(id, name)
  revalidatePath("/admin/platforms")
}

export async function deletePlatformAction(id: number) {
    try {
        deletePlatform(id)
        revalidatePath("/admin/platforms")
        return { success: true }
    } catch {
        return { success: false, error: "This platform has other tables linked to it. Delete those first." }
    }
}
