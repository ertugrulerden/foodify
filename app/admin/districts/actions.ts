"use server"

import { revalidatePath } from "next/cache"
import { createDistrict, updateDistrict, deleteDistrict } from "@/lib/data/queries"

export async function createDistrictAction(formData: FormData) {
  const district = formData.get("district") as string
  const cityID = Number(formData.get("cityID"))
  createDistrict({ district, cityID })
  revalidatePath("/admin/districts")
}

export async function updateDistrictAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const district = formData.get("district") as string
  const cityID = Number(formData.get("cityID"))
  updateDistrict(id, { district, cityID })
  revalidatePath("/admin/districts")
}

export async function deleteDistrictAction(id: number) {
  deleteDistrict(id)
  revalidatePath("/admin/districts")
}
