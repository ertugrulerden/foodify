import Database from 'better-sqlite3'

const db = new Database('./foodify.db')

function hasColumn(table, column) {
  return db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column)
}

try {
  if (!hasColumn('users', 'firstName')) {
    db.exec("ALTER TABLE users ADD COLUMN firstName TEXT NOT NULL DEFAULT ''")
  }
  if (!hasColumn('users', 'lastName')) {
    db.exec("ALTER TABLE users ADD COLUMN lastName TEXT NOT NULL DEFAULT ''")
  }
  console.log('firstName ve lastName kolonlari hazir')
} finally {
  db.close()
}
