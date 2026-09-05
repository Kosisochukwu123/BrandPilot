// src/lib/crypto.ts
// Encrypts OAuth tokens before they're stored in Channel.accessToken /
// refreshToken. Never store third-party access tokens in plaintext —
// a DB leak would otherwise hand over every connected user's social
// accounts directly.
import crypto from "crypto";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY ?? "", "hex"); // 32 bytes, hex-encoded

export function encryptToken(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":");
}

export function decryptToken(stored: string): string {
  const [ivHex, authTagHex, dataHex] = stored.split(":");
  const decipher = crypto.createDecipheriv(ALGO, KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}