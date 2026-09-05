// src/server/services/paystack/client.ts
// Thin wrapper around the Paystack REST API. Every call needs the secret
// key in the Authorization header — never expose this key client-side
// (the public key is what goes to the browser, if you ever add Paystack's
// inline JS popup instead of hosted checkout).
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export async function paystackRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: Record<string, unknown> } = {}
): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Paystack request failed");
  }
  return data.data as T;
}