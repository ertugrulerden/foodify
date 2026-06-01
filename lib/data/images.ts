export const DEFAULT_PRODUCT_IMAGE = "/placeholder.svg"

export function isUsableProductImage(image?: string | null): image is string {
  if (!image) return false

  // Scrape bazen urun fotografi yerine platform logosu getiriyor, bunlari urun gorseli saymiyorum.
  return !image.includes("micro-assets.foodora.com")
}

export function getProductImageOrDefault(image?: string | null) {
  // Gorsel yoksa kart tarafinda ortak placeholder'a dusuyorum.
  return isUsableProductImage(image) ? image : DEFAULT_PRODUCT_IMAGE
}
