import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSlotString = (slot: number): string => {
  if (slot < 1 || slot > 4) {
    throw new Error("Slot number must be between 1 and 4");
  }

  const slotTimes = ["07:00 - 09:30", "09:30 - 12:00", "12:00 - 14:30", "14:30 - 17:00"];
  return `Slot ${slot} - ${slotTimes[slot - 1]}`;
};
