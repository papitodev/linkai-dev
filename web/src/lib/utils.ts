import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Endpoints
export const API_BASE_URL = 'http://localhost:3333/api';
export const API_LINKS = `${API_BASE_URL}/links`;
export const API_SOCIALS = `${API_BASE_URL}/socials`;
export const API_PROFILE = `${API_BASE_URL}/users/profile`;

// Magic Numbers
export const MAX_CUSTOM_LINKS = 5;
export const MAX_AVATAR_SIZE_MB = 5;
export const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;
