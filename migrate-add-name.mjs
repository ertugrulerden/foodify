import Database from 'better-sqlite3'
const db = new Database('./foodify.db')
db.exec(`ALTER TABLE users ADD COLUMN firstName TEXT DEFAULT ''`)
db.exec(`ALTER TABLE users ADD COLUMN lastName TEXT DEFAULT ''`)
console.log('firstName ve lastName kolonları eklendi')
db.close()
