  // src/lib/poster/reference-types.ts

  export interface PosterReferenceMeta {
    id: string;
    /** Path under /public or absolute URL */
    imagePath: string;
    businessType: string[];
    style: string; // luxury | bold | minimal | editorial | ...
    mood: string; // elegant | warm | energetic | dark | ...
    layout: string; // hero | split | type-led | offer | ...
    tags: string[];
  }

  export interface ReferenceGenerationInput {
    /** Optional facts to print on the poster (user-provided only) */
    details?: {
      offer?: string;
      price?: string;
      date?: string;
      time?: string;
      address?: string;
      phone?: string;
      website?: string;
      extra?: string; // e.g. "2 bed · 2 bath"
    };
    /** Main creative brief / master prompt */
    prompt: string;

    /** Reference poster images (buffers or File-like for the API) */
    referenceImages: Buffer[];

    keywords?: string[];

    /** Optional brand assets */
    logoImage?: Buffer | null;
    productImage?: Buffer | null;

    people?: {
      name?: string;
      role?: string;
      image?: Buffer | null;
    }[];

    businessName?: string | null;
    businessType?: string | null;
    brandColors?: string[];
    headline?: string;
    subheadline?: string;
    cta?: string;

    /** When true, no text/headline/CTA is generated into the image at all —
     * used when text will be rendered separately as real DOM elements
     * (OVERLAY mode), so the AI image and the React text layer never
     * duplicate or conflict with each other. */
    noText?: boolean;

    size?: "1024x1024" | "1024x1536" | "1536x1024";
    /** Higher = stick closer to faces/logos in inputs */
    inputFidelity?: "low" | "high";

    plan?: ReferenceCreativePlan;

    posterType?: string;
    goal?: string;
    mainMessage?: string;
  }

  /** Creative Director output — drives the single image generation */
  export interface ReferenceCreativePlan {
    campaignType: string;
    emotion: string;
    composition: string;
    lighting: string;
    contrast: string;
    background: string;
    typographyStyle: string;
    negativeSpace: string;
    visualPriority: string[];
    graphicDirection: string;
    avoid: string[];
    headline: string;
    subheadline: string;
    cta: string;
    imageDirection: string;
    reasoning: string[];
  }
