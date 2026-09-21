import type {
  PosterDesignBlueprint,
  PosterElement,
} from "@/lib/types/poster-design-blueprint";

interface AdaptPosterBlueprintInput {
  blueprint: PosterDesignBlueprint;

  assets: {
    logoImage?: string | null;
    productImage?: string | null;
  };

  details: {
    offer?: string;
    price?: string;
    date?: string;
    time?: string;
    address?: string;
    phone?: string;
    website?: string;
    extra?: string;
  };

  content: {
    headline: string;
    subheadline: string;
    bullets?: string[];
    cta?: string;
  };
}

function hasValue(value?: string | null) {
  return Boolean(value?.trim());
}

function sourceExists(
  element: PosterElement,
  input: AdaptPosterBlueprintInput,
) {
  const source = element.source;

  if (!source) return true;

  switch (source) {
    case "brand.logo":
      return Boolean(input.assets.logoImage);

    case "asset.product":
      return Boolean(input.assets.productImage);

    case "content.headline":
      return hasValue(input.content.headline);

    case "content.subheadline":
      return hasValue(input.content.subheadline);

    case "content.cta":
      return hasValue(input.content.cta);

    case "details.offer":
      return hasValue(input.details.offer);

    case "details.price":
      return hasValue(input.details.price);

    case "details.date":
      return hasValue(input.details.date);

    case "details.time":
      return hasValue(input.details.time);

    case "details.address":
      return hasValue(input.details.address);

    case "details.phone":
      return hasValue(input.details.phone);

    case "details.website":
      return hasValue(input.details.website);

    case "details.extra":
      return hasValue(input.details.extra);

    default:
      return true;
  }
}

export function adaptPosterBlueprint(
  input: AdaptPosterBlueprintInput,
): PosterDesignBlueprint {
  const availableElements = input.blueprint.elements.filter((element) =>
    sourceExists(element, input),
  );

  const hasProduct = Boolean(input.assets.productImage);
  const hasOffer = hasValue(input.details.offer);
  const hasPrice = hasValue(input.details.price);
  const hasLogo = Boolean(input.assets.logoImage);

  const isContentOnly = !hasProduct && !hasOffer && !hasPrice && !hasLogo;

  let elements = availableElements;

  if (isContentOnly) {
    elements = availableElements.map((element) => {
      if (element.type === "headline") {
        return {
          ...element,
          position: {
            x: 0.07,
            y: 0.2,
            w: 0.86,
            h: 0.22,
          },
          style: {
            ...element.style,
            fontSize: "hero" as const,
          },
        };
      }

      if (element.type === "subheadline") {
        return {
          ...element,
          position: {
            x: 0.08,
            y: 0.45,
            w: 0.72,
            h: 0.12,
          },
        };
      }

      if (element.type === "cta") {
        return {
          ...element,
          position: {
            x: 0.08,
            y: 0.68,
            w: 0.38,
            h: 0.09,
          },
        };
      }
      return element;
    });
  }

  return {
    ...input.blueprint,
    composition: isContentOnly
      ? `${input.blueprint.composition}-content-only`
      : input.blueprint.composition,
    elements,
  };
}
