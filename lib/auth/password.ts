import { randomBytes, scryptSync, timingSafeEqual } from "crypto"

const PREFIX = "scrypt"
const KEY_LENGTH = 64

// Sifreler duz metin yerine salt + scrypt hash olarak saklanir.
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex")
  return `${PREFIX}:${salt}:${hash}`
}

export function verifyPassword(password: string, storedPassword: string): { valid: boolean; needsRehash: boolean } {
  const parts = storedPassword.split(":")

  // Eski kayit duz metinse giris basarili olunca hash formatina tasiniyor.
  if (parts.length !== 3 || parts[0] !== PREFIX) {
    return { valid: storedPassword === password, needsRehash: storedPassword === password }
  }

  const [, salt, hash] = parts
  const expected = Buffer.from(hash, "hex")
  const actual = scryptSync(password, salt, expected.length)

  if (expected.length !== actual.length) {
    return { valid: false, needsRehash: false }
  }

  // Normal string karsilastirmasi yerine sabit sureli karsilastirma kullaniyorum.
  return { valid: timingSafeEqual(expected, actual), needsRehash: false }
}
