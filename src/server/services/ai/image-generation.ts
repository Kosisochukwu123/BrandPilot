// src/server/services/ai/image-generation.ts
import { openai } from "./openai-client";
import { toFile } from "openai";
// import type { ReferenceGenerationInput } from "@/lib/poster/reference-types";
import type { ReferenceGenerationInput } from "@/lib/poster/reference-types";

export interface ImageGenerationOptions {
  prompt: string;
  businessType?: string | null;
  visualStyle?: string;
  imageMood?: string;
  hierarchy?: string;
  colors?: string[];
  aspectRatio?: "1:1" | "4:5" | "16:9";
}

/**
 * Generates a poster background image.
 * Accepts either a plain string (legacy) or a structured options object.
 * Returns base64 PNG.
 */
export async function generatePosterImage(
  input: string | ImageGenerationOptions,
): Promise<string> {
  const options: ImageGenerationOptions =
    typeof input === "string" ? { prompt: input } : input;

  const finalPrompt = buildFinalPrompt(options);

  const size =
    options.aspectRatio === "4:5"
      ? "1024x1536"
      : options.aspectRatio === "16:9"
        ? "1536x1024"
        : "1024x1024";

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: finalPrompt,
    size,
    quality: "high",
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("Image generation returned no data");
  }

  return b64;
}

/**
 * Builds a high-end commercial advertising prompt.
 * Injects business-type specific direction + strong quality constraints.
 */
function buildFinalPrompt(options: ImageGenerationOptions): string {
  const parts: string[] = [];

  // 1. Core creative direction from the Creative Director
  parts.push(options.prompt);

  // 2. Business-type specific visual language
  const businessDirection = getBusinessDirection(options.businessType);
  if (businessDirection) {
    parts.push(businessDirection);
  }

  // 3. Style + mood
  if (options.visualStyle) {
    parts.push(`Visual style: ${options.visualStyle}.`);
  }
  if (options.imageMood) {
    parts.push(`Mood and lighting: ${options.imageMood}.`);
  }

  // 4. Hierarchy / negative space (critical for text overlay)
  if (options.hierarchy) {
    parts.push(
      `Composition must strongly support a ${options.hierarchy} hierarchy. Leave clean, intentional negative space where headline and CTA will be placed. Do not fill the entire frame with busy detail.`,
    );
  } else {
    parts.push(
      "Leave clean negative space in the composition for text overlay. Do not make the image overly busy.",
    );
  }

  // 5. Brand colors as accents only
  if (options.colors && options.colors.length > 0) {
    parts.push(
      `Use only these brand colors as subtle accents: ${options.colors.join(", ")}. Do not let unrelated colors dominate the image.`,
    );
  }

  // 6. Hard commercial quality lock
  parts.push(
    [
      "Award-winning commercial advertising photography.",
      "Ultra high resolution, photorealistic, professional color grading.",
      "Cinematic lighting, sharp focus, premium production value.",
      "No text, no letters, no numbers, no logos, no watermarks.",
      "No borders, no frames, no mockup UI, no collages.",
      "No distorted anatomy, no extra limbs, no deformed hands or faces.",
      "No stock-photo look, no generic template composition.",
      "Original composition created specifically for this brand.",
    ].join(" "),
  );

  return parts.join(" ");
}

/**
 * Returns industry-specific visual direction.
 * This is what makes a restaurant poster feel different from a SaaS poster.
 */
