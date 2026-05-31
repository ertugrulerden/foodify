export const DEFAULT_PRODUCT_IMAGE = "/placeholder.svg"

export function isUsableProductImage(image?: string | null): image is string {
  if (!image) return false

  // Scrape bazen urun fotografi yerine Yemeksepeti/Foodora logosu donuyor; bunu gercek urun gorseli saymiyoruz.
  return !image.includes("micro-assets.foodora.com")
}

export function getProductImageOrDefault(image?: string | null) {
  // DB'de sadece gercek scrape gorselini saklayip, eksik durumda UI tarafinda ortak default'a dusuyoruz.
  return isUsableProductImage(image) ? image : DEFAULT_PRODUCT_IMAGE
}
