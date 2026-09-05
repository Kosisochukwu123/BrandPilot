// src/lib/utils.ts
// Standard shadcn/ui class merger — combines conditional classnames and
// resolves Tailwind conflicts (e.g. "px-2" vs "px-4") deterministically.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}