function getBusinessDirection(businessType?: string | null): string | null {
  if (!businessType) return null;

  const map: Record<string, string> = {
    "Restaurant / Food & Beverage":
      "Food photography style: close-up plated dish or ingredient hero shot, appetizing textures, warm natural or soft studio lighting, shallow depth of field, rich color, steam or fresh garnish when appropriate. Make the viewer hungry.",

    "Fashion & Apparel":
      "High fashion editorial photography: strong model or garment focus, clean elegant composition, sophisticated lighting, premium fabric texture, magazine-cover quality. Avoid clutter.",

    "Beauty & Cosmetics":
      "Beauty campaign photography: soft diffused lighting, clean product or skin close-up, delicate textures, elegant negative space, luxurious and calm mood. No harsh shadows.",

    "E-commerce / Retail":
      "Premium product advertising: hero product clearly visible, clean studio or lifestyle setting, strong focal point, commercial catalog quality, plenty of negative space for headline.",

    "SaaS / Software":
      "Modern tech visual: abstract geometric forms, soft gradients, clean desk/workspace, subtle screen glow, or minimal product UI suggestion. Avoid cluttered dashboards. Bright, trustworthy, contemporary.",

    "Health & Wellness":
      "Active lifestyle or calm wellness photography: athletic movement or serene natural setting, strong human energy or peaceful atmosphere, natural light, aspirational and clean.",

    "Real Estate":
      "Architectural photography: beautiful interior or exterior of a property, wide and inviting, natural light, aspirational lifestyle feel, clean lines, high-end real estate listing quality.",

    "Local Service Business":
      "Trustworthy local service photography: clean professional environment or friendly human presence, approachable and credible, natural lighting, real-world setting without looking cheap.",

    "Education / Coaching":
      "Inspirational education visual: focused human moment, notebook, laptop, or teaching environment, warm and encouraging light, clear subject, professional yet approachable.",
  };

  // Try exact match first, then partial
  if (map[businessType]) return map[businessType];

  for (const [key, value] of Object.entries(map)) {
    if (
      businessType.toLowerCase().includes(key.toLowerCase().split(" / ")[0])
    ) {
      return value;
    }
  }

  return "Professional commercial photography appropriate for this business category.";
}

/**
 * Reference-guided poster generation via images.edit.
 * Returns base64 PNG.
 */
