// src/server/services/scraper.ts
// Fetches a website's homepage and pulls out the text an AI model actually
// needs (title, meta description, headings, visible body copy) — not the
// full raw HTML, which would waste tokens and dilute the prompt.
import * as cheerio from "cheerio";

export interface ScrapedSite {
  title: string;
  metaDescription: string;
  headings: string[];
  bodyText: string;
}

export class ScraperError extends Error {}

export async function scrapeWebsite(url: string): Promise<ScrapedSite> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "BrandPilotBot/1.0 (+https://brandpilot.ai)" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ScraperError("Could not reach that website. Check the URL and try again.");
  }

  if (!response.ok) {
    throw new ScraperError(`Website responded with status ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, svg").remove();

  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? "";

  const headings = $("h1, h2")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)
    .slice(0, 15);

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 6000); // cap length — this only feeds a prompt, not stored verbatim

  if (!bodyText) {
    throw new ScraperError("That page didn't return any readable content.");
  }

  return { title, metaDescription, headings, bodyText };
}