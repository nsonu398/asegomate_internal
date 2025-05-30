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
  MASTER_SELECT: {
    GEOGRAPHICAL_AREAS: '/asego/api/v1/masterSelect/GEOGRAPHICAL_AREA',
  },
  COUNTRIES: {
    LIST: 'asego/api/v1/country',
  },
};