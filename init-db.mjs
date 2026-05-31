import Database from 'better-sqlite3'
const db = new Database('./foodify.db')

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

db.exec(`
  CREATE TABLE IF NOT EXISTS city (
    cityID INTEGER PRIMARY KEY,
    city TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS district (
    districtID INTEGER PRIMARY KEY,
    district TEXT NOT NULL,
    cityID INTEGER NOT NULL,
    FOREIGN KEY (cityID) REFERENCES city(cityID)
  );

  CREATE TABLE IF NOT EXISTS region (
    regionID INTEGER PRIMARY KEY,
    region TEXT NOT NULL,
    districtID INTEGER NOT NULL,
    FOREIGN KEY (districtID) REFERENCES district(districtID)
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    restaurantID INTEGER PRIMARY KEY,
    name TEXT,
    isActive INTEGER DEFAULT 1,
    sourceHash TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS restaurantRegion (
    restaurantID INTEGER NOT NULL,
    regionID INTEGER NOT NULL,
    PRIMARY KEY (restaurantID, regionID),
    FOREIGN KEY (restaurantID) REFERENCES restaurants(restaurantID),
    FOREIGN KEY (regionID) REFERENCES region(regionID)
  );

  CREATE TABLE IF NOT EXISTS platforms (
    platformID INTEGER PRIMARY KEY,
    platform TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    productID INTEGER PRIMARY KEY,
    restaurantID INTEGER,
    name TEXT,
    image TEXT,
    description TEXT,
    FOREIGN KEY (restaurantID) REFERENCES restaurants(restaurantID)
  );

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

  CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY,
    productID INTEGER,
    platformID INTEGER,
    price REAL,
    lastUpdated TEXT,
    FOREIGN KEY (productID) REFERENCES products(productID),
    FOREIGN KEY (platformID) REFERENCES platforms(platformID)
  );

  CREATE TABLE IF NOT EXISTS details (
    id INTEGER PRIMARY KEY,
    restaurantID INTEGER,
    platformID INTEGER,
    rating REAL,
    fee REAL,
    deliveryTime TEXT,
    minCart REAL,
    sourceLink TEXT,
    FOREIGN KEY (restaurantID) REFERENCES restaurants(restaurantID),
    FOREIGN KEY (platformID) REFERENCES platforms(platformID)
  );

  CREATE TABLE IF NOT EXISTS users (
    userID INTEGER PRIMARY KEY,
    firstName TEXT NOT NULL DEFAULT '',
    lastName TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    lastRegionID INTEGER NOT NULL,
    FOREIGN KEY (lastRegionID) REFERENCES region(regionID)
  );

  CREATE TABLE IF NOT EXISTS userFavs (
    favID INTEGER PRIMARY KEY,
    userID INTEGER NOT NULL,
    productID INTEGER NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (productID) REFERENCES products(productID)
  );

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

db.exec(`
  INSERT OR IGNORE INTO city VALUES
    (1, 'Elazığ'),
    (2, 'Malatya'),
    (3, 'Diyarbakır');

  INSERT OR IGNORE INTO district VALUES
    (1, 'Merkez', 1),
    (2, 'Merkez', 2),
    (3, 'Kayapınar', 3);

  INSERT OR IGNORE INTO region VALUES
    (1, 'Kadıköy Mah.', 1),
    (2, 'Cumhuriyet Mah.', 1),
    (3, 'Üniversite Mah.', 1),
    (4, 'Sürsürü Mah.', 1),
    (5, 'Çaydaçıra Mah.', 1),
    (6, 'Yeni 1. Bölge Mah.', 1),
    (7, 'Cumhuriyet 1. Bölge Mah.', 1),
    (8, 'Şehitlik Mah.', 2),
    (9, 'Yeni Mahalle', 3);

  INSERT OR IGNORE INTO platforms VALUES
    (1, 'Yemeksepeti'),
    (2, 'Uber Eats'),
    (3, 'GetirYemek');

  INSERT OR IGNORE INTO restaurants (restaurantID, name, isActive) VALUES
    (1, 'Urfalı Usta', 1),
    (2, 'Halil Kebap', 1),
    (3, 'Pizza City', 1),
    (4, 'Hot Döner', 1),
    (5, 'Koçoğlu Elazığ Sofrası', 1),
    (6, 'Burger Buffs', 1),
    (7, 'Lahmacuncu', 1),
    (8, 'Fry Stop', 1);

  INSERT OR IGNORE INTO restaurantRegion VALUES
    (1, 1), (2, 8), (3, 2), (4, 3),
    (5, 4), (6, 5), (7, 6), (8, 7);

  INSERT OR IGNORE INTO products VALUES
    -- Urfalı Usta (id: 1)
    (1, 1, 'Lahmacun', NULL, 'Kıymalı lahmacun'),
    (2, 1, 'Dürüm', NULL, 'Tavuk dürüm'),
    -- Halil Kebap (id: 2)
    (3, 2, 'İskender', NULL, 'Bursa usulü iskender'),
    (4, 2, 'Adana Kebap', NULL, 'El yapımı adana kebap'),
    (5, 2, 'Beyti Sarma', NULL, 'Kıymalı beyti sarma'),
    -- Pizza City (id: 3)
    (6, 3, 'Karışık Pizza', NULL, 'Bol malzemeli karışık pizza'),
    (7, 3, 'Margherita Pizza', NULL, 'Klasik margherita pizza'),
    (8, 3, 'Makarna Bolognese', NULL, 'İtalyan usulü bolonez makarna'),
    -- Hot Döner (id: 4)
    (9, 4, 'Döner Dürüm', NULL, 'İskender usulü döner dürüm'),
    (10, 4, 'Döner Tabak', NULL, 'Pilav üstü döner'),
    (11, 4, 'İskender', NULL, 'Yoğurtlu iskender'),
    -- Koçoğlu Elazığ Sofrası (id: 5)
    (12, 5, 'Elazığ Köfte', NULL, 'Elazığ usulü ızgar köfte'),
    (13, 5, 'Tandır Kebabı', NULL, 'Taş fırın tandır'),
    -- Burger Buffs (id: 6)
    (14, 6, 'Cheese Burger', NULL, 'Çift katlı cheese burger'),
    (15, 6, 'Chicken Burger', NULL, 'Tavuk burger'),
    (16, 6, 'Patates Kızartması', NULL, 'Altın sarısı patates'),
    -- Lahmacuncu (id: 7)
    (17, 7, 'Lahmacun', NULL, 'Klasik kıymalı lahmacun'),
    (18, 7, 'Künefe', NULL, 'Antep fıstıklı künefe'),
    -- Fry Stop (id: 8)
    (19, 8, 'Sossuz Patates', NULL, 'Tuzlu patates kızartması'),
    (20, 8, 'Soslu Patates', NULL, 'Ketçaplı mayonezli patates');

  INSERT OR IGNORE INTO prices VALUES
    -- Urfalı Usta - Lahmacun
    (1, 1, 1, 120, '2026-05-15'),
    (2, 1, 2, 110, '2026-05-15'),
    (3, 1, 3, 125, '2026-05-15'),
    -- Urfalı Usta - Dürüm
    (4, 2, 1, 150, '2026-05-15'),
    (5, 2, 3, 140, '2026-05-15'),
    -- Halil Kebap - İskender
    (6, 3, 1, 200, '2026-05-15'),
    (7, 3, 2, 190, '2026-05-15'),
    (8, 3, 3, 210, '2026-05-15'),
    -- Halil Kebap - Adana Kebap
    (9, 4, 1, 180, '2026-05-15'),
    (10, 4, 2, 170, '2026-05-15'),
    -- Halil Kebap - Beyti Sarma
    (11, 5, 1, 160, '2026-05-15'),
    (12, 5, 3, 155, '2026-05-15'),
    -- Pizza City - Karışık Pizza
    (13, 6, 1, 180, '2026-05-15'),
    (14, 6, 2, 165, '2026-05-15'),
    (15, 6, 3, 175, '2026-05-15'),
    -- Pizza City - Margherita
    (16, 7, 1, 140, '2026-05-15'),
    (17, 7, 2, 130, '2026-05-15'),
    -- Pizza City - Makarna
    (18, 8, 1, 100, '2026-05-15'),
    (19, 8, 3, 95, '2026-05-15'),
    -- Hot Döner - Döner Dürüm
    (20, 9, 1, 130, '2026-05-15'),
    (21, 9, 2, 120, '2026-05-15'),
    (22, 9, 3, 125, '2026-05-15'),
    -- Hot Döner - Döner Tabak
    (23, 10, 1, 160, '2026-05-15'),
    (24, 10, 2, 150, '2026-05-15'),
    -- Hot Döner - İskender
    (25, 11, 1, 190, '2026-05-15'),
    (26, 11, 3, 185, '2026-05-15'),
    -- Koçoğlu - Elazığ Köfte
    (27, 12, 1, 140, '2026-05-15'),
    (28, 12, 2, 130, '2026-05-15'),
    (29, 12, 3, 135, '2026-05-15'),
    -- Koçoğlu - Tandır
    (30, 13, 1, 220, '2026-05-15'),
    (31, 13, 2, 210, '2026-05-15'),
    -- Burger Buffs - Cheese Burger
    (32, 14, 1, 110, '2026-05-15'),
    (33, 14, 2, 100, '2026-05-15'),
    (34, 14, 3, 105, '2026-05-15'),
    -- Burger Buffs - Chicken Burger
    (35, 15, 1, 120, '2026-05-15'),
    (36, 15, 3, 115, '2026-05-15'),
    -- Burger Buffs - Patates
    (37, 16, 1, 50, '2026-05-15'),
    (38, 16, 2, 45, '2026-05-15'),
    -- Lahmacuncu - Lahmacun
    (39, 17, 1, 100, '2026-05-15'),
    (40, 17, 2, 90, '2026-05-15'),
    (41, 17, 3, 95, '2026-05-15'),
    -- Lahmacuncu - Künefe
    (42, 18, 1, 130, '2026-05-15'),
    (43, 18, 2, 120, '2026-05-15'),
    -- Fry Stop - Sossuz Patates
    (44, 19, 1, 40, '2026-05-15'),
    (45, 19, 2, 35, '2026-05-15'),
    (46, 19, 3, 38, '2026-05-15'),
    -- Fry Stop - Soslu Patates
    (47, 20, 1, 55, '2026-05-15'),
    (48, 20, 2, 50, '2026-05-15');

  INSERT OR IGNORE INTO details (id, restaurantID, platformID, rating, fee) VALUES
    -- Urfalı Usta
    (1, 1, 1, 4.5, 20),
    (2, 1, 2, 4.3, 15),
    (3, 1, 3, 4.6, 18),
    -- Halil Kebap
    (4, 2, 1, 4.8, 25),
    (5, 2, 2, 4.7, 22),
    (6, 2, 3, 4.9, 28),
    -- Pizza City
    (7, 3, 1, 4.5, 20),
    (8, 3, 2, 4.2, 15),
    -- Hot Döner
    (9, 4, 1, 4.3, 12),
    (10, 4, 2, 4.1, 10),
    (11, 4, 3, 4.4, 14),
    -- Koçoğlu
    (12, 5, 1, 4.6, 25),
    (13, 5, 2, 4.5, 22),
    (14, 5, 3, 4.7, 28),
    -- Burger Buffs
    (15, 6, 1, 4.2, 18),
    (16, 6, 2, 4.0, 15),
    -- Lahmacuncu
    (17, 7, 1, 4.4, 12),
    (18, 7, 2, 4.3, 10),
    -- Fry Stop
    (19, 8, 1, 4.1, 15),
    (20, 8, 2, 3.9, 12);
`)

console.log('Veritabanı oluşturuldu!')
db.close()
