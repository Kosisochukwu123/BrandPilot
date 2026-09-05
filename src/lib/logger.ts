// src/lib/logger.ts
// Centralized logging so we never accidentally console.log a raw request
// body, token, or password anywhere in the app — every log call goes
// through this, and this is the one place that redacts known-sensitive keys.
const SENSITIVE_KEYS = ["password", "accessToken", "refreshToken", "token", "authorization"];

function redact(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
      k,
      SENSITIVE_KEYS.includes(k) ? "[REDACTED]" : redact(v),
    ])
  );
}

export const logger = {
  error(message: string, context?: Record<string, unknown>) {
    console.error(message, context ? redact(context) : "");
  },
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(message, context ? redact(context) : "");
  },
  info(message: string, context?: Record<string, unknown>) {
    console.info(message, context ? redact(context) : "");
  },
};