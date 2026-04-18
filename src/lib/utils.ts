import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractShortDescription(description: string): string {
  const match = description.match(/#\s*工具简介\n([^#\n]+)/);
  if (match) {
    return match[1].trim().replace(/。$/, '');
  }
  const firstLine = description.split('\n')[0].replace(/^#+\s*/, '').trim().replace(/。$/, '');
  return firstLine;
}
