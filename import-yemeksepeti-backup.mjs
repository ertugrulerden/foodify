import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import { repairTurkishText } from "./lib/text/repair-turkish-core.mjs"

const dataRoot = path.join(process.cwd(), "data-backup")
const db = new Database(path.join(process.cwd(), "foodify.db"))

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

function hasColumn(table, column) {
  return db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column)
}

function ensureRuntimeColumns() {
  if (!hasColumn("restaurants", "sourceHash")) {
    db.exec("ALTER TABLE restaurants ADD COLUMN sourceHash TEXT")
  }
  if (!hasColumn("restaurants", "image")) {
    db.exec("ALTER TABLE restaurants ADD COLUMN image TEXT")
  }
  if (!hasColumn("details", "deliveryTime")) {
    db.exec("ALTER TABLE details ADD COLUMN deliveryTime TEXT")
  }
  if (!hasColumn("details", "minCart")) {
    db.exec("ALTER TABLE details ADD COLUMN minCart REAL")
  }
  if (!hasColumn("details", "sourceLink")) {
    db.exec("ALTER TABLE details ADD COLUMN sourceLink TEXT")
  }
  if (!hasColumn("details", "isSynthetic")) {
    db.exec("ALTER TABLE details ADD COLUMN isSynthetic INTEGER NOT NULL DEFAULT 0")
  }

  // Import tekrar calistiginda tarama yapmamak icin dogal lookup alanlarini indeksliyoruz.
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      categoryID INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      normalizedName TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS productCategories (
      productID INTEGER NOT NULL,
      categoryID INTEGER NOT NULL,
      PRIMARY KEY (productID, categoryID),
      FOREIGN KEY (productID) REFERENCES products(productID),
      FOREIGN KEY (categoryID) REFERENCES categories(categoryID)
    );
    CREATE INDEX IF NOT EXISTS idx_restaurants_source_hash ON restaurants(sourceHash);
    CREATE INDEX IF NOT EXISTS idx_products_restaurant_name ON products(restaurantID, name);
    CREATE INDEX IF NOT EXISTS idx_prices_product_platform ON prices(productID, platformID);
    CREATE INDEX IF NOT EXISTS idx_details_restaurant_platform ON details(restaurantID, platformID);
    CREATE INDEX IF NOT EXISTS idx_categories_normalized_name ON categories(normalizedName);
    CREATE INDEX IF NOT EXISTS idx_product_categories_category ON productCategories(categoryID, productID);
  `)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function isDirectory(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
}

function walkJsonFiles(dir, matcher, files = []) {
  if (!isDirectory(dir)) return files
  for (const name of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, name)
    if (fs.statSync(fullPath).isDirectory()) {
      walkJsonFiles(fullPath, matcher, files)
    } else if (name.endsWith(".json") && matcher(fullPath)) {
      files.push(fullPath)
    }
  }
  return files
}

function repairPathName(name) {
  // Klasor adlari data-backup veya dis kaynaktan geldiklerinde ortak Turkce onarim katmanindan gecirilir.
  return repairTurkishText(name)
}

function normalizeText(value) {
  return typeof value === "string" ? value.normalize("NFC") : value
}

const excludedProductWords = [
  "poşet",
  "poset",
  "su",
  "soda",
  "ayran",
  "kola",
  "cola",
  "fanta",
  "sprite",
  "pepsi",
  "yedigün",
  "yedigun",
  "7up",
  "gazoz",
  "gazozu",
  "beypazarı",
  "beypazari",
  "sarıyer",
  "sariyer",
  "ice tea",
  "icetea",
  "şalgam",
  "salgam",
  "limonata",
  "meyve suyu",
  "enerji içeceği",
  "enerji icecegi",
  "sos",
  "sosu",
  "ketçap",
  "ketcap",
  "mayonez",
  "hardal",
  "barbekü",
  "barbeku",
  "ranch",
  "sweet chili",
  "honey mustard",
  "acı sos",
  "aci sos",
  "ekstra",
  "turşu",
  "tursu",
  "süt",
  "sut",
  "çay",
  "cay",
  "kahve",
  "coffee",
  "americano",
  "latte",
  "cappuccino",
  "espresso",
  "iced",
  "magnum",
  "dondurma",
  "puding",
  "tatli",
  "tatlı",
  "tatlisi",
  "tatlısı",
  "baklava",
  "cikolata",
  "çikolata",
  "pismaniye",
  "pişmaniye",
  "pismanye",
  "pişmanye",
]

const mainFoodWords = [
  "adana",
  "burger",
  "dürüm",
  "durum",
  "döner",
  "doner",
  "kebap",
  "kofte",
  "köfte",
  "lahmacun",
  "makarna",
  "pide",
  "pizza",
  "sandvic",
  "sandviç",
  "snitzel",
  "şnitzel",
  "tavuk",
  "tost",
  "bowl",
]

function normalizeProductText(value) {
  return value
    .normalize("NFC")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
}

function normalizeCategoryKey(value) {
  return normalizeProductText(repairTurkishText(normalizeText(value) ?? ""))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

function isMenuCategoryName(value) {
  return ["menuler", "menu"].includes(normalizeCategoryKey(value))
}

function hasProductTerm(normalizedText, term) {
  const normalizedTerm = normalizeProductText(term)
  const tokenizedText = ` ${normalizedText.replace(/[^\p{L}\p{N}]+/gu, " ")} `
  const tokenizedTerm = ` ${normalizedTerm.replace(/[^\p{L}\p{N}]+/gu, " ").trim()} `
  return tokenizedText.includes(tokenizedTerm)
}

function isNonListableProductName(name) {
  const normalized = normalizeProductText(name)
  return excludedProductWords.some((word) => hasProductTerm(normalized, word))
}

function isStandaloneNonListableProductName(name) {
  const normalized = normalizeProductText(name)
  if (!isNonListableProductName(normalized)) return false

  // Menuler kategorisindeki yemek + icecek setleri korunur; tekil icecek/tatli/yan urunler yine temizlenir.
  return !mainFoodWords.some((word) => hasProductTerm(normalized, word))
}

function parseLocationSegment(segment) {
  const match = segment.match(/^(\d+)-(.+)$/)
  if (!match) return null
  return { id: Number(match[1]), name: repairPathName(match[2]) }
}

function locationFromScraperFile(filePath) {
  const parts = path.relative(dataRoot, filePath).split(path.sep)
  const city = parseLocationSegment(parts[0] ?? "")
  const district = parseLocationSegment(parts[1] ?? "")
  const region = parseLocationSegment(parts[2] ?? "")
  if (!city || !district || !region) return null
  return { city, district, region }
}

function isUsableImage(image) {
  // Foodora/Yemeksepeti placeholder logosunu urun fotografi gibi DB'ye basmiyoruz.
  return typeof image === "string" && image.trim() !== "" && !image.includes("micro-assets.foodora.com")
}

function normalizeDeliveryTime(value) {
  if (!value) return null
  return String(value).replace(/\s*min$/i, "").trim()
}

function asNumberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function normalizeScrapedProductPrice(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null

  // Yemeksepeti fiyatlarinda 1.400 TL gibi binlik ayiraci bazen JSON'a 1.4 olarak dusmus.
  // Posetleri zaten ayikladigimiz icin 10 TL altindaki urun fiyatlarini binlik format kabul ediyoruz.
  if (value > 0 && value < 10) return Math.round(value * 1000 * 100) / 100

  return value
}

ensureRuntimeColumns()

const insertCity = db.prepare("INSERT INTO city (cityID, city) VALUES (?, ?) ON CONFLICT(cityID) DO UPDATE SET city = excluded.city")
const insertDistrict = db.prepare("INSERT INTO district (districtID, district, cityID) VALUES (?, ?, ?) ON CONFLICT(districtID) DO UPDATE SET district = excluded.district, cityID = excluded.cityID")
const insertRegion = db.prepare("INSERT INTO region (regionID, region, districtID) VALUES (?, ?, ?) ON CONFLICT(regionID) DO UPDATE SET region = excluded.region, districtID = excluded.districtID")
const insertPlatform = db.prepare("INSERT INTO platforms (platform) VALUES (?) RETURNING platformID")
const insertRestaurant = db.prepare("INSERT INTO restaurants (name, isActive, sourceHash, image) VALUES (?, 1, ?, ?) RETURNING restaurantID")
const updateRestaurantName = db.prepare("UPDATE restaurants SET name = ?, image = COALESCE(?, image) WHERE restaurantID = ?")
const insertRestaurantRegion = db.prepare("INSERT OR IGNORE INTO restaurantRegion (restaurantID, regionID) VALUES (?, ?)")
const insertDetail = db.prepare("INSERT INTO details (restaurantID, platformID, rating, fee, deliveryTime, minCart, sourceLink, isSynthetic) VALUES (?, ?, ?, ?, ?, ?, ?, 0)")
const updateDetail = db.prepare("UPDATE details SET rating = ?, fee = ?, deliveryTime = ?, minCart = ?, sourceLink = COALESCE(?, sourceLink), isSynthetic = 0 WHERE id = ?")
const insertProduct = db.prepare("INSERT INTO products (restaurantID, name, image, description) VALUES (?, ?, ?, ?) RETURNING productID")
const updateProduct = db.prepare("UPDATE products SET name = ?, image = COALESCE(?, image), description = COALESCE(NULLIF(?, ''), description) WHERE productID = ?")
const upsertCategory = db.prepare("INSERT INTO categories (name, normalizedName) VALUES (?, ?) ON CONFLICT(normalizedName) DO UPDATE SET name = excluded.name RETURNING categoryID")
const insertProductCategory = db.prepare("INSERT OR IGNORE INTO productCategories (productID, categoryID) VALUES (?, ?)")
const insertPrice = db.prepare("INSERT INTO prices (productID, platformID, price, lastUpdated) VALUES (?, ?, ?, ?)")
const updatePrice = db.prepare("UPDATE prices SET price = ?, lastUpdated = ? WHERE id = ?")

function cleanupIgnoredProducts() {
  // Teknik/yan ürünler arama ve popüler listelerde ürün gibi görünmemeli.
  const ids = db.prepare(`
    SELECT products.productID, products.name,
      EXISTS (
      SELECT 1
      FROM productCategories
      JOIN categories ON categories.categoryID = productCategories.categoryID
      WHERE productCategories.productID = products.productID
        AND categories.normalizedName IN ('menuler', 'menu')
    ) AS isMenuCategory
    FROM products
  `).all()
    .filter((row) => {
      const productName = normalizeText(row.name) ?? ""
      return row.isMenuCategory
        ? isStandaloneNonListableProductName(productName)
        : isNonListableProductName(productName)
    })
    .map((row) => row.productID)
  if (ids.length === 0) return 0
  for (let i = 0; i < ids.length; i += 500) {
    const chunk = ids.slice(i, i + 500)
    const placeholders = chunk.map(() => "?").join(", ")
    db.prepare(`DELETE FROM userFavs WHERE productID IN (${placeholders})`).run(...chunk)
    db.prepare(`DELETE FROM prices WHERE productID IN (${placeholders})`).run(...chunk)
    db.prepare(`DELETE FROM productCategories WHERE productID IN (${placeholders})`).run(...chunk)
    db.prepare(`DELETE FROM products WHERE productID IN (${placeholders})`).run(...chunk)
  }
  return ids.length
}

const platformCache = new Map(db.prepare("SELECT platformID, platform FROM platforms").all().map((row) => [row.platform, row.platformID]))
const restaurantCache = new Map(db.prepare("SELECT restaurantID, sourceHash FROM restaurants WHERE sourceHash IS NOT NULL").all().map((row) => [row.sourceHash, row.restaurantID]))
const detailCache = new Map(db.prepare("SELECT id, restaurantID, platformID FROM details").all().map((row) => [`${row.restaurantID}:${row.platformID}`, row.id]))
const productCache = new Map(db.prepare("SELECT productID, restaurantID, name FROM products").all().map((row) => [`${row.restaurantID}:${normalizeText(row.name)}`, row.productID]))
const priceCache = new Map(db.prepare("SELECT id, productID, platformID FROM prices").all().map((row) => [`${row.productID}:${row.platformID}`, row.id]))
const categoryCache = new Map(db.prepare("SELECT categoryID, normalizedName FROM categories").all().map((row) => [row.normalizedName, row.categoryID]))

const stats = {
  restaurantsSeen: 0,
  restaurantsCreated: 0,
  restaurantRegionsLinked: 0,
  productsSeen: 0,
  productsCreated: 0,
  pricesUpserted: 0,
  realImagesUsed: 0,
  defaultImageFallbacks: 0,
  categoriesLinked: 0,
  ignoredProductsRemoved: 0,
  ignoredProductsSkipped: 0,
}

function ensurePlatform(name) {
  const cached = platformCache.get(name)
  if (cached) return cached
  const platformID = insertPlatform.get(name).platformID
  platformCache.set(name, platformID)
  return platformID
}

function ensureLocation(location) {
  insertCity.run(location.city.id, location.city.name)
  insertDistrict.run(location.district.id, location.district.name, location.city.id)
  insertRegion.run(location.region.id, location.region.name, location.district.id)
}

function ensureRestaurant(name, sourceHash, image = null) {
  const normalizedName = normalizeText(name)
  const restaurantImage = isUsableImage(image) ? image : null
  const cached = restaurantCache.get(sourceHash)
  if (cached) {
    updateRestaurantName.run(normalizedName, restaurantImage, cached)
    return cached
  }
  stats.restaurantsCreated++
  const restaurantID = insertRestaurant.get(normalizedName, sourceHash, restaurantImage).restaurantID
  restaurantCache.set(sourceHash, restaurantID)
  return restaurantID
}

function upsertDetail(restaurantID, platformID, restaurant) {
  const rating = asNumberOrNull(restaurant.rating)
  const fee = asNumberOrNull(restaurant.fee)
  const deliveryTime = normalizeDeliveryTime(restaurant.delivery_time)
  const minCart = asNumberOrNull(restaurant.min_cart)
  const sourceLink = normalizeText(restaurant.link) ?? null
  const key = `${restaurantID}:${platformID}`
  const existing = detailCache.get(key)

  // Ayni restoran birden fazla bolgede gelirse tek platform detay kaydini son scrape bilgisiyle guncelliyoruz.
  if (existing) {
    updateDetail.run(rating, fee, deliveryTime, minCart, sourceLink, existing)
  } else {
    const info = insertDetail.run(restaurantID, platformID, rating, fee, deliveryTime, minCart, sourceLink)
    detailCache.set(key, Number(info.lastInsertRowid))
  }
}

function shouldSkipProduct(productName) {
  return isNonListableProductName(normalizeText(productName) ?? "")
}

function shouldSkipMenuCategoryProduct(productName) {
  return isStandaloneNonListableProductName(normalizeText(productName) ?? "")
}

function upsertProduct(restaurantID, product) {
  const productName = normalizeText(product.name)
  const description = normalizeText(product.description) ?? null
  const image = isUsableImage(product.img) ? product.img : null
  if (image) stats.realImagesUsed++
  else stats.defaultImageFallbacks++

  const key = `${restaurantID}:${productName}`
  const existing = productCache.get(key)
  if (existing) {
    updateProduct.run(productName, image, description ?? "", existing)
    return existing
  }

  stats.productsCreated++
  const productID = insertProduct.get(restaurantID, productName, image, description).productID
  productCache.set(key, productID)
  return productID
}

function ensureCategory(name) {
  const categoryName = repairTurkishText(normalizeText(name) ?? "").trim()
  const normalizedName = normalizeCategoryKey(categoryName)
  if (!categoryName || !normalizedName) return null
  const cached = categoryCache.get(normalizedName)
  if (cached) return cached

  // Scrape'deki kategori adini ayri tutuyoruz; Populer Menuler gibi alanlar artik urun adindan tahmin edilmeyecek.
  const categoryID = upsertCategory.get(categoryName, normalizedName).categoryID
  categoryCache.set(normalizedName, categoryID)
  return categoryID
}

function upsertPrice(productID, platformID, price, scrapedAt) {
  const key = `${productID}:${platformID}`
  const existing = priceCache.get(key)
  if (existing) {
    updatePrice.run(price, scrapedAt, existing)
  } else {
    const info = insertPrice.run(productID, platformID, price, scrapedAt)
    priceCache.set(key, Number(info.lastInsertRowid))
  }
  stats.pricesUpserted++
}

function importRestaurants(platformID) {
  const files = walkJsonFiles(dataRoot, (filePath) => path.basename(filePath) === "restaurants.json")
  for (const filePath of files) {
    const location = locationFromScraperFile(filePath)
    if (!location) continue
    ensureLocation(location)

    for (const restaurant of readJson(filePath)) {
      if (!restaurant.link_hash) continue
      stats.restaurantsSeen++
      const restaurantID = ensureRestaurant(restaurant.name, restaurant.link_hash, restaurant.image)
      insertRestaurantRegion.run(restaurantID, location.region.id)
      stats.restaurantRegionsLinked++
      upsertDetail(restaurantID, platformID, restaurant)
    }
  }
}

function importProducts(platformID) {
  const files = walkJsonFiles(dataRoot, (filePath) => filePath.includes(`${path.sep}products${path.sep}`))
  for (const filePath of files) {
    const doc = readJson(filePath)
    if (!doc.link_hash) continue
    const restaurantID = ensureRestaurant(doc.restaurant_name, doc.link_hash)

    for (const category of doc.categories ?? []) {
      const categoryID = ensureCategory(category.name)
      const isMenuCategory = isMenuCategoryName(category.name)
      for (const product of category.products ?? []) {
        const normalizedPrice = normalizeScrapedProductPrice(product.price)
        if (!product.name || normalizedPrice === null) continue
        if (isMenuCategory ? shouldSkipMenuCategoryProduct(product.name) : shouldSkipProduct(product.name)) {
          stats.ignoredProductsSkipped++
          continue
        }
        stats.productsSeen++
        const productID = upsertProduct(restaurantID, product)
        if (categoryID) {
          insertProductCategory.run(productID, categoryID)
          stats.categoriesLinked++
        }
        upsertPrice(productID, platformID, normalizedPrice, doc.scraped_at ?? null)
      }
    }
  }
}

const run = db.transaction(() => {
  stats.ignoredProductsRemoved = cleanupIgnoredProducts()
  const platformID = ensurePlatform("Yemeksepeti")
  importRestaurants(platformID)
  importProducts(platformID)
})

run()
db.close()

console.log("Yemeksepeti data-backup import tamamlandi:")
console.table(stats)
