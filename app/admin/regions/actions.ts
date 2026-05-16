"use server"

import { revalidatePath } from "next/cache"
import { createRegion, updateRegion, deleteRegion } from "@/lib/data/queries"

export async function createRegionAction(formData: FormData) {
  const region = formData.get("region") as string
  const districtID = Number(formData.get("districtID"))
  createRegion({ region, districtID })
  revalidatePath("/admin/regions")
}

export async function updateRegionAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const region = formData.get("region") as string
  const districtID = Number(formData.get("districtID"))
  updateRegion(id, { region, districtID })
  revalidatePath("/admin/regions")
}

export async function deleteRegionAction(id: number) {
  deleteRegion(id)
  revalidatePath("/admin/regions")
}
