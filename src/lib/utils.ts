import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine classnames with tailwindcss */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Result type where error type is optional and if not set is a string */
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/** Unwrap a result, throwing an error if it is not ok */
export function unwrap<T, E = string>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  } else {
    throw new Error(result.error as string);
  }
}
