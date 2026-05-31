import { randomBytes, scryptSync, timingSafeEqual } from "crypto"

const PREFIX = "scrypt"
const KEY_LENGTH = 64

// Sifreleri veritabanina duz metin yazmak yerine salt + scrypt hash olarak sakliyoruz.
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex")
  return `${PREFIX}:${salt}:${hash}`
}

export function verifyPassword(password: string, storedPassword: string): { valid: boolean; needsRehash: boolean } {
  const parts = storedPassword.split(":")

  // Eski kayitlarda sifre duz metin olabilir; giris basariliysa login akisi bunu hash'e yukseltir.
  if (parts.length !== 3 || parts[0] !== PREFIX) {
    return { valid: storedPassword === password, needsRehash: storedPassword === password }
  }

  const [, salt, hash] = parts
  const expected = Buffer.from(hash, "hex")
  const actual = scryptSync(password, salt, expected.length)

  if (expected.length !== actual.length) {
    return { valid: false, needsRehash: false }
  }

  // Timing attack riskini azaltmak icin normal string karsilastirmasi yerine sabit sureli karsilastirma.
  return { valid: timingSafeEqual(expected, actual), needsRehash: false }
}
