// src/constants/routes.ts
export const ROUTES = {
    // Auth routes
    AUTH: {
      LOGIN: '/login',
      REGISTER: '/register',
      FORGOT_PASSWORD: '/forgot-password',
      RESET_PASSWORD: '/reset-password',
    },
    
    // Main app routes
    HOME: '/home',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    
    // Trip routes
    TRIPS: {
      LIST: '/trips',
      DETAIL: (id: string) => `/trips/${id}`,
      CREATE: '/trips/create',
      EDIT: (id: string) => `/trips/${id}/edit`,
    },
    
    // Policy routes
    POLICIES: {
      LIST: '/policies',
      DETAIL: (id: string) => `/policies/${id}`,
      CREATE: (tripId: string) => `/policies/create?tripId=${tripId}`,
      COVERAGE_SELECTION: (tripId: string) => `/policies/coverage?tripId=${tripId}`,
    },
    
    // Claim routes
    CLAIMS: {
      LIST: '/claims',
      DETAIL: (id: string) => `/claims/${id}`,
      CREATE: (policyId: string) => `/claims/create?policyId=${policyId}`,
      EDIT: (id: string) => `/claims/${id}/edit`,
      DOCUMENT_UPLOAD: (id: string) => `/claims/${id}/upload`,
    },
  };