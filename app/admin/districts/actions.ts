"use server"

import { revalidatePath } from "next/cache"
import { createDistrict, updateDistrict, deleteDistrict } from "@/lib/data/queries"

export async function saveDistrictAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const district = formData.get("district") as string
  const cityID = Number(formData.get("cityID"))
  try {
    if (id) {
      updateDistrict(Number(id), { district, cityID })
      revalidatePath("/admin/districts")
      return { success: true, msg: `Updated '${district}'` }
    }
    createDistrict({ district, cityID })
    revalidatePath("/admin/districts")
    return { success: true, msg: `Created '${district}'` }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteDistrictAction(id: number) {
  try {
    deleteDistrict(id)
    revalidatePath("/admin/districts")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
