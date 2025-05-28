// app/constants/api.ts
import { API_BASE_URL, API_TIMEOUT, CLIENT_TYPE } from './environment';

export { API_BASE_URL, API_TIMEOUT, CLIENT_TYPE };

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/authenticate',
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