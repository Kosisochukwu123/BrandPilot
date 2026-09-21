export type PosterAspectRatio = "1:1" | "4:5" | "16:9";

export type PosterElementType =
  | "logo"
  | "headline"
  | "subheadline"
  | "body"
  | "bullet-list"
  | "image"
  | "product"
  | "person"
  | "offer"
  | "price"
  | "date"
  | "time"
  | "location"
  | "phone"
  | "website"
  | "cta"
  | "badge"
  | "decorative-shape";

export type PosterTextAlign = "left" | "center" | "right";

export interface PosterElementPosition {
  x: number;
  y: number;
  w: number;
  h?: number;
}

export interface PosterElement {
  id: string;

  type: PosterElementType;

  position: PosterElementPosition;

  /**
   * Optional reference to where the content comes from.
   *
   * Examples:
   * "brand.logo"
   * "content.headline"
   * "details.price"
   * "details.phone"
   * "person.0"
   * "asset.object"
   */
  source?: string;

  /**
   * Literal text/value when the element doesn't need
   * to resolve its content from another source.
   */
  value?: string;

  align?: PosterTextAlign;

  rotation?: number;

  zIndex?: number;

  opacity?: number;

  style?: {
    fontSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "hero";

    fontWeight?: "normal" | "medium" | "semibold" | "bold" | "black";

    fontFamily?: "display" | "modern" | "serif-elegant" | "bold-sans";

    color?: string;

    backgroundColor?: string;

    borderColor?: string;

    borderWidth?: number;

    borderRadius?: number;

    padding?: number;

    shadow?: "none" | "soft" | "medium" | "hard";

    objectFit?: "cover" | "contain";

    objectPosition?: string;

    shape?: "rectangle" | "circle" | "pill" | "line";
  };
}

export interface PosterDesignBlueprint {
  version: 1;

  aspectRatio: PosterAspectRatio;

  templateId: string;

  /**
   * Short description of the intended composition.
   *
   * Example:
   * "Product-focused promotional poster with oversized
   * product photography on the right and pricing information
   * on the lower left."
   */
  composition: string;

  elements: PosterElement[];
}
