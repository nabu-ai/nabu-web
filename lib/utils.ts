import { clsx, type ClassValue } from "clsx";
import { DurationUnit, formatDuration, intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

export const  titleCase = (str: string) => {
   if (typeof str !== "string" || !str.trim()) return "";
    return str.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}

export const formatTimeDuration = (seconds: number, format?: DurationUnit[]) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return formatDuration(duration, {format:format?format:["days", "hours","minutes","seconds"], delimiter:", ", zero: true})
}

