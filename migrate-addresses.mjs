import Database from 'better-sqlite3';

const db = new Database('./foodify.db');
db.pragma("foreign_keys = ON")

try {
  console.log("Adding userAddresses table...");
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
  `);
  console.log("Successfully created userAddresses table.");
} catch (error) {
  console.error("Migration failed:", error);
} finally {
  db.close()
}
