export type PosterCompositionType =
  | "service-promo"
  | "product-promo"
  | "offer-promo"
  | "event"
  | "person-led"
  | "editorial";

export interface CompositionDecision {
  type: PosterCompositionType;
  reason: string;

  priorities: Array<
    | "headline"
    | "subheadline"
    | "cta"
    | "product"
    | "person"
    | "offer"
    | "price"
    | "date"
    | "time"
    | "location"
  >;

  needsGeneratedVisual: boolean;

  visualDirection: string;
}

interface ChooseCompositionInput {
  caption: string;

  assets: {
    logoImage?: string | null;
    productImage?: string | null;
    peopleImages?: string[];
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
}

function hasValue(value?: string | null) {
  return Boolean(value?.trim());
}

export function choosePosterComposition(
  input: ChooseCompositionInput,
): CompositionDecision {
  const caption = input.caption.toLowerCase();

  const hasProduct = Boolean(input.assets.productImage);

  const hasPeople =
    Boolean(input.assets.peopleImages?.length);

  const hasOffer = hasValue(input.details.offer);
  const hasPrice = hasValue(input.details.price);

  const hasDate = hasValue(input.details.date);
  const hasTime = hasValue(input.details.time);
  const hasAddress = hasValue(input.details.address);

  const eventWords = [
    "event",
    "conference",
    "seminar",
    "workshop",
    "concert",
    "webinar",
    "launch",
    "meeting",
    "party",
  ];

  const productWords = [
    "product",
    "buy",
    "shop",
    "order",
    "available",
    "collection",
    "sale",
  ];

  const serviceWords = [
    "website",
    "web design",
    "web development",
    "branding",
    "marketing",
    "design",
    "development",
    "agency",
    "service",
    "business",
  ];

  const looksLikeEvent =
    hasDate ||
    hasTime ||
    hasAddress ||
    eventWords.some((word) => caption.includes(word));

  if (looksLikeEvent) {
    return {
      type: "event",

      reason:
        "The brief contains event-oriented information such as a date, time, location or event language.",

      priorities: [
        "headline",
        "date",
        "time",
        "location",
        "person",
        "cta",
      ],

      needsGeneratedVisual: !hasPeople,

      visualDirection:
        "Event campaign artwork with strong hierarchy, prominent event information and a clear focal visual.",
    };
  }

  const looksLikeProduct =
    hasProduct ||
    productWords.some((word) => caption.includes(word));

  if (looksLikeProduct && (hasOffer || hasPrice)) {
    return {
      type: "offer-promo",

      reason:
        "The brief contains a product or sales context together with pricing or promotional information.",

      priorities: [
        "product",
        "headline",
        "offer",
        "price",
        "cta",
      ],

      needsGeneratedVisual: !hasProduct,

      visualDirection:
        "Commercial promotional artwork with a strong product hero, visible offer or price and high-impact CTA.",
    };
  }

  if (looksLikeProduct) {
    return {
      type: "product-promo",

      reason:
        "The brief or supplied assets indicate that a product should be the main visual subject.",

      priorities: [
        "product",
        "headline",
        "subheadline",
        "cta",
      ],

      needsGeneratedVisual: !hasProduct,

      visualDirection:
        "Product-focused advertising composition with a dominant hero product and supporting promotional copy.",
    };
  }

  if (hasPeople) {
    return {
      type: "person-led",

      reason:
        "One or more people were supplied and can serve as the visual focus of the poster.",

      priorities: [
        "person",
        "headline",
        "subheadline",
        "cta",
      ],

      needsGeneratedVisual: false,

      visualDirection:
        "Portrait-led campaign composition where the person is a major focal point and typography supports the portrait.",
    };
  }

  const looksLikeService = serviceWords.some((word) =>
    caption.includes(word),
  );

  if (looksLikeService) {
    return {
      type: "service-promo",

      reason:
        "The brief promotes a service rather than a physical product or event.",

      priorities: [
        "headline",
        "subheadline",
        "cta",
      ],

      needsGeneratedVisual: true,

      visualDirection:
        "Service advertising artwork with a relevant conceptual or industry visual, strong headline hierarchy and clear CTA.",
    };
  }

  return {
    type: "editorial",

    reason:
      "No strong product, event, person or promotional signal was detected, so a content-led composition is appropriate.",

    priorities: [
      "headline",
      "subheadline",
      "cta",
    ],

    needsGeneratedVisual: true,

    visualDirection:
      "Editorial campaign composition with expressive typography, intentional negative space and a supporting visual concept.",
  };
}