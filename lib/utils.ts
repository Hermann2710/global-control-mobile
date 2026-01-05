import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data.message || "Une erreur est survenue";
  } else if (error instanceof ZodError) {
    return error.issues.map((err) => err.message).join(", ");
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return String(error);
  }
}
