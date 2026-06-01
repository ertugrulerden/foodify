import Database from "better-sqlite3"
import path from "path"

const db = new Database(path.join(process.cwd(), "foodify.db"))

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

function hasColumn(table, column) {
  return db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column)
}

if (!hasColumn("details", "isSynthetic")) {
  db.exec("ALTER TABLE details ADD COLUMN isSynthetic INTEGER NOT NULL DEFAULT 0")
}

const platformConfigs = [
  { name: "GetirYemek", priceBase: 0.98, priceSpread: 0.12, ratingDelta: 0.06, feeDelta: -4, timeDelta: -4, minCartBase: 0.9 },
  { name: "Uber Eats", priceBase: 1.03, priceSpread: 0.14, ratingDelta: 0.02, feeDelta: 2, timeDelta: 2, minCartBase: 1.05 },
  { name: "MigrosYemek", priceBase: 0.96, priceSpread: 0.16, ratingDelta: -0.03, feeDelta: -2, timeDelta: 4, minCartBase: 0.95 },
]
const minSyntheticPrice = 10

function hashNumber(input) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash >>> 0)
}

function ratio(seed) {
  return (hashNumber(seed) % 1000) / 1000
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function roundMoney(value) {
  return Math.round(value * 100) / 100
}

function roundMenuPrice(value, seed) {
  const endings = [0, 0.5, 0.99]
  const whole = Math.max(minSyntheticPrice, Math.floor(value))
  return roundMoney(whole + endings[hashNumber(seed) % endings.length])
}

function adjustDeliveryTime(value, delta) {
  if (!value) return null
  const parts = String(value).match(/\d+/g)
  if (!parts || parts.length === 0) return value

  if (parts.length === 1) return String(Math.max(5, Number(parts[0]) + delta))

  const start = Math.max(5, Number(parts[0]) + delta)
  const end = Math.max(start + 5, Number(parts[1]) + delta)
  return `${start}-${end}`
}

function ensurePlatform(name) {
  const existing = db.prepare("SELECT platformID FROM platforms WHERE platform = ?").get(name)
  if (existing) return existing.platformID
  return db.prepare("INSERT INTO platforms (platform) VALUES (?) RETURNING platformID").get(name).platformID
}

const run = db.transaction(() => {
  const yemeksepetiID = ensurePlatform("Yemeksepeti")
  const platformIDs = new Map(platformConfigs.map((config) => [config.name, ensurePlatform(config.name)]))

  // Eski elle girilmis/demo Getir-Uber satirlarini temizleyip her calismada ayni synthetic veriyi yeniden kuruyoruz.
  for (const platformID of platformIDs.values()) {
    db.prepare("DELETE FROM prices WHERE platformID = ?").run(platformID)
    db.prepare("DELETE FROM details WHERE platformID = ?").run(platformID)
  }

  db.prepare("UPDATE details SET isSynthetic = 0 WHERE platformID = ?").run(yemeksepetiID)

  const yemeksepetiDetails = db.prepare(`
    SELECT restaurantID, rating, fee, deliveryTime, minCart
    FROM details
    WHERE platformID = ?
      AND sourceLink IS NOT NULL
      AND TRIM(sourceLink) != ''
  `).all(yemeksepetiID)

  const yemeksepetiPrices = db.prepare(`
    SELECT products.restaurantID, prices.productID, prices.price, prices.lastUpdated
    FROM prices
    JOIN products ON products.productID = prices.productID
    WHERE prices.platformID = ?
      AND prices.price >= ?
      AND EXISTS (
        SELECT 1
        FROM details
        WHERE details.restaurantID = products.restaurantID
          AND details.platformID = ?
      )
  `).all(yemeksepetiID, minSyntheticPrice, yemeksepetiID)

  const insertDetail = db.prepare(`
    INSERT INTO details (restaurantID, platformID, rating, fee, deliveryTime, minCart, sourceLink, isSynthetic)
    VALUES (?, ?, ?, ?, ?, ?, NULL, 1)
  `)
  const insertPrice = db.prepare(`
    INSERT INTO prices (productID, platformID, price, lastUpdated)
    VALUES (?, ?, ?, ?)
  `)

  const stats = []

  for (const config of platformConfigs) {
    const platformID = platformIDs.get(config.name)
    let detailsCreated = 0
    let pricesCreated = 0

    for (const detail of yemeksepetiDetails) {
      const seed = `${config.name}:${detail.restaurantID}`
      const ratingJitter = (ratio(`${seed}:rating`) - 0.5) * 0.16
      const feeJitter = Math.round((ratio(`${seed}:fee`) - 0.5) * 8)
      const cartJitter = 0.9 + ratio(`${seed}:cart`) * 0.2

      const rating = detail.rating == null
        ? null
        : Math.round(clamp(detail.rating + config.ratingDelta + ratingJitter, 3.2, 5) * 10) / 10
      const fee = detail.fee == null ? null : roundMoney(Math.max(0, detail.fee + config.feeDelta + feeJitter))
      const minCart = detail.minCart == null ? null : Math.round(Math.max(0, detail.minCart * config.minCartBase * cartJitter))
      const deliveryTime = adjustDeliveryTime(detail.deliveryTime, config.timeDelta + Math.round((ratio(`${seed}:time`) - 0.5) * 8))

      insertDetail.run(detail.restaurantID, platformID, rating, fee, deliveryTime, minCart)
      detailsCreated++
    }

    for (const price of yemeksepetiPrices) {
      const priceRatio = config.priceBase + (ratio(`${config.name}:${price.productID}:price`) - 0.5) * config.priceSpread
      // Scrape/parse kaynakli 0-1 TL gibi fiyatlardan demo platform fiyati uretmiyoruz; kalanlarda alt siniri koruyoruz.
      const syntheticPrice = roundMenuPrice(Math.max(minSyntheticPrice, price.price * priceRatio), `${config.name}:${price.productID}:ending`)
      insertPrice.run(price.productID, platformID, syntheticPrice, price.lastUpdated)
      pricesCreated++
    }

    stats.push({ platform: config.name, detailsCreated, pricesCreated })
  }

  return stats
})

const stats = run()
console.log("Synthetic platform seed tamamlandi:")
console.table(stats)

db.close()
