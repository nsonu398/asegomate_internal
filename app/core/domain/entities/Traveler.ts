// src/core/domain/entities/Traveler.ts
export interface Traveler {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber?: string;
    nationality?: string;
    email?: string;
    phone?: string;
    relationToMainTraveler?: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'friend' | 'other';
    medicalConditions?: string[];
  }