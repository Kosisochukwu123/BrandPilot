// src/server/services/channels/meta.ts
// Shared logic for Instagram + Facebook, since both run through the Meta
// Graph API and the same OAuth app. Requires App Review approval for
// instagram_content_publish / pages_manage_posts before real users can
// connect — see note above.
const GRAPH_VERSION = "v21.0";

export function getMetaAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/channels/meta/callback`,
    scope: "pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish",
    response_type: "code",
    state,
  });
  return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params}`;
}

export async function exchangeMetaCode(code: string) {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/channels/meta/callback`,
    code,
  });
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token?${params}`);
  if (!res.ok) throw new Error("Meta token exchange failed");
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

// The short-lived user token above can't publish anything by itself — we
// need the Page (and linked Instagram Business account) the user manages.
export async function getManagedPages(userAccessToken: string) {
  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?access_token=${userAccessToken}`
  );
  if (!res.ok) throw new Error("Could not fetch managed Pages");
  const data = await res.json();
  return data.data as Array<{ id: string; name: string; access_token: string }>;
}

export async function publishFacebookPost(pageId: string, pageAccessToken: string, message: string) {
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: pageAccessToken }),
  });
  if (!res.ok) throw new Error(`Facebook publish failed: ${await res.text()}`);
  return res.json();
}

// Instagram publishing is a two-step process: create a media container,
// then publish it. A media URL is required — Instagram doesn't accept
// text-only posts.
export async function publishInstagramPost(
  igBusinessAccountId: string,
  accessToken: string,
  caption: string,
  imageUrl: string
) {
  const create = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${igBusinessAccountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
    }
  );
  if (!create.ok) throw new Error(`Instagram container creation failed: ${await create.text()}`);
  const { id: creationId } = await create.json();

  const publish = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${igBusinessAccountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
    }
  );
  if (!publish.ok) throw new Error(`Instagram publish failed: ${await publish.text()}`);
  return publish.json();
}