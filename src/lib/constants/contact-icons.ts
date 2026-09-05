// src/lib/constants/contact-icons.ts
// AI/business-logic only ever decides WHICH icons apply (has a website?
// has Instagram? has WhatsApp?) — the actual icon rendering always comes
// from this fixed Lucide set, never drawn or hallucinated by any model.
import { Globe, Instagram, Phone } from "lucide-react";

export const CONTACT_ICONS = {
  website: Globe,
  instagram: Instagram,
  whatsapp: Phone,
} as const;