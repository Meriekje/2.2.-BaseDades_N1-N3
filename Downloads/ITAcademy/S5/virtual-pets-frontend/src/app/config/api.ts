// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  TIMEOUT: 10000,
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },
  PETS: {
    LIST: "/pets",
    CREATE: "/pets",
    UPDATE: (id: number) => `/pets/${id}`,
    DELETE: (id: number) => `/pets/${id}`,
    FEED: (id: number) => `/pets/${id}/feed`,
    PLAY: (id: number) => `/pets/${id}/play`,
    REST: (id: number) => `/pets/${id}/rest`,
  },
}
