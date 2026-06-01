import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "foodify.db")
const db = new Database(dbPath)

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Eski veritabani dosyasi varsa silmeden, eksik alanlari uygulama acilirken tamamliyorum.
function hasColumn(table: string, column: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]
  return columns.some((c) => c.name === column)
}

function hasTable(table: string) {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)
  return Boolean(row)
}

// Kayitli adres tablosu yoksa burada olusturulur.
db.exec(`
  CREATE TABLE IF NOT EXISTS userAddresses (
    addressID INTEGER PRIMARY KEY,
    userID INTEGER NOT NULL,
    regionID INTEGER NOT NULL,
    title TEXT NOT NULL,
    detail TEXT,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (regionID) REFERENCES region(regionID)
  );
`)

// Eski DB dosyalarinda eksik kullanici alanlari varsa burada ekleniyor.
if (hasTable("users") && !hasColumn("users", "firstName")) {
  db.exec("ALTER TABLE users ADD COLUMN firstName TEXT NOT NULL DEFAULT ''")
}

if (hasTable("users") && !hasColumn("users", "lastName")) {
  db.exec("ALTER TABLE users ADD COLUMN lastName TEXT NOT NULL DEFAULT ''")
}

if (hasTable("restaurants") && !hasColumn("restaurants", "isActive")) {
  db.exec("ALTER TABLE restaurants ADD COLUMN isActive INTEGER NOT NULL DEFAULT 1")
}

if (hasTable("restaurants") && !hasColumn("restaurants", "sourceHash")) {
  // Ayni restorani tekrar tekrar acmamak icin scrape kaynagina gore takip anahtari.
  db.exec("ALTER TABLE restaurants ADD COLUMN sourceHash TEXT")
}

if (hasTable("restaurants") && !hasColumn("restaurants", "image")) {
  // Restoran kartinda varsa scrape edilen restoran/listing gorselini kullaniyorum.
  db.exec("ALTER TABLE restaurants ADD COLUMN image TEXT")
}

if (hasTable("details") && !hasColumn("details", "deliveryTime")) {
  // Teslim suresi urune degil restoran-platform detayina ait.
  db.exec("ALTER TABLE details ADD COLUMN deliveryTime TEXT")
}

if (hasTable("details") && !hasColumn("details", "minCart")) {
  // Minimum sepet de restoran-platform detayinda tutuluyor.
  db.exec("ALTER TABLE details ADD COLUMN minCart REAL")
}

if (hasTable("details") && !hasColumn("details", "sourceLink")) {
  // Platformun gercek kaynak linki varsa burada saklaniyor.
  db.exec("ALTER TABLE details ADD COLUMN sourceLink TEXT")
}

if (hasTable("details") && !hasColumn("details", "isSynthetic")) {
  // Demo platform satirlarini gercek linkli veriden ayirmak icin kullaniyorum.
  db.exec("ALTER TABLE details ADD COLUMN isSynthetic INTEGER NOT NULL DEFAULT 0")
}

export default db
