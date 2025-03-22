import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random ID for use as a session identifier
 * @returns A random string of the format 'xxxx-xxxx-xxxx-xxxx'
 */
export function generateRandomId(): string {
  const segments = 4;
  const segmentLength = 4;
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  const randomSegments = Array.from({ length: segments }, () => {
    return Array.from(
      { length: segmentLength },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  });

  return randomSegments.join("-");
}
