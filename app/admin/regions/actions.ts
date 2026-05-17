"use server"

import { revalidatePath } from "next/cache"
import { createRegion, updateRegion, deleteRegion } from "@/lib/data/queries"

export async function saveRegionAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const region = formData.get("region") as string
  const districtID = Number(formData.get("districtID"))
  try {
    if (id) {
      updateRegion(Number(id), { region, districtID })
      revalidatePath("/admin/regions")
      return { success: true, msg: `Updated '${region}'` }
    }
    createRegion({ region, districtID })
    revalidatePath("/admin/regions")
    return { success: true, msg: `Created '${region}'` }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteRegionAction(id: number) {
  try {
    deleteRegion(id)
    revalidatePath("/admin/regions")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
