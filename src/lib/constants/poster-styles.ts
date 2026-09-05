// src/lib/constants/poster-styles.ts
// Style presets mapped from brand tone, so poster generation needs zero
// extra input from the user in the common case — it inherits the same
// tone already set in Brand Analysis.
export interface PosterStyle {
  id: string;
  label: string;
  visualDirection: string; // slotted into the compiled image prompt
}

export const POSTER_STYLES: PosterStyle[] = [
  { id: "minimal", label: "Minimal & Clean", visualDirection: "minimalist flat design, generous negative space, soft muted color palette, subtle shadows" },
  { id: "bold", label: "Bold & Energetic", visualDirection: "high contrast, saturated colors, dynamic diagonal composition, bold geometric shapes" },
  { id: "luxury", label: "Luxury & Premium", visualDirection: "elegant, dark or neutral palette with gold or metallic accents, soft studio lighting, refined composition" },
  { id: "playful", label: "Playful & Fun", visualDirection: "bright cheerful colors, rounded shapes, hand-drawn or illustrative style, lighthearted mood" },
  { id: "photographic", label: "Photographic", visualDirection: "realistic photography style, natural lighting, shallow depth of field, lifestyle setting" },
];

const TONE_TO_STYLE: Record<string, string> = {
  "Professional": "minimal",
  "Friendly & Casual": "photographic",
  "Playful & Fun": "playful",
  "Luxury & Premium": "luxury",
  "Bold & Energetic": "bold",
  "Minimal & Calm": "minimal",
};

export function suggestStyleForTone(tone: string | null): PosterStyle {
  const id = tone ? TONE_TO_STYLE[tone] ?? "minimal" : "minimal";
  return POSTER_STYLES.find((s) => s.id === id) ?? POSTER_STYLES[0];
}