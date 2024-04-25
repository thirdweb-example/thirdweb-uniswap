import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bigIntMax = (...args: bigint[]) => args.reduce((m, e) => (e ?? 0) > (m ?? 0) ? e : m);

export function withTimeout(promise: () => Promise<any>, timeout: number) {
  return Promise.race([
    promise(),
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeout);
    })
  ]);
}

