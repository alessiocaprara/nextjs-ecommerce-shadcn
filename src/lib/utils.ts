import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(priceInCents: number) {
  return (priceInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
}

export function getInitialsUpperCase(text: string | null | undefined) {
  console.log(text);
  if (!text) return "";
  const words = text?.split(" ");
  if (words?.length >= 2) {
    const inizialeNome = words[0].charAt(0).toUpperCase();
    const inizialeCognome = words[1].charAt(0).toUpperCase();
    return inizialeNome + inizialeCognome;
  } else {
    return "";
  }
}
