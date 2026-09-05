// src/server/services/channels/x.ts
// X OAuth 2.0 with PKCE. Requires Elevated/Pro API access on your X
// developer app before posting on behalf of other users works.
import crypto from "crypto";

export function generatePkcePair() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function getXAuthUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/channels/x/callback`,
    scope: "tweet.read tweet.write users.read offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `https://twitter.com/i/oauth2/authorize?${params}`;
}

export async function exchangeXCode(code: string, verifier: string) {
  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/channels/x/callback`,
      code_verifier: verifier,
    }),
  });
  if (!res.ok) throw new Error("X token exchange failed");
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number }>;
}

export async function publishTweet(accessToken: string, text: string) {
  const res = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`X publish failed: ${await res.text()}`);
  return res.json();
}