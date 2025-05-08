// src/core/domain/entities/User.ts
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    dateOfBirth?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  }