"use server"

import { revalidatePath } from "next/cache"
import { createCity, updateCity, deleteCity } from "@/lib/data/queries"

export async function saveCityAction(prevState: unknown, formData: FormData) {
  const id = formData.get("id")
  const city = formData.get("city") as string
  try {
    if (id) {
      updateCity(Number(id), city)
      revalidatePath("/admin/cities")
      return { success: true, msg: `Updated '${city}'` }
    }
    createCity(city)
    revalidatePath("/admin/cities")
    return { success: true, msg: `Created '${city}'` }
  } catch {
    return { success: false, error: "Operation failed" }
  }
}

export async function deleteCityAction(id: number) {
  try {
    deleteCity(id)
    revalidatePath("/admin/cities")
    return { success: true, msg: "Deleted" }
  } catch {
    return { success: false, error: "Has linked records. Delete those first." }
  }
}
