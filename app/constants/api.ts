// src/constants/api.ts
export const API_BASE_URL = 'https://api.asegomate.com/v1';
export const API_TIMEOUT = 30000; // 30 seconds

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  TRIPS: {
    LIST: '/trips',
    DETAIL: (id: string) => `/trips/${id}`,
    CREATE: '/trips',
    UPDATE: (id: string) => `/trips/${id}`,
    DELETE: (id: string) => `/trips/${id}`,
  },
  POLICIES: {
    LIST: '/policies',
    DETAIL: (id: string) => `/policies/${id}`,
    CREATE: '/policies',
    UPDATE: (id: string) => `/policies/${id}`,
    CANCEL: (id: string) => `/policies/${id}/cancel`,
    AVAILABLE_COVERAGE: '/coverage/available',
    CALCULATE_PREMIUM: '/policies/calculate-premium',
  },
  CLAIMS: {
    LIST: '/claims',
    DETAIL: (id: string) => `/claims/${id}`,
    CREATE: '/claims',
    UPDATE: (id: string) => `/claims/${id}`,
    UPLOAD_DOCUMENT: (id: string) => `/claims/${id}/documents`,
    DELETE_DOCUMENT: (id: string, documentId: string) => `/claims/${id}/documents/${documentId}`,
  },
};