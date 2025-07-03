import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};


export const auth = (customHeaders = {}) => ({
  headers: {
    Authorization: `Bearer ${getToken() || ''}`,
    ...customHeaders,
  },
});