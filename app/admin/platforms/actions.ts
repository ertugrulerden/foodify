"use server"

import { revalidatePath } from "next/cache"
import { createPlatform, updatePlatform, deletePlatform } from "@/lib/data/queries"

export async function savePlatformAction(prevState: unknown, formData: FormData) {
    const id = formData.get("id")
    try {
      if (id) {
        const name = formData.get("name") as string
        updatePlatform(Number(id), name)
        revalidatePath("/admin/platforms")
        return { success: true, msg: `Updated platform to '${name}'` }

      } else {
        const name = formData.get("name") as string
        createPlatform(name)
        revalidatePath("/admin/platforms")
        return { success: true, msg: `Created platform '${name}'` }

      }
    } catch {
      return { success: false, error: "Operation failed" }
    }
  }

export async function deletePlatformAction(id: number) {
    try {
        deletePlatform(id)
        revalidatePath("/admin/platforms")
        return { success: true, msg: `Platform with id:${id} has been deleted` }
    } catch {
        return { success: false, error: `This platform with id:${id} has other tables linked to it. Delete those first.` }
    }
}
