import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "foodify.db")
const db = new Database(dbPath)

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Mevcut local DB'yi silmeden yeni kolonlari/taraf tablolari desteklemek icin runtime uyumluluk kontrolu.
function hasColumn(table: string, column: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]
  return columns.some((c) => c.name === column)
}

function hasTable(table: string) {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)
  return Boolean(row)
}

// Kayitli adresler yeni eklendigi icin tablo yoksa uygulama acilisinda olusturuyoruz.
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

// Eski veritabanlari migration calismasa bile uygulamanin bekledigi kullanici alanlarini kazanir.
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
  // Scrape importu ayni restorani farkli bolgelerde tek kayit tutup restaurantRegion ile cogaltmak icin bu anahtari kullanir.
  db.exec("ALTER TABLE restaurants ADD COLUMN sourceHash TEXT")
}

if (hasTable("restaurants") && !hasColumn("restaurants", "image")) {
  // Populer restoran kartlari urun fotografi yerine scrape edilen restoran/listing gorselini kullanir.
  db.exec("ALTER TABLE restaurants ADD COLUMN image TEXT")
}

if (hasTable("details") && !hasColumn("details", "deliveryTime")) {
  // Yemeksepeti verisindeki teslimat suresi platform detayina aittir; urun tablosunu sisirmeden burada sakliyoruz.
  db.exec("ALTER TABLE details ADD COLUMN deliveryTime TEXT")
}

if (hasTable("details") && !hasColumn("details", "minCart")) {
  // Minimum sepet tutari da platform/restoran detayidir, arama kartlarinda buradan gosterilir.
  db.exec("ALTER TABLE details ADD COLUMN minCart REAL")
}

if (hasTable("details") && !hasColumn("details", "sourceLink")) {
  // Platform satirina tiklandiginda gidilecek kaynak linki burada tutulur; link yoksa UI tiklanabilir yapmaz.
  db.exec("ALTER TABLE details ADD COLUMN sourceLink TEXT")
}

export default db
