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

// the function below check if a string is in yyyy/mm/dd format
export function isValidDate(str: string) {
  const parts = str.split('/');
  if (parts.length !== 3) return false;
  if (parts[0].length !== 2) return false;
  if (parts[1].length !== 2) return false;
  if (parts[2].length !== 4) return false;

  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  return (
    year >= 1000 && year <= 9999 &&
    month >= 1 && month <= 12 &&
    day >= 1 && day <= new Date(year, month, 0).getDate()
  );
};