export async function generatePosterFromReferences(
  input: ReferenceGenerationInput,
): Promise<string> {
  const {
    referenceImages,
    logoImage,
    productImage,
    people,
    size = "1024x1024",
    inputFidelity = "low",
  } = input;

  if (!referenceImages.length) {
    throw new Error("At least one reference image is required");
  }

  const imageParts: File[] = [];

  // 1) People photos first (strongest identity)
  if (people?.length) {
    people.forEach((person, i) => {
      if (person.image) {
        imageParts.push(bufferToFile(person.image, `person-${i + 1}.png`));
      }
    });
  }

  // 2) Main image second (hero subject — product/property/scene)
  if (productImage) {
    imageParts.push(bufferToFile(productImage, "main-image.png"));
  }

  // 3) Logo third
  if (logoImage) {
    imageParts.push(bufferToFile(logoImage, "logo.png"));
  }

  // 4) Style references last
  for (let i = 0; i < referenceImages.length; i++) {
    imageParts.push(bufferToFile(referenceImages[i], `ref-${i + 1}.png`));
  }

  const masterPrompt = buildReferencePrompt(input);

  const result = await openai.images.edit({
    model: "gpt-image-1",
    image: imageParts as unknown as File[],
    prompt: masterPrompt,
    size,
    ...({ input_fidelity: inputFidelity } as Record<string, unknown>),
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("Reference-guided generation returned no data");
  }

  return b64;
}

/** Convert a Node Buffer into a Web File the OpenAI SDK accepts. */
function bufferToFile(buffer: Buffer, filename: string): File {
  // Uint8Array view avoids some Buffer typing issues with BlobPart
  const bytes = new Uint8Array(buffer);
  const blob = new Blob([bytes], { type: "image/png" });
  return new File([blob], filename, { type: "image/png" });
}

function buildReferencePrompt(input: ReferenceGenerationInput): string {
  const plan = input.plan;

  // Determine headline, subheadline, and CTA from plan or input
  const headline = input.headline ?? plan?.headline;
  const subheadline = input.subheadline ?? plan?.subheadline ?? "";
  const cta = (input.cta ?? plan?.cta ?? "").trim();

  const colors = input.brandColors?.length
    ? `Brand colors (use as the primary palette): ${input.brandColors.join(", ")}.`
    : "";

  const business = [
    input.businessName ? `Business name: ${input.businessName}.` : "",
    input.businessType ? `Business type: ${input.businessType}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const copy = input.noText
    ? "Do NOT include any text, headline, CTA, letters, or numbers anywhere in the image. Clean background only — text will be added separately afterward."
    : [
        headline
          ? `Use this exact headline: "${headline}".`
          : "Invent a short, strong headline (3–7 words) from the brief.",
        subheadline ? `Subheadline: "${subheadline}".` : "",
        cta
          ? `Include a clear call-to-action label: "${cta}".`
          : "Do NOT include a button-style CTA. This poster should work with headline and supporting/contact information only — no Shop Now / Get Started button.",
      ]
        .filter(Boolean)
        .join(" ");

  const personPhotoCount = input.people?.filter((p) => p.image).length ?? 0;

  const peopleNotes =
    input.people
      ?.map((person, i) => {
        const label = [
          person.name?.trim(),
          person.role?.trim() ? `— ${person.role.trim()}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        if (person.image) {
          return [
            `PERSON ${i + 1} PHOTO is an input image of a real person${label ? ` (${label})` : ""}.`,
            "Preserve their real facial identity: same face shape, skin tone, age, hair, facial hair, and features.",
            "Do NOT beautify, age, gender-swap, or replace them with a different person.",
            "Do NOT turn them into a generic stock model.",
            "Likeness must be clearly recognizable as the same person in the photo.",
            "Place their name and role directly with their portrait (typically below or beside the face).",
          ].join(" ");
        }

        if (label) {
          return `Person ${i + 1} (no photo uploaded): ${label}. Include name/role only if the layout supports it; do not invent a face for them.`;
        }

        return "";
      })
      .filter(Boolean)
      .join("\n") ?? "";

  const assetNotes = [
    input.logoImage
      ? "One input image is the brand logo. You may place it tastefully if it fits (e.g. corner or header). Keep it sharp and undistorted if used. You may omit it if the layout is stronger without it."
      : "",
    peopleNotes,
  input.productImage
      ? [
          "MAIN IMAGE INPUT (file main-image.png) is the user's real photo (product, property, or scene).",
          "This exact subject must be the primary visual hero on the poster.",
          "Preserve the real subject, colors, and recognizable details of that photo.",
          "Do NOT replace it with a different product, room, or stock scene.",
          "Do NOT ignore this image.",
          "Crop and color-grade only; do not redesign the subject.",
        ].join(" ")
      : "",
    personPhotoCount > 0
      ? [
          "PEOPLE CONSTRAINT:",
          `Exactly ${personPhotoCount} real person photo(s) were provided as inputs.`,
          "Only depict the people supplied in those person photos.",
          "Do NOT add extra people, colleagues, clients, or stock models.",
          "Do NOT invent a conversation partner or second professional.",
          personPhotoCount === 1
            ? "Show only that one person on the poster."
            : `Show exactly those ${personPhotoCount} people — no additional humans.`,
          "IDENTITY LOCK: prioritize face likeness over stylization; light retouch only; no face redesign.",
        ].join(" ")
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const detailLines = input.details
    ? [
        input.details.offer && `Offer: ${input.details.offer}`,
        input.details.price && `Price: ${input.details.price}`,
        input.details.date && `Date: ${input.details.date}`,
        input.details.time && `Time: ${input.details.time}`,
        input.details.address && `Address: ${input.details.address}`,
        input.details.phone && `Phone: ${input.details.phone}`,
        input.details.website && `Website: ${input.details.website}`,
        input.details.extra && `Extra: ${input.details.extra}`,
      ].filter(Boolean)
    : [];

  const detailsBlock =
    detailLines.length > 0
      ? [
          "User-provided details to include (do not invent extra facts):",
          ...detailLines.map((line) => `- ${line}`),
          "",
          "How to present those details:",
          "- Do NOT dump them as a plain footer text list.",
          "- Design them as proper poster elements:",
          "  · Offer → badge, pill, or ribbon near the top or beside the headline",
          "  · Price → large, bold price callout if present",
          "  · Date / time → clear event-style line or chip",
          "  · Address / phone / website → small contact row or card, tidy and legible",
          "  · Extra (e.g. beds, services) → short supporting line or bullet row",
          "- Integrate them into the layout hierarchy, not as an afterthought.",
          "- Keep the headline dominant; details support it.",
        ].join("\n")
      : "";

  // Build plan block from the creative direction
  const planBlock = plan
    ? [
        "Creative direction (follow closely):",
        `- Campaign: ${plan.campaignType}`,
        `- Emotion: ${plan.emotion}`,
        `- Composition: ${plan.composition}`,
        `- Lighting: ${plan.lighting}`,
        `- Contrast: ${plan.contrast}`,
        `- Background: ${plan.background}`,
        `- Typography style: ${plan.typographyStyle}`,
        `- Negative space: ${plan.negativeSpace}`,
        `- Visual priority: ${plan.visualPriority.join(" → ")}`,
        `- Graphic direction: ${plan.graphicDirection}`,
        `- Image direction: ${plan.imageDirection}`,
        plan.avoid?.length ? `- Avoid: ${plan.avoid.join("; ")}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const keywordsLine =
    input.keywords && input.keywords.length > 0
      ? `Preferred words/phrases (use when natural): ${input.keywords.join(", ")}.`
      : "";

  const contextLine = [
    input.posterType ? `Poster type: ${input.posterType}.` : "",
    input.goal ? `Goal: ${input.goal}.` : "",
    input.mainMessage
      ? `User main message (base the headline on this): ${input.mainMessage}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "Create ONE original square marketing poster (1:1).",
    "",
    `Brief: ${input.prompt}`,
    business,
    colors,
    contextLine,
    keywordsLine,
    copy,
    detailsBlock,
    planBlock,
    assetNotes,
    "",
    "REFERENCE DESIGN ANALYSIS",
    "Study all provided reference posters carefully before creating the final poster.",
    "Use the references as visual design systems, not as templates to copy.",
    "Analyze and learn from them:",
    "- information density",
    "- content hierarchy",
    "- placement and scale of headlines",
    "- placement and scale of supporting information",
    "- number and arrangement of people/products",
    "- portrait composition",
    "- typography hierarchy",
    "- spacing and margins",
    "- use of shapes and graphic elements",
    "- color relationships",
    "- image treatment",
    "- CTA placement",
    "- logo placement",
    "- balance between visual elements and written information",
    "Select the strongest design principles from the references and combine them into ONE original composition.",
    "The final poster must be capable of comfortably containing ALL user-provided information.",
    "Do not omit, shorten, replace, or invent user-provided names, dates, prices, locations, contact information, or other factual details.",
    "Adapt the composition to the amount of information provided.",
    "If the user provides multiple people, design a deliberate multi-person composition rather than treating them as unrelated images.",
    "Do not simply copy any reference poster.",
    "Do not reproduce its exact layout, typography, imagery, people, branding, or text.",
    "Create a new composition inspired by the combined design principles.",
    "",
    "Design rules:",
    "- Professional commercial poster, not a social-media photo with text stuck on top.",
    "- Premium advertising composition mixing graphic design and commercial photography.",
    "- Bold geometric shapes, intentional framing, layered depth, modern editorial hierarchy when appropriate.",
    "- Avoid generic stock-photo layouts.",
    "- Use the full poster area deliberately.",
    "- Avoid large empty regions that waste space.",
    "- Avoid overcrowding: keep readable margins (roughly 5–8% from edges).",
    "- All user-provided facts must fit without clipping or overflowing the frame.",
    "- Scale type and photos so the layout feels balanced and complete, like a finished print poster.",
    
    input.noText
      ? "- No text of any kind in the image."
      : "- Clear visual hierarchy: headline dominates; supporting text and contact stay legible.",
    "- Balanced negative space — filled with purpose, not empty or cramped.",
    input.noText
      ? ""
      : cta
        ? "- CTA should look like a real button or clear action label."
        : "- No button-style CTA on this poster.",
    personPhotoCount > 0
      ? "- CRITICAL: Do not invent people. Only use faces from the provided person input photos."
      : "",
    input.productImage
      ? "- CRITICAL: The user main image must remain a recognizable hero subject, not a substituted stock scene."
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
