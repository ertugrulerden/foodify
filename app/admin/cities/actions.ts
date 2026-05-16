"use server"

import { revalidatePath } from "next/cache"
import { createCity, updateCity, deleteCity } from "@/lib/data/queries"

export async function createCityAction(formData: FormData) {
  const city = formData.get("city") as string
  createCity(city)
  revalidatePath("/admin/cities")
}

export async function updateCityAction(formData: FormData) {
  const id = Number(formData.get("id"))
  const city = formData.get("city") as string
  updateCity(id, city)
  revalidatePath("/admin/cities")
}

export async function deleteCityAction(id: number) {
  deleteCity(id)
  revalidatePath("/admin/cities")
}
