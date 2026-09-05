// src/lib/color-utils.ts
// Picks readable text color against a given background color, using
// perceived-brightness luminance rather than assuming dark or light text
// based on template type alone — a gradient or brand color can be either.
export function getReadableTextColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 140 ? "#111111" : "#ffffff";
}

// Blends two hex colors to approximate a gradient's midpoint color, for
// contrast decisions on text placed over a gradient background.
export function blendColors(hexA: string, hexB: string): string {
  const a = hexA.replace("#", "");
  const b = hexB.replace("#", "");
  const r = Math.round((parseInt(a.substring(0, 2), 16) + parseInt(b.substring(0, 2), 16)) / 2);
  const g = Math.round((parseInt(a.substring(2, 4), 16) + parseInt(b.substring(2, 4), 16)) / 2);
  const bl = Math.round((parseInt(a.substring(4, 6), 16) + parseInt(b.substring(4, 6), 16)) / 2);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}