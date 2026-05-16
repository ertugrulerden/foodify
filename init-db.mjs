import Database from 'better-sqlite3'
const db = new Database('./foodify.db')
db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (restaurantID INTEGER PRIMARY KEY, name TEXT, isActive INTEGER DEFAULT 1);
  CREATE TABLE IF NOT EXISTS platforms (platformID INTEGER PRIMARY KEY, platform TEXT);
  CREATE TABLE IF NOT EXISTS products (productID INTEGER PRIMARY KEY, restaurantID INTEGER, name TEXT, image TEXT, description TEXT);
  CREATE TABLE IF NOT EXISTS prices (id INTEGER PRIMARY KEY, productID INTEGER, platformID INTEGER, price REAL, lastUpdated TEXT);
  CREATE TABLE IF NOT EXISTS details (id INTEGER PRIMARY KEY, restaurantID INTEGER, platformID INTEGER, rating REAL, fee REAL);
  CREATE TABLE IF NOT EXISTS restaurantregion (restaurantID INTEGER, regionID INTEGER, PRIMARY KEY (restaurantID, regionID));
  CREATE TABLE IF NOT EXISTS regions (regionID INTEGER PRIMARY KEY, region TEXT, districtID INTEGER);
  INSERT OR IGNORE INTO platforms VALUES (1, 'Yemeksepeti'), (2, 'Trendyol Yemek'), (3, 'GetirYemek');
  INSERT OR IGNORE INTO restaurants VALUES (1, 'Urfalı Usta', 1), (2, 'Halil Kebap', 1);
  INSERT OR IGNORE INTO products VALUES (1, 1, 'Lahmacun', NULL, 'Kıymalı lahmacun'), (2, 1, 'Dürüm', NULL, 'Tavuk dürüm'), (3, 2, 'İskender', NULL, 'Bursa usulü iskender');
  INSERT OR IGNORE INTO prices VALUES (1, 1, 1, 120, '2026-05-15'), (2, 1, 2, 110, '2026-05-15'), (3, 2, 1, 150, '2026-05-15'), (4, 2, 3, 140, '2026-05-15'), (5, 3, 1, 200, '2026-05-15'), (6, 3, 2, 190, '2026-05-15');
  INSERT OR IGNORE INTO details VALUES (1, 1, 1, 4.5, 20), (2, 1, 2, 4.3, 15), (3, 2, 1, 4.8, 25);
  INSERT OR IGNORE INTO regions VALUES (1, 'Kadıköy', 1);
  INSERT OR IGNORE INTO restaurantregion VALUES (1, 1), (2, 1);
`)
console.log('Veritabanı oluşturuldu!')
db.close()