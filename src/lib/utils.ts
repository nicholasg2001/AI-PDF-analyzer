import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToASCII = (str: string) => {

  //remove all non ascii chars
  return str.replace(/[^\x00-\x7F]+/g, ""); //shoutout GPT for writing this regex :D
}